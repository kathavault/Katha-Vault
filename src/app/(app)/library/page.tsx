
"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StoryCard } from "@/components/story-card";
import type { Story } from "@/types";
import { Star, BookOpenCheck, BookCopy, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { mockStories } from '@/lib/mock-data'; // Import shared mock data

const EmptyState = ({ message, icon: Icon }: { message: string; icon: React.ElementType }) => (
  <Alert className="mt-6">
    <Icon className="h-5 w-5" />
    <AlertTitle>Nothing here yet!</AlertTitle>
    <AlertDescription>{message}</AlertDescription>
  </Alert>
);

export default function LibraryPage() {
  const publishedStories = mockStories.filter(story => story.publishedStatus === 'Published');

  // Simulate user library data - these should ideally come from user-specific data
  const favoriteStories = publishedStories.length > 0 ? [publishedStories[0]] : [];
  const readStories = publishedStories.length > 0 ? [publishedStories[0]] : [];
  const unreadStories = publishedStories.length > 1 ? [publishedStories[1]] : [];


  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-primary">My Library</h1>
      <p className="text-muted-foreground">Organize your reading journey. Keep track of your favorites, what you've read, and what's next on your list.</p>
      
      <Tabs defaultValue="favorites" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="favorites">
            <Star className="mr-2 h-4 w-4" /> Favorites
          </TabsTrigger>
          <TabsTrigger value="read">
            <BookOpenCheck className="mr-2 h-4 w-4" /> Read
          </TabsTrigger>
          <TabsTrigger value="unread">
            <BookCopy className="mr-2 h-4 w-4" /> Unread
          </TabsTrigger>
        </TabsList>

        <TabsContent value="favorites">
          {favoriteStories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
              {favoriteStories.map((story) => (
                <StoryCard key={story.id} story={story} />
              ))}
            </div>
          ) : (
            <EmptyState message="Stories you mark as favorite will appear here." icon={Star} />
          )}
        </TabsContent>

        <TabsContent value="read">
          {readStories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
              {readStories.map((story) => (
                <StoryCard key={story.id} story={story} />
              ))}
            </div>
          ) : (
            <EmptyState message="Stories you've finished reading will be listed here." icon={BookOpenCheck} />
          )}
        </TabsContent>

        <TabsContent value="unread">
          {unreadStories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
              {unreadStories.map((story) => (
                <StoryCard key={story.id} story={story} />
              ))}
            </div>
          ) : (
            <EmptyState message="Stories you've saved to read later will show up here." icon={BookCopy} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
