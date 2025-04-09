"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { movieApi } from "@/lib/api/movies"
import { Star, Film, Sparkles, Calendar, CheckCircle, Pencil } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"

interface WatchedMovie {
  id: number
  movie: string // Movie ID
  watched_at: string
  movieDetails?: {
    id: string
    title: string
    image_url: string | null
    release_date: string | null
    description?: string
  }
  hasReview?: boolean
  reviewDetails?: {
    id: number
    rating: number
    review_text: string
  }
}

export default function WatchedMoviesPage() {
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

  const handleEditReview = (movieId: string) => {
    router.push(`/movies/${movieId}?edit=true`)
  }

  const handleMovieClick = (movieId: string) => {
    router.push(`/movies/${movieId}`)
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
            <CheckCircle className="mr-2 text-pink-500 fill-pink-500" />
            Watched Movies
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
          {watchedMovies.length > 0 ? (
            watchedMovies.map((movie) => (
              <Card 
                key={movie.id} 
                className="p-6 border-2 border-pink-200 shadow-lg rounded-2xl bg-white/90 backdrop-blur-sm cursor-pointer hover:shadow-xl transition-all duration-300"
                onClick={() => handleMovieClick(movie.movie)}
              >
                <div className="flex gap-6">
                  <div className="relative w-32 h-48">
                    {movie.movieDetails?.image_url ? (
                      <div className="relative w-full h-full rounded-lg overflow-hidden border-2 border-pink-200">
                        <Image
                          src={movie.movieDetails.image_url}
                          alt={movie.movieDetails.title}
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
                    <h2 className="text-2xl font-semibold text-purple-700 mb-2">{movie.movieDetails?.title || "Unknown Movie"}</h2>
                    
                    <div className="flex items-center gap-1 mb-2">
                      {movie.hasReview && movie.reviewDetails ? (
                        [...Array(5)].map((_, i) => (
                          <Star
                            key={`star-${i}`}
                            className={i < movie.reviewDetails!.rating ? "text-pink-500 fill-pink-500" : "text-gray-300"}
                            size={20}
                          />
                        ))
                      ) : (
                        <span className="text-sm text-gray-500 italic">Not rated</span>
                      )}
                    </div>
                    
                    <p className="text-purple-600 italic mb-2 line-clamp-2">
                      {movie.movieDetails?.description || "No description available"}
                    </p>
                    
                    <div className="text-sm text-pink-500 mb-4">
                      Watched on {new Date(movie.watched_at).toLocaleDateString()}
                    </div>
                    
                    <div className="flex gap-2">
                      {movie.hasReview ? (
                        <Button
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditReview(movie.movie);
                          }}
                          className="border-2 border-pink-200 hover:bg-pink-50"
                        >
                          <Pencil className="w-4 h-4 mr-2" />
                          Edit Review
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/movies/${movie.movie}?review=true`);
                          }}
                          className="border-2 border-pink-200 hover:bg-pink-50"
                        >
                          <Star className="w-4 h-4 mr-2" />
                          Add Review
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-xl border-2 border-pink-200">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-pink-400" />
              <p className="text-xl text-purple-600">No watched movies yet</p>
              <p className="text-pink-600 mt-2">Start watching movies to see them here!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 