
"use client";

import type { UserProfile, UserPost, PostComment } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { User, Edit3, BookOpen, Mail, CalendarDays, Users, UserPlus, Settings, Menu as MenuIcon, MessageCircle, PlusCircle } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, FormEvent } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { UserPostCard } from '@/components/user-post-card'; // New import
import { mockUserPosts as allMockPosts } from '@/lib/mock-data'; // For simulating adding posts

const initialMockUser: UserProfile = {
  id: 'user123',
  username: 'StorySeeker92',
  email: 'story.seeker@example.com',
  avatarUrl: 'https://placehold.co/150x150/B4317B/F7F2FA?text=SS',
  bio: "Avid reader and aspiring author. Always on the lookout for the next great adventure within the pages of a book. Favorite genres: Sci-Fi and Fantasy. Now sharing my thoughts here too!",
  readingHistory: [
    { storyId: '1', title: 'The Whispers of Chronos', lastReadChapterId: 'c3', progress: 75 },
    { storyId: '2', title: 'Beneath the Emerald Canopy', lastReadChapterId: 'c1', progress: 20 },
  ],
  favorites: ['1'],
  submittedStories: [], // Kept for data structure, but functionality removed
  userPosts: allMockPosts.filter(p => p.userId === 'user123'), // Initialize with posts for StorySeeker92
  followers: 1250,
  following: 180,
};

export default function AccountPage() {
  const [joinedDate, setJoinedDate] = useState('');
  const [currentUser, setCurrentUser] = useState<UserProfile>(initialMockUser);
  const [newPostContent, setNewPostContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    setJoinedDate(new Date(Date.now() - 1000 * 60 * 60 * 24 * Math.floor(Math.random() * 365)).toLocaleDateString());
  }, []);

  const handleCreatePost = (e: FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) {
      toast({ title: "Empty Post", description: "Please write something to post.", variant: "destructive" });
      return;
    }
    setIsPosting(true);

    // Simulate post creation
    const newPost: UserPost = {
      id: `post${Date.now()}`,
      userId: currentUser.id,
      username: currentUser.username,
      avatarUrl: currentUser.avatarUrl,
      dataAihint: 'user initial',
      content: newPostContent.trim(),
      timestamp: new Date().toISOString(),
      likes: 0,
      comments: [],
    };

    setTimeout(() => { // Simulate network delay
      setCurrentUser(prevUser => ({
        ...prevUser,
        userPosts: [newPost, ...(prevUser.userPosts || [])]
      }));
      setNewPostContent('');
      toast({ title: "Post Created!", description: "Your post is now live (simulated)." });
      setIsPosting(false);
    }, 500);
  };
  
  const handleLikePost = (postId: string) => {
    // This is a placeholder. In a real app, you'd update the backend.
    // For UI simulation, the UserPostCard manages its own local like count.
    toast({ title: "Liked! (Simulated)", description: `You liked a post.` });
  };

  const handleCommentOnPost = (postId: string, commentText: string) => {
    // Placeholder for actual comment submission
    toast({ title: "Comment Added! (Simulated)", description: `Your comment: "${commentText}"` });
  };


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
            <AvatarFallback className="text-3xl">{currentUser.username.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-grow">
            <CardTitle className="text-2xl">{currentUser.username}</CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <Mail className="h-4 w-4" /> {currentUser.email}
            </CardDescription>
            <CardDescription className="flex items-center gap-2 mt-1">
              <CalendarDays className="h-4 w-4" /> Joined: {joinedDate || 'Loading...'}
            </CardDescription>
            <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" /> <strong>{currentUser.followers}</strong> Followers
              </div>
              <div className="flex items-center gap-1">
                <UserPlus className="h-4 w-4" /> <strong>{currentUser.following}</strong> Following
              </div>
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

          {/* Create Post Section */}
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


          {/* My Posts Section */}
          <div>
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
               My Posts
            </h3>
            {(currentUser.userPosts && currentUser.userPosts.length > 0) ? (
              <div className="space-y-6">
                {currentUser.userPosts.map(post => (
                  <UserPostCard key={post.id} post={post} onLike={handleLikePost} onComment={handleCommentOnPost} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">You haven't made any posts yet.</p>
            )}
          </div>

          <Separator className="my-6" />

          <div>
            <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" /> Reading History
            </h3>
            {currentUser.readingHistory.length > 0 ? (
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
        </CardContent>
      </Card>
    </div>
  );
}
