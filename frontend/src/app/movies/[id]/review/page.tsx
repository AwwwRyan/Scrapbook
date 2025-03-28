'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { movieApi } from '@/lib/api/movies';
import { useAuthStore } from '@/store/auth';
import { toast } from 'react-hot-toast';
import { Loading } from '@/components/ui/loading';
import axios from 'axios';

export default function ReviewPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(4);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!isAuthenticated || !token) {
      sessionStorage.setItem('redirectAfterLogin', `/movies/${params.id}/review`);
      router.push('/login');
    }
  }, [isAuthenticated, params.id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate rating
    if (rating < 1 || rating > 5) {
      toast.error('Rating must be between 1 and 5');
      return;
    }

    try {
      setSubmitting(true);
      // Remove movie addition, just submit the review
      await movieApi.addReview(params.id as string, {
        review_text: review.trim(),
        rating: rating
      });
      
      toast.success('Review submitted successfully');
      router.push(`/movies/${params.id}`);
    } catch (error: any) {
      if (error.response?.status === 401) {
        useAuthStore.getState().logout();
        sessionStorage.setItem('redirectAfterLogin', `/movies/${params.id}/review`);
        router.push('/login');
      } else {
        toast.error('Failed to submit review');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // If not authenticated, return null (redirect will happen in useEffect)
  if (!isAuthenticated) return null;

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Write a Review</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2">Rating (1-5)</label>
            <div className="flex items-center gap-4">
              <input
                type="number"
                min="1"
                max="5"
                step="0.5"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-24 p-2 border rounded"
              />
              <span className="text-lg">⭐</span>
            </div>
          </div>
          <div>
            <label className="block mb-2">Your Review</label>
            <Textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              rows={6}
              placeholder="Write your review here..."
              required
              className="w-full"
            />
          </div>
          <div className="flex gap-4">
            <Button 
              type="submit" 
              disabled={submitting}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </Button>
            <Button 
              type="button" 
              variant="outline"
              onClick={() => router.back()}
              className="border-purple-600 text-purple-600 hover:bg-purple-50"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
} 