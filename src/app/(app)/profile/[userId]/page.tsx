
"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import type { UserProfile, UserPost } from '@/types';
import { mockUsers, mockUserPosts } from '@/lib/mock-data';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, UserMinus, UserCircle2, ChevronLeft, MessageCircle, AlertTriangle, Loader2, Users } from "lucide-react";
import { UserPostCard } from '@/components/user-post-card';
import Link from 'next/link';
import { toast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { ScrollArea } from '@/components/ui/scroll-area';

// Re-using mock lists similar to account page for dialogs
const mockGenericFollowersList = ["UserAlpha", "BookLover22", "PageTurnerPro", "ReaderX", "AnotherUser", "BookwormBelle", "SciFiFan", "FantasyGuru", "NovelNinja", "WordSmith", "TechGuru", "ArtFan", "MusicMaven", "TravelBug", "FoodieFiend"];
const mockGenericFollowingList = ["AdminUser", "EleanorVanceAuthor", "MarcusStoneWrites", "StorySeeker92", "PageTurnerPro", "WordSmith"];


export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.userId as string;

  const [profileUser, setProfileUser] = useState<UserProfile | null | undefined>(undefined);
  const [userPosts, setUserPosts] = useState<UserPost[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [displayedFollowersCount, setDisplayedFollowersCount] = useState(0);
  const [currentLoggedInUserId, setCurrentLoggedInUserId] = useState<string | null>(null);

  const [isFollowersDialogOpen, setIsFollowersDialogOpen] = useState(false);
  const [isFollowingDialogOpen, setIsFollowingDialogOpen] = useState(false);


  useEffect(() => {
    let storedUserId = null;
    if (typeof window !== 'undefined') {
        const storedProfile = localStorage.getItem('userProfileData');
        if (storedProfile) {
            try {
                const parsedProfile: Partial<UserProfile> = JSON.parse(storedProfile);
                storedUserId = parsedProfile.id || null;
                setCurrentLoggedInUserId(storedUserId);
            } catch(e) {
                console.error("Error parsing userProfileData from localStorage on profile page", e);
            }
        }
    }

    setIsLoading(true);
    // Simulate fetching user data
    setTimeout(() => {
      const foundUser = mockUsers.find(user => user.id === userId);
      setProfileUser(foundUser || null);

      if (foundUser) {
        const posts = mockUserPosts.filter(post => post.userId === userId);
        setUserPosts(posts);
        setDisplayedFollowersCount(foundUser.followers || 0);
        // In a real app, you'd fetch the current user's follow status for this profileUser
        // For simulation, if current user is viewing their own mock profile, and they are in mockUsers, check that
        if (storedUserId && foundUser.id === storedUserId) {
           // It's the current user's profile page (via /profile/[theirId])
           // Follow state isn't relevant for self.
           setIsFollowing(false); 
        } else {
            // Placeholder: check if current user (if exists) follows this profileUser (mocked)
            // For now, defaulting to false
            setIsFollowing(false); 
        }

      }
      setIsLoading(false);
    }, 300);
  }, [userId]);

  const handleFollowToggle = () => {
    if (!profileUser || profileUser.id === currentLoggedInUserId) return; // Can't follow self
    
    setIsFollowing(prevIsFollowing => {
      const newFollowState = !prevIsFollowing;
      if (newFollowState) {
        setDisplayedFollowersCount(count => count + 1);
        setTimeout(() => {
          toast({ title: "Followed!", description: `You are now following ${profileUser.username}. (Simulated)` });
        }, 0);
      } else {
        setDisplayedFollowersCount(count => Math.max(0, count - 1));
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
            <Link href="/">Go to Homepage</Link>
          </Button>
        </Alert>
      </div>
    );
  }
  
  const isOwnProfile = currentLoggedInUserId === profileUser.id;


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

                <Dialog open={isFollowersDialogOpen} onOpenChange={setIsFollowersDialogOpen}>
                    <DialogTrigger asChild>
                       <Button variant="link" className="p-0 h-auto flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
                          <Users className="h-4 w-4" /> <strong>{displayedFollowersCount}</strong> Followers
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Followers</DialogTitle>
                        <DialogDescription>
                            Users who follow @{profileUser.username}. (Mock data)
                        </DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="max-h-60">
                        <div className="space-y-2 py-2">
                        {mockGenericFollowersList.slice(0, displayedFollowersCount).map((follower, index) => (
                            <div key={index} className="flex items-center gap-2 p-1.5 rounded-md hover:bg-muted">
                            <Avatar className="h-7 w-7"><AvatarFallback>{follower.substring(0,1)}</AvatarFallback></Avatar>
                            <span className="text-sm">{follower}</span>
                            </div>
                        ))}
                        {displayedFollowersCount === 0 && <p className="text-sm text-center text-muted-foreground">No followers yet.</p>}
                        </div>
                    </ScrollArea>
                    <DialogFooter><DialogClose asChild><Button variant="outline">Close</Button></DialogClose></DialogFooter>
                    </DialogContent>
                </Dialog>

                <Dialog open={isFollowingDialogOpen} onOpenChange={setIsFollowingDialogOpen}>
                    <DialogTrigger asChild>
                        <Button variant="link" className="p-0 h-auto flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
                            <UserPlus className="h-4 w-4" /> <strong>{profileUser.following || 0}</strong> Following
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Following</DialogTitle>
                        <DialogDescription>
                            Users @{profileUser.username} follows. (Mock data)
                        </DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="max-h-60">
                        <div className="space-y-2 py-2">
                        {mockGenericFollowingList.slice(0, profileUser.following || 0).map((followedUser, index) => (
                            <div key={index} className="flex items-center gap-2 p-1.5 rounded-md hover:bg-muted">
                            <Avatar className="h-7 w-7"><AvatarFallback>{followedUser.substring(0,1)}</AvatarFallback></Avatar>
                            <span className="text-sm">{followedUser}</span>
                            </div>
                        ))}
                        {(profileUser.following || 0) === 0 && <p className="text-sm text-center text-muted-foreground">Not following anyone yet.</p>}
                        </div>
                    </ScrollArea>
                    <DialogFooter><DialogClose asChild><Button variant="outline">Close</Button></DialogClose></DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
          </div>
          {!isOwnProfile && (
            <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
              <Button variant={isFollowing ? "outline" : "default"} size="sm" onClick={handleFollowToggle}>
                {isFollowing ? <UserMinus className="mr-2 h-4 w-4" /> : <UserPlus className="mr-2 h-4 w-4" />}
                {isFollowing ? "Unfollow" : "Follow"}
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/chat`}>
                   <MessageCircle className="mr-2 h-4 w-4" /> Message
                </Link>
              </Button>
            </div>
          )}
           {isOwnProfile && (
             <Button variant="outline" size="sm" asChild>
               <Link href="/account/edit-profile">
                 Edit Profile
               </Link>
            </Button>
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
        <h2 className="text-xl font-semibold mb-4 text-primary">{isOwnProfile ? "My Posts" : `${profileUser.name || profileUser.username}'s Posts`}</h2>
        {userPosts.length > 0 ? (
          <div className="space-y-6">
            {userPosts.map(post => (
              <UserPostCard key={post.id} post={post} currentUserId={currentLoggedInUserId || undefined} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">
            {isOwnProfile ? "You haven't made any posts yet." : `${profileUser.name || profileUser.username} hasn't made any posts yet.`}
          </p>
        )}
      </section>
    </div>
  );
}

    