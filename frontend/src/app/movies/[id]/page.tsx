'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { movieApi } from '@/lib/api/movies';
import { Movie } from '@/types/movie';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/auth';
import { toast } from 'react-hot-toast';
import { Heart, Sparkles, Star, Calendar, Clock, Globe, Film, PenLine, BookmarkPlus, Languages, BookmarkCheck, Pencil } from 'lucide-react';

export default function MoviePage() {
  const params = useParams();
  const router = useRouter();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInWatchLater, setIsInWatchLater] = useState(false);
  const [hasReview, setHasReview] = useState(false);
  const [reviewId, setReviewId] = useState<number | null>(null);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);
        const data = await movieApi.getMovie(params.id as string);
        setMovie(data);
        
        // Only try to add movie if authenticated and we have movie data
        if (isAuthenticated && data) {
          try {
            await movieApi.addMovie(data);
            
            // Check if movie is in watch later
            const watchLaterList = await movieApi.getWatchLater();
            const isInWatchLater = watchLaterList.some((item: any) => item.movie === data.id);
            setIsInWatchLater(isInWatchLater);
            
            // Check if user has reviewed this movie
            const reviews = await movieApi.getUserReviews();
            const userReview = reviews.find((review: any) => review.movie === data.id);
            if (userReview) {
              setHasReview(true);
              setReviewId(userReview.id);
            } else {
              setHasReview(false);
              setReviewId(null);
            }
          } catch (error: any) {
            console.error('Error adding movie to DB:', error);
          }
        }
      } catch (err) {
        setError('Failed to load movie details');
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [params.id, isAuthenticated]);

  const handleReviewClick = () => {
    if (!isAuthenticated) {
      toast.error('Please login to write a review');
      sessionStorage.setItem('redirectAfterLogin', `/movies/${params.id}/review`);
      router.push('/login');
      return;
    }
    if (hasReview) {
      router.push(`/movies/${params.id}/review/edit`);
    } else {
      router.push(`/movies/${params.id}/review`);
    }
  };

  const handleWatchlaterClick = async () => {
    if (!isAuthenticated) {
      return; 
    }
    
    try {
      if (isInWatchLater) {
        await movieApi.removeFromWatchLater(movie!.id);
        setIsInWatchLater(false);
        toast.success('Removed from watch later');
      } else {
        await movieApi.addToWatchlater(movie!.id);
        setIsInWatchLater(true);
        toast.success('Added to watch later');
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        useAuthStore.getState().logout();
        sessionStorage.setItem('redirectAfterLogin', `/movies/${params.id}`);
        router.push('/login');
      } else {
        toast.error('Failed to update watch later');
      }
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-r from-pink-100 to-purple-100 flex items-center justify-center">
      <div className="text-center p-8 rounded-lg bg-white/80 backdrop-blur-sm shadow-md border-2 border-pink-200">
        <div className="animate-spin text-pink-500 mb-4">
          <Sparkles size={40} />
        </div>
        <p className="text-purple-700 font-medium">Loading movie details...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gradient-to-r from-pink-100 to-purple-100 flex items-center justify-center p-4">
      <div className="text-pink-600 text-center bg-white/80 backdrop-blur-sm p-8 rounded-lg border-2 border-pink-200 shadow-md max-w-md">
        <Heart className="mx-auto mb-4 text-pink-500" size={40} />
        <h2 className="text-xl font-bold text-purple-700 mb-2">Oh no!</h2>
        <p>{error}</p>
        <Button 
          onClick={() => router.push('/')}
          className="mt-4 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 rounded-full px-6 shadow-md transition-all duration-300"
        >
          Go Back Home
        </Button>
      </div>
    </div>
  );

  if (!movie) return (
    <div className="min-h-screen bg-gradient-to-r from-pink-100 to-purple-100 flex items-center justify-center p-4">
      <div className="text-pink-600 text-center bg-white/80 backdrop-blur-sm p-8 rounded-lg border-2 border-pink-200 shadow-md max-w-md">
        <Film className="mx-auto mb-4 text-pink-500" size={40} />
        <h2 className="text-xl font-bold text-purple-700 mb-2">Movie Not Found</h2>
        <p>We couldn't find the movie you're looking for.</p>
        <Button 
          onClick={() => router.push('/')}
          className="mt-4 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 rounded-full px-6 shadow-md transition-all duration-300"
        >
          Discover Movies
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-100 to-purple-100 py-10">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 text-pink-300 opacity-30">
          <Sparkles size={40} />
        </div>
        <div className="absolute bottom-20 right-10 text-purple-300 opacity-30">
          <Sparkles size={40} />
        </div>
        <div className="absolute top-1/4 right-1/4 text-pink-200 opacity-20">
          <Heart size={60} />
        </div>
        <div className="absolute bottom-1/4 left-1/4 text-purple-200 opacity-20">
          <Heart size={60} />
        </div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <Card className="p-8 border-2 border-pink-200 shadow-lg rounded-2xl bg-white/90 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row gap-8">
            {movie.image_url && (
              <div className="md:w-64 w-full">
                <div className="relative rounded-xl overflow-hidden border-4 border-pink-200 shadow-md">
                  <div className="absolute inset-0 bg-gradient-to-t from-pink-500/30 to-transparent z-10"></div>
                  <img
                    src={movie.image_url || "/placeholder.svg"}
                    alt={movie.title}
                    className="w-full h-96 md:h-[450px] object-cover"
                  />
                  <div className="absolute top-3 right-3 z-20 bg-pink-100 text-pink-600 rounded-full p-1.5 shadow-sm border border-pink-200">
                    <Star className="w-5 h-5 fill-pink-500 text-pink-500" />
                  </div>
                </div>
                
                <div className="mt-4 bg-pink-50 rounded-lg p-3 border border-pink-200 text-center">
                  <div className="flex items-center justify-center text-pink-600 mb-1">
                    <Star className="w-5 h-5 fill-pink-500 text-pink-500 mr-1" />
                    <span className="font-bold text-lg">{movie.rating}/10</span>
                  </div>
                  <p className="text-xs text-purple-600">User Rating</p>
                </div>
              </div>
            )}
            
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
                {movie.title}
              </h1>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {movie.genres?.map((genre) => (
                  <span 
                    key={genre} 
                    className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded-full"
                  >
                    {genre}
                  </span>
                ))}
              </div>
              
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
                <p className="text-purple-800 italic">{movie.description}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="space-y-3">
                  <p className="flex items-center text-purple-700">
                    <Calendar className="w-4 h-4 mr-2 text-pink-500" />
                    <span className="font-medium">Release Date:</span> 
                    <span className="ml-2">{movie.release_date}</span>
                  </p>
                  <p className="flex items-center text-purple-700">
                    <Clock className="w-4 h-4 mr-2 text-pink-500" />
                    <span className="font-medium">Runtime:</span> 
                    <span className="ml-2">{movie.runtime_minutes} minutes</span>
                  </p>
                </div>
                <div className="space-y-3">
                  <p className="flex items-center text-purple-700">
                    <Languages className="w-4 h-4 mr-2 text-pink-500" />
                    <span className="font-medium">Language:</span> 
                    <span className="ml-2">{movie.language}</span>
                  </p>
                  <p className="flex items-center text-purple-700">
                    <Globe className="w-4 h-4 mr-2 text-pink-500" />
                    <span className="font-medium">Countries:</span> 
                    <span className="ml-2">{movie.countries?.join(', ')}</span>
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <Button 
                  onClick={handleReviewClick}
                  className={`rounded-full px-6 shadow-md transition-all duration-300 ${
                    hasReview
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
                      : 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600'
                  }`}
                >
                  {hasReview ? (
                    <Pencil className="w-4 h-4 mr-2" />
                  ) : (
                    <PenLine className="w-4 h-4 mr-2" />
                  )}
                  {isAuthenticated 
                    ? (hasReview ? 'Edit Your Review' : 'Write Review')
                    : 'Login to Review'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleWatchlaterClick}
                  disabled={!isAuthenticated}
                  className={`border-2 rounded-full px-6 transition-all duration-300 ${
                    isAuthenticated 
                      ? isInWatchLater
                        ? 'border-green-300 bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700'
                        : 'border-pink-300 bg-white text-pink-600 hover:bg-pink-50 hover:text-pink-700'
                      : 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                  title={!isAuthenticated ? 'Please login to add to watchlater' : ''}
                >
                  {isInWatchLater ? (
                    <BookmarkCheck className="w-4 h-4 mr-2 text-green-600" />
                  ) : (
                    <BookmarkPlus className="w-4 h-4 mr-2 text-pink-600" />
                  )}
                  {isAuthenticated 
                    ? (isInWatchLater ? 'In Watch Later' : 'Add to Watch Later')
                    : 'Login to Add to Watch Later'}
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
