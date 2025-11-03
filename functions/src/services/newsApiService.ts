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

export class NewsApiService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Obtiene noticias trending usando NewsAPI
   */
  async getTrendingNews(country: string = 'us'): Promise<TrendingTopic[]> {
    try {
      // Obtener top headlines
      const response = await axios.get('https://newsapi.org/v2/top-headlines', {
        params: {
          apiKey: this.apiKey,
          country: country,
          pageSize: 20,
        },
        timeout: 30000,
      });

      // Agrupar por temas comunes y crear trending topics
      const articles = response.data.articles || [];
      const topicsMap = new Map<string, any[]>();

      // Extraer keywords principales de los títulos
      articles.forEach((article: any) => {
        const title = article.title || '';
        // Extraer palabras clave (simplificado)
        const keywords = this.extractKeywords(title);
        
        keywords.forEach((keyword) => {
          if (!topicsMap.has(keyword)) {
            topicsMap.set(keyword, []);
          }
          topicsMap.get(keyword)!.push(article);
        });
      });

      // Convertir a TrendingTopic
      const trends: TrendingTopic[] = Array.from(topicsMap.entries())
        .map(([keyword, articles]) => ({
          keyword,
          traffic: this.estimateTraffic(articles.length),
          articles: articles.slice(0, 3).map((article) => ({
            title: article.title || '',
            url: article.url || '',
            source: article.source?.name || 'Unknown',
          })),
          score: this.calculateScore(articles.length),
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);

      return trends;
    } catch (error) {
      console.error('Error fetching trending news:', error);
      throw new Error(
        `Failed to fetch trending news: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  private extractKeywords(title: string): string[] {
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

  private estimateTraffic(articleCount: number): string {
    if (articleCount >= 10) return '200K+';
    if (articleCount >= 7) return '100K+';
    if (articleCount >= 5) return '50K+';
    return '20K+';
  }

  private calculateScore(articleCount: number): number {
    return Math.min(50 + (articleCount * 10), 100);
  }
}

