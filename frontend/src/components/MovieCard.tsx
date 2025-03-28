import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Movie } from '@/types/movie';
import Link from 'next/link';

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        {movie.image_url && (
          <div className="relative h-[200px] w-full">
            <Image
              src={movie.image_url}
              alt={movie.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className="p-4">
          <h3 className="text-lg font-semibold">{movie.title}</h3>
          <p className="text-sm text-gray-600">
            {movie.release_date?.split('T')[0]}
          </p>
          {movie.rating && (
            <p className="text-sm">Rating: {movie.rating.toFixed(1)}/10</p>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4">
        <Link href={`/movies/${movie.id}`} className="w-full">
          <Button className="w-full">View Details</Button>
        </Link>
      </CardFooter>
    </Card>
  );
} 