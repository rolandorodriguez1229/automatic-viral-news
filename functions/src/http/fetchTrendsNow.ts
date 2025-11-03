import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { TrendsService } from '../services/trendsService';

const db = admin.firestore();

/**
 * Función HTTP para buscar tendencias actuales y agregarlas al sistema
 * Se puede llamar desde el dashboard web o manualmente
 */
export const fetchTrendsNow = functions
  .runWith({ memory: '1GB', timeoutSeconds: 540 })
  .https.onRequest(async (req, res) => {
    // Configurar CORS
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
      res.status(204).send('');
      return;
    }

    try {
      console.log('🔍 Buscando tendencias actuales...');

      const trendsService = new TrendsService();
      const trends = await trendsService.getDailyTrends('US');

      console.log(`✅ Encontradas ${trends.length} tendencias`);

      const batch = db.batch();
      let addedCount = 0;
      const addedTrends: any[] = [];

      // Tomar las top 5 tendencias con mejor score
      const topTrends = trends
        .filter((t) => t.score > 50)
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);

      for (const trend of topTrends) {
        // Verificar si ya existe en las últimas 12 horas
        const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);

        const existing = await db.collection('trending_topics')
          .where('keyword', '==', trend.keyword)
          .where('createdAt', '>', twelveHoursAgo)
          .limit(1)
          .get();

        if (existing.empty) {
          const docRef = db.collection('trending_topics').doc();
          batch.set(docRef, {
            keyword: trend.keyword,
            traffic: trend.traffic,
            articles: trend.articles,
            score: trend.score,
            status: 'pending',
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          });

          addedTrends.push({
            keyword: trend.keyword,
            score: trend.score,
            traffic: trend.traffic,
          });

          addedCount++;
        }
      }

      if (addedCount > 0) {
        await batch.commit();
        console.log(`✅ Agregadas ${addedCount} nuevas tendencias`);
      }

      res.status(200).json({
        success: true,
        message: `Se agregaron ${addedCount} nuevas tendencias`,
        trendsFound: trends.length,
        trendsAdded: addedCount,
        addedTrends: addedTrends,
        messageInfo: 'Los scripts se generarán automáticamente en 1-2 minutos',
      });
    } catch (error) {
      console.error('❌ Error buscando tendencias:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });

