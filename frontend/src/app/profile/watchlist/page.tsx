"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { movieApi } from "@/lib/api/movies"
import { Heart, Film, Sparkles, Calendar, CheckCircle2 } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"

interface WatchLaterItem {
  id: number
  user: string
  movie: string
  added_at: string
}

interface MovieDetails {
  id: string
  title: string
  image_url: string | null
  release_date: string | null
}

interface WatchlistMovieWithDetails {
  id: number
  movieDetails: MovieDetails | null
  added_at: string
}

export default function WatchlistPage() {
  const router = useRouter()
  const [watchlistItems, setWatchlistItems] = useState<WatchlistMovieWithDetails[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWatchlist()
  }, [])

  const fetchWatchlist = async () => {
    try {
      const watchLaterData = await movieApi.getWatchLater()
      const moviesWithDetails = await Promise.all(
        watchLaterData.map(async (item: WatchLaterItem) => {
          try {
            const movieDetails = await movieApi.getMovieDetail(item.movie)
            return {
              id: item.id,
              movieDetails,
              added_at: item.added_at,
            }
          } catch (error) {
            console.error(`Error fetching details for movie ${item.movie}:`, error)
            return {
              id: item.id,
              movieDetails: null,
              added_at: item.added_at,
            }
          }
        }),
      )
      setWatchlistItems(moviesWithDetails)
    } catch (error) {
      console.error("Error fetching watchlist:", error)
      toast.error("Failed to load watchlist")
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsWatched = async (movieId: string) => {
    try {
      await movieApi.addToWatchlist(movieId)
      await movieApi.removeFromWatchLater(movieId)
      toast.success("Movie marked as watched!")
      fetchWatchlist()
    } catch (error) {
      toast.error("Failed to update movie status")
    }
  }

  const handleRemoveFromWatchlist = async (movieId: string) => {
    try {
      await movieApi.removeFromWatchLater(movieId)
      toast.success("Movie removed from watchlist")
      fetchWatchlist()
    } catch (error) {
      toast.error("Failed to remove movie from watchlist")
    }
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
            <Heart className="mr-2 text-pink-500" />
            My Watchlist
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
          {watchlistItems.length > 0 ? (
            watchlistItems
              .filter((item): item is WatchlistMovieWithDetails & { movieDetails: NonNullable<MovieDetails> } => 
                item.movieDetails !== null
              )
              .map((item) => (
                <Card key={item.id} className="p-6 border-2 border-pink-200 shadow-lg rounded-2xl bg-white/90 backdrop-blur-sm">
                  <div className="flex gap-6">
                    <div className="relative w-32 h-48">
                      {item.movieDetails.image_url ? (
                        <div className="relative w-full h-full rounded-lg overflow-hidden border-2 border-pink-200">
                          <Image
                            src={item.movieDetails.image_url}
                            alt={item.movieDetails.title}
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
                      <h2 className="text-2xl font-semibold text-purple-700 mb-2">{item.movieDetails.title}</h2>
                      <div className="flex items-center gap-2 text-pink-600 mb-4">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {item.movieDetails.release_date
                            ? new Date(item.movieDetails.release_date).getFullYear()
                            : "Release date not available"}
                        </span>
                      </div>
                      <div className="text-sm text-pink-500 mb-4">
                        Added on {new Date(item.added_at).toLocaleDateString()}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => handleMarkAsWatched(item.movieDetails.id)}
                          className="border-2 border-pink-200 hover:bg-pink-50"
                        >
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Mark as Watched
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleRemoveFromWatchlist(item.movieDetails.id)}
                          className="border-2 border-red-200 hover:bg-red-50 text-red-600"
                        >
                          Remove from Watchlist
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
          ) : (
            <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-xl border-2 border-pink-200">
              <Heart className="h-12 w-12 mx-auto mb-4 text-pink-400" />
              <p className="text-xl text-purple-600">Your watchlist is empty</p>
              <p className="text-pink-600 mt-2">Add movies to your watchlist to see them here!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 