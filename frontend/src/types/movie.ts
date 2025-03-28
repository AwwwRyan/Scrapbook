export interface Movie {
  id: string;
  title: string;
  original_title: string;
  description: string;
  image_url: string;
  release_date: string;
  start_year: number;
  end_year: number | null;
  runtime_minutes: number;
  genres: string[];
  language: string;
  countries: string[];
  rating: number;
  num_votes: number;
  budget: number | null;
  gross_worldwide: number | null;
  is_adult: boolean;
  // Add any other fields that come from the API
}

export interface Review {
  id: number;
  user: number;
  movie: string;
  rating: number;
  review_text?: string;
  created_at: string;
}

export interface WatchLater {
  id: number;
  user: number;
  movie: string;
  added_at: string;
} 