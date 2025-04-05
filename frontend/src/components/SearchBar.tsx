'use client';

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Sparkles } from "lucide-react"
import { movieApi } from "@/lib/api/movies"
import { Movie } from "@/types/movie"

interface SearchBarProps {
  onSearch: (results: Movie[]) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      setIsLoading(true);
      try {
        const results = await movieApi.searchMovies(search);
        console.log('Search results:', results);
        onSearch(results);
      } catch (error) {
        console.error('Error searching movies:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="relative">
      <div className="absolute -top-10 -right-10 text-pink-200 opacity-20 pointer-events-none">
        <Sparkles size={40} />
      </div>
      
      <form onSubmit={handleSearch} className="flex gap-2 w-full">
        <div className="relative flex-1">
          <Input
            type="search"
            placeholder="Search for movies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border-2 border-pink-200 focus:border-pink-400 focus:ring-pink-400 rounded-lg pl-10 pr-4 py-2 bg-white/90 backdrop-blur-sm"
            disabled={isLoading}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-pink-400" />
        </div>
        
        <Button 
          type="submit" 
          className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-medium rounded-lg transition-all duration-300 shadow-md hover:shadow-lg px-6"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Sparkles className="w-4 h-4 mr-2 animate-spin" />
              Searching...
            </>
          ) : (
            <>
              Search
            </>
          )}
        </Button>
      </form>
    </div>
  );
}

