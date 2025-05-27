
"use client";

import { useState, useEffect, FormEvent, ChangeEvent, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ShieldCheck, Users, Settings, BookText, PlusCircle, MoreVertical, Edit, Trash2, ImageUp, BookPlus, BookKey, Search as SearchIcon, Eraser
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"; // Removed DialogTrigger as it's used with <Dialog> directly
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import Image from 'next/image';
import type { Story, StoryChapter } from '@/types'; // Using global types
import { mockStories as initialMockStories } from '@/lib/mock-data'; // Import shared mock data

// Type for form data, closely related to the global Story type
type StoryFormDataFields = Omit<Story, 'id' | 'chapters' | 'createdAt' | 'updatedAt' | 'authorId' | 'isTrending' | 'isCurated'> & { id?: string };
type ChapterFormData = Omit<StoryChapter, 'id' | 'order'>;


export default function AdminPage() {
  const [stories, setStories] = useState<Story[]>(() => JSON.parse(JSON.stringify(initialMockStories)));
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredStories, setFilteredStories] = useState<Story[]>(stories);

  const [isAddStoryDialogOpen, setIsAddStoryDialogOpen] = useState(false);
  const [isEditStoryDialogOpen, setIsEditStoryDialogOpen] = useState(false);
  const [editingStory, setEditingStory] = useState<Story | null>(null);
  
  const [isManageChaptersDialogOpen, setIsManageChaptersDialogOpen] = useState(false);
  const [storyForChapterManagement, setStoryForChapterManagement] = useState<Story | null>(null);

  const [isEditChapterDialogOpen, setIsEditChapterDialogOpen] = useState(false);
  const [editingChapter, setEditingChapter] = useState<StoryChapter | null>(null);
  const [editingChapterIndex, setEditingChapterIndex] = useState<number | null>(null);
  const [currentChapterData, setCurrentChapterData] = useState<ChapterFormData>({ title: '', content: '' });
  const [chapterToDelete, setChapterToDelete] = useState<{storyId: string, chapterId: string} | null>(null);


  useEffect(() => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    setFilteredStories(
      stories.filter(story => story.title.toLowerCase().includes(lowerSearchTerm) || story.author.toLowerCase().includes(lowerSearchTerm))
    );
  }, [searchTerm, stories]);
  
  useEffect(() => {
    stories.forEach(updatedStory => {
      const indexInGlobal = initialMockStories.findIndex(s => s.id === updatedStory.id);
      if (indexInGlobal !== -1) {
        initialMockStories[indexInGlobal] = { ...initialMockStories[indexInGlobal], ...updatedStory };
      } else {
        initialMockStories.push(updatedStory);
      }
    });
    for (let i = initialMockStories.length - 1; i >= 0; i--) {
        if (!stories.find(s => s.id === initialMockStories[i].id)) {
            initialMockStories.splice(i, 1);
        }
    }
  }, [stories]);


  const handleDeleteStory = (storyId: string) => {
    setStories(prevStories => prevStories.filter(story => story.id !== storyId));
    toast({
      title: "Story Deleted (Simulated)",
      description: `Story with ID ${storyId} has been removed from this view. Changes reflected in shared mock data.`,
      variant: "default"
    });
  };

  const handleOpenEditDialog = (story: Story) => {
    setEditingStory(story);
    setIsEditStoryDialogOpen(true);
  };
  
  const handleSaveStory = (formData: StoryFormDataFields & {id?: string}) => {
    const fullFormData: Partial<Story> = {
        ...formData,
        chapters: formData.id ? stories.find(s => s.id === formData.id)?.chapters || [] : [],
        authorId: formData.authorId || `author-${Date.now()}`,
        createdAt: formData.id ? stories.find(s => s.id === formData.id)?.createdAt || new Date().toISOString() : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    if (formData.id) { 
        setStories(prevStories => prevStories.map(s => s.id === formData.id ? { ...s, ...fullFormData } as Story : s)); 
        toast({ title: "Story Updated (Simulated)", description: `"${formData.title}" has been updated.` });
        setIsEditStoryDialogOpen(false);
        setEditingStory(null);
    } else { 
        const newStory: Story = {
            ...fullFormData,
            id: `story-${Date.now()}`,
            chapters: [], 
            publishedStatus: formData.publishedStatus || 'Draft',
            status: 'Ongoing', 
            category: formData.category || 'General',
        } as Story;
        setStories(prevStories => [newStory, ...prevStories]);
        toast({ title: "Story Added (Simulated)", description: `"${formData.title}" has been added as a draft.` });
        setIsAddStoryDialogOpen(false);
    }
  };
  
  const StoryForm: React.FC<{story?: Story | null, onSave: (data: StoryFormDataFields & {id?:string}) => void, onCancel: () => void}> = ({ story, onSave, onCancel }) => {
    const [title, setTitle] = useState(story?.title || '');
    const [author, setAuthor] = useState(story?.author || '');
    const [description, setDescription] = useState(story?.description || '');
    const [genre, setGenre] = useState(story?.genre || '');
    const [tags, setTags] = useState(story?.tags?.join(', ') || '');
    const [publishedStatus, setPublishedStatus] = useState<Story['publishedStatus']>(story?.publishedStatus || 'Draft');
    const [category, setCategory] = useState<Story['category']>(story?.category || 'General');
    const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
    const [coverImagePreview, setCoverImagePreview] = useState<string | null>(story?.coverImage || null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setCoverImageFile(file);
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
            coverImage: coverImagePreview || `https://placehold.co/300x450?text=${encodeURIComponent(title.substring(0,10))}`, 
            genre, 
            tags: tags.split(',').map(t => t.trim()).filter(t => t),
            publishedStatus,
            category
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
                 <p className="text-xs text-muted-foreground mt-1">Upload an image. If not provided, a placeholder will be used for new stories.</p>
            </div>
            <div>
                <Label htmlFor="story-genre">Genre</Label>
                <Input id="story-genre" value={genre} onChange={e => setGenre(e.target.value)} required />
            </div>
            <div>
                <Label htmlFor="story-tags">Tags (comma-separated)</Label>
                <Input id="story-tags" value={tags} onChange={e => setTags(e.target.value)} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="story-publishedStatus">Publication Status</Label>
                    <Select value={publishedStatus} onValueChange={(value) => setPublishedStatus(value as Story['publishedStatus'])}>
                        <SelectTrigger id="story-publishedStatus">
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Draft">Draft</SelectItem>
                            <SelectItem value="Review">Review</SelectItem>
                            <SelectItem value="Published">Published</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label htmlFor="story-category">Category</Label>
                    <Select value={category} onValueChange={(value) => setCategory(value as Story['category'])}>
                        <SelectTrigger id="story-category">
                            <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Trending">Trending</SelectItem>
                            <SelectItem value="Novel">Novel</SelectItem>
                            <SelectItem value="ShortStory">Short Story</SelectItem>
                            <SelectItem value="Romance">Romance</SelectItem>
                            <SelectItem value="SciFi">Sci-Fi</SelectItem>
                            <SelectItem value="General">General</SelectItem>
                            {/* Add more categories as needed */}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
                <Button type="submit">{story?.id ? 'Save Changes' : 'Add Story'}</Button>
            </DialogFooter>
        </form>
    );
  };

  const handleOpenChapterManagement = (storyToManage: Story) => {
    setStoryForChapterManagement(JSON.parse(JSON.stringify(storyToManage))); 
    setIsManageChaptersDialogOpen(true);
  };

  const handleAddChapter = () => {
    if (!storyForChapterManagement) return;
    const newChapter: StoryChapter = {
      id: `chap-${Date.now()}`,
      title: `New Chapter ${storyForChapterManagement.chapters.length + 1}`,
      content: "Start writing content here...",
      order: storyForChapterManagement.chapters.length + 1,
    };
    const updatedStory = {
      ...storyForChapterManagement,
      chapters: [...storyForChapterManagement.chapters, newChapter]
    };
    setStoryForChapterManagement(updatedStory);
    setStories(prevStories => 
      prevStories.map(s => s.id === updatedStory.id ? updatedStory : s)
    );
    toast({title: "Chapter Added (Locally)", description: `"${newChapter.title}" added to "${updatedStory.title}".`})
  };

  const handleOpenEditChapterDialog = (chapter: StoryChapter, index: number) => {
    setEditingChapter(chapter);
    setEditingChapterIndex(index);
    setCurrentChapterData({ title: chapter.title, content: chapter.content });
    setIsEditChapterDialogOpen(true);
  };

  const handleSaveChapter = () => {
    if (!storyForChapterManagement || editingChapterIndex === null || !editingChapter) return;

    const updatedChapters = [...storyForChapterManagement.chapters];
    updatedChapters[editingChapterIndex] = { ...editingChapter, ...currentChapterData, order: editingChapter.order };
    
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
    <div className="max-w-5xl mx-auto space-y-8 p-4 md:p-6">
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
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
          <div>
            <CardTitle className="flex items-center gap-2"><BookText className="h-6 w-6" /> Story Management</CardTitle>
            <CardDescription>Add, edit, or delete stories and manage their chapters and status. Changes are simulated locally.</CardDescription>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Button size="sm" className="w-full md:w-auto" onClick={() => setIsAddStoryDialogOpen(true)}>
              <BookPlus className="mr-2 h-4 w-4" /> Add New Story
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
                        src={story.coverImage || `https://placehold.co/80x120?text=${encodeURIComponent(story.title.substring(0,1))}`} 
                        alt={story.title} 
                        width={80}
                        height={120}
                        className="w-16 h-24 object-cover rounded-sm shadow-md"
                        data-ai-hint="book cover admin"
                      />
                    <div className="flex-grow">
                      <h3 className="font-semibold">{story.title}</h3>
                      <p className="text-sm text-muted-foreground">By {story.author} - {story.chapters.length} Chapters</p>
                      <Badge variant={
                        story.publishedStatus === 'Published' ? 'default' : story.publishedStatus === 'Draft' ? 'secondary' : 'outline'
                      } className={`text-xs font-medium mt-1 ${
                        story.publishedStatus === 'Published' ? 'bg-green-100 text-green-700 border-green-300 dark:bg-green-700 dark:text-green-100 dark:border-green-500' :
                        story.publishedStatus === 'Draft' ? 'bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-700 dark:text-yellow-100 dark:border-yellow-500' :
                        'bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-700 dark:text-blue-100 dark:border-blue-500'
                      }`}>{story.publishedStatus}</Badge>
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
        
      <Dialog open={isAddStoryDialogOpen} onOpenChange={setIsAddStoryDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Story</DialogTitle>
            <DialogDescription>Fill in the details for the new story. It will be added as a 'Draft'.</DialogDescription>
          </DialogHeader>
          <StoryForm onSave={handleSaveStory} onCancel={() => setIsAddStoryDialogOpen(false)} />
        </DialogContent>
      </Dialog>

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
              <DialogDescription>Add, edit, or remove chapters for this story. Changes are local and simulated.</DialogDescription>
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
                           <Button variant="destructive" size="sm" onClick={() => confirmRemoveChapter(storyForChapterManagement!.id, chapter.id)}>
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

      {isEditChapterDialogOpen && editingChapter && storyForChapterManagement && (
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
                    <DialogDescription>Modify the chapter title and content below. Changes are local and simulated.</DialogDescription>
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
            <CardDescription>View, edit, or suspend user accounts. (Placeholder)</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => toast({title:"Placeholder", description: "User management not yet implemented."})} className="w-full">Manage Users</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Settings className="h-5 w-5" /> Site Settings</CardTitle>
            <CardDescription>Configure general site parameters. (Placeholder)</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => toast({title:"Placeholder", description:"Site settings not yet implemented."})} className="w-full">Site Settings</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
