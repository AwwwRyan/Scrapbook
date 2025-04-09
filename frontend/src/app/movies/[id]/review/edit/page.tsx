'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { movieApi } from '@/lib/api/movies';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuthStore } from '@/store/auth';
import { toast } from 'react-hot-toast';
import { Star, ArrowLeft } from 'lucide-react';

export default function EditReviewPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [review, setReview] = useState<{
    rating: number;
    review_text: string;
  }>({
    rating: 0,
    review_text: '',
  });
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    const fetchReview = async () => {
      if (!isAuthenticated) {
        toast.error('Please login to edit your review');
        sessionStorage.setItem('redirectAfterLogin', `/movies/${params.id}/review/edit`);
        router.push('/login');
        return;
      }

      try {
        setLoading(true);
        const reviews = await movieApi.getUserReviews();
        const userReview = reviews.find((review: any) => review.movie === params.id);
        
        if (!userReview) {
          setError('Review not found');
          return;
        }

        setReview({
          rating: userReview.rating,
          review_text: userReview.review_text || '',
        });
      } catch (err) {
        setError('Failed to load review');
      } finally {
        setLoading(false);
      }
    };

    fetchReview();
  }, [params.id, isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Please login to edit your review');
      return;
    }

    try {
      const reviews = await movieApi.getUserReviews();
      const userReview = reviews.find((review: any) => review.movie === params.id);
      
      if (!userReview) {
        toast.error('Review not found');
        return;
      }

      await movieApi.updateReview(userReview.id, {
        rating: review.rating,
        review_text: review.review_text,
      });

      toast.success('Review updated successfully');
      router.replace(`/movies/${params.id}`);
    } catch (error) {
      toast.error('Failed to update review');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-pink-100 to-purple-100 flex items-center justify-center">
        <div className="text-center p-8 rounded-lg bg-white/80 backdrop-blur-sm shadow-md border-2 border-pink-200">
          <div className="animate-spin text-pink-500 mb-4">
            <Star size={40} />
          </div>
          <p className="text-purple-700 font-medium">Loading review...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-pink-100 to-purple-100 flex items-center justify-center p-4">
        <div className="text-pink-600 text-center bg-white/80 backdrop-blur-sm p-8 rounded-lg border-2 border-pink-200 shadow-md max-w-md">
          <Star className="mx-auto mb-4 text-pink-500" size={40} />
          <h2 className="text-xl font-bold text-purple-700 mb-2">Oh no!</h2>
          <p>{error}</p>
          <Button 
            onClick={() => router.push(`/movies/${params.id}`)}
            className="mt-4 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 rounded-full px-6 shadow-md transition-all duration-300"
          >
            Back to Movie
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-100 to-purple-100 py-10">
      <div className="container mx-auto px-4">
        <Button
          onClick={() => router.push(`/movies/${params.id}`)}
          className="mb-6 bg-white/80 hover:bg-white/90 text-pink-600 border-2 border-pink-200 rounded-full px-6 shadow-md transition-all duration-300"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Movie
        </Button>

        <Card className="p-8 border-2 border-pink-200 shadow-lg rounded-2xl bg-white/90 backdrop-blur-sm">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
            Edit Your Review
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-lg font-medium text-purple-700">Your Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReview({ ...review, rating: star })}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        (hoverRating || review.rating) >= star
                          ? 'fill-pink-500 text-pink-500'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-lg font-medium text-purple-700">Your Review</label>
              <Textarea
                value={review.review_text}
                onChange={(e) => setReview({ ...review, review_text: e.target.value })}
                placeholder="Share your thoughts about this movie..."
                className="min-h-[200px] bg-white/50 border-2 border-pink-200 focus:border-pink-300 focus:ring-2 focus:ring-pink-200"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 rounded-full px-6 shadow-md transition-all duration-300"
            >
              Update Review
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
} 