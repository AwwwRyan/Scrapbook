"use client"

import { useEffect, useState, memo, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { movieApi } from "@/lib/api/movies"
import type { Movie } from "@/types/movie"
import { Card, CardContent } from "@/components/ui/card"
import SearchBar from "@/components/SearchBar"
import { useAuthStore } from "@/store/auth"
import { toast } from "react-hot-toast"
import { Heart, Sparkles, Star, Calendar, Film, Search, User, LogIn } from "lucide-react"
import Image from 'next/image'
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

// Memoize MovieGrid component to prevent unnecessary re-renders
const MovieGrid = memo(({
  movies,
  error,
  loading,
}: {
  movies: Movie[]
  error: string | null
  loading: boolean
}) => {
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

  if (loading)
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin text-pink-500">
          <Sparkles size={40} />
        </div>
      </div>
    )

  if (error)
    return (
      <div className="text-pink-600 text-center bg-pink-50 p-4 rounded-lg border border-pink-200">
        <Heart className="inline-block mr-2 text-pink-500" size={20} />
        {error}
      </div>
    )

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {movies.map((movie) => (
        <Card
          key={movie.id}
          className={`cursor-pointer hover:shadow-lg transition-all duration-300 border-2 border-pink-200 rounded-xl overflow-hidden bg-white/90
            ${clickedId === movie.id ? 'opacity-70 scale-95' : 'opacity-100 scale-100'}
          `}
          onClick={() => handleMovieClick(movie.id)}
          onMouseEnter={() => handleMovieHover(movie.id)}
        >
          <CardContent className="p-0 relative">
            {/* Add loading indicator when clicked */}
            {clickedId === movie.id && (
              <div className="absolute inset-0 bg-white/50 z-20 flex items-center justify-center">
                <div className="animate-spin text-pink-500">
                  <Sparkles size={24} />
                </div>
              </div>
            )}
            
            {movie.image_url && (
              <div className="relative h-[300px] w-full">
                <div className="absolute inset-0 bg-gradient-to-t from-pink-500/20 to-transparent z-10"></div>
                <Image
                  src={movie.image_url || "/placeholder.svg"}
                  alt={movie.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover"
                  priority={false}
                  loading="lazy"
                />
              </div>
            )}
            <div className="p-4 space-y-2">
              <h3 className="font-semibold text-lg line-clamp-2 text-purple-700">{movie.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">{movie.description}</p>
              <div className="flex justify-between text-sm">
                <span className="flex items-center text-pink-600">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(movie.release_date).getFullYear()}
                </span>
                <span className="flex items-center text-pink-600">
                  <Star className="w-4 h-4 mr-1 text-pink-500 fill-pink-500" />
                  {movie.rating?.toFixed(1)}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {movie.genres.slice(0, 3).map((genre) => (
                  <span key={genre} className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded-full">
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
})
MovieGrid.displayName = 'MovieGrid'

export default function HomePage() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const [popularMovies, setPopularMovies] = useState<Movie[]>([])
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([])
  const [searchResults, setSearchResults] = useState<Movie[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [loading, setLoading] = useState({
    popular: true,
    topRated: true,
    search: false,
  })
  const [error, setError] = useState({
    popular: null as string | null,
    topRated: null as string | null,
    search: null as string | null,
  })

  const handleSearchResults = async (results: Movie[]) => {
    setIsSearching(true)
    setSearchResults(results)
  }

  useEffect(() => {
    const fetchMovies = async () => {
      // Fetch Popular Movies first
      try {
        setLoading((prev) => ({ ...prev, popular: true }))
        const popularData = await movieApi.getPopularMovies()
        setPopularMovies(popularData)
      } catch (err) {
        setError((prev) => ({ ...prev, popular: "Failed to load popular movies" }))
        console.error(err)
      } finally {
        setLoading((prev) => ({ ...prev, popular: false }))
      }

      // Small delay before fetching top rated movies
      setTimeout(async () => {
        try {
          setLoading((prev) => ({ ...prev, topRated: true }))
          const topRatedData = await movieApi.getTopRatedMovies()
          setTopRatedMovies(topRatedData)
        } catch (err) {
          setError((prev) => ({ ...prev, topRated: "Failed to load top rated movies" }))
          console.error(err)
        } finally {
          setLoading((prev) => ({ ...prev, topRated: false }))
        }
      }, 100)
    }

    fetchMovies()
  }, [])

  useEffect(() => {
    // Check if token exists and is valid
    const token = localStorage.getItem("token")
    if (isAuthenticated && !token) {
      // Token missing but state shows authenticated - reset state
      useAuthStore.getState().setToken(null)
    }
  }, [isAuthenticated])

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-100 to-purple-100" suppressHydrationWarning>
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

      <div className="container mx-auto py-8 px-4 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col gap-6 mb-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white/80 backdrop-blur-sm p-6 rounded-xl border-2 border-pink-200 shadow-md">
            <div 
              onClick={() => router.push('/')}
              className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600 flex items-center cursor-pointer hover:scale-105 transition-transform"
            >
              Scrapbook
              <Sparkles className="ml-2 text-pink-500" size={24} />
            </div>

            <div className="flex-1 max-w-3xl w-full mx-4">
              <SearchBar onSearch={handleSearchResults} />
            </div>
            
            <div className="flex items-center gap-8">
              <Button
                onClick={() => router.push('/analytics')}
                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600"
              >
                Analytics
              </Button>
              
              <button
                onClick={() => router.push('/profile')}
                className="relative group"
              >
                <Avatar className="h-10 w-10 transition-transform group-hover:scale-110">
                  <AvatarImage 
                    src="/default-avatar.png" 
                    alt="/default-avatar.png" 
                  />
                  <AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">
                    <User size={20} />
                  </AvatarFallback>
                </Avatar>
              </button>
            </div>
          </div>
        </div>

        {/* Movies Sections */}
        <div className="space-y-12">
          {/* Search Results */}
          {isSearching && (
            <section className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border-2 border-pink-200 shadow-md">
              <h2 className="text-2xl font-semibold mb-6 text-purple-700 flex items-center justify-between">
                <div className="flex items-center">
                  <Search className="mr-2 text-pink-500" />
                  Search Results
                </div>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setIsSearching(false)
                    setSearchResults([])
                  }}
                  className="text-pink-500 hover:text-pink-700"
                >
                  Clear Search
                </Button>
              </h2>
              <MovieGrid 
                movies={searchResults} 
                error={error.search} 
                loading={loading.search} 
              />
            </section>
          )}

          {/* Show Popular and Top Rated sections only when not searching */}
          {!isSearching && (
            <>
              {/* Popular Movies */}
              <section className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border-2 border-pink-200 shadow-md">
                <h2 className="text-2xl font-semibold mb-6 text-purple-700 flex items-center">
                  <Sparkles className="mr-2 text-pink-500" />
                  Popular Movies
                </h2>
                <MovieGrid 
                  movies={popularMovies} 
                  error={error.popular} 
                  loading={loading.popular} 
                />
              </section>

              {/* Top Rated Movies */}
              <section className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border-2 border-pink-200 shadow-md">
                <h2 className="text-2xl font-semibold mb-6 text-purple-700 flex items-center">
                  <Star className="mr-2 text-pink-500 fill-pink-500" />
                  Top Rated Movies
                </h2>
                <MovieGrid 
                  movies={topRatedMovies} 
                  error={error.topRated} 
                  loading={loading.topRated} 
                />
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

