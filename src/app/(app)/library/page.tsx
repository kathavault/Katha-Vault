
"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StoryCard } from "@/components/story-card";
import type { Story, UserPost } from "@/types";
import { Star, BookOpenCheck, BookCopy, Info, Users, TrendingUp as TrendingUpIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { mockStories } from '@/lib/mock-data';
import { mockUserPosts } from '@/lib/mock-data'; // Import mock user posts
import { UserPostCard } from '@/components/user-post-card'; // Import UserPostCard
import { useEffect, useState } from 'react';


const EmptyState = ({ message, icon: IconComp }: { message: string; icon: React.ElementType }) => (
  <Alert className="mt-6">
    <IconComp className="h-5 w-5" />
    <AlertTitle>Nothing here yet!</AlertTitle>
    <AlertDescription>{message}</AlertDescription>
  </Alert>
);

export default function LibraryPage() {
  const [publishedStories, setPublishedStories] = useState<Story[]>([]);
  const [favoriteStories, setFavoriteStories] = useState<Story[]>([]);
  const [readStories, setReadStories] = useState<Story[]>([]);
  const [unreadStories, setUnreadStories] = useState<Story[]>([]);
  const [trendingPosts, setTrendingPosts] = useState<UserPost[]>([]);
  const [socialPosts, setSocialPosts] = useState<UserPost[]>([]);


  useEffect(() => {
    const filteredPublished = mockStories.filter(story => story.publishedStatus === 'Published');
    setPublishedStories(filteredPublished);

    // Simulate user library data - these should ideally come from user-specific data
    setFavoriteStories(filteredPublished.length > 0 ? [filteredPublished[0]] : []);
    setReadStories(filteredPublished.length > 0 ? [filteredPublished[0]] : []);
    setUnreadStories(filteredPublished.length > 1 ? [filteredPublished[1]] : []);

    // Filter mockUserPosts for trending and social posts
    setTrendingPosts(mockUserPosts.filter(post => post.isTrending).slice(0, 4)); // Limit to 4 for example
    // For "Social Posts", we'll just show some other posts as a placeholder for friends' posts
    setSocialPosts(mockUserPosts.filter(post => !post.isTrending).slice(0, 4)); // Limit to 4

  }, []);


  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-primary">My Library</h1>
      <p className="text-muted-foreground">Organize your reading journey and discover community posts.</p>

      <Tabs defaultValue="favorites" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-5">
          <TabsTrigger value="favorites">
            <Star className="mr-2 h-4 w-4" /> Favorites
          </TabsTrigger>
          <TabsTrigger value="read">
            <BookOpenCheck className="mr-2 h-4 w-4" /> Read
          </TabsTrigger>
          <TabsTrigger value="unread">
            <BookCopy className="mr-2 h-4 w-4" /> Unread
          </TabsTrigger>
          <TabsTrigger value="trending_posts">
            <TrendingUpIcon className="mr-2 h-4 w-4" /> Trending Posts
          </TabsTrigger>
          <TabsTrigger value="social_posts">
            <Users className="mr-2 h-4 w-4" /> Social Posts
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

        <TabsContent value="trending_posts">
          {trendingPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {trendingPosts.map((post) => (
                <UserPostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <EmptyState message="Trending posts from the community will appear here." icon={TrendingUpIcon} />
          )}
        </TabsContent>

        <TabsContent value="social_posts">
          {socialPosts.length > 0 ? (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {socialPosts.map((post) => (
                <UserPostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <EmptyState message="Posts from users you follow will appear here. (Simulated)" icon={Users} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
