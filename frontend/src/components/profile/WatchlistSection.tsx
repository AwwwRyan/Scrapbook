"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { movieApi } from "@/lib/api/movies"
import Image from "next/image"
import Link from "next/link"
import { Switch } from "@/components/ui/switch"
import { BookmarkCheck, ChevronRight, Film, Heart, Sparkles, Calendar, CheckCircle } from "lucide-react"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"

interface WatchLaterItem {
  id: number
  user: string
  movie: string // This is the movie ID
  added_at: string
}

interface MovieDetails {
  id: string
  title: string
  image_url: string | null
  release_date: string | null
  watched_at?: string
  description?: string
}

interface WatchlistMovieWithDetails {
  id: number
  movieDetails: MovieDetails | null
  added_at: string
  watched_at?: string
}

interface Props {
  fullView?: boolean
  showWatchedOnly?: boolean
}

export default function WatchlistSection({ fullView = false, showWatchedOnly = false }: Props) {
  const [watchlistItems, setWatchlistItems] = useState<WatchlistMovieWithDetails[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWatchlist()
  }, [])

  const fetchWatchlist = async () => {
    try {
      // Fetch either watched movies or watch later based on the showWatchedOnly prop
      const data = showWatchedOnly 
        ? await movieApi.getWatchlist() 
        : await movieApi.getWatchLater()

      // Then fetch movie details for each movie ID
      const moviesWithDetails = await Promise.all(
        data.map(async (item: any) => {
          try {
            const movieDetails = await movieApi.getMovieDetail(item.movie)
            return {
              id: item.id,
              movieDetails,
              added_at: item.added_at,
              watched_at: item.watched_at, // Include watched_at for watched movies
            }
          } catch (error) {
            console.error(`Error fetching details for movie ${item.movie}:`, error)
            return {
              id: item.id,
              movieDetails: null,
              added_at: item.added_at,
              watched_at: item.watched_at, // Include watched_at for watched movies
            }
          }
        }),
      )

      setWatchlistItems(moviesWithDetails)
    } catch (error) {
      console.error("Error fetching watchlist:", error)
      toast.error(`Failed to load ${showWatchedOnly ? 'watched movies' : 'watch later list'}`)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsWatched = async (movieId: string) => {
    try {
      await movieApi.addToWatchlist(movieId)
      await movieApi.removeFromWatchLater(movieId)
      toast.success("Movie marked as watched!")
      fetchWatchlist() // Refresh the list
    } catch (error) {
      toast.error("Failed to update movie status")
    }
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
          {showWatchedOnly ? (
            <>
              <CheckCircle className="mr-2 text-pink-500" />
              Watched Movies
            </>
          ) : (
            <>
              <Heart className="mr-2 text-pink-500" />
              Watch Later
            </>
          )}
        </h2>
        {!fullView && (
          <Link
            href={showWatchedOnly ? "/profile/watched" : "/profile/watchlist"}
            className="text-pink-600 hover:text-pink-700 transition-colors flex items-center group"
          >
            {showWatchedOnly ? "Manage All Watched Movies" : "Manage Watchlist"}
            <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        )}
      </div>

      <div className={`grid gap-4 ${fullView ? "grid-cols-1 md:grid-cols-3" : "grid-cols-1 md:grid-cols-2"}`}>
        {watchlistItems
          .filter(
            (item): item is WatchlistMovieWithDetails & { movieDetails: NonNullable<MovieDetails> } =>
              item.movieDetails !== null,
          )
          .map((item) => (
            <MovieCard
              key={item.id}
              movie={item.movieDetails}
              onMarkWatched={() => handleMarkAsWatched(item.movieDetails.id)}
              showWatchedOnly={showWatchedOnly}
            />
          ))}
      </div>

      {watchlistItems.length === 0 && (
        <div className="text-center py-8 text-purple-600 italic">
          {showWatchedOnly ? (
            <>
              <CheckCircle className="h-8 w-8 mx-auto mb-2 text-pink-400" />
              No watched movies yet
            </>
          ) : (
            <>
              <BookmarkCheck className="h-8 w-8 mx-auto mb-2 text-pink-400" />
              No movies in your watch later list
            </>
          )}
        </div>
      )}
    </Card>
  )
}

interface MovieCardProps {
  movie: MovieDetails
  onMarkWatched: () => void
  showWatchedOnly?: boolean
}

function MovieCard({ movie, onMarkWatched, showWatchedOnly = false }: MovieCardProps) {
  const router = useRouter()
  const formatReleaseYear = (date: string | null) => {
    if (!date) return "N/A"
    const year = new Date(date).getFullYear()
    return isNaN(year) ? "N/A" : year.toString()
  }

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent navigation if the user clicked on the switch or its label
    if (
      (e.target as HTMLElement).closest('.switch-container') ||
      (e.target as HTMLElement).closest('.switch-label')
    ) {
      return
    }
    router.push(`/movies/${movie.id}`)
  }

  return (
    <div 
      className="flex gap-4 p-4 border-2 border-pink-100 rounded-xl bg-gradient-to-br from-white to-pink-50 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative w-24 h-36">
        {movie.image_url ? (
          <div className="relative w-full h-full rounded-lg overflow-hidden border-2 border-pink-200">
            <Image
              src={movie.image_url || "/placeholder.svg"}
              alt={movie.title}
              fill
              className="object-cover"
              onError={(e) => {
                ;(e.target as HTMLImageElement).src = "/default-movie-poster.png"
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
        <h3 className="font-semibold text-purple-700">{movie.title}</h3>
        <p className="text-sm text-pink-600 flex items-center mt-1">
          <Calendar className="w-3 h-3 mr-1" />
          {formatReleaseYear(movie.release_date)}
        </p>
        {showWatchedOnly && movie.watched_at && (
          <p className="text-xs text-pink-500 mt-1">
            Watched on {new Date(movie.watched_at).toLocaleDateString()}
          </p>
        )}
        {showWatchedOnly && movie.description && (
          <p className="text-sm text-gray-600 mt-2 line-clamp-3">
            {movie.description}
          </p>
        )}
        <div className="flex items-center gap-2 mt-4">
          {!showWatchedOnly && (
            <>
              <div className="switch-container">
                <Switch
                  onCheckedChange={onMarkWatched}
                  className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-pink-500 data-[state=checked]:to-purple-500"
                />
              </div>
              <span className="text-sm text-purple-600 switch-label">Mark as watched</span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}