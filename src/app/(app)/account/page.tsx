
"use client";

import type { UserProfile } from '@/types'; 
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { User, Edit3, BookOpen, UploadCloud, Mail, CalendarDays, Users, UserPlus, Settings, Menu as MenuIcon, MessageCircle } from "lucide-react"; // Added MessageCircle
import Link from "next/link";
import { useState, useEffect } from 'react';


const mockUser: UserProfile = {
  id: 'user123',
  username: 'StorySeeker92',
  email: 'story.seeker@example.com',
  avatarUrl: 'https://placehold.co/150x150/B4317B/F7F2FA?text=SS',
  bio: "Avid reader and aspiring author. Always on the lookout for the next great adventure within the pages of a book. Favorite genres: Sci-Fi and Fantasy.",
  readingHistory: [
    { storyId: '1', title: 'The Whispers of Chronos', lastReadChapterId: 'c3', progress: 75 },
    { storyId: '2', title: 'Beneath the Emerald Canopy', lastReadChapterId: 'c1', progress: 20 },
  ],
  favorites: ['1'],
  submittedStories: [
    { storyId: 's1', title: 'My First Space Opera (Draft)' },
  ],
  followers: 1250, 
  following: 180,  
};

export default function AccountPage() {
  const [joinedDate, setJoinedDate] = useState('');

  useEffect(() => {
    setJoinedDate(new Date(Date.now() - 1000 * 60 * 60 * 24 * Math.floor(Math.random() * 365)).toLocaleDateString());
  }, []);

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
      <p className="text-muted-foreground">Manage your profile, view your reading activity, and keep track of your submissions.</p>

      <Card className="shadow-lg">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-6">
          <Avatar className="h-24 w-24 border-2 border-primary">
            <AvatarImage src={mockUser.avatarUrl} alt={mockUser.username} data-ai-hint="user avatar"/>
            <AvatarFallback className="text-3xl">{mockUser.username.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-grow">
            <CardTitle className="text-2xl">{mockUser.username}</CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <Mail className="h-4 w-4" /> {mockUser.email}
            </CardDescription>
            <CardDescription className="flex items-center gap-2 mt-1">
              <CalendarDays className="h-4 w-4" /> Joined: {joinedDate || 'Loading...'}
            </CardDescription>
            <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" /> <strong>{mockUser.followers}</strong> Followers
              </div>
              <div className="flex items-center gap-1">
                <UserPlus className="h-4 w-4" /> <strong>{mockUser.following}</strong> Following
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
          {mockUser.bio && (
            <>
              <h3 className="font-semibold text-foreground mb-1">Bio</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{mockUser.bio}</p>
              <Separator className="my-4" />
            </>
          )}

          <div>
            <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" /> Reading History
            </h3>
            {mockUser.readingHistory.length > 0 ? (
              <ul className="space-y-2 text-sm">
                {mockUser.readingHistory.map(item => (
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

          <div>
            <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
              <UploadCloud className="h-5 w-5 text-primary" /> My Submissions
            </h3>
            {mockUser.submittedStories.length > 0 ? (
              <ul className="space-y-2 text-sm">
                {mockUser.submittedStories.map(item => (
                  <li key={item.storyId} className="flex justify-between items-center p-2 rounded-md hover:bg-muted">
                     <Link href={`/submit?edit=${item.storyId}`} className="text-accent-foreground hover:underline">
                      {item.title}
                    </Link>
                    <span className="text-xs text-muted-foreground">Status: Draft</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">You haven't submitted any stories yet.</p>
            )}
            <Button asChild variant="link" className="mt-2 p-0 h-auto">
              <Link href="/submit">
                Submit a new story
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

