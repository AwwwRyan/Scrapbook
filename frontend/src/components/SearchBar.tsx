'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useDebounce } from '@/lib/hooks/useDebounce';

export default function SearchBar() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const router = useRouter();

  useEffect(() => {
    // Perform search with debouncedSearch value
  }, [debouncedSearch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/search?q=${encodeURIComponent(search)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex gap-2 w-full">
      <Input
        type="search"
        placeholder="Search for movies..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="flex-1"
      />
      <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
        <Search className="w-4 h-4 mr-2" />
        Search
      </Button>
    </form>
  );
} 