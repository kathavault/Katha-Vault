
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ShieldCheck, AlertTriangle, Users, Settings, BookText, PlusCircle, MoreVertical, Edit, Trash2, ImageUp, BookPlus, BookKey
} from "lucide-react";
import { toast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface AdminStory {
  id: string;
  title: string;
  author: string;
  status: 'Published' | 'Draft' | 'Review';
  chapters: number;
}

const mockAdminStories: AdminStory[] = [
  { id: '1', title: 'The Whispers of Chronos', author: 'Eleanor Vance', status: 'Published', chapters: 3 },
  { id: '2', title: 'Beneath the Emerald Canopy', author: 'Marcus Stone', status: 'Draft', chapters: 2 },
  { id: '3', title: 'The Alchemist of Moonhaven', author: 'Seraphina Gold', status: 'Published', chapters: 5 },
  { id: '4', title: 'Echoes of the Void', author: 'Orion Nebula', status: 'Review', chapters: 10 },
];

export default function AdminPage() {
  const [stories, setStories] = useState<AdminStory[]>(mockAdminStories);

  const handlePlaceholderAction = (actionName: string) => {
    toast({
      title: "Admin Action Placeholder",
      description: `${actionName} functionality is not yet implemented. This is a UI demonstration.`,
    });
  };

  const handleDeleteStory = (storyId: string) => {
    // Simulate deletion
    setStories(prevStories => prevStories.filter(story => story.id !== storyId));
    toast({
      title: "Story Deleted (Simulated)",
      description: `Story with ID ${storyId} has been removed from this view. No actual data was deleted.`,
      variant: "default"
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <ShieldCheck className="h-10 w-10 text-primary" />
          <h1 className="text-3xl font-bold text-primary">Admin Panel</h1>
        </div>
        <Button variant="outline" asChild>
          <Link href="/">Go Back to Site</Link>
        </Button>
      </header>
      <p className="text-muted-foreground">
        Manage users, stories, and site settings. Most actions are UI placeholders.
      </p>

      {/* Story Management Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2"><BookText className="h-6 w-6" /> Story Management</CardTitle>
            <CardDescription>Add, edit, or delete stories and chapters.</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => handlePlaceholderAction("Add New Story")} size="sm">
              <BookPlus className="mr-2 h-4 w-4" /> Add New Story
            </Button>
            <Button onClick={() => handlePlaceholderAction("Upload Default Image")} variant="outline" size="sm">
              <ImageUp className="mr-2 h-4 w-4" /> Upload Image
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {stories.length > 0 ? (
            <div className="space-y-4">
              {stories.map((story) => (
                <Card key={story.id} className="flex items-center justify-between p-4">
                  <div>
                    <h3 className="font-semibold">{story.title}</h3>
                    <p className="text-sm text-muted-foreground">By {story.author} - {story.chapters} Chapters</p>
                    <p className={`text-xs font-medium px-2 py-0.5 rounded-full inline-block ${
                      story.status === 'Published' ? 'bg-green-100 text-green-700' :
                      story.status === 'Draft' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>{story.status}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Story Options</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handlePlaceholderAction(`Edit Story: ${story.title}`)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit Story
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handlePlaceholderAction(`Manage Chapters for: ${story.title}`)}>
                        <BookKey className="mr-2 h-4 w-4" /> Manage Chapters
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                       <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete Story
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the story
                              (simulated - no actual data will be deleted in this demo).
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteStory(story.id)} className="bg-destructive hover:bg-destructive/90">
                              Yes, delete story
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">No stories to display.</p>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" /> User Management</CardTitle>
            <CardDescription>View, edit, or suspend user accounts.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => handlePlaceholderAction("Manage Users")} className="w-full">Manage Users</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Settings className="h-5 w-5" /> Site Settings</CardTitle>
            <CardDescription>Configure general site parameters.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => handlePlaceholderAction("Site Settings")} className="w-full">Site Settings</Button>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8 border-destructive bg-destructive/10">
        <CardHeader className="flex-row items-center gap-3">
          <AlertTriangle className="h-8 w-8 text-destructive" />
          <div>
            <CardTitle className="text-destructive">Developer Note</CardTitle>
            <CardDescription className="text-destructive/80">
              This admin panel is primarily a UI concept. Management actions are simulated and do not persist data. Full functionality requires backend development.
            </CardDescription>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}
