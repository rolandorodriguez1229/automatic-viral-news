"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrendsService = void 0;
const google_trends_api_1 = __importDefault(require("google-trends-api"));
class TrendsService {
    /**
     * Obtiene las tendencias del día actual
     */
    async getDailyTrends(geo = "US") {
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