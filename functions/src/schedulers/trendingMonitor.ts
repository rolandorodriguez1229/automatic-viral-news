import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {TrendsService} from "../services/trendsService";

const db = admin.firestore();

export const monitorTrends = functions
  .runWith({memory: "1GB", timeoutSeconds: 540})
  .pubsub.schedule("every 2 hours")
  .timeZone("America/New_York")
  .onRun(async (context) => {
    console.log("Starting trends monitoring...");

    try {
      const trendsService = new TrendsService();
      const trends = await trendsService.getDailyTrends("US");

      console.log(`Found ${trends.length} trends`);

      const batch = db.batch();
      let newTrendsCount = 0;

      for (const trend of trends) {
        // Verificar si ya existe en las últimas 12 horas
        const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);

        const existing = await db.collection("trending_topics")
          .where("keyword", "==", trend.keyword)
          .where("createdAt", ">", twelveHoursAgo)
          .limit(1)
          .get();

        if (existing.empty && trend.score > 50) {
          // Solo agregar si tiene buen score
          const docRef = db.collection("trending_topics").doc();
          batch.set(docRef, {
            keyword: trend.keyword,
            traffic: trend.traffic,
            articles: trend.articles,
            score: trend.score,
            status: "pending",
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          });
          newTrendsCount++;
        }
      }

      if (newTrendsCount > 0) {
        await batch.commit();
        console.log(`Added ${newTrendsCount} new trends to Firestore`);
      } else {
        console.log("No new trends to add");
      }

      return {success: true, trendsFound: trends.length, newTrendsAdded: newTrendsCount};
    } catch (error) {
      console.error("Error in monitorTrends:", error);
      throw error;
    }
  });

// Función manual para probar
export const manualTrendsCheck = functions
  .runWith({memory: "1GB", timeoutSeconds: 540})
  .https.onRequest(async (req, res) => {
    // Verificar token de seguridad
    const authToken = req.headers.authorization?.replace("Bearer ", "");
    const expectedToken = functions.config().manual?.trigger_token;

    if (authToken !== expectedToken) {
      res.status(401).json({error: "Unauthorized"});
      return;
    }

    try {
      const trendsService = new TrendsService();
      const trends = await trendsService.getDailyTrends("US");

      res.json({
        success: true,
        trends: trends,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error in manualTrendsCheck:", error);
      res.status(500).json({
        error: "Failed to fetch trends",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

// Health check
export const healthCheck = functions.https.onRequest(async (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

