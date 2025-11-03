import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {GeminiService} from "../services/geminiService";

export const generateScript = functions.firestore
  .document("trending_topics/{topicId}")
  .onCreate(async (snap, context) => {
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
      const geminiApiKey = functions.config().gemini?.api_key;
      if (!geminiApiKey) {
        throw new Error("GEMINI_API_KEY not configured");
      }

      const geminiService = new GeminiService(geminiApiKey);

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
    } catch (error) {
      console.error(`Error generating script for topic ${topicId}:`, error);

      await snap.ref.update({
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }
  });

