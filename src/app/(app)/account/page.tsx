
"use client";

import type { UserProfile, UserPost } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { User, Edit3, BookOpen, Mail, CalendarDays, Users, UserPlus, Settings, Menu as MenuIcon, MessageCircle, PlusCircle, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, FormEvent } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { UserPostCard } from '@/components/user-post-card';
import { mockUserPosts as allMockPosts, mockUsers } from '@/lib/mock-data';
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

const defaultUserProfile: UserProfile = {
  id: 'user123',
  name: 'Katha Seeker',
  username: 'StorySeeker92',
  email: 'story.seeker@example.com',
  avatarUrl: 'https://placehold.co/150x150/B4317B/F7F2FA?text=SS',
  bio: "Avid reader and aspiring author. Always on the lookout for the next great adventure within the pages of a book. Favorite genres: Sci-Fi and Fantasy. Now sharing my thoughts here too!",
  readingHistory: [
    { storyId: '1', title: 'The Whispers of Chronos', lastReadChapterId: 'c3', progress: 75 },
    { storyId: '2', title: 'Beneath the Emerald Canopy', lastReadChapterId: 'c1', progress: 20 },
  ],
  favorites: ['1'],
  submittedStories: [], // Kept for consistency with mock-data structure, but not actively used
  userPosts: [],
  followers: 1250,
  following: 180,
};

const mockFollowersList = ["ReaderRiley", "BookwormBelle", "SciFiFan", "FantasyGuru", "NovelNinja", "WordSmith", "PageTurnerPro", "AlexAuthor"];
const mockFollowingList = ["EleanorVanceAuthor", "MarcusStoneWrites", "ReaderRiley", "AdminUser"];


export default function AccountPage() {
  const [joinedDate, setJoinedDate] = useState('');
  const [currentUser, setCurrentUser] = useState<UserProfile>(defaultUserProfile);
  const [newPostContent, setNewPostContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [isEmailHidden, setIsEmailHidden] = useState(false);

  const [isFollowersDialogOpen, setIsFollowersDialogOpen] = useState(false);
  const [isFollowingDialogOpen, setIsFollowingDialogOpen] = useState(false);

  const loadProfileData = () => {
    let profileToUse: UserProfile = { ...defaultUserProfile };
    let emailHiddenSetting = false;

    if (typeof window !== 'undefined') {
      const storedProfile = localStorage.getItem('userProfileData');
      const storedIsEmailHidden = localStorage.getItem('settings_isEmailHidden');

      if (storedProfile) {
        try {
          const parsedProfile = JSON.parse(storedProfile) as Partial<UserProfile>;
          profileToUse = {
            ...defaultUserProfile,
            ...parsedProfile,
            id: parsedProfile.id || defaultUserProfile.id,
            email: parsedProfile.email || defaultUserProfile.email,
            readingHistory: parsedProfile.readingHistory || defaultUserProfile.readingHistory,
            favorites: parsedProfile.favorites || defaultUserProfile.favorites,
            submittedStories: parsedProfile.submittedStories || defaultUserProfile.submittedStories,
            userPosts: parsedProfile.userPosts || defaultUserProfile.userPosts, // Keep this or fetch specific below
            name: parsedProfile.name || defaultUserProfile.name,
            username: parsedProfile.username || defaultUserProfile.username,
            avatarUrl: parsedProfile.avatarUrl || defaultUserProfile.avatarUrl,
            bio: parsedProfile.bio || defaultUserProfile.bio,
            followers: parsedProfile.followers || defaultUserProfile.followers,
            following: parsedProfile.following || defaultUserProfile.following,
          };
        } catch (e) {
          console.error("Failed to parse stored profile data for account page", e);
        }
      }
      if (storedIsEmailHidden !== null) {
        emailHiddenSetting = JSON.parse(storedIsEmailHidden);
      }
    }
    
    // Find posts specifically for this user from the global mockUserPosts
    // This is for display only. Creating new posts adds to currentUser.userPosts directly.
    const userSpecificPosts = allMockPosts.filter(p => p.userId === profileToUse.id);
    
    // Combine posts from localStorage (newly created) with those from mock data
    const combinedPosts = [
      ...(profileToUse.userPosts || []), // Posts created in this session
      ...userSpecificPosts.filter(mockPost => !(profileToUse.userPosts || []).find(p => p.id === mockPost.id)) // Add mock posts not already in session
    ];
    
    setCurrentUser(prevUser => ({
      ...prevUser,
      ...profileToUse,
      userPosts: combinedPosts,
    }));
    setIsEmailHidden(emailHiddenSetting);
  };

  useEffect(() => {
    loadProfileData();

    if (typeof window !== 'undefined' && !localStorage.getItem('userJoinedDate')) {
        const newJoinedDate = new Date(Date.now() - 1000 * 60 * 60 * 24 * Math.floor(Math.random() * 365)).toLocaleDateString();
        localStorage.setItem('userJoinedDate', newJoinedDate);
        setJoinedDate(newJoinedDate);
    } else if (typeof window !== 'undefined') {
        setJoinedDate(localStorage.getItem('userJoinedDate') || '');
    }

    window.addEventListener('focus', loadProfileData);
    return () => {
      window.removeEventListener('focus', loadProfileData);
    };
  }, []);

  const handleCreatePost = (e: FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) {
      setTimeout(() => {
        toast({ title: "Empty Post", description: "Please write something to post.", variant: "destructive" });
      }, 0);
      return;
    }
    setIsPosting(true);

    const newPost: UserPost = {
      id: `post${Date.now()}`,
      userId: currentUser.id,
      username: currentUser.username, // Use current username from state
      name: currentUser.name, // Use current name from state
      avatarUrl: currentUser.avatarUrl, // Use current avatar from state
      dataAihint: currentUser.avatarUrl?.includes('placehold.co') ? 'user initial' : 'user avatar',
      content: newPostContent.trim(),
      timestamp: new Date().toISOString(),
      likes: 0,
      comments: [],
    };

    setTimeout(() => {
      setCurrentUser(prevUser => ({
        ...prevUser,
        userPosts: [newPost, ...(prevUser.userPosts || [])]
      }));
      // Also update localStorage userProfileData if userPosts is part of it.
      if (typeof window !== 'undefined') {
        const storedProfile = localStorage.getItem('userProfileData');
        if (storedProfile) {
          try {
            const parsedProfile = JSON.parse(storedProfile);
            parsedProfile.userPosts = [newPost, ...(parsedProfile.userPosts || [])];
            localStorage.setItem('userProfileData', JSON.stringify(parsedProfile));
          } catch (e) {
            console.error("Failed to update userProfileData with new post", e);
          }
        }
      }

      setNewPostContent('');
      toast({ title: "Post Created!", description: "Your post is now live (simulated)." });
      setIsPosting(false);
    }, 500);
  };

  const handleLikePost = (postId: string) => {
    setTimeout(() => {
        toast({ title: "Liked! (Simulated)", description: `You liked a post.` });
    }, 0);
  };

  const handleCommentOnPost = (postId: string, commentText: string) => {
    setTimeout(() => {
        toast({ title: "Comment Added! (Simulated)", description: `Your comment: "${commentText}"` });
    }, 0);
  };

  const displayedEmail = isEmailHidden ? "Email hidden by user" : currentUser.email;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <User className="h-10 w-10 text-primary" />
          <h1 className="text-3xl font-bold text-primary">My Account</h1>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MenuIcon className="h-6 w-6" />
              <span className="sr-only">Account Options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/account/edit-profile">
                <Edit3 className="mr-2 h-4 w-4" /> Edit Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/account/settings">
                <Settings className="mr-2 h-4 w-4" /> Account Settings
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
      <p className="text-muted-foreground">Manage your profile, view your activity, and share your thoughts.</p>

      <Card className="shadow-lg">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-6">
          <Avatar className="h-24 w-24 border-2 border-primary">
            <AvatarImage src={currentUser.avatarUrl} alt={currentUser.username} data-ai-hint="user avatar"/>
            <AvatarFallback className="text-3xl">{currentUser.username?.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-grow">
            {currentUser.name && <CardTitle className="text-2xl">{currentUser.name}</CardTitle>}
            <CardDescription className={cn("text-lg text-muted-foreground", currentUser.name ? "-mt-1" : "mt-1")}>@{currentUser.username}</CardDescription>
            <CardDescription className="flex items-center gap-2 mt-1">
              {isEmailHidden ? <EyeOff className="h-4 w-4" /> : <Mail className="h-4 w-4" />} {displayedEmail}
            </CardDescription>
            <CardDescription className="flex items-center gap-2 mt-1">
              <CalendarDays className="h-4 w-4" /> Joined: {joinedDate || 'Loading...'}
            </CardDescription>
            <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
              <Dialog open={isFollowersDialogOpen} onOpenChange={setIsFollowersDialogOpen}>
                <DialogTrigger asChild>
                   <Button variant="link" className="p-0 h-auto flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
                      <Users className="h-4 w-4" /> <strong>{currentUser.followers}</strong> Followers
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Followers</DialogTitle>
                  <DialogDescription>This list shows users who follow you. (Mock data for {currentUser.username})</DialogDescription>
                  </DialogHeader>
                  <ScrollArea className="max-h-60">
                    <div className="space-y-2 py-2">
                    {mockFollowersList.slice(0, currentUser.followers).map((follower, index) => (
                        <div key={index} className="flex items-center gap-2 p-1.5 rounded-md hover:bg-muted">
                        <Avatar className="h-7 w-7"><AvatarFallback>{follower.substring(0,1)}</AvatarFallback></Avatar>
                        <span className="text-sm">{follower}</span>
                        </div>
                    ))}
                    {currentUser.followers === 0 && <p className="text-sm text-center text-muted-foreground">No followers yet.</p>}
                    </div>
                  </ScrollArea>
                  <DialogFooter><DialogClose asChild><Button variant="outline">Close</Button></DialogClose></DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog open={isFollowingDialogOpen} onOpenChange={setIsFollowingDialogOpen}>
                 <DialogTrigger asChild>
                    <Button variant="link" className="p-0 h-auto flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
                        <UserPlus className="h-4 w-4" /> <strong>{currentUser.following}</strong> Following
                    </Button>
                </DialogTrigger>
                 <DialogContent>
                  <DialogHeader><DialogTitle>Following</DialogTitle>
                  <DialogDescription>This list shows users you follow. (Mock data for {currentUser.username})</DialogDescription>
                  </DialogHeader>
                   <ScrollArea className="max-h-60">
                     <div className="space-y-2 py-2">
                    {mockFollowingList.slice(0, currentUser.following).map((followedUser, index) => (
                        <div key={index} className="flex items-center gap-2 p-1.5 rounded-md hover:bg-muted">
                        <Avatar className="h-7 w-7"><AvatarFallback>{followedUser.substring(0,1)}</AvatarFallback></Avatar>
                        <span className="text-sm">{followedUser}</span>
                        </div>
                    ))}
                    {currentUser.following === 0 && <p className="text-sm text-center text-muted-foreground">Not following anyone yet.</p>}
                    </div>
                  </ScrollArea>
                  <DialogFooter><DialogClose asChild><Button variant="outline">Close</Button></DialogClose></DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
            <Button variant="outline" size="sm" asChild>
              <Link href="/account/edit-profile">
                <Edit3 className="mr-2 h-4 w-4" /> Edit Profile
              </Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/chat">
                <MessageCircle className="mr-2 h-4 w-4" /> Message
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          {currentUser.bio && (
            <>
              <h3 className="font-semibold text-foreground mb-1">Bio</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{currentUser.bio}</p>
              <Separator className="my-4" />
            </>
          )}

          <div>
            <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" /> Reading History
            </h3>
            {currentUser.readingHistory && currentUser.readingHistory.length > 0 ? (
              <ul className="space-y-2 text-sm">
                {currentUser.readingHistory.map(item => (
                  <li key={item.storyId} className="flex justify-between items-center p-2 rounded-md hover:bg-muted">
                    <Link href={`/read/${item.storyId}`} className="text-accent-foreground hover:underline">
                      {item.title}
                    </Link>
                    <span className="text-xs text-muted-foreground">Progress: {item.progress}%</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No reading history yet. Start exploring stories!</p>
            )}
          </div>
          <Separator className="my-6" />

          <div className="mb-6">
            <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
              <PlusCircle className="h-5 w-5 text-primary" /> Create a New Post
            </h3>
            <form onSubmit={handleCreatePost} className="space-y-3">
              <Textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="Share your thoughts with the community..."
                rows={3}
                className="w-full"
              />
              <Button type="submit" disabled={isPosting || !newPostContent.trim()} className="w-full sm:w-auto">
                {isPosting ? "Posting..." : "Post"}
              </Button>
            </form>
          </div>
          <Separator className="my-6" />

          <div>
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
               My Posts
            </h3>
            {(currentUser.userPosts && currentUser.userPosts.length > 0) ? (
              <div className="space-y-6">
                {currentUser.userPosts.map(post => (
                  <UserPostCard key={post.id} post={post} currentUserId={currentUser.id} onLike={handleLikePost} onComment={handleCommentOnPost} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">You haven't made any posts yet.</p>
            )}
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
