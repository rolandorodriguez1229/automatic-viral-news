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
     */
    async getTrendingNews(country = 'us') {
        try {
            // Obtener top headlines
            const response = await axios_1.default.get('https://newsapi.org/v2/top-headlines', {
                params: {
                    apiKey: this.apiKey,
                    country: country,
                    pageSize: 20,
                },
                timeout: 30000,
            });
            // Agrupar por temas comunes y crear trending topics
            const articles = response.data.articles || [];
            const topicsMap = new Map();
            // Extraer keywords principales de los títulos
            articles.forEach((article) => {
                const title = article.title || '';
                // Extraer palabras clave (simplificado)
                const keywords = this.extractKeywords(title);
                keywords.forEach((keyword) => {
                    if (!topicsMap.has(keyword)) {
                        topicsMap.set(keyword, []);
                    }
                    topicsMap.get(keyword).push(article);
                });
            });
            // Convertir a TrendingTopic
            const trends = Array.from(topicsMap.entries())
                .map(([keyword, articles]) => ({
                keyword,
                traffic: this.estimateTraffic(articles.length),
                articles: articles.slice(0, 3).map((article) => {
                    var _a;
                    return ({
                        title: article.title || '',
                        url: article.url || '',
                        source: ((_a = article.source) === null || _a === void 0 ? void 0 : _a.name) || 'Unknown',
                    });
                }),
                score: this.calculateScore(articles.length),
            }))
                .sort((a, b) => b.score - a.score)
                .slice(0, 10);
            return trends;
        }
        catch (error) {
            console.error('Error fetching trending news:', error);
            throw new Error(`Failed to fetch trending news: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    extractKeywords(title) {
        // Palabras comunes a ignorar
        const stopWords = new Set([
            'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
            'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
            'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those',
        ]);
        // Extraer palabras clave principales (primeras 2-3 palabras significativas)
        const words = title
            .toLowerCase()
            .replace(/[^\w\s]/g, ' ')
            .split(/\s+/)
            .filter((w) => w.length > 3 && !stopWords.has(w))
            .slice(0, 3);
        return words.length > 0 ? [words.join(' ')] : [];
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
    calculateScore(articleCount) {
        return Math.min(50 + (articleCount * 10), 100);
    }
}
exports.NewsApiService = NewsApiService;
//# sourceMappingURL=newsApiService.js.map