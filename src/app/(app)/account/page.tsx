
"use client";

import type { UserProfile, UserPost } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { User, Edit3, BookOpen, Mail, CalendarDays, Users, UserPlus, Settings, Menu as MenuIcon, MessageCircle, PlusCircle, EyeOff, Lock } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, FormEvent } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input'; // Added Input import
import { toast } from '@/hooks/use-toast';
import { UserPostCard } from '@/components/user-post-card';
import { mockUsers, mockUserPosts as allMockPosts } from '@/lib/mock-data'; // Ensure mockUsers is imported if needed for profileUser logic
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
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const defaultUserProfilePlaceholder: UserProfile = {
  id: 'defaultUser',
  name: 'Katha User',
  username: 'katha_user',
  email: 'user@example.com',
  avatarUrl: 'https://placehold.co/150x150/7E3AF2/FFFFFF?text=KU',
  bio: "Welcome to Katha Vault! Complete your profile to share more about yourself.",
  readingHistory: [],
  favorites: [],
  submittedStories: [],
  userPosts: [],
  followers: 0,
  following: 0,
  gender: 'Prefer not to say',
};

const mockFollowersList = ["ReaderRiley", "BookwormBelle", "SciFiFan", "FantasyGuru", "NovelNinja", "WordSmith", "PageTurnerPro", "AlexAuthor"];
const mockFollowingList = ["EleanorVanceAuthor", "MarcusStoneWrites", "ReaderRiley", "AdminUser"];

// Placeholder icons for social login
const GoogleIcon = () => <Mail className="mr-2 h-4 w-4" />;
const FacebookIcon = () => <Mail className="mr-2 h-4 w-4" />;


export default function AccountPage() {
  const [joinedDate, setJoinedDate] = useState('');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [newPostContent, setNewPostContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [isEmailHidden, setIsEmailHidden] = useState(false);

  const [isFollowersDialogOpen, setIsFollowersDialogOpen] = useState(false);
  const [isFollowingDialogOpen, setIsFollowingDialogOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const loadProfileData = () => {
    let profileToUse: UserProfile = { ...defaultUserProfilePlaceholder };
    let emailHiddenSetting = false;
    let authStatus = false;
    let userSpecificPosts: UserPost[] = [];

    if (typeof window !== 'undefined') {
      const storedAuthUser = localStorage.getItem('currentUser');
      if (storedAuthUser) {
        authStatus = true;
        const storedProfile = localStorage.getItem('userProfileData');
        const storedIsEmailHidden = localStorage.getItem('settings_isEmailHidden');

        if (storedProfile) {
          try {
            const parsedProfile = JSON.parse(storedProfile) as UserProfile;
            profileToUse = {
              ...defaultUserProfilePlaceholder,
              ...parsedProfile,
            };
            userSpecificPosts = parsedProfile.userPosts || allMockPosts.filter(p => p.userId === profileToUse.id);

          } catch (e) {
            console.error("Failed to parse stored profile data for account page", e);
             try {
                const parsedAuthUser = JSON.parse(storedAuthUser);
                profileToUse = {
                    ...defaultUserProfilePlaceholder,
                    id: parsedAuthUser.uid || defaultUserProfilePlaceholder.id,
                    email: parsedAuthUser.email || defaultUserProfilePlaceholder.email,
                    name: parsedAuthUser.displayName || parsedAuthUser.email?.split('@')[0] || defaultUserProfilePlaceholder.name,
                    username: parsedAuthUser.email?.split('@')[0] || defaultUserProfilePlaceholder.username,
                    avatarUrl: parsedAuthUser.photoURL || defaultUserProfilePlaceholder.avatarUrl,
                };
            } catch (authParseError) {
                console.error("Failed to parse storedAuthUser for minimal profile", authParseError);
                authStatus = false; // Failed to get even minimal profile
            }
          }
        } else if (authStatus && storedAuthUser) { // Authenticated but no detailed profileData yet
             try {
                const parsedAuthUser = JSON.parse(storedAuthUser);
                profileToUse = {
                    ...defaultUserProfilePlaceholder,
                    id: parsedAuthUser.uid,
                    email: parsedAuthUser.email,
                    name: parsedAuthUser.displayName || parsedAuthUser.email.split('@')[0],
                    username: parsedAuthUser.email.split('@')[0],
                    avatarUrl: parsedAuthUser.photoURL || defaultUserProfilePlaceholder.avatarUrl,
                };
            } catch (authParseError) {
                 console.error("Failed to parse storedAuthUser for profile init", authParseError);
                 authStatus = false;
            }
        }

        if (storedIsEmailHidden !== null) {
          emailHiddenSetting = JSON.parse(storedIsEmailHidden);
        }
      } else {
        authStatus = false;
      }
    }

    setIsAuthenticated(authStatus);

    if (authStatus) {
      const combinedPosts = [
        ...(profileToUse.userPosts || []),
        ...allMockPosts.filter(mockPost =>
            mockPost.userId === profileToUse.id &&
            !(profileToUse.userPosts || []).find(p => p.id === mockPost.id)
        )
      ];
      setCurrentUser({ ...profileToUse, userPosts: combinedPosts });
    } else {
      setCurrentUser(null);
    }
    setIsEmailHidden(emailHiddenSetting);
  };

  useEffect(() => {
    loadProfileData();

    if (typeof window !== 'undefined' && isAuthenticated && !localStorage.getItem('userJoinedDate')) {
        const newJoinedDate = new Date(Date.now() - 1000 * 60 * 60 * 24 * Math.floor(Math.random() * 30)).toLocaleDateString();
        localStorage.setItem('userJoinedDate', newJoinedDate);
        setJoinedDate(newJoinedDate);
    } else if (typeof window !== 'undefined' && isAuthenticated) {
        setJoinedDate(localStorage.getItem('userJoinedDate') || new Date().toLocaleDateString());
    }

    const handleFocus = () => { loadProfileData(); };
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'userProfileData' || event.key === 'currentUser' || event.key === 'settings_isEmailHidden') {
        loadProfileData();
      }
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [isAuthenticated]); // Rerun when isAuthenticated changes

  const handleCreatePost = (e: FormEvent) => {
    e.preventDefault();
    if (!currentUser || !currentUser.id) return;
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
      username: currentUser.username,
      name: currentUser.name,
      avatarUrl: currentUser.avatarUrl,
      dataAihint: currentUser.avatarUrl?.includes('placehold.co') ? 'user initial' : 'user avatar',
      content: newPostContent.trim(),
      timestamp: new Date().toISOString(),
      likes: 0,
      comments: [],
    };

    setTimeout(() => {
      const updatedUser = {
        ...currentUser,
        userPosts: [newPost, ...(currentUser.userPosts || [])]
      };
      setCurrentUser(updatedUser);

      if (typeof window !== 'undefined') {
        localStorage.setItem('userProfileData', JSON.stringify(updatedUser));
      }

      setNewPostContent('');
      toast({ title: "Post Created!", description: "Your post is now live (simulated)." });
      setIsPosting(false);
    }, 500);
  };

  const handleLikePost = (postId: string) => {
    // This function is now primarily managed within UserPostCard
    // This outer handler can be removed if not used elsewhere on AccountPage
    setTimeout(() => {
        // toast({ title: "Liked! (Simulated)", description: `You liked a post.` });
    }, 0);
  };

  const handleCommentOnPost = (postId: string, commentText: string) => {
     // This function is now primarily managed within UserPostCard
    setTimeout(() => {
        // toast({ title: "Comment Added! (Simulated)", description: `Your comment: "${commentText}"` });
    }, 0);
  };

  const displayedEmail = isEmailHidden ? "Email hidden by user" : currentUser?.email;

  const handleSocialLoginPlaceholder = (provider: string) => {
    setTimeout(() => {
        toast({
        title: `${provider} Login (Placeholder)`,
        description: `This would initiate ${provider} OAuth flow. This is a UI placeholder.`,
        });
    }, 0);
  };


  return (
    <div className="relative space-y-8 max-w-4xl mx-auto">
      {!isAuthenticated && (
         <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-4 bg-background/90 backdrop-blur-sm rounded-lg min-h-[calc(100vh-100px)] md:min-h-0">
          <Card className="w-full max-w-md p-6 sm:p-8 text-center shadow-xl border">
            <CardHeader>
              <Lock className="mx-auto h-12 w-12 text-primary mb-4" />
              <CardTitle className="text-2xl font-semibold">Access Your Account</CardTitle>
              <CardDescription className="mt-2 text-muted-foreground">
                Please log in or create an account to view your full profile and manage your settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Input type="text" placeholder="Username or Email" className="text-center" />
                <Input type="password" placeholder="Password" className="text-center" />
                <div className="text-right text-sm">
                  <Link href="/auth/forgot-password" className="text-destructive hover:underline">
                    Forgot Password?
                  </Link>
                </div>
              </div>

              <Button asChild className="w-full">
                <Link href="/auth/login">Log In</Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link href="/auth/signup">Create Account</Link>
              </Button>
              <div className="relative my-3">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" onClick={() => handleSocialLoginPlaceholder("Google")}>
                  <GoogleIcon /> Google
                </Button>
                <Button variant="outline" onClick={() => handleSocialLoginPlaceholder("Facebook")}>
                  <FacebookIcon /> Facebook
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className={cn("space-y-8", !isAuthenticated && "blur-md pointer-events-none")}>
        {isAuthenticated && currentUser && (
          <>
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
                            <Users className="h-4 w-4" /> <strong>{currentUser.followers || 0}</strong> Followers
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Followers</DialogTitle>
                           <DialogDescription>
                              {isEmailHidden ? `This profile is private. Typically, only approved followers can see this list.` : `This profile is public. This list shows users who follow ${currentUser.username}.`} (Mock data)
                          </DialogDescription>
                        </DialogHeader>
                        <ScrollArea className="max-h-60">
                          <div className="space-y-2 py-2">
                          {mockFollowersList.slice(0, currentUser.followers || 0).map((follower, index) => (
                              <div key={index} className="flex items-center gap-2 p-1.5 rounded-md hover:bg-muted">
                              <Avatar className="h-7 w-7"><AvatarFallback>{follower.substring(0,1)}</AvatarFallback></Avatar>
                              <span className="text-sm">{follower}</span>
                              </div>
                          ))}
                          {(currentUser.followers || 0) === 0 && <p className="text-sm text-center text-muted-foreground">No followers yet.</p>}
                          </div>
                        </ScrollArea>
                        <DialogFooter><DialogClose asChild><Button variant="outline">Close</Button></DialogClose></DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <Dialog open={isFollowingDialogOpen} onOpenChange={setIsFollowingDialogOpen}>
                      <DialogTrigger asChild>
                          <Button variant="link" className="p-0 h-auto flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
                              <UserPlus className="h-4 w-4" /> <strong>{currentUser.following || 0}</strong> Following
                          </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Following</DialogTitle>
                          <DialogDescription>
                               {isEmailHidden ? `This profile is private. Typically, only approved followers can see this list.` : `This profile is public. This list shows users ${currentUser.username} follows.`} (Mock data)
                          </DialogDescription>
                        </DialogHeader>
                        <ScrollArea className="max-h-60">
                          <div className="space-y-2 py-2">
                          {mockFollowingList.slice(0, currentUser.following || 0).map((followedUser, index) => (
                              <div key={index} className="flex items-center gap-2 p-1.5 rounded-md hover:bg-muted">
                              <Avatar className="h-7 w-7"><AvatarFallback>{followedUser.substring(0,1)}</AvatarFallback></Avatar>
                              <span className="text-sm">{followedUser}</span>
                              </div>
                          ))}
                          {(currentUser.following || 0) === 0 && <p className="text-sm text-center text-muted-foreground">Not following anyone yet.</p>}
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
                        <UserPostCard key={post.id} post={post} currentUserId={currentUser.id} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">You haven't made any posts yet.</p>
                  )}
                </div>

              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
