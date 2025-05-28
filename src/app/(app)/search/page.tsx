
"use client";

import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StoryCard } from "@/components/story-card";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Story, UserProfile } from "@/types";
import { Search as SearchIcon, Filter, Info, UserPlus, Users } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockStories, mockUsers as initialMockUsers } from '@/lib/mock-data'; // Import shared mock data
import Link from 'next/link'; // Added Link

const UserSearchCard: React.FC<{ user: UserProfile }> = ({ user }) => (
  <Card className="shadow-md hover:shadow-lg transition-shadow">
    <CardHeader className="flex flex-row items-center gap-4 p-4">
      <Link href={`/profile/${user.id}`} className="cursor-pointer">
        <Avatar className="h-16 w-16">
          <AvatarImage src={user.avatarUrl} alt={user.username} data-ai-hint="user avatar"/>
          <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
      </Link>
      <div>
        <Link href={`/profile/${user.id}`} className="cursor-pointer hover:underline">
          <CardTitle className="text-lg">{user.username}</CardTitle>
        </Link>
        <CardDescription className="text-xs">{user.bio?.substring(0, 50)}{user.bio && user.bio.length > 50 ? '...' : ''}</CardDescription>
      </div>
    </CardHeader>
    <CardContent className="p-4 pt-0 flex justify-between items-center">
      <div className="text-xs text-muted-foreground">
        <span className="mr-2">{user.followers || 0} Followers</span>
        <span>{user.following || 0} Following</span>
      </div>
      <Button size="sm" variant="outline" onClick={() => toast({title: "Follow (Simulated)", description: `Follow request sent to ${user.username}`})}>
        <UserPlus className="mr-2 h-4 w-4" /> Follow
      </Button>
    </CardContent>
  </Card>
);


export default function SearchPage() {
  const [storySearchTerm, setStorySearchTerm] = useState('');
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [filterGenre, setFilterGenre] = useState('all');
  
  const [storyResults, setStoryResults] = useState<Story[]>([]);
  const [userResults, setUserResults] = useState<UserProfile[]>(initialMockUsers); // Initialize with all mock users
  
  const [hasSearchedStories, setHasSearchedStories] = useState(false);
  const [hasSearchedUsers, setHasSearchedUsers] = useState(false);

  const publishedStories = mockStories.filter(s => s.publishedStatus === 'Published');

  const performStorySearch = () => {
    if (!storySearchTerm.trim() && filterGenre === 'all') {
      setStoryResults([]);
      setHasSearchedStories(false);
      return;
    }
    setHasSearchedStories(true);
    const searchTermLower = storySearchTerm.toLowerCase();
    const filtered = publishedStories.filter(story => { 
      const termMatch = searchTermLower
        ? story.title.toLowerCase().includes(searchTermLower) ||
          story.author.toLowerCase().includes(searchTermLower) ||
          (story.tags && story.tags.some(tag => tag.toLowerCase().includes(searchTermLower))) ||
          story.description.toLowerCase().includes(searchTermLower)
        : true;
      const genreMatch = filterGenre !== 'all' ? story.genre.toLowerCase() === filterGenre.toLowerCase() : true;
      return termMatch && genreMatch;
    });
    setStoryResults(filtered);
  };
  
  useEffect(() => {
    if (storySearchTerm.trim() || filterGenre !== 'all' || (hasSearchedStories && !storySearchTerm.trim() && filterGenre === 'all')) {
        performStorySearch();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterGenre, storySearchTerm, hasSearchedStories]); 


  const handleUserSearch = () => {
    if (!userSearchTerm.trim()) {
      setUserResults(initialMockUsers); // Show all users if search is cleared
      setHasSearchedUsers(false);
      return;
    }
    setHasSearchedUsers(true);
    const searchTermLower = userSearchTerm.toLowerCase();
    const filtered = initialMockUsers.filter(user =>
      user.username.toLowerCase().includes(searchTermLower) ||
      (user.name && user.name.toLowerCase().includes(searchTermLower)) ||
      (user.email && user.email.toLowerCase().includes(searchTermLower))
    );
    setUserResults(filtered);
  };
  

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
                onKeyDown={(e) => { if (e.key === 'Enter') performStorySearch(); }}
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
                <SelectItem value="Romance">Romance</SelectItem>
                <SelectItem value="Thriller">Thriller</SelectItem>
                <SelectItem value="Historical">Historical Fiction</SelectItem>
                <SelectItem value="Horror">Horror</SelectItem>
                <SelectItem value="Cyberpunk">Cyberpunk</SelectItem>
                 <SelectItem value="Space Opera">Space Opera</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={performStorySearch} className="w-full sm:w-auto">
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
                <AlertTitle>No Published Stories Found</AlertTitle>
                <AlertDescription>Try different keywords or filters. Only published stories are shown.</AlertDescription>
            </Alert>
          )}
          {!hasSearchedStories && (
            <Alert variant="default" className="mt-6">
                <Info className="h-5 w-5" />
                <AlertTitle>Search for Stories</AlertTitle>
                <AlertDescription>Enter a term or select a filter to find published stories.</AlertDescription>
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
                onKeyDown={(e) => { if (e.key === 'Enter') handleUserSearch(); }}
              />
            </div>
            <Button onClick={handleUserSearch} className="w-full sm:w-auto">
              <SearchIcon className="mr-2 h-4 w-4 sm:hidden" /> Search Users
            </Button>
          </div>

          {userResults.length > 0 && ( // Always show users, filtered or all
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">User Results ({userResults.length})</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {userResults.map((user) => (
                  <UserSearchCard key={user.id} user={user} />
                ))}
              </div>
            </div>
          )}
          {hasSearchedUsers && userResults.length === 0 && ( // Only show this if a search was performed and yielded no results
             <Alert className="mt-6">
                <Info className="h-5 w-5" />
                <AlertTitle>No Users Found</AlertTitle>
                <AlertDescription>Try different search terms.</AlertDescription>
            </Alert>
          )}
          {!hasSearchedUsers && userResults.length === 0 && ( // If no search and no users (unlikely with mock data)
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
