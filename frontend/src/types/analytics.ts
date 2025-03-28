export interface UserStatistics {
  total_movies_watched: number;
  total_reviews: number;
  average_rating: number;
  watchlist_count: number;
  watch_later_count: number;
  total_genres_watched: number;
  most_watched_genre: string;
  review_completion_rate: number;
}

export interface RecentActivity {
  activities: Array<{
    type: 'review' | 'watch' | 'watchlist_add' | 'watch_later_add';
    movie: {
      id: string;
      title: string;
      image_url: string;
    };
    action_date: string;
    details?: {
      rating?: number;
      review_snippet?: string;
    };
  }>;
  total_activities: number;
}

export interface GenreAnalytics {
  distribution: Record<string, number>;
  favorite_genres: Array<{
    genre: string;
    movie_count: number;
    average_rating: number;
  }>;
  trending_genres: Array<{
    genre: string;
    recent_watches: number;
    last_30_days: boolean;
  }>;
}

export interface RatingAnalytics {
  distribution: {
    '5_stars': number;
    '4_stars': number;
    '3_stars': number;
    '2_stars': number;
    '1_star': number;
  };
  average_by_genre: Record<string, number>;
  rating_trends: {
    last_30_days: number;
    previous_30_days: number;
    trend: 'increasing' | 'decreasing' | 'stable';
  };
}

export interface WatchHistory {
  timeline: Array<{
    date: string;
    movies_watched: number;
    movies: Array<{
      id: string;
      title: string;
      rating?: number;
    }>;
  }>;
  summary: {
    daily_average: number;
    most_active_day: string;
    total_watch_time: number;
  };
}

export interface UserHighlights {
  top_rated_movies: Array<{
    id: string;
    title: string;
    rating: number;
    review_date: string;
  }>;
  longest_movies_watched: Array<{
    id: string;
    title: string;
    runtime_minutes: number;
  }>;
  most_reviewed_directors: Array<{
    name: string;
    movies_watched: number;
    average_rating: number;
  }>;
  watching_streak: {
    current_streak: number;
    longest_streak: number;
    total_active_days: number;
  };
} 