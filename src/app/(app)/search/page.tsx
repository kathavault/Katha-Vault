
"use client";

import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StoryCard } from "@/components/story-card";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"; // Added Card components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Added Avatar
import type { Story, UserProfile } from "@/types"; // Added UserProfile
import { Search as SearchIcon, Filter, Info, UserPlus, Users } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Added Tabs

// Mock data - replace with actual data fetching
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
];

const mockUsers: UserProfile[] = [
  {
    id: 'user001',
    username: 'ReaderRiley',
    email: 'riley@example.com',
    avatarUrl: 'https://placehold.co/100x100/8E7CC3/FFFFFF?text=RR',
    bio: 'Loves fantasy and sci-fi. Always looking for new authors.',
    followers: 150,
    following: 75,
    readingHistory: [],
    favorites: [],
    submittedStories: [],
  },
  {
    id: 'user002',
    username: 'AuthorAlex',
    email: 'alex@example.com',
    avatarUrl: 'https://placehold.co/100x100/E8A87C/FFFFFF?text=AA',
    bio: 'Aspiring novelist. Currently working on a steampunk adventure.',
    followers: 320,
    following: 120,
    readingHistory: [],
    favorites: [],
    submittedStories: [],
  },
];


// User Card Component (simplified for search results)
const UserSearchCard: React.FC<{ user: UserProfile }> = ({ user }) => (
  <Card className="shadow-md hover:shadow-lg transition-shadow">
    <CardHeader className="flex flex-row items-center gap-4 p-4">
      <Avatar className="h-16 w-16">
        <AvatarImage src={user.avatarUrl} alt={user.username} data-ai-hint="user avatar"/>
        <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div>
        <CardTitle className="text-lg">{user.username}</CardTitle>
        <CardDescription className="text-xs">{user.bio?.substring(0, 50)}{user.bio && user.bio.length > 50 ? '...' : ''}</CardDescription>
      </div>
    </CardHeader>
    <CardContent className="p-4 pt-0 flex justify-between items-center">
      <div className="text-xs text-muted-foreground">
        <span className="mr-2">{user.followers} Followers</span>
        <span>{user.following} Following</span>
      </div>
      <Button size="sm" variant="outline">
        <UserPlus className="mr-2 h-4 w-4" /> Follow
        {/* This button would trigger a follow action. Full implementation requires backend. */}
      </Button>
    </CardContent>
  </Card>
);


export default function SearchPage() {
  const [storySearchTerm, setStorySearchTerm] = useState('');
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [filterGenre, setFilterGenre] = useState('all');
  
  const [storyResults, setStoryResults] = useState<Story[]>([]);
  const [userResults, setUserResults] = useState<UserProfile[]>([]);
  
  const [hasSearchedStories, setHasSearchedStories] = useState(false);
  const [hasSearchedUsers, setHasSearchedUsers] = useState(false);

  const handleStorySearch = () => {
    if (!storySearchTerm && filterGenre === 'all') {
      setStoryResults([]);
      setHasSearchedStories(false);
      return;
    }
    setHasSearchedStories(true);
    const filtered = mockStories.filter(story => {
      const termMatch = storySearchTerm.toLowerCase()
        ? story.title.toLowerCase().includes(storySearchTerm.toLowerCase()) ||
          story.author.toLowerCase().includes(storySearchTerm.toLowerCase()) ||
          story.tags.some(tag => tag.toLowerCase().includes(storySearchTerm.toLowerCase()))
        : true;
      const genreMatch = filterGenre !== 'all' ? story.genre.toLowerCase() === filterGenre.toLowerCase() : true;
      return termMatch && genreMatch;
    });
    setStoryResults(filtered);
  };

  const handleUserSearch = () => {
    if (!userSearchTerm) {
      setUserResults([]);
      setHasSearchedUsers(false);
      return;
    }
    setHasSearchedUsers(true);
    const filtered = mockUsers.filter(user =>
      user.username.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      (user.email && user.email.toLowerCase().includes(userSearchTerm.toLowerCase()))
    );
    setUserResults(filtered);
  };
  
  useEffect(() => {
    if(hasSearchedStories || storySearchTerm) {
        handleStorySearch();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterGenre]); 

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-primary">Discover</h1>
        <p className="text-muted-foreground">Find your next adventure or connect with fellow readers and authors.</p>
      </header>
      
      <Tabs defaultValue="stories" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="stories"><SearchIcon className="mr-2 h-4 w-4" />Search Stories</TabsTrigger>
          <TabsTrigger value="users"><Users className="mr-2 h-4 w-4" />Search People</TabsTrigger>
        </TabsList>

        <TabsContent value="stories" className="mt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for stories, authors, tags..."
                className="pl-10 w-full"
                value={storySearchTerm}
                onChange={(e) => setStorySearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleStorySearch()}
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
              </SelectContent>
            </Select>
            <Button onClick={handleStorySearch} className="w-full sm:w-auto">
              <SearchIcon className="mr-2 h-4 w-4 sm:hidden" /> Search
            </Button>
          </div>

          {hasSearchedStories && storyResults.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Story Results ({storyResults.length})</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {storyResults.map((story) => (
                  <StoryCard key={story.id} story={story} />
                ))}
              </div>
            </div>
          )}
          {hasSearchedStories && storyResults.length === 0 && (
            <Alert className="mt-6">
                <Info className="h-5 w-5" />
                <AlertTitle>No Stories Found</AlertTitle>
                <AlertDescription>Try different keywords or filters.</AlertDescription>
            </Alert>
          )}
          {!hasSearchedStories && (
            <Alert variant="default" className="mt-6">
                <Info className="h-5 w-5" />
                <AlertTitle>Search for Stories</AlertTitle>
                <AlertDescription>Enter a term or select a filter.</AlertDescription>
            </Alert>
          )}
        </TabsContent>

        <TabsContent value="users" className="mt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for users by username or name..."
                className="pl-10 w-full"
                value={userSearchTerm}
                onChange={(e) => setUserSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleUserSearch()}
              />
            </div>
            <Button onClick={handleUserSearch} className="w-full sm:w-auto">
              <SearchIcon className="mr-2 h-4 w-4 sm:hidden" /> Search Users
            </Button>
          </div>

          {hasSearchedUsers && userResults.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">User Results ({userResults.length})</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {userResults.map((user) => (
                  <UserSearchCard key={user.id} user={user} />
                ))}
              </div>
            </div>
          )}
          {hasSearchedUsers && userResults.length === 0 && (
             <Alert className="mt-6">
                <Info className="h-5 w-5" />
                <AlertTitle>No Users Found</AlertTitle>
                <AlertDescription>Try different search terms.</AlertDescription>
            </Alert>
          )}
          {!hasSearchedUsers && (
             <Alert variant="default" className="mt-6">
                <Info className="h-5 w-5" />
                <AlertTitle>Find People</AlertTitle>
                <AlertDescription>Enter a username or name to find users.</AlertDescription>
            </Alert>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
