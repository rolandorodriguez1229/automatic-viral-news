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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrendsService = void 0;
const functions = __importStar(require("firebase-functions"));
const google_trends_api_1 = __importDefault(require("google-trends-api"));
const serpapiService_1 = require("./serpapiService");
const newsApiService_1 = require("./newsApiService");
class TrendsService {
    /**
     * Obtiene las tendencias del día actual
     * Intenta múltiples fuentes: Google Trends, SerpAPI, NewsAPI
     */
    async getDailyTrends(geo = "US", apiKeys) {
        var _a, _b;
        // Intentar primero con Google Trends
        try {
            return await this.getDailyTrendsFromGoogle(geo);
        }
        catch (error) {
            console.log("Google Trends falló, intentando alternativas...", error);
        }
        // Intentar con SerpAPI si está configurado
        const serpApiKey = (apiKeys === null || apiKeys === void 0 ? void 0 : apiKeys.serpApiKey) || process.env.SERPAPI_KEY || ((_a = functions.config().serpapi) === null || _a === void 0 ? void 0 : _a.key) || '';
        if (serpApiKey) {
            try {
                const serpService = new serpapiService_1.SerpApiService(serpApiKey);
                const trends = await serpService.getTrendingSearches(geo);
                if (trends.length > 0) {
                    console.log(`✅ Obtenidas ${trends.length} tendencias de SerpAPI`);
                    return trends;
                }
            }
            catch (error) {
                console.log("SerpAPI falló:", error);
            }
        }
        // Intentar con NewsAPI si está configurado
        const newsApiKey = (apiKeys === null || apiKeys === void 0 ? void 0 : apiKeys.newsApiKey) || process.env.NEWSAPI_KEY || ((_b = functions.config().newsapi) === null || _b === void 0 ? void 0 : _b.key) || '';
        if (newsApiKey) {
            try {
                const newsService = new newsApiService_1.NewsApiService(newsApiKey);
                const countryMap = {
                    'US': 'us',
                    'MX': 'mx',
                    'ES': 'es',
                };
                const country = countryMap[geo] || 'us';
                const trends = await newsService.getTrendingNews(country);
                if (trends.length > 0) {
                    console.log(`✅ Obtenidas ${trends.length} tendencias de NewsAPI`);
                    return trends;
                }
            }
            catch (error) {
                console.log("NewsAPI falló:", error);
            }
        }
        // Si todas fallan, lanzar error
        throw new Error('No se pudieron obtener tendencias. Google Trends está bloqueando y no hay APIs alternativas configuradas. ' +
            'Configura SERPAPI_KEY o NEWSAPI_KEY, o agrega tendencias manualmente.');
    }
    /**
     * Obtiene tendencias directamente de Google Trends
     */
    async getDailyTrendsFromGoogle(geo = "US") {
        var _a, _b, _c;
        try {
            let trends;
            let attempts = 0;
            const maxAttempts = 3;
            while (attempts < maxAttempts) {
                try {
                    trends = await google_trends_api_1.default.dailyTrends({
                        trendDate: new Date(),
                        geo: geo,
                    });
                    // Verificar que la respuesta no sea HTML
                    if (typeof trends === 'string') {
                        const trimmed = trends.trim();
                        if (trimmed.startsWith('<!') || trimmed.startsWith('<html')) {
                            console.error('Google Trends returned HTML:', trimmed.substring(0, 200));
                            throw new Error('Google Trends está bloqueando la petición (retornó HTML)');
                        }
                    }
                    break; // Si llegamos aquí, la respuesta es válida
                }
                catch (error) {
                    attempts++;
                    console.log(`Intento ${attempts}/${maxAttempts} falló:`, error.message);
                    if (attempts >= maxAttempts) {
                        // Si todos los intentos fallaron, lanzar error más descriptivo
                        throw new Error(`No se pudo obtener tendencias después de ${maxAttempts} intentos. ` +
                            `Google Trends puede estar bloqueando peticiones desde servidores. ` +
                            `Error: ${error.message}`);
                    }
                    // Esperar antes de reintentar (exponencial backoff)
                    await new Promise(resolve => setTimeout(resolve, 2000 * attempts));
                }
            }
            if (!trends) {
                throw new Error('No se obtuvo respuesta de Google Trends');
            }
            const parsed = typeof trends === 'string' ? JSON.parse(trends) : trends;
            // Verificar estructura de respuesta
            if (!parsed || !parsed.default) {
                console.error('Respuesta inválida de Google Trends:', JSON.stringify(parsed).substring(0, 500));
                throw new Error('Estructura de respuesta inválida de Google Trends');
            }
            const trendingSearches = ((_c = (_b = (_a = parsed.default) === null || _a === void 0 ? void 0 : _a.trendingSearchesDays) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.trendingSearches) || [];
            return trendingSearches.slice(0, 10).map((trend) => {
                var _a, _b, _c;
                // Calcular score basado en traffic y cantidad de artículos
                const trafficNum = this.parseTraffic(trend.formattedTraffic);
                const articleCount = ((_a = trend.articles) === null || _a === void 0 ? void 0 : _a.length) || 0;
                const score = (trafficNum * 0.7) + (articleCount * 3);
                return {
                    keyword: ((_b = trend.title) === null || _b === void 0 ? void 0 : _b.query) || "",
                    traffic: trend.formattedTraffic || "0",
                    articles: ((_c = trend.articles) === null || _c === void 0 ? void 0 : _c.slice(0, 3).map((article) => ({
                        title: article.title || "",
                        url: article.url || "",
                        source: article.source || "",
                    }))) || [],
                    score: Math.round(score),
                };
            }).filter((topic) => topic.keyword.length > 0);
        }
        catch (error) {
            console.error("Error fetching trends:", error);
            throw new Error(`Failed to fetch trends: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }
    /**
     * Obtiene información adicional sobre un keyword específico
     */
    async getKeywordInfo(keyword, geo = "US") {
        try {
            const [relatedQueries, interestOverTime] = await Promise.all([
                google_trends_api_1.default.relatedQueries({ keyword, geo }),
                google_trends_api_1.default.interestOverTime({ keyword, geo }),
            ]);
            return {
                relatedQueries: JSON.parse(relatedQueries),
                interestOverTime: JSON.parse(interestOverTime),
            };
        }
        catch (error) {
            console.error(`Error fetching info for keyword ${keyword}:`, error);
            return null;
        }
    }
    /**
     * Parsea el formato de traffic a número
     */
    parseTraffic(traffic) {
        if (!traffic)
            return 0;
        const numStr = traffic.replace(/[^0-9.]/g, "");
        const num = parseFloat(numStr);
        if (traffic.toLowerCase().includes("m")) {
            return num * 1000000;
        }
        else if (traffic.toLowerCase().includes("k")) {
            return num * 1000;
        }
        return num;
    }
}
exports.TrendsService = TrendsService;
//# sourceMappingURL=trendsService.js.map