"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SerpApiService = void 0;
const axios_1 = __importDefault(require("axios"));
class SerpApiService {
    constructor(apiKey) {
        this.apiKey = apiKey;
    }
    /**
     * Obtiene las tendencias diarias usando SerpAPI
     */
    async getDailyTrends(geo = 'US') {
        var _a, _b;
        try {
            const response = await axios_1.default.get('https://serpapi.com/search.json', {
                params: {
                    engine: 'google_trends',
                    api_key: this.apiKey,
                    geo: geo,
                    data_type: 'TIMESERIES',
                },
                timeout: 30000,
            });
            // SerpAPI retorna datos diferentes, necesitamos adaptarlos
            const trends = [];
            if ((_a = response.data) === null || _a === void 0 ? void 0 : _a.interest_over_time) {
                // Si hay trending_searches en la respuesta
                if (response.data.trending_searches) {
                    response.data.trending_searches.forEach((item, index) => {
                        var _a, _b;
                        trends.push({
                            keyword: item.title || item.query || `Trend ${index + 1}`,
                            traffic: this.estimateTraffic(item.value || 0),
                            articles: ((_a = item.articles) === null || _a === void 0 ? void 0 : _a.map((article) => ({
                                title: article.title || '',
                                url: article.url || '',
                                source: article.source || '',
                            }))) || [],
                            score: this.calculateScore(item.value || 0, ((_b = item.articles) === null || _b === void 0 ? void 0 : _b.length) || 0),
                        });
                    });
                }
            }
            // Si no hay trending_searches, intentar con related_topics
            if (trends.length === 0 && ((_b = response.data) === null || _b === void 0 ? void 0 : _b.related_topics)) {
                response.data.related_topics.slice(0, 10).forEach((topic, index) => {
                    trends.push({
                        keyword: topic.title || topic.query || `Topic ${index + 1}`,
                        traffic: '50K+',
                        articles: [],
                        score: 60 + (index * 5),
                    });
                });
            }
            return trends.filter((t) => t.keyword.length > 0).slice(0, 10);
        }
        catch (error) {
            console.error('Error fetching trends from SerpAPI:', error);
            throw new Error(`Failed to fetch trends from SerpAPI: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    /**
     * Obtiene trending searches directamente
     */
    async getTrendingSearches(geo = 'US') {
        var _a, _b, _c;
        try {
            const response = await axios_1.default.get('https://serpapi.com/search.json', {
                params: {
                    engine: 'google_trends',
                    api_key: this.apiKey,
                    geo: geo,
                    data_type: 'DAILY',
                    date: 'now 1-d',
                },
                timeout: 30000,
            });
            const trends = [];
            // Intentar diferentes formatos de respuesta de SerpAPI
            if ((_a = response.data) === null || _a === void 0 ? void 0 : _a.daily_searches) {
                response.data.daily_searches.forEach((search) => {
                    trends.push({
                        keyword: search.query || search.title || '',
                        traffic: this.estimateTraffic(search.value || 0),
                        articles: [],
                        score: this.calculateScore(search.value || 0, 0),
                    });
                });
            }
            // Si hay related_queries
            if (trends.length === 0 && ((_c = (_b = response.data) === null || _b === void 0 ? void 0 : _b.related_queries) === null || _c === void 0 ? void 0 : _c.rising)) {
                response.data.related_queries.rising.slice(0, 10).forEach((query) => {
                    trends.push({
                        keyword: query.query || '',
                        traffic: '50K+',
                        articles: [],
                        score: 70,
                    });
                });
            }
            return trends.filter((t) => t.keyword.length > 0).slice(0, 10);
        }
        catch (error) {
            console.error('Error fetching trending searches:', error);
            throw error;
        }
    }
    estimateTraffic(value) {
        if (value >= 1000000)
            return '1M+';
        if (value >= 500000)
            return '500K+';
        if (value >= 200000)
            return '200K+';
        if (value >= 100000)
            return '100K+';
        if (value >= 50000)
            return '50K+';
        return '10K+';
    }
    calculateScore(traffic, articles) {
        const trafficScore = Math.min(traffic / 10000, 100);
        const articlesScore = articles * 3;
        return Math.round((trafficScore * 0.7) + articlesScore);
    }
}
exports.SerpApiService = SerpApiService;
//# sourceMappingURL=serpapiService.js.map