"use client";

import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StoryCard } from "@/components/story-card";
import type { Story } from "@/types";
import { Search as SearchIcon, Filter, Info } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const mockStories: Story[] = [
   {
    id: '1',
    title: 'The Whispers of Chronos',
    author: 'Eleanor Vance',
    authorId: 'author1',
    coverImage: 'https://placehold.co/300x450/B4317B/F7F2FA?text=Chronos',
    description: 'A thrilling journey through time.',
    tags: ['sci-fi', 'time travel', 'adventure'],
    chapters: [{ id: 'c1', title: 'The Discovery', content: '...', order: 1 }],
    genre: 'Science Fiction',
    status: 'Completed',
    rating: 4.8,
    views: 25000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    dataAihint: "futuristic city"
  },
  {
    id: '2',
    title: 'Beneath the Emerald Canopy',
    author: 'Marcus Stone',
    authorId: 'author2',
    coverImage: 'https://placehold.co/300x450/B4317B/F7F2FA?text=Canopy',
    description: 'Explorers venture deep into an uncharted jungle.',
    tags: ['fantasy', 'exploration', 'magic'],
    chapters: [{ id: 'c1', title: 'The Summons', content: '...', order: 1 }],
    genre: 'Fantasy',
    status: 'Ongoing',
    rating: 4.5,
    views: 18000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    dataAihint: "lush jungle"
  },
  {
    id: '3',
    title: 'The Alchemist of Moonhaven',
    author: 'Seraphina Gold',
    authorId: 'author3',
    coverImage: 'https://placehold.co/300x450/B4317B/F7F2FA?text=Moonhaven',
    description: 'Alchemy and mystery in a moonlit city.',
    tags: ['steampunk', 'mystery', 'alchemy'],
    chapters: [{ id: 'c1', title: 'First Transmutation', content: '...', order: 1 }],
    genre: 'Steampunk',
    status: 'Completed',
    rating: 4.2,
    views: 12000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    dataAihint: "mystical city"
  },
];

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGenre, setFilterGenre] = useState('all');
  const [searchResults, setSearchResults] = useState<Story[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    if (!searchTerm && filterGenre === 'all') {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    setHasSearched(true);
    const filtered = mockStories.filter(story => {
      const termMatch = searchTerm.toLowerCase()
        ? story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          story.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
          story.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
        : true;
      const genreMatch = filterGenre !== 'all' ? story.genre.toLowerCase() === filterGenre.toLowerCase() : true;
      return termMatch && genreMatch;
    });
    setSearchResults(filtered);
  };
  
  useEffect(() => {
    // Trigger search if filters change and a search has already been performed or if search term exists
    if(hasSearched || searchTerm) {
        handleSearch();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterGenre]); // Only re-run if filterGenre changes after initial search

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-primary">Search Stories</h1>
      <p className="text-muted-foreground">Find your next adventure. Search by title, author, tags, or filter by genre.</p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search for stories, authors, tags..."
            className="pl-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <Select value={filterGenre} onValueChange={setFilterGenre}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter by Genre" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Genres</SelectItem>
            <SelectItem value="Science Fiction">Science Fiction</SelectItem>
            <SelectItem value="Fantasy">Fantasy</SelectItem>
            <SelectItem value="Steampunk">Steampunk</SelectItem>
            <SelectItem value="Mystery">Mystery</SelectItem>
            {/* Add more genres as needed */}
          </SelectContent>
        </Select>
        <Button onClick={handleSearch} className="w-full sm:w-auto">
          <SearchIcon className="mr-2 h-4 w-4 sm:hidden" /> Search
        </Button>
      </div>

      {hasSearched && searchResults.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Search Results ({searchResults.length})</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {searchResults.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>
        </div>
      )}

      {hasSearched && searchResults.length === 0 && (
         <Alert className="mt-6">
            <Info className="h-5 w-5" />
            <AlertTitle>No Results Found</AlertTitle>
            <AlertDescription>
                We couldn't find any stories matching your search criteria. Try different keywords or filters.
            </AlertDescription>
        </Alert>
      )}

      {!hasSearched && (
         <Alert variant="default" className="mt-6">
            <Info className="h-5 w-5" />
            <AlertTitle>Start Your Search</AlertTitle>
            <AlertDescription>
                Enter a search term or select a filter to discover stories.
            </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
