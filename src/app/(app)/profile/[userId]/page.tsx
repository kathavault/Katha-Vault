
"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import type { UserProfile, UserPost } from '@/types';
import { mockUsers, mockUserPosts } from '@/lib/mock-data';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, UserMinus, UserCircle2, ChevronLeft, MessageCircle, AlertTriangle, Loader2 } from "lucide-react";
import { UserPostCard } from '@/components/user-post-card';
import Link from 'next/link';
import { toast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Simulate the current logged-in user's ID for follow/unfollow logic
// In a real app, this would come from an auth context
const MOCK_CURRENT_USER_ID = 'user123'; // This is StorySeeker92

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.userId as string;

  const [profileUser, setProfileUser] = useState<UserProfile | null | undefined>(undefined); // undefined for loading
  const [userPosts, setUserPosts] = useState<UserPost[]>([]);
  const [isFollowing, setIsFollowing] = useState(false); // Mock follow state
  const [isLoading, setIsLoading] = useState(true);
  const [displayedFollowersCount, setDisplayedFollowersCount] = useState(0);

  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const foundUser = mockUsers.find(user => user.id === userId);
      setProfileUser(foundUser || null);

      if (foundUser) {
        const posts = mockUserPosts.filter(post => post.userId === userId);
        setUserPosts(posts);
        setDisplayedFollowersCount(foundUser.followers || 0);
        // Mock initial follow state (e.g., check localStorage or a mock list)
        setIsFollowing(false); 
      }
      setIsLoading(false);
    }, 300); // Simulate network delay
  }, [userId]);

  const handleFollowToggle = () => {
    if (!profileUser) return;
    
    setIsFollowing(prev => {
      const newFollowState = !prev;
      if (newFollowState) {
        setDisplayedFollowersCount(count => count + 1);
        setTimeout(() => {
          toast({ title: "Followed!", description: `You are now following ${profileUser.username}. (Simulated)` });
        }, 0);
      } else {
        setDisplayedFollowersCount(count => Math.max(0, count - 1)); // Ensure count doesn't go below 0
         setTimeout(() => {
          toast({ title: "Unfollowed", description: `You have unfollowed ${profileUser.username}. (Simulated)` });
        }, 0);
      }
      return newFollowState;
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-150px)] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (profileUser === null) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-150px)] text-center p-4">
        <Alert variant="destructive" className="max-w-md w-full">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle>User Not Found</AlertTitle>
          <AlertDescription>The profile you are looking for does not exist.</AlertDescription>
          <Button asChild variant="link" className="mt-4">
            <Link href="/search">Go to Search</Link>
          </Button>
        </Alert>
      </div>
    );
  }
  
  const isOwnProfile = profileUser.id === MOCK_CURRENT_USER_ID;


  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <Button variant="outline" size="sm" onClick={() => router.back()} className="mb-4">
        <ChevronLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      <Card className="shadow-lg">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-6">
          <Avatar className="h-24 w-24 border-2 border-primary">
            <AvatarImage src={profileUser.avatarUrl} alt={profileUser.username} data-ai-hint="user avatar public profile"/>
            <AvatarFallback className="text-3xl">{profileUser.username.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-grow">
            {profileUser.name && <CardTitle className="text-2xl">{profileUser.name}</CardTitle>}
            <CardDescription className="text-lg text-muted-foreground -mt-1">@{profileUser.username}</CardDescription>
             <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <UserCircle2 className="h-4 w-4" /> <strong>{displayedFollowersCount}</strong> Followers
              </div>
              <div className="flex items-center gap-1">
                <UserPlus className="h-4 w-4" /> <strong>{profileUser.following || 0}</strong> Following
              </div>
            </div>
          </div>
          {!isOwnProfile && (
            <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
              <Button variant={isFollowing ? "outline" : "default"} size="sm" onClick={handleFollowToggle}>
                {isFollowing ? <UserMinus className="mr-2 h-4 w-4" /> : <UserPlus className="mr-2 h-4 w-4" />}
                {isFollowing ? "Unfollow" : "Follow"}
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/chat`}> {/* Navigates to general chat page */}
                   <MessageCircle className="mr-2 h-4 w-4" /> Message
                </Link>
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent className="p-6 pt-0">
          {profileUser.bio && (
            <>
              <h3 className="font-semibold text-foreground mb-1">Bio</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{profileUser.bio}</p>
            </>
          )}
        </CardContent>
      </Card>

      <section>
        <h2 className="text-xl font-semibold mb-4 text-primary">{isOwnProfile ? "My Posts" : `${profileUser.username}'s Posts`}</h2>
        {userPosts.length > 0 ? (
          <div className="space-y-6">
            {userPosts.map(post => (
              <UserPostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">
            {isOwnProfile ? "You haven't made any posts yet." : `${profileUser.username} hasn't made any posts yet.`}
          </p>
        )}
      </section>
    </div>
  );
}
