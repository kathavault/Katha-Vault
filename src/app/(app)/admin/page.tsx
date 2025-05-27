
"use client";

import { useState, useEffect, FormEvent, ChangeEvent, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ShieldCheck, Users, Settings, BookText, PlusCircle, MoreVertical, Edit, Trash2, ImageUp, BookPlus, BookKey, Search as SearchIcon
} from "lucide-react";
import { toast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
  AlertDialogTrigger, // Added AlertDialogTrigger here
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import Image from 'next/image'; // For image preview

interface AdminStoryChapter {
  id: string;
  title: string;
  content: string;
}
interface AdminStory {
  id: string;
  title: string;
  author: string;
  description: string;
  coverImageUrl: string; // Can be a URL or Data URI
  genre: string;
  tags: string[];
  status: 'Published' | 'Draft' | 'Review';
  chapters: AdminStoryChapter[];
}

const mockAdminStories: AdminStory[] = [
  { id: '1', title: 'The Whispers of Chronos', author: 'Eleanor Vance', description: 'A thrilling journey through time.', coverImageUrl: 'https://placehold.co/300x450/B4317B/F7F2FA?text=Chronos', genre: 'Sci-Fi', tags: ['time travel', 'adventure'], status: 'Published', chapters: [{id: 'c1', title: 'The Attic Anomaly', content: 'Chapter 1 content...'}, {id: 'c2', title: 'Echoes of Tomorrow', content: 'Chapter 2 content...'}] },
  { id: '2', title: 'Beneath the Emerald Canopy', author: 'Marcus Stone', description: 'Into the wild green yonder.', coverImageUrl: 'https://placehold.co/300x450/2A9D8F/FFFFFF?text=Canopy', genre: 'Fantasy', tags: ['jungle', 'magic'], status: 'Draft', chapters: [{id: 'c1', title: 'The Summons', content: 'Chapter 1 content...'}] },
  { id: '3', title: 'The Alchemist of Moonhaven', author: 'Seraphina Gold', description: 'Secrets in a moonlit city.', coverImageUrl: 'https://placehold.co/300x450/C7A2E8/FFFFFF?text=Moonhaven', genre: 'Steampunk', tags: ['alchemy', 'mystery'], status: 'Published', chapters: [{id: 'c1', title: 'First Transmutation', content: 'Chapter 1 content...'}, {id: 'c2', title: 'City of Gears', content: 'Chapter 2 content...'}] },
  { id: '4', title: 'Echoes of the Void', author: 'Orion Nebula', description: 'Cosmic horrors await.', coverImageUrl: 'https://placehold.co/300x450/4A4E69/FFFFFF?text=Void', genre: 'Space Opera', tags: ['horror', 'space'], status: 'Review', chapters: [{id: 'c1', title: 'The Signal', content: '...'}, {id: 'c2', title: 'Deep Space Anomaly', content: '...'}, {id: 'c3', title: 'Contact', content: '...'}] },
];

type StoryFormDataFields = Omit<AdminStory, 'id' | 'chapters'> & { id?: string, status: AdminStory['status'] };
type ChapterFormData = Omit<AdminStoryChapter, 'id'>;


export default function AdminPage() {
  const [stories, setStories] = useState<AdminStory[]>(mockAdminStories);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredStories, setFilteredStories] = useState<AdminStory[]>(mockAdminStories);

  const [isAddStoryDialogOpen, setIsAddStoryDialogOpen] = useState(false);
  const [isEditStoryDialogOpen, setIsEditStoryDialogOpen] = useState(false);
  const [editingStory, setEditingStory] = useState<AdminStory | null>(null);
  
  const [isManageChaptersDialogOpen, setIsManageChaptersDialogOpen] = useState(false);
  const [storyForChapterManagement, setStoryForChapterManagement] = useState<AdminStory | null>(null);

  const [isEditChapterDialogOpen, setIsEditChapterDialogOpen] = useState(false);
  const [editingChapter, setEditingChapter] = useState<AdminStoryChapter | null>(null);
  const [editingChapterIndex, setEditingChapterIndex] = useState<number | null>(null);
  const [currentChapterData, setCurrentChapterData] = useState<ChapterFormData>({ title: '', content: '' });
  const [chapterToDelete, setChapterToDelete] = useState<{storyId: string, chapterId: string} | null>(null);


  useEffect(() => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    setFilteredStories(
      stories.filter(story => story.title.toLowerCase().includes(lowerSearchTerm) || story.author.toLowerCase().includes(lowerSearchTerm))
    );
  }, [searchTerm, stories]);

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
  
  const handleSaveStory = (formData: StoryFormDataFields) => {
    if (formData.id) { // Editing existing story
        setStories(prevStories => prevStories.map(s => s.id === formData.id ? { ...s, ...formData, chapters: s.chapters } : s)); 
        toast({ title: "Story Updated (Simulated)", description: `"${formData.title}" has been updated.` });
        setIsEditStoryDialogOpen(false);
        setEditingStory(null);
    } else { // Adding new story
        const newStory: AdminStory = {
            ...formData,
            id: `story-${Date.now()}`,
            chapters: [], // New stories start with no chapters
        };
        setStories(prevStories => [newStory, ...prevStories]);
        toast({ title: "Story Added (Simulated)", description: `"${formData.title}" has been added as a draft.` });
        setIsAddStoryDialogOpen(false);
    }
  };
  
  const StoryForm: React.FC<{story?: AdminStory | null, onSave: (data: StoryFormDataFields) => void, onCancel: () => void}> = ({ story, onSave, onCancel }) => {
    const [title, setTitle] = useState(story?.title || '');
    const [author, setAuthor] = useState(story?.author || '');
    const [description, setDescription] = useState(story?.description || '');
    const [genre, setGenre] = useState(story?.genre || '');
    const [tags, setTags] = useState(story?.tags?.join(', ') || '');
    const [status, setStatus] = useState<AdminStory['status']>(story?.status || 'Draft');
    const [coverImagePreview, setCoverImagePreview] = useState<string | null>(story?.coverImageUrl || null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCoverImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ 
            id: story?.id, 
            title, 
            author, 
            description, 
            coverImageUrl: coverImagePreview || `https://placehold.co/300x450?text=${encodeURIComponent(title.substring(0,10))}`, 
            genre, 
            tags: tags.split(',').map(t => t.trim()).filter(t => t),
            status
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto p-1">
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
                <Label htmlFor="story-coverImageFile">Cover Image</Label>
                <Input id="story-coverImageFile" type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="mb-2"/>
                {coverImagePreview && (
                    <div className="mt-2 w-32 h-48 relative border rounded overflow-hidden">
                        <Image src={coverImagePreview} alt="Cover preview" layout="fill" objectFit="cover" data-ai-hint="book cover preview"/>
                    </div>
                )}
                 <p className="text-xs text-muted-foreground mt-1">Upload an image or leave blank for an auto-generated placeholder if adding a new story.</p>
            </div>
            <div>
                <Label htmlFor="story-genre">Genre</Label>
                <Input id="story-genre" value={genre} onChange={e => setGenre(e.target.value)} required />
            </div>
            <div>
                <Label htmlFor="story-tags">Tags (comma-separated)</Label>
                <Input id="story-tags" value={tags} onChange={e => setTags(e.target.value)} />
            </div>
             <div>
                <Label htmlFor="story-status">Status</Label>
                <Select value={status} onValueChange={(value) => setStatus(value as AdminStory['status'])}>
                    <SelectTrigger id="story-status">
                        <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Draft">Draft</SelectItem>
                        <SelectItem value="Review">Review</SelectItem>
                        <SelectItem value="Published">Published</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
                <Button type="submit">{story?.id ? 'Save Changes' : 'Add Story'}</Button>
            </DialogFooter>
        </form>
    );
  };

  const handleOpenChapterManagement = (storyToManage: AdminStory) => {
    setStoryForChapterManagement(JSON.parse(JSON.stringify(storyToManage))); // Deep copy to avoid direct state mutation issues
    setIsManageChaptersDialogOpen(true);
  };

  const handleAddChapter = () => {
    if (!storyForChapterManagement) return;
    const newChapter: AdminStoryChapter = {
      id: `chap-${Date.now()}`,
      title: `New Chapter ${storyForChapterManagement.chapters.length + 1}`,
      content: "Start writing content here..."
    };
    const updatedStory = {
      ...storyForChapterManagement,
      chapters: [...storyForChapterManagement.chapters, newChapter]
    };
    setStoryForChapterManagement(updatedStory);
    // Also update the main stories list
    setStories(prevStories => 
      prevStories.map(s => s.id === updatedStory.id ? updatedStory : s)
    );
    toast({title: "Chapter Added (Locally)", description: `"${newChapter.title}" added to "${updatedStory.title}".`})
  };

  const handleOpenEditChapterDialog = (chapter: AdminStoryChapter, index: number) => {
    setEditingChapter(chapter);
    setEditingChapterIndex(index);
    setCurrentChapterData({ title: chapter.title, content: chapter.content });
    setIsEditChapterDialogOpen(true);
  };

  const handleSaveChapter = () => {
    if (!storyForChapterManagement || editingChapterIndex === null || !editingChapter) return;

    const updatedChapters = [...storyForChapterManagement.chapters];
    updatedChapters[editingChapterIndex] = { ...editingChapter, ...currentChapterData };
    
    const updatedStory = {
      ...storyForChapterManagement,
      chapters: updatedChapters
    };
    
    setStoryForChapterManagement(updatedStory);
    setStories(prevStories => 
      prevStories.map(s => s.id === updatedStory.id ? updatedStory : s)
    );

    toast({title: "Chapter Saved (Locally)", description: `Changes to "${currentChapterData.title}" saved.`});
    setIsEditChapterDialogOpen(false);
    setEditingChapter(null);
    setEditingChapterIndex(null);
  };

  const confirmRemoveChapter = (storyId: string, chapterId: string) => {
    setChapterToDelete({storyId, chapterId});
  };

  const handleRemoveChapter = () => {
    if (!storyForChapterManagement || !chapterToDelete || chapterToDelete.storyId !== storyForChapterManagement.id) {
      setChapterToDelete(null);
      return;
    }

    const chapterToRemove = storyForChapterManagement.chapters.find(ch => ch.id === chapterToDelete.chapterId);

    const updatedChapters = storyForChapterManagement.chapters.filter(
      (chapter) => chapter.id !== chapterToDelete.chapterId
    );
    const updatedStory = {
      ...storyForChapterManagement,
      chapters: updatedChapters
    };

    setStoryForChapterManagement(updatedStory);
    setStories(prevStories => 
      prevStories.map(s => s.id === updatedStory.id ? updatedStory : s)
    );
    
    toast({title: "Chapter Removed (Locally)", description: `Chapter "${chapterToRemove?.title || 'N/A'}" removed from "${updatedStory.title}".`});
    setChapterToDelete(null);
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
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2"><BookText className="h-6 w-6" /> Story Management</CardTitle>
            <CardDescription>Add, edit, or delete stories and manage their chapters and status.</CardDescription>
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
            <Button onClick={() => toast({title: "Placeholder Action", description:"Global image upload needs backend."})} variant="outline" size="sm">
              <ImageUp className="mr-2 h-4 w-4" /> Upload Global Cover
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Label htmlFor="search-stories">Search Stories by Title or Author</Label>
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                id="search-stories"
                type="search"
                placeholder="Enter story title or author..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {filteredStories.length > 0 ? (
            <div className="space-y-4">
              {filteredStories.map((story) => (
                <Card key={story.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 gap-4">
                  <div className="flex items-center gap-4 flex-grow">
                     <Image 
                        src={story.coverImageUrl || `https://placehold.co/80x120?text=${encodeURIComponent(story.title.substring(0,1))}`} 
                        alt={story.title} 
                        width={80}
                        height={120}
                        className="w-16 h-24 object-cover rounded-sm"
                        data-ai-hint="book cover admin"
                      />
                    <div className="flex-grow">
                      <h3 className="font-semibold">{story.title}</h3>
                      <p className="text-sm text-muted-foreground">By {story.author} - {story.chapters.length} Chapters</p>
                      <Badge variant={
                        story.status === 'Published' ? 'default' : story.status === 'Draft' ? 'secondary' : 'outline'
                      } className={`text-xs font-medium mt-1 ${
                        story.status === 'Published' ? 'bg-green-100 text-green-700 border-green-300 dark:bg-green-700 dark:text-green-100 dark:border-green-500' :
                        story.status === 'Draft' ? 'bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-700 dark:text-yellow-100 dark:border-yellow-500' :
                        'bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-700 dark:text-blue-100 dark:border-blue-500'
                      }`}>{story.status}</Badge>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="shrink-0">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Story Options for {story.title}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleOpenEditDialog(story)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit Story Details
                        </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleOpenChapterManagement(story)}>
                        <BookKey className="mr-2 h-4 w-4" /> Manage Chapters
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toast({title:"Placeholder", description:`Trigger file input for ${story.title} here. Requires backend.`})}>
                        <ImageUp className="mr-2 h-4 w-4" /> Change Cover Image
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
                              This action cannot be undone. This will (simulate) permanently delete the story "{story.title}".
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
            <p className="text-muted-foreground text-center py-4">
              {searchTerm ? 'No stories match your search.' : 'No stories to display.'}
            </p>
          )}
        </CardContent>
      </Card>
        
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

       {storyForChapterManagement && (
        <Dialog open={isManageChaptersDialogOpen} onOpenChange={(isOpen) => {
          setIsManageChaptersDialogOpen(isOpen);
          if (!isOpen) setStoryForChapterManagement(null);
        }}>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Manage Chapters for: {storyForChapterManagement.title}</DialogTitle>
              <DialogDescription>Add, edit, or remove chapters for this story. Changes are local.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto p-1 mt-4">
              {storyForChapterManagement.chapters.length > 0 ? (
                storyForChapterManagement.chapters.map((chapter, index) => (
                  <Card key={chapter.id} className="p-3 flex justify-between items-center">
                    <div className="flex-grow overflow-hidden">
                      <p className="font-medium truncate">Chapter {index + 1}: {chapter.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{chapter.content.substring(0,50)}...</p>
                    </div>
                    <div className="flex gap-2 shrink-0 ml-2">
                      <Button variant="outline" size="sm" onClick={() => handleOpenEditChapterDialog(chapter, index)}>
                        <Edit className="h-3 w-3 mr-1 sm:mr-2" /> <span className="hidden sm:inline">Edit</span>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                           <Button variant="destructive" size="sm" onClick={() => confirmRemoveChapter(storyForChapterManagement.id, chapter.id)}>
                             <Trash2 className="h-3 w-3 mr-1 sm:mr-2" /> <span className="hidden sm:inline">Remove</span>
                           </Button>
                        </AlertDialogTrigger>
                         {chapterToDelete?.chapterId === chapter.id && (
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure you want to remove chapter "{chapter.title}"? This is a local change.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setChapterToDelete(null)}>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleRemoveChapter} className="bg-destructive hover:bg-destructive/90">
                                    Yes, Remove
                                </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        )}
                      </AlertDialog>
                    </div>
                  </Card>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">No chapters yet for this story.</p>
              )}
            </div>
            <DialogFooter className="pt-4">
              <Button variant="outline" onClick={() => setIsManageChaptersDialogOpen(false)}>Close</Button>
              <Button onClick={handleAddChapter}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Chapter
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {isEditChapterDialogOpen && editingChapter && (
        <Dialog open={isEditChapterDialogOpen} onOpenChange={(isOpen) => {
            setIsEditChapterDialogOpen(isOpen);
            if (!isOpen) {
                setEditingChapter(null);
                setEditingChapterIndex(null);
            }
        }}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Edit Chapter: {editingChapter.title}</DialogTitle>
                    <DialogDescription>Modify the chapter title and content below.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div>
                        <Label htmlFor="chapter-title-edit">Chapter Title</Label>
                        <Input 
                            id="chapter-title-edit" 
                            value={currentChapterData.title} 
                            onChange={(e) => setCurrentChapterData(prev => ({...prev, title: e.target.value}))} 
                        />
                    </div>
                    <div>
                        <Label htmlFor="chapter-content-edit">Chapter Content</Label>
                        <Textarea 
                            id="chapter-content-edit" 
                            value={currentChapterData.content} 
                            onChange={(e) => setCurrentChapterData(prev => ({...prev, content: e.target.value}))}
                            rows={10}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => {
                        setIsEditChapterDialogOpen(false); 
                        setEditingChapter(null); 
                        setEditingChapterIndex(null);
                    }}>Cancel</Button>
                    <Button onClick={handleSaveChapter}>Save Chapter</Button>
                </DialogFooter>
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
            <Button onClick={() => toast({title:"Placeholder", description: "User management not yet implemented."})} className="w-full">Manage Users</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Settings className="h-5 w-5" /> Site Settings</CardTitle>
            <CardDescription>Configure general site parameters.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => toast({title:"Placeholder", description:"Site settings not yet implemented."})} className="w-full">Site Settings</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


