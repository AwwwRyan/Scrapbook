"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { movieApi } from "@/lib/api/movies"
import { Star, Film, Sparkles, Pencil, Trash2 } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"

interface ReviewActivity {
  id: string
  type: "review"
  movie: {
    id: string
    title: string
    image_url: string
  }
  action_date: string
  details?: {
    rating?: number
    review_snippet?: string
  }
}

export default function ReviewsPage() {
  const router = useRouter()
  const [reviews, setReviews] = useState<ReviewActivity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      const data = await movieApi.getRecentActivity()
      const reviewActivities = data.activities.filter((a): a is ReviewActivity => a.type === "review")
      setReviews(reviewActivities)
    } catch (error) {
      console.error("Error fetching reviews:", error)
      toast.error("Failed to load reviews")
    } finally {
      setLoading(false)
    }
  }

  const handleEditReview = (movieId: string) => {
    router.push(`/movies/${movieId}?edit=true`)
  }



  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-pink-100 to-purple-100 flex items-center justify-center">
        <div className="animate-spin text-pink-500">
          <Sparkles size={40} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-100 to-purple-100 py-8 px-4" suppressHydrationWarning>
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600 flex items-center">
            <Star className="mr-2 text-pink-500 fill-pink-500" />
            My Reviews
          </h1>
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="border-2 border-pink-200 hover:bg-pink-50"
          >
            Back to Profile
          </Button>
        </div>

        <div className="grid gap-6">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <Card key={review.id} className="p-6 border-2 border-pink-200 shadow-lg rounded-2xl bg-white/90 backdrop-blur-sm">
                <div className="flex gap-6">
                  <div className="relative w-32 h-48">
                    {review.movie.image_url ? (
                      <div className="relative w-full h-full rounded-lg overflow-hidden border-2 border-pink-200">
                        <Image
                          src={review.movie.image_url}
                          alt={review.movie.title}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/default-movie-poster.png"
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-pink-500/30 to-transparent"></div>
                      </div>
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg flex items-center justify-center border-2 border-pink-200">
                        <Film className="w-8 h-8 text-pink-400" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <h2 className="text-2xl font-semibold text-purple-700 mb-2">{review.movie.title}</h2>
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={`star-${i}`}
                          className={i < (review.details?.rating || 0) ? "text-pink-500 fill-pink-500" : "text-gray-300"}
                          size={20}
                        />
                      ))}
                    </div>
                    <p className="text-purple-600 italic mb-4">
                      "{review.details?.review_snippet || "No review content"}"
                    </p>
                    <div className="text-sm text-pink-500 mb-4">
                      Reviewed on {new Date(review.action_date).toLocaleDateString()}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => handleEditReview(review.movie.id)}
                        className="border-2 border-pink-200 hover:bg-pink-50"
                      >
                        <Pencil className="w-4 h-4 mr-2" />
                        Edit Review
                      </Button>
                      
                     
            
                      
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-xl border-2 border-pink-200">
              <Star className="h-12 w-12 mx-auto mb-4 text-pink-400" />
              <p className="text-xl text-purple-600">No reviews yet</p>
              <p className="text-pink-600 mt-2">Start reviewing movies to see them here!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 