declare module "google-trends-api" {
  interface DailyTrendsOptions {
    trendDate: Date;
    geo: string;
  }

  interface RelatedQueriesOptions {
    keyword: string;
    geo: string;
  }

  interface InterestOverTimeOptions {
    keyword: string;
    geo: string;
  }

  export function dailyTrends(options: DailyTrendsOptions): Promise<string>;
  export function relatedQueries(options: RelatedQueriesOptions): Promise<string>;
  export function interestOverTime(options: InterestOverTimeOptions): Promise<string>;
}

