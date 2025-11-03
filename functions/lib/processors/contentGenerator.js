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
exports.generateScript = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const geminiService_1 = require("../services/geminiService");
exports.generateScript = functions.firestore
    .document("trending_topics/{topicId}")
    .onCreate(async (snap, context) => {
    var _a;
    const data = snap.data();
    const topicId = context.params.topicId;
    console.log(`Processing new topic: ${topicId} - ${data.keyword}`);
    try {
        // Verificar que no esté ya procesado
        if (data.status !== "pending") {
            console.log(`Topic ${topicId} already processed, skipping`);
            return;
        }
        // Obtener API key de Gemini
        const geminiApiKey = (_a = functions.config().gemini) === null || _a === void 0 ? void 0 : _a.api_key;
        if (!geminiApiKey) {
            throw new Error("GEMINI_API_KEY not configured");
        }
        const geminiService = new geminiService_1.GeminiService(geminiApiKey);
        // Actualizar estado
        await snap.ref.update({
            status: "generating_script",
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        // Generar script
        const scriptData = await geminiService.generateScript({
            keyword: data.keyword,
            articles: data.articles || [],
            traffic: data.traffic || "0",
        });
        // Analizar contenido
        const analysis = await geminiService.analyzeContent(scriptData);
        // Guardar script y análisis
        await snap.ref.update({
            script: scriptData,
            analysis: analysis,
            status: "script_ready",
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        console.log(`Script generated successfully for topic: ${topicId}`);
    }
    catch (error) {
        console.error(`Error generating script for topic ${topicId}:`, error);
        await snap.ref.update({
            status: "error",
            error: error instanceof Error ? error.message : "Unknown error",
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
    }
});
//# sourceMappingURL=contentGenerator.js.map