import { Movie, Review } from '@/types/movie';
import axiosInstance from './axiosConfig';
import { handleApiError } from '@/lib/utils/handleApiError';
import { useAuthStore } from '@/store/auth';
import axios from 'axios';
import {
  UserStatistics,
  RecentActivity,
  GenreAnalytics,
  RatingAnalytics,
  WatchHistory,
  UserHighlights
} from '@/types/analytics';

const RAPIDAPI_KEY = process.env.NEXT_PUBLIC_RAPIDAPI_KEY;
const RAPIDAPI_HOST = process.env.NEXT_PUBLIC_RAPIDAPI_HOST;

if (!RAPIDAPI_KEY || !RAPIDAPI_HOST) {
  throw new Error('Required RapidAPI environment variables are not defined');
}

const rapidApiHeaders = {
  'x-rapidapi-key': RAPIDAPI_KEY,
  'x-rapidapi-host': RAPIDAPI_HOST,
};

// Create a separate axios instance for RapidAPI calls
const rapidApiInstance = axios.create({
  headers: rapidApiHeaders
});

interface RapidAPIMovie {
    id: string;
    primaryTitle: string;
    originalTitle: string;
    description: string;
    primaryImage: string;
    releaseDate: string;
    startYear: number;
    endYear: number | null;
    runtimeMinutes: number;
    genres: string[];
    spokenLanguages: string[];
    countriesOfOrigin: string[];
    averageRating: number;
    numVotes: number;
    budget: number;
    grossWorldwide: number | null;
    isAdult: boolean;
}

const mapMovieData = (movie: RapidAPIMovie): Movie => ({
  id: movie.id,
  title: movie.primaryTitle,
  original_title: movie.originalTitle,
  description: movie.description,
  image_url: movie.primaryImage,
  release_date: movie.releaseDate,
  start_year: movie.startYear,
  end_year: movie.endYear,
  runtime_minutes: movie.runtimeMinutes,
  genres: movie.genres,
  language: movie.spokenLanguages?.[0] || 'en',
  countries: movie.countriesOfOrigin,
  rating: movie.averageRating,
  num_votes: movie.numVotes,
  budget: movie.budget,
  gross_worldwide: movie.grossWorldwide,
  is_adult: movie.isAdult
});

export const movieApi = {
  // RapidAPI methods
  getPopularMovies: async (page: number = 1, pageSize: number = 8): Promise<Movie[]> => {
    try {
      const response = await rapidApiInstance.get(
        `https://${RAPIDAPI_HOST}/imdb/most-popular-movies`,
        {
          params: { page, pageSize }
        }
      );
      return response.data
        .slice((page - 1) * pageSize, page * pageSize)
        .map(mapMovieData);
    } catch (error) {
      console.error('Error fetching popular movies:', error);
      throw error;
    }
  },

  searchMovies: async (params: any) => {
    try {
      const response = await axiosInstance.get(`https://${RAPIDAPI_HOST}/imdb/search`, {
        headers: rapidApiHeaders,
        params
      });
      return response.data;
    } catch (error) {
      console.error('Error searching movies:', error);
      throw error;
    }
  },

  addMovie: async (movieData: Movie) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Format the request body according to the API requirements
      const formattedMovieData = {
        id: movieData.id,
        title: movieData.title,
        description: movieData.description || '',
        image_url: movieData.image_url || '',
        release_date: movieData.release_date,
        start_year: movieData.start_year,
        end_year: movieData.end_year,
        runtime_minutes: movieData.runtime_minutes,
        genres: movieData.genres,
        language: movieData.language,
        countries: movieData.countries,
        rating: movieData.rating,
        num_votes: movieData.num_votes,
        budget: movieData.budget,
        gross_worldwide: movieData.gross_worldwide,
        is_adult: movieData.is_adult
      };

      // Make the API request with proper headers and formatted data
      const response = await axiosInstance.post(
        '/movies/add/',
        formattedMovieData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        useAuthStore.getState().logout();
      }
      throw error;
    }
  },

  addReview: async (movieId: string, reviewData: { rating: number; review_text: string }) => {
    try {
      const response = await axiosInstance.post(
        `/movies/${movieId}/reviews/create/`,
        {
          rating: parseFloat(reviewData.rating.toFixed(1)),
          review_text: reviewData.review_text || ''
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error adding review:', error);
      throw error;
    }
  },

  getUserReviews: async () => {
    try {
      const response = await axiosInstance.get('/users/reviews/');
      return response.data;
    } catch (error) {
      console.error('Error fetching user reviews:', error);
      throw error;
    }
  },

  getMovie: async (id: string): Promise<Movie> => {
    try {
      const response = await axiosInstance.get<RapidAPIMovie>(`https://imdb236.p.rapidapi.com/imdb/${id}`, {
        headers: rapidApiHeaders
      });
      
      return mapMovieData(response.data);
    } catch (error: any) {
      console.error('RapidAPI Error Details:', {
        message: error.message,
        response: error.response?.data,
        headers: rapidApiHeaders
      });
      throw error;
    }
  },

  addToWatchlater: async (movieId: string) => {
    try {
      const response = await axiosInstance.post(`/watch-later/add/${movieId}/`);
      return response.data;
    } catch (error) {
      console.error('Error adding to watchlater:', error);
      throw error;
    }
  },

  getTopRatedMovies: async (page: number = 1, pageSize: number = 8): Promise<Movie[]> => {
    try {
      const response = await axiosInstance.get<RapidAPIMovie[]>(
        'https://imdb236.p.rapidapi.com/imdb/top250-movies',
        {
          headers: rapidApiHeaders,
          params: {
            page,
            pageSize
          }
        }
      );
      
      return response.data
        .slice((page - 1) * pageSize, page * pageSize)
        .map(mapMovieData);
    } catch (error) {
      console.error('Error fetching top rated movies:', error);
      throw error;
    }
  },

  getAllMovies: async () => {
    try {
      const response = await axiosInstance.get('/movies/');
      return response.data;
    } catch (error) {
      console.error('Error fetching all movies:', error);
      throw error;
    }
  },

  getMovieDetail: async (movieId: string) => {
    try {
      const response = await axiosInstance.get(`/movies/${movieId}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching movie details:', error);
      throw error;
    }
  },

  getMovieReviews: async (movieId: string) => {
    try {
      const response = await axiosInstance.get(`/movies/${movieId}/reviews/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching movie reviews:', error);
      throw error;
    }
  },

  createReview: async (movieId: string, data: { rating: number; review_text: string }) => {
    try {
      const response = await axiosInstance.post(
        `/movies/${movieId}/reviews/create/`,
        {
          rating: parseFloat(data.rating.toFixed(1)),
          review_text: data.review_text
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    }
  },

  updateReview: async (reviewId: number, data: { rating?: number; review_text?: string }) => {
    try {
      const response = await axiosInstance.put(`/reviews/${reviewId}/`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating review:', error);
      throw error;
    }
  },

  deleteReview: async (reviewId: number) => {
    try {
      await axiosInstance.delete(`/reviews/${reviewId}/`);
    } catch (error) {
      console.error('Error deleting review:', error);
      throw error;
    }
  },

  getWatchLater: async () => {
    try {
      const response = await axiosInstance.get('/watch-later/');
      return response.data;
    } catch (error) {
      console.error('Error fetching watch later list:', error);
      throw error;
    }
  },

  addToWatchLater: async (movieId: string) => {
    try {
      const response = await axiosInstance.post(`/watch-later/add/${movieId}/`);
      return response.data;
    } catch (error) {
      console.error('Error adding to watch later:', error);
      throw error;
    }
  },

  removeFromWatchLater: async (movieId: string) => {
    try {
      await axiosInstance.post(`/watchlist/add/${movieId}/`);
      await axiosInstance.delete(`/watch-later/remove/${movieId}/`);
    } catch (error) {
      console.error('Error removing from watch later:', error);
      throw error;
    }
  },

  getWatchlist: async () => {
    try {
      const response = await axiosInstance.get('/watchlist/');
      return response.data;
    } catch (error) {
      console.error('Error fetching watchlist:', error);
      throw error;
    }
  },

  addToWatchlist: async (movieId: string) => {
    try {
      const response = await axiosInstance.post(`/watchlist/add/${movieId}/`);
      return response.data;
    } catch (error) {
      console.error('Error adding to watchlist:', error);
      throw error;
    }
  },

  removeFromWatchlist: async (movieId: string) => {
    try {
      await axiosInstance.delete(`/watchlist/remove/${movieId}/`);
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      throw error;
    }
  },

  // User Statistics
  getUserStatistics: async (): Promise<UserStatistics> => {
    try {
      const response = await axiosInstance.get('/users/statistics/');
      return response.data;
    } catch (error) {
      console.error('Error fetching user statistics:', error);
      throw error;
    }
  },

  // Recent Activity Feed
  getRecentActivity: async (): Promise<RecentActivity> => {
    try {
      const response = await axiosInstance.get('/users/recent-activity/');
      return response.data;
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      throw error;
    }
  },

  // Genre Analytics
  getGenreAnalytics: async (): Promise<GenreAnalytics> => {
    try {
      const response = await axiosInstance.get('/users/analytics/genres/');
      console.log("genre analytics",response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching genre analytics:', error);
      throw error;
    }
  },

  // Rating Analytics
  getRatingAnalytics: async (): Promise<RatingAnalytics> => {
    try {
      const response = await axiosInstance.get('/users/analytics/ratings/');
      console.log("rating analytics",response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching rating analytics:', error);
      throw error;
    }
  },

  // Watch History
  getWatchHistory: async (timeframe: 'week' | 'month' | 'year' = 'month'): Promise<WatchHistory> => {
    try {
      const response = await axiosInstance.get('/users/analytics/watch-history/', {
        params: { timeframe }
      });
      console.log("watch history",response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching watch history:', error);
      throw error;
    }
  },

  // User Highlights
  getUserHighlights: async (): Promise<UserHighlights> => {
    try {
      const response = await axiosInstance.get('/users/analytics/highlights/');
      return response.data;
    } catch (error) {
      console.error('Error fetching user highlights:', error);
      throw error;
    }
  },
}; 