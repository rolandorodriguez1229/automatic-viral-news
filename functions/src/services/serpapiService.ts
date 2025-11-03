import axios from 'axios';

export interface TrendingTopic {
  keyword: string;
  traffic: string;
  articles: Array<{
    title: string;
    url: string;
    source: string;
  }>;
  score: number;
}

export class SerpApiService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Obtiene las tendencias diarias usando SerpAPI
   */
  async getDailyTrends(geo: string = 'US'): Promise<TrendingTopic[]> {
    try {
      const response = await axios.get('https://serpapi.com/search.json', {
        params: {
          engine: 'google_trends',
          api_key: this.apiKey,
          geo: geo,
          data_type: 'TIMESERIES',
        },
        timeout: 30000,
      });

      // SerpAPI retorna datos diferentes, necesitamos adaptarlos
      const trends: TrendingTopic[] = [];

      if (response.data?.interest_over_time) {
        // Si hay trending_searches en la respuesta
        if (response.data.trending_searches) {
          response.data.trending_searches.forEach((item: any, index: number) => {
            trends.push({
              keyword: item.title || item.query || `Trend ${index + 1}`,
              traffic: this.estimateTraffic(item.value || 0),
              articles: item.articles?.map((article: any) => ({
                title: article.title || '',
                url: article.url || '',
                source: article.source || '',
              })) || [],
              score: this.calculateScore(item.value || 0, item.articles?.length || 0),
            });
          });
        }
      }

      // Si no hay trending_searches, intentar con related_topics
      if (trends.length === 0 && response.data?.related_topics) {
        response.data.related_topics.slice(0, 10).forEach((topic: any, index: number) => {
          trends.push({
            keyword: topic.title || topic.query || `Topic ${index + 1}`,
            traffic: '50K+',
            articles: [],
            score: 60 + (index * 5),
          });
        });
      }

      return trends.filter((t) => t.keyword.length > 0).slice(0, 10);
    } catch (error) {
      console.error('Error fetching trends from SerpAPI:', error);
      throw new Error(
        `Failed to fetch trends from SerpAPI: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Obtiene trending searches directamente
   */
  async getTrendingSearches(geo: string = 'US'): Promise<TrendingTopic[]> {
    try {
      const response = await axios.get('https://serpapi.com/search.json', {
        params: {
          engine: 'google_trends',
          api_key: this.apiKey,
          geo: geo,
          data_type: 'DAILY',
          date: 'now 1-d',
        },
        timeout: 30000,
      });

      const trends: TrendingTopic[] = [];

      // Intentar diferentes formatos de respuesta de SerpAPI
      if (response.data?.daily_searches) {
        response.data.daily_searches.forEach((search: any) => {
          trends.push({
            keyword: search.query || search.title || '',
            traffic: this.estimateTraffic(search.value || 0),
            articles: [],
            score: this.calculateScore(search.value || 0, 0),
          });
        });
      }

      // Si hay related_queries
      if (trends.length === 0 && response.data?.related_queries?.rising) {
        response.data.related_queries.rising.slice(0, 10).forEach((query: any) => {
          trends.push({
            keyword: query.query || '',
            traffic: '50K+',
            articles: [],
            score: 70,
          });
        });
      }

      return trends.filter((t) => t.keyword.length > 0).slice(0, 10);
    } catch (error) {
      console.error('Error fetching trending searches:', error);
      throw error;
    }
  }

  private estimateTraffic(value: number): string {
    if (value >= 1000000) return '1M+';
    if (value >= 500000) return '500K+';
    if (value >= 200000) return '200K+';
    if (value >= 100000) return '100K+';
    if (value >= 50000) return '50K+';
    return '10K+';
  }

  private calculateScore(traffic: number, articles: number): number {
    const trafficScore = Math.min(traffic / 10000, 100);
    const articlesScore = articles * 3;
    return Math.round((trafficScore * 0.7) + articlesScore);
  }
}

