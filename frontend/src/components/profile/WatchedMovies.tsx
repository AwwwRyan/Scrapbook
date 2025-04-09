"use client"

import { useState, useEffect, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { movieApi } from "@/lib/api/movies"
import { Star, Film, Heart, ChevronRight, Sparkles, PenLine } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"

interface WatchedMovie {
  id: number
  movie: string // Movie ID
  watched_at: string
  movieDetails?: {
    id: string
    title: string
    image_url: string | null
    release_date: string | null
  }
  hasReview?: boolean
  reviewDetails?: {
    id: number
    rating: number
    review_text: string
  }
}

interface Props {
  fullView?: boolean
}

export default function WatchedMovies({ fullView = false }: Props) {
  const router = useRouter()
  const [watchedMovies, setWatchedMovies] = useState<WatchedMovie[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWatchedMovies()
  }, [])

  const fetchWatchedMovies = async () => {
    try {
      setLoading(true)
      // Get all watched movies
      const watchlistData = await movieApi.getWatchlist()
      
      // Get all user reviews
      const userReviews = await movieApi.getUserReviews()
      
      // Fetch movie details for each watched movie
      const moviesWithDetails = await Promise.all(
        watchlistData.map(async (item: any) => {
          try {
            const movieDetails = await movieApi.getMovieDetail(item.movie)
            
            // Check if user has reviewed this movie
            const review = userReviews.find((review: any) => review.movie === item.movie)
            
            return {
              id: item.id,
              movie: item.movie,
              watched_at: item.watched_at,
              movieDetails,
              hasReview: !!review,
              reviewDetails: review ? {
                id: review.id,
                rating: review.rating,
                review_text: review.review_text
              } : undefined
            }
          } catch (error) {
            console.error(`Error fetching details for movie ${item.movie}:`, error)
            return {
              id: item.id,
              movie: item.movie,
              watched_at: item.watched_at,
              hasReview: false
            }
          }
        })
      )
      
      setWatchedMovies(moviesWithDetails)
    } catch (error) {
      console.error("Error fetching watched movies:", error)
      toast.error("Failed to load watched movies")
    } finally {
      setLoading(false)
    }
  }

  const handleAddReview = (movieId: string) => {
    router.push(`/movies/${movieId}/review`)
  }

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
          <Film className="mr-2 text-pink-500" />
          Watched Movies
        </h2>
        {!fullView && (
          <Link
            href="/profile/watched"
            className="text-pink-600 hover:text-pink-700 transition-colors flex items-center group"
          >
            View All
            <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        )}
      </div>

      <div className={`grid gap-4 ${fullView ? "grid-cols-1 md:grid-cols-3" : "grid-cols-1 md:grid-cols-2"}`}>
        {watchedMovies.length > 0 ? (
          watchedMovies.map((movie) => (
            <WatchedMovieCard 
              key={`${movie.movie}-${movie.watched_at}`} 
              movie={movie} 
              onAddReview={handleAddReview} 
            />
          ))
        ) : (
          <div className="text-center py-8 text-purple-600 italic">
            <Film className="h-8 w-8 mx-auto mb-2 text-pink-400" />
            No watched movies yet. Start watching some movies!
          </div>
        )}
      </div>
    </Card>
  )
}

interface WatchedMovieCardProps {
  movie: WatchedMovie
  onAddReview: (movieId: string) => void
}

function WatchedMovieCard({ movie, onAddReview }: WatchedMovieCardProps) {
  const router = useRouter()
  const [clickedId, setClickedId] = useState<string | null>(null)

  // Handle navigation with loading state
  const handleMovieClick = useCallback((movieId: string) => {
    setClickedId(movieId)
    router.push(`/movies/${movieId}`)
  }, [router])

  // Prefetch on hover
  const handleMovieHover = useCallback((movieId: string) => {
    router.prefetch(`/movies/${movieId}`)
  }, [router])

  if (!movie.movieDetails) {
    return null
  }

  return (
    <div 
      className={`flex gap-4 p-4 border-2 border-pink-100 rounded-xl bg-gradient-to-br from-white to-pink-50 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1
        ${clickedId === movie.movieDetails.id ? 'opacity-70 scale-95' : 'opacity-100 scale-100'}
      `}
    >
      {/* Add loading indicator when clicked */}
      {clickedId === movie.movieDetails.id && (
        <div className="absolute inset-0 bg-white/50 z-20 flex items-center justify-center rounded-xl">
          <div className="animate-spin text-pink-500">
            <Sparkles size={24} />
          </div>
        </div>
      )}
      
      <div 
        className="relative w-24 h-36 cursor-pointer"
        onClick={() => handleMovieClick(movie.movieDetails!.id)}
        onMouseEnter={() => handleMovieHover(movie.movieDetails!.id)}
      >
        {movie.movieDetails.image_url ? (
          <div className="relative w-full h-full rounded-lg overflow-hidden border-2 border-pink-200">
            <Image
              src={movie.movieDetails.image_url || "/placeholder.svg"}
              alt={movie.movieDetails.title}
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
        <h3 
          className="font-semibold text-purple-700 cursor-pointer"
          onClick={() => handleMovieClick(movie.movieDetails!.id)}
          onMouseEnter={() => handleMovieHover(movie.movieDetails!.id)}
        >
          {movie.movieDetails.title}
        </h3>
        
        {movie.hasReview && movie.reviewDetails ? (
          <>
            <div className="flex items-center gap-1 mt-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={`star-${i}`}
                  className={i < movie.reviewDetails!.rating ? "text-pink-500 fill-pink-500" : "text-gray-300"}
                  size={16}
                />
              ))}
            </div>
            <p className="text-sm text-purple-600 mt-3 line-clamp-2 italic">
              "{movie.reviewDetails.review_text.substring(0, 100)}{movie.reviewDetails.review_text.length > 100 ? '...' : ''}"
            </p>
            <div className="mt-2 text-xs text-pink-500">
              Watched on {new Date(movie.watched_at).toLocaleDateString()}
            </div>
          </>
        ) : (
          <div className="mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAddReview(movie.movieDetails!.id)}
              className="border-2 border-pink-200 hover:bg-pink-50 text-pink-600"
            >
              <PenLine className="w-3 h-3 mr-1" />
              Add Review
            </Button>
            <div className="mt-2 text-xs text-pink-500">
              Watched on {new Date(movie.watched_at).toLocaleDateString()}
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 