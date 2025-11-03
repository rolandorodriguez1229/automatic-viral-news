import * as admin from "firebase-admin";

// Inicializar Firebase Admin
admin.initializeApp();

// Exportar todas las funciones
export * from "./schedulers/trendingMonitor";
export * from "./processors/contentGenerator";
export * from "./http/fetchTrendsNow";

