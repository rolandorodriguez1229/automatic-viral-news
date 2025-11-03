const admin = require('firebase-admin');
const { TrendsService } = require('../functions/lib/services/trendsService');

// Inicializar Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}

const db = admin.firestore();

async function fetchAndAddTrends() {
  try {
    console.log('🔍 Buscando tendencias actuales...');
    
    const trendsService = new TrendsService();
    const trends = await trendsService.getDailyTrends('US');
    
    console.log(`✅ Encontradas ${trends.length} tendencias`);
    
    let addedCount = 0;
    
    for (const trend of trends.slice(0, 3)) { // Tomar las top 3
      // Verificar si ya existe en las últimas 12 horas
      const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);
      
      const existing = await db.collection('trending_topics')
        .where('keyword', '==', trend.keyword)
        .where('createdAt', '>', twelveHoursAgo)
        .limit(1)
        .get();
      
      if (existing.empty && trend.score > 50) {
        const docRef = db.collection('trending_topics').doc();
        await docRef.set({
          keyword: trend.keyword,
          traffic: trend.traffic,
          articles: trend.articles,
          score: trend.score,
          status: 'pending',
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        
        console.log(`✅ Agregada: "${trend.keyword}" (Score: ${trend.score})`);
        addedCount++;
      } else {
        console.log(`⏭️  Omitida: "${trend.keyword}" (ya existe o score bajo)`);
      }
    }
    
    console.log(`\n🎉 Total agregadas: ${addedCount} tendencias`);
    console.log('⏳ Los scripts se generarán automáticamente en 1-2 minutos...');
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fetchAndAddTrends();

