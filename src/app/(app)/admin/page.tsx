
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ShieldCheck, Users, Settings, BookText, PlusCircle, MoreVertical, Edit, Trash2, ImageUp, BookPlus, BookKey
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface AdminStory {
  id: string;
  title: string;
  author: string;
  description: string;
  coverImageUrl: string;
  genre: string;
  tags: string[];
  status: 'Published' | 'Draft' | 'Review';
  chapters: number;
}

const mockAdminStories: AdminStory[] = [
  { id: '1', title: 'The Whispers of Chronos', author: 'Eleanor Vance', description: 'A thrilling journey through time.', coverImageUrl: 'https://placehold.co/300x450', genre: 'Sci-Fi', tags: ['time travel', 'adventure'], status: 'Published', chapters: 3 },
  { id: '2', title: 'Beneath the Emerald Canopy', author: 'Marcus Stone', description: 'Into the wild green yonder.', coverImageUrl: 'https://placehold.co/300x450', genre: 'Fantasy', tags: ['jungle', 'magic'], status: 'Draft', chapters: 2 },
  { id: '3', title: 'The Alchemist of Moonhaven', author: 'Seraphina Gold', description: 'Secrets in a moonlit city.', coverImageUrl: 'https://placehold.co/300x450', genre: 'Steampunk', tags: ['alchemy', 'mystery'], status: 'Published', chapters: 5 },
  { id: '4', title: 'Echoes of the Void', author: 'Orion Nebula', description: 'Cosmic horrors await.', coverImageUrl: 'https://placehold.co/300x450', genre: 'Space Opera', tags: ['horror', 'space'], status: 'Review', chapters: 10 },
];

export default function AdminPage() {
  const [stories, setStories] = useState<AdminStory[]>(mockAdminStories);
  const [isAddStoryDialogOpen, setIsAddStoryDialogOpen] = useState(false);
  const [isEditStoryDialogOpen, setIsEditStoryDialogOpen] = useState(false);
  const [editingStory, setEditingStory] = useState<AdminStory | null>(null);

  const handlePlaceholderAction = (actionName: string) => {
    toast({
      title: "Admin Action Placeholder",
      description: `${actionName} functionality is not yet implemented. This is a UI demonstration.`,
    });
  };

  const handleDeleteStory = (storyId: string) => {
    setStories(prevStories => prevStories.filter(story => story.id !== storyId));
    toast({
      title: "Story Deleted (Simulated)",
      description: `Story with ID ${storyId} has been removed from this view. No actual data was deleted.`,
      variant: "default"
    });
  };

  const handleOpenEditDialog = (story: AdminStory) => {
    setEditingStory(story);
    setIsEditStoryDialogOpen(true);
  };
  
  const handleSaveStory = (formData: Omit<AdminStory, 'id' | 'status' | 'chapters'> & { id?: string }) => {
    if (formData.id) { // Editing existing story
        setStories(prevStories => prevStories.map(s => s.id === formData.id ? { ...s, ...formData, status: s.status, chapters: s.chapters } : s));
        toast({ title: "Story Updated (Simulated)", description: `"${formData.title}" has been updated.` });
        setIsEditStoryDialogOpen(false);
        setEditingStory(null);
    } else { // Adding new story
        const newStory: AdminStory = {
            ...formData,
            id: `story-${Date.now()}`, // Generate a mock ID
            status: 'Draft', // Default status
            chapters: 0, // Default chapters
        };
        setStories(prevStories => [newStory, ...prevStories]);
        toast({ title: "Story Added (Simulated)", description: `"${formData.title}" has been added as a draft.` });
        setIsAddStoryDialogOpen(false);
    }
  };
  
  const StoryForm: React.FC<{story?: AdminStory | null, onSave: (data: Omit<AdminStory, 'id' | 'status' | 'chapters'> & { id?: string }) => void, onCancel: () => void}> = ({ story, onSave, onCancel }) => {
    const [title, setTitle] = useState(story?.title || '');
    const [author, setAuthor] = useState(story?.author || '');
    const [description, setDescription] = useState(story?.description || '');
    const [coverImageUrl, setCoverImageUrl] = useState(story?.coverImageUrl || '');
    const [genre, setGenre] = useState(story?.genre || '');
    const [tags, setTags] = useState(story?.tags.join(', ') || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ 
            id: story?.id, 
            title, 
            author, 
            description, 
            coverImageUrl, 
            genre, 
            tags: tags.split(',').map(t => t.trim()).filter(t => t) 
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="story-title">Title</Label>
                <Input id="story-title" value={title} onChange={e => setTitle(e.target.value)} required />
            </div>
            <div>
                <Label htmlFor="story-author">Author</Label>
                <Input id="story-author" value={author} onChange={e => setAuthor(e.target.value)} required />
            </div>
            <div>
                <Label htmlFor="story-description">Description</Label>
                <Textarea id="story-description" value={description} onChange={e => setDescription(e.target.value)} required />
            </div>
            <div>
                <Label htmlFor="story-coverImageUrl">Cover Image URL</Label>
                <Input id="story-coverImageUrl" type="url" value={coverImageUrl} onChange={e => setCoverImageUrl(e.target.value)} placeholder="https://placehold.co/300x450" />
            </div>
            <div>
                <Label htmlFor="story-genre">Genre</Label>
                <Input id="story-genre" value={genre} onChange={e => setGenre(e.target.value)} required />
            </div>
            <div>
                <Label htmlFor="story-tags">Tags (comma-separated)</Label>
                <Input id="story-tags" value={tags} onChange={e => setTags(e.target.value)} />
            </div>
            <DialogFooter>
                <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
                <Button type="submit">Save Story</Button>
            </DialogFooter>
        </form>
    );
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
        Manage users, stories, and site settings. Management actions are simulated and do not persist data.
      </p>

      {/* Story Management Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2"><BookText className="h-6 w-6" /> Story Management</CardTitle>
            <CardDescription>Add, edit, or delete stories and chapters.</CardDescription>
          </div>
          <div className="flex gap-2">
            <Dialog open={isAddStoryDialogOpen} onOpenChange={setIsAddStoryDialogOpen}>
                <DialogTrigger asChild>
                    <Button size="sm">
                        <BookPlus className="mr-2 h-4 w-4" /> Add New Story
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Add New Story</DialogTitle>
                        <DialogDescription>Fill in the details for the new story. Click save when you're done.</DialogDescription>
                    </DialogHeader>
                    <StoryForm onSave={handleSaveStory} onCancel={() => setIsAddStoryDialogOpen(false)} />
                </DialogContent>
            </Dialog>
            <Button onClick={() => handlePlaceholderAction("Upload Default Image triggered. Actual upload requires backend.")} variant="outline" size="sm">
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
                        <DropdownMenuItem onClick={() => handleOpenEditDialog(story)}>
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
                              This action cannot be undone. This will (simulate) permanently delete the story.
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
        
      {/* Edit Story Dialog */}
      {editingStory && (
        <Dialog open={isEditStoryDialogOpen} onOpenChange={(isOpen) => {
            setIsEditStoryDialogOpen(isOpen);
            if (!isOpen) setEditingStory(null);
        }}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Edit Story: {editingStory.title}</DialogTitle>
                    <DialogDescription>Make changes to the story details below. Click save when you're done.</DialogDescription>
                </DialogHeader>
                <StoryForm story={editingStory} onSave={handleSaveStory} onCancel={() => { setIsEditStoryDialogOpen(false); setEditingStory(null); }} />
            </DialogContent>
        </Dialog>
      )}


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

      {/* Removed Developer Note Card */}
    </div>
  );
}


    