import { Movie, Review } from '@/types/movie';
import axiosInstance from './axiosConfig';
import { handleApiError } from '@/lib/utils/handleApiError';
import { useAuthStore } from '@/store/auth';

const RAPIDAPI_KEY = process.env.NEXT_PUBLIC_RAPIDAPI_KEY;
const RAPIDAPI_HOST = process.env.NEXT_PUBLIC_RAPIDAPI_HOST;

if (!RAPIDAPI_KEY || !RAPIDAPI_HOST) {
  throw new Error('Required environment variables are not defined');
}

const rapidApiHeaders = {
  'x-rapidapi-key': RAPIDAPI_KEY,
  'x-rapidapi-host': RAPIDAPI_HOST,
};

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
  getPopularMovies: async (): Promise<Movie[]> => {
    try {
      const response = await axiosInstance.get(`https://${RAPIDAPI_HOST}/imdb/most-popular-movies`, {
        headers: rapidApiHeaders
      });
      
      return response.data.slice(0, 8).map(mapMovieData);
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

  addMovie: async (movieId: string) => {
    try {
      // Get movie data from RapidAPI
      const movieData = await movieApi.getMovie(movieId);
      console.log('Movie data to be added:', movieData); // Debug log

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Add movie to our database with proper headers
      const response = await axiosInstance.post(
        '/movies/add/',
        movieData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Add movie response:', response.data); // Debug log
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        // Handle unauthorized error
        useAuthStore.getState().logout();
        window.location.href = '/login';
      }
      console.error('Error adding movie:', {
        error,
        movieId,
        response: error.response?.data
      });
      throw error;
    }
  },

  addReview: async (movieId: string, reviewData: { rating: number; review_text: string }) => {
    try {
      await movieApi.addMovie(movieId);
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

  addToWatchlist: async (movieId: string) => {
    try {
      const response = await axiosInstance.post(`/watchlist/add/${movieId}/`);
      return response.data;
    } catch (error) {
      console.error('Error adding to watchlist:', error);
      throw error;
    }
  },

  getTopRatedMovies: async (): Promise<Movie[]> => {
    try {
      const response = await axiosInstance.get<RapidAPIMovie[]>('https://imdb236.p.rapidapi.com/imdb/top250-movies', {
        headers: rapidApiHeaders
      });
      
      return response.data.slice(0, 20).map(mapMovieData);
    } catch (error: any) {
      console.error('RapidAPI Error Details:', {
        message: error.message,
        response: error.response?.data,
        headers: rapidApiHeaders
      });
      throw error;
    }
  },
}; 