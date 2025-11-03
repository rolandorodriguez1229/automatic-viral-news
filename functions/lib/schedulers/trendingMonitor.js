"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthCheck = exports.manualTrendsCheck = exports.monitorTrends = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const trendsService_1 = require("../services/trendsService");
const db = admin.firestore();
exports.monitorTrends = functions
    .runWith({ memory: "1GB", timeoutSeconds: 540 })
    .pubsub.schedule("every 2 hours")
    .timeZone("America/New_York")
    .onRun(async (context) => {
    console.log("Starting trends monitoring...");
    try {
        const trendsService = new trendsService_1.TrendsService();
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
        }
        else {
            console.log("No new trends to add");
        }
        return { success: true, trendsFound: trends.length, newTrendsAdded: newTrendsCount };
    }
    catch (error) {
        console.error("Error in monitorTrends:", error);
        throw error;
    }
});
// Función manual para probar
exports.manualTrendsCheck = functions
    .runWith({ memory: "1GB", timeoutSeconds: 540 })
    .https.onRequest(async (req, res) => {
    var _a, _b;
    // Verificar token de seguridad
    const authToken = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.replace("Bearer ", "");
    const expectedToken = (_b = functions.config().manual) === null || _b === void 0 ? void 0 : _b.trigger_token;
    if (authToken !== expectedToken) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    try {
        const trendsService = new trendsService_1.TrendsService();
        const trends = await trendsService.getDailyTrends("US");
        res.json({
            success: true,
            trends: trends,
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        console.error("Error in manualTrendsCheck:", error);
        res.status(500).json({
            error: "Failed to fetch trends",
            message: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
// Health check
exports.healthCheck = functions.https.onRequest(async (req, res) => {
    res.json({
        status: "healthy",
        timestamp: new Date().toISOString(),
        version: "1.0.0",
    });
});
//# sourceMappingURL=trendingMonitor.js.map