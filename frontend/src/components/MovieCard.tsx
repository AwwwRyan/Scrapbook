import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Movie } from "@/types/movie"
import Link from "next/link"
import { Star, Calendar, Sparkles } from "lucide-react"

interface MovieCardProps {
  movie: Movie
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <Card className="overflow-hidden border-2 border-pink-200 shadow-lg rounded-xl bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <CardContent className="p-0">
        {movie.image_url && (
          <div className="relative h-[200px] w-full">
            <div className="absolute inset-0 bg-gradient-to-t from-pink-500/30 to-transparent z-10"></div>
            <Image
              src={movie.image_url || "/placeholder.svg"}
              alt={movie.title}
              fill
              className="object-cover"
              onError={(e) => {
                // Fallback to default image on error
                ;(e.target as HTMLImageElement).src = "/default-movie-poster.png"
              }}
            />
            <div className="absolute top-2 right-2 z-20 bg-white rounded-full p-1 shadow-sm border border-pink-200">
              {movie.rating && (
                <div className="flex items-center text-pink-600">
                  <Star className="w-3 h-3 fill-pink-500 text-pink-500 mr-1" />
                  <span className="text-xs font-bold">{movie.rating.toFixed(1)}</span>
                </div>
              )}
            </div>
          </div>
        )}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-purple-700">{movie.title}</h3>
          <div className="flex items-center mt-2 text-sm text-pink-600">
            <Calendar className="w-3 h-3 mr-1" />
            <p>{movie.release_date?.split("T")[0]}</p>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {movie.genres?.slice(0, 2).map((genre) => (
              <span key={genre} className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded-full">
                {genre}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link href={`/movies/${movie.id}`} className="w-full">
          <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-medium rounded-lg transition-all duration-300 shadow-md hover:shadow-lg">
            <Sparkles className="w-4 h-4 mr-2" />
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

