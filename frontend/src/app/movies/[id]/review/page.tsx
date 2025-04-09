"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { movieApi } from "@/lib/api/movies"
import { useAuthStore } from "@/store/auth"
import { toast } from "react-hot-toast"
import { Heart, Sparkles, Star, ArrowLeft, Send } from "lucide-react"

export default function ReviewPage() {
  const params = useParams()
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const [review, setReview] = useState("")
  const [rating, setRating] = useState(4)
  const [submitting, setSubmitting] = useState(false)
  const [hoverRating, setHoverRating] = useState(0)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!isAuthenticated || !token) {
      sessionStorage.setItem("redirectAfterLogin", `/movies/${params.id}/review`)
      router.push("/login")
    }
  }, [isAuthenticated, params.id, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate rating
    if (rating < 1 || rating > 5) {
      toast.error("Rating must be between 1 and 5")
      return
    }

    try {
      setSubmitting(true)
      console.log("Submitting review with data:", {
        movieId: params.id,
        rating,
        review_text: review.trim(),
      })

      const response = await movieApi.addReview(params.id as string, {
        review_text: review.trim(),
        rating: rating,
      })

      console.log("Review submission response:", response)
      toast.success("Review submitted successfully")
      router.replace(`/movies/${params.id}`)
    } catch (error: any) {
      console.error("Review submission error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      })

      if (error.response?.status === 401) {
        useAuthStore.getState().logout()
        sessionStorage.setItem("redirectAfterLogin", `/movies/${params.id}/review`)
        router.push("/login")
      } else {
        toast.error("Failed to submit review")
      }
    } finally {
      setSubmitting(false)
    }
  }

  // If not authenticated, return null (redirect will happen in useEffect)
  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-100 to-purple-100 py-8 px-4">
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

      <div className="container mx-auto relative z-10">
        <Card className="max-w-2xl mx-auto p-8 border-2 border-pink-200 shadow-lg rounded-2xl bg-white/90 backdrop-blur-sm">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-2">
              <Sparkles className="text-pink-500 mr-2" />
              <Star className="text-pink-400 fill-pink-400" />
              <Sparkles className="text-pink-500 ml-2" />
            </div>
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
              Write a Review
            </h1>
            <p className="text-purple-500 text-sm mt-1">Share your thoughts about this movie</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-3 text-purple-700 font-medium">Rating</label>
              <div className="flex flex-col items-center gap-4 bg-pink-50 p-4 rounded-xl border border-pink-200">
                <div className="flex items-center justify-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="focus:outline-none transition-transform hover:scale-110 px-1"
                    >
                      <Star
                        size={32}
                        className={`${
                          star <= (hoverRating || rating) ? "text-pink-500 fill-pink-500" : "text-gray-300"
                        } transition-colors duration-200`}
                      />
                    </button>
                  ))}
                </div>
                <p className="text-sm text-pink-600 font-medium">
                  {rating} {rating === 1 ? "star" : "stars"}
                </p>
              </div>
            </div>

            <div>
              <label className="block mb-3 text-purple-700 font-medium">Your Review</label>
              <Textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                rows={6}
                placeholder="Write your review here..."
                required
                className="w-full border-2 border-pink-200 focus:border-pink-400 focus:ring-pink-400 rounded-lg bg-white/90 placeholder:text-pink-300"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                type="submit"
                disabled={submitting}
                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-medium py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
              >
                {submitting ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Review
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="border-2 border-pink-300 bg-white text-pink-600 hover:bg-pink-50 hover:text-pink-700 font-medium py-2 rounded-lg transition-all duration-300"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}
