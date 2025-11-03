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
   * Simplificado: usa los títulos de las noticias principales como trending topics
   */
  async getTrendingNews(country: string = 'us'): Promise<TrendingTopic[]> {
    try {
      console.log(`📰 Obteniendo noticias trending de NewsAPI para país: ${country}`);
      
      // Obtener top headlines
      const response = await axios.get('https://newsapi.org/v2/top-headlines', {
        params: {
          apiKey: this.apiKey,
          country: country,
          pageSize: 15,
        },
        timeout: 30000,
      });

      console.log(`✅ NewsAPI respondió con ${response.data?.articles?.length || 0} artículos`);

      const articles = response.data?.articles || [];
      
      if (articles.length === 0) {
        console.warn('⚠️ NewsAPI no retornó artículos');
        return [];
      }

      // Simplificar: usar las noticias principales como trending topics
      // Extraer el tema principal de cada título
      const trends: TrendingTopic[] = articles
        .filter((article: any) => article.title && article.title.length > 10)
        .slice(0, 10)
        .map((article: any, index: number) => {
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
                source: article.source?.name || 'Unknown',
              },
            ],
            score: Math.max(60, 100 - (index * 3)), // Score decreciente
          };
        })
        .filter((topic: TrendingTopic) => topic.keyword.length > 3);

      console.log(`✅ Generadas ${trends.length} tendencias de NewsAPI`);
      return trends;
    } catch (error: any) {
      console.error('❌ Error fetching trending news:', error.response?.data || error.message);
      
      // Si es error de API key
      if (error.response?.status === 401) {
        throw new Error('NewsAPI: API key inválida. Verifica tu API key en Firebase config.');
      }
      
      // Si es error de límite
      if (error.response?.status === 429) {
        throw new Error('NewsAPI: Límite de requests excedido. Prueba más tarde.');
      }
      
      throw new Error(
        `Failed to fetch trending news: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  private extractMainTopic(title: string): string {
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

  private estimateTraffic(articleCount: number): string {
    if (articleCount >= 10) return '200K+';
    if (articleCount >= 7) return '100K+';
    if (articleCount >= 5) return '50K+';
    return '20K+';
  }

}

