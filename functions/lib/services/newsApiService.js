"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsApiService = void 0;
const axios_1 = __importDefault(require("axios"));
class NewsApiService {
    constructor(apiKey) {
        this.apiKey = apiKey;
    }
    /**
     * Obtiene noticias trending usando NewsAPI
     * Simplificado: usa los títulos de las noticias principales como trending topics
     */
    async getTrendingNews(country = 'us') {
        var _a, _b, _c, _d, _e, _f;
        try {
            console.log(`📰 Obteniendo noticias trending de NewsAPI para país: ${country}`);
            // Obtener top headlines
            const response = await axios_1.default.get('https://newsapi.org/v2/top-headlines', {
                params: {
                    apiKey: this.apiKey,
                    country: country,
                    pageSize: 15,
                },
                timeout: 30000,
            });
            console.log(`✅ NewsAPI respondió con ${((_b = (_a = response.data) === null || _a === void 0 ? void 0 : _a.articles) === null || _b === void 0 ? void 0 : _b.length) || 0} artículos`);
            const articles = ((_c = response.data) === null || _c === void 0 ? void 0 : _c.articles) || [];
            if (articles.length === 0) {
                console.warn('⚠️ NewsAPI no retornó artículos');
                return [];
            }
            // Simplificar: usar las noticias principales como trending topics
            // Extraer el tema principal de cada título
            const trends = articles
                .filter((article) => article.title && article.title.length > 10)
                .slice(0, 10)
                .map((article, index) => {
                var _a;
                // Extraer el tema principal del título (eliminar palabras comunes, tomar las primeras palabras clave)
                const title = article.title || '';
                const keyword = this.extractMainTopic(title);
                return {
                    keyword: keyword || `Noticia ${index + 1}`,
                    traffic: this.estimateTraffic(15 - index), // Las primeras tienen más tráfico
                    articles: [
                        {
                            title: article.title || '',
                            url: article.url || '',
                            source: ((_a = article.source) === null || _a === void 0 ? void 0 : _a.name) || 'Unknown',
                        },
                    ],
                    score: Math.max(60, 100 - (index * 3)), // Score decreciente
                };
            })
                .filter((topic) => topic.keyword.length > 3);
            console.log(`✅ Generadas ${trends.length} tendencias de NewsAPI`);
            return trends;
        }
        catch (error) {
            console.error('❌ Error fetching trending news:', ((_d = error.response) === null || _d === void 0 ? void 0 : _d.data) || error.message);
            // Si es error de API key
            if (((_e = error.response) === null || _e === void 0 ? void 0 : _e.status) === 401) {
                throw new Error('NewsAPI: API key inválida. Verifica tu API key en Firebase config.');
            }
            // Si es error de límite
            if (((_f = error.response) === null || _f === void 0 ? void 0 : _f.status) === 429) {
                throw new Error('NewsAPI: Límite de requests excedido. Prueba más tarde.');
            }
            throw new Error(`Failed to fetch trending news: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    extractMainTopic(title) {
        // Palabras comunes a ignorar
        const stopWords = new Set([
            'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
            'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
            'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can',
            'this', 'that', 'these', 'those', 'from', 'as', 'by', 'about',
        ]);
        // Limpiar título y extraer palabras significativas
        const words = title
            .toLowerCase()
            .replace(/[^\w\s]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
            .split(' ')
            .filter((w) => w.length > 3 && !stopWords.has(w));
        // Tomar las primeras 3-5 palabras como tema principal
        if (words.length === 0) {
            // Si no hay palabras significativas, tomar las primeras palabras del título
            return title.split(' ').slice(0, 4).join(' ').substring(0, 50);
        }
        const mainTopic = words.slice(0, 5).join(' ');
        return mainTopic.substring(0, 60); // Limitar longitud
    }
    estimateTraffic(articleCount) {
        if (articleCount >= 10)
            return '200K+';
        if (articleCount >= 7)
            return '100K+';
        if (articleCount >= 5)
            return '50K+';
        return '20K+';
    }
}
exports.NewsApiService = NewsApiService;
//# sourceMappingURL=newsApiService.js.map