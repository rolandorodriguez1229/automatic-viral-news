/**
 * Función para buscar tendencias actuales desde el dashboard
 */
export async function fetchTrendsNow(): Promise<{
  success: boolean;
  message?: string;
  trendsFound?: number;
  trendsAdded?: number;
  addedTrends?: Array<{ keyword: string; score: number; traffic: string }>;
  error?: string;
}> {
  try {
    const response = await fetch(
      'https://us-central1-automatic-viral-news.cloudfunctions.net/fetchTrendsNow',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching trends:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

