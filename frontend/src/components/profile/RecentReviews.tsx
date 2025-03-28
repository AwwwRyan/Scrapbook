"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { movieApi } from "@/lib/api/movies"
import { Star, Film, Heart, ChevronRight, Sparkles } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface ReviewActivity {
  id: string
  type: "review" | "watch" | "watchlist_add" | "watch_later_add"
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

interface Props {
  fullView?: boolean
}

export default function RecentReviews({ fullView = false }: Props) {
  const [reviews, setReviews] = useState<ReviewActivity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await movieApi.getRecentActivity()
        const reviewActivities = data.activities.filter((a): a is ReviewActivity => a.type === "review")
        setReviews(reviewActivities)
      } catch (error) {
        console.error("Error fetching reviews:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [])

  if (loading) {
    return (
      <Card className="p-6 border-2 border-pink-200 shadow-lg rounded-2xl bg-white/90 backdrop-blur-sm">
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin text-pink-500">
            <Sparkles size={40} />
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6 border-2 border-pink-200 shadow-lg rounded-2xl bg-white/90 backdrop-blur-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600 flex items-center">
          <Star className="mr-2 text-pink-500 fill-pink-500" />
          Recent Reviews
        </h2>
        {!fullView && (
          <Link
            href="/profile/reviews"
            className="text-pink-600 hover:text-pink-700 transition-colors flex items-center group"
          >
            Manage Reviews
            <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        )}
      </div>

      <div className={`grid gap-4 ${fullView ? "grid-cols-1 md:grid-cols-3" : "grid-cols-1 md:grid-cols-2"}`}>
        {reviews.length > 0 ? (
          reviews.map((review) => <ReviewCard key={`${review.movie.id}-${review.action_date}`} review={review} />)
        ) : (
          <div className="text-center py-8 text-purple-600 italic">
            <Star className="h-8 w-8 mx-auto mb-2 text-pink-400" />
            No reviews yet. Start rating some movies!
          </div>
        )}
      </div>
    </Card>
  )
}

interface ReviewCardProps {
  review: ReviewActivity
}

function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="flex gap-4 p-4 border-2 border-pink-100 rounded-xl bg-gradient-to-br from-white to-pink-50 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative w-24 h-36">
        {review.movie.image_url ? (
          <div className="relative w-full h-full rounded-lg overflow-hidden border-2 border-pink-200">
            <Image
              src={review.movie.image_url || "/placeholder.svg"}
              alt={review.movie.title}
              fill
              className="object-cover"
              onError={(e) => {
                // Fallback to default image on error
                ;(e.target as HTMLImageElement).src = "/default-movie-poster.png"
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-pink-500/30 to-transparent"></div>
          </div>
        ) : (
          // Fallback for when no image URL is provided
          <div className="w-full h-full bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg flex items-center justify-center border-2 border-pink-200">
            <Film className="w-8 h-8 text-pink-400" />
          </div>
        )}
      </div>

      <div className="flex-1">
        <h3 className="font-semibold text-purple-700">{review.movie.title}</h3>
        <div className="flex items-center gap-1 mt-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={`star-${i}`}
              className={i < (review.details?.rating || 0) ? "text-pink-500 fill-pink-500" : "text-gray-300"}
              size={16}
            />
          ))}
        </div>
        <p className="text-sm text-purple-600 mt-3 line-clamp-2 italic">
          "{review.details?.review_snippet || "No review content"}"
        </p>
        <div className="mt-2 text-xs text-pink-500">{new Date(review.action_date).toLocaleDateString()}</div>
      </div>
    </div>
  )
}

