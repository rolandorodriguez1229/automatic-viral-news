import googleTrends from "google-trends-api";

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

export class TrendsService {
  /**
   * Obtiene las tendencias del día actual
   */
  async getDailyTrends(geo = "US"): Promise<TrendingTopic[]> {
    try {
      let trends;
      let attempts = 0;
      const maxAttempts = 3;
      
      while (attempts < maxAttempts) {
        try {
          trends = await googleTrends.dailyTrends({
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
        } catch (error: any) {
          attempts++;
          console.log(`Intento ${attempts}/${maxAttempts} falló:`, error.message);
          
          if (attempts >= maxAttempts) {
            // Si todos los intentos fallaron, lanzar error más descriptivo
            throw new Error(
              `No se pudo obtener tendencias después de ${maxAttempts} intentos. ` +
              `Google Trends puede estar bloqueando peticiones desde servidores. ` +
              `Error: ${error.message}`
            );
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
      
      const trendingSearches = parsed.default?.trendingSearchesDays?.[0]?.trendingSearches || [];

      return trendingSearches.slice(0, 10).map((trend: any) => {
        // Calcular score basado en traffic y cantidad de artículos
        const trafficNum = this.parseTraffic(trend.formattedTraffic);
        const articleCount = trend.articles?.length || 0;
        const score = (trafficNum * 0.7) + (articleCount * 3);

        return {
          keyword: trend.title?.query || "",
          traffic: trend.formattedTraffic || "0",
          articles: trend.articles?.slice(0, 3).map((article: any) => ({
            title: article.title || "",
            url: article.url || "",
            source: article.source || "",
          })) || [],
          score: Math.round(score),
        };
      }).filter((topic: TrendingTopic) => topic.keyword.length > 0);
    } catch (error) {
      console.error("Error fetching trends:", error);
      throw new Error(`Failed to fetch trends: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  /**
   * Obtiene información adicional sobre un keyword específico
   */
  async getKeywordInfo(keyword: string, geo = "US"): Promise<any> {
    try {
      const [relatedQueries, interestOverTime] = await Promise.all([
        googleTrends.relatedQueries({keyword, geo}),
        googleTrends.interestOverTime({keyword, geo}),
      ]);

      return {
        relatedQueries: JSON.parse(relatedQueries),
        interestOverTime: JSON.parse(interestOverTime),
      };
    } catch (error) {
      console.error(`Error fetching info for keyword ${keyword}:`, error);
      return null;
    }
  }

  /**
   * Parsea el formato de traffic a número
   */
  private parseTraffic(traffic: string): number {
    if (!traffic) return 0;

    const numStr = traffic.replace(/[^0-9.]/g, "");
    const num = parseFloat(numStr);

    if (traffic.toLowerCase().includes("m")) {
      return num * 1000000;
    } else if (traffic.toLowerCase().includes("k")) {
      return num * 1000;
    }

    return num;
  }
}

