
"use client";

import type { Story, StoryChapter, PostComment, UserProfile } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { cn } from "@/lib/utils";
import { mockStories } from '@/lib/mock-data';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertTriangle, Bookmark, BookOpenText, ChevronLeft, ChevronRight, Loader2 as LoaderIcon, LogIn, MessageCircle, Minus, Moon, Plus, Send, Share2, Star, Sun, ThumbsDown, ThumbsUp
} from 'lucide-react';
import Image from "next/image";
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import { format, formatDistanceToNowStrict } from 'date-fns';

export default function ReadingPage() {
  const params = useParams();
  const router = useRouter();
  const storyId = params.storyId as string;

  const [story, setStory] = useState<Story | null>(null);
  const [displayViews, setDisplayViews] = useState<number | undefined>(undefined);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [fontSize, setFontSize] = useState(16);
  const [readingTheme, setReadingTheme] = useState<'light' | 'dark'>('dark');
  
  const [commentText, setCommentText] = useState('');
  const [chapterComments, setChapterComments] = useState<PostComment[]>([]); 
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [storyNotFound, setStoryNotFound] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [readingProgress, setReadingProgress] = useState(0);

  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [currentUserProfile, setCurrentUserProfile] = useState<Partial<UserProfile> | null>(null);

  useEffect(() => {
    setIsLoading(true);
    if (typeof window !== 'undefined') {
      const storedProfile = localStorage.getItem('userProfileData');
      if (storedProfile) {
        try {
          setCurrentUserProfile(JSON.parse(storedProfile));
        } catch (e) {
          console.error("Failed to parse user profile from localStorage", e);
        }
      }
    }

    const foundStory = mockStories.find(s => s.id === storyId);

    if (foundStory && foundStory.publishedStatus === 'Published') {
      setStory(foundStory);
      setDisplayViews(foundStory.views ? foundStory.views + 1 : 1);
      setStoryNotFound(false);
      
      const initialComments: PostComment[] = [
        { id: `chapComment1-${foundStory.chapters[0]?.id}`, postId: foundStory.chapters[0]?.id || 'unknown_chapter', userId: 'userBot1', username: 'BookFanatic', avatarUrl: 'https://placehold.co/40x40/7E3AF2/FFFFFF?text=BF', dataAihint: "user avatar", text: "What a great start to the story!", timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString() },
        { id: `chapComment2-${foundStory.chapters[0]?.id}`, postId: foundStory.chapters[0]?.id || 'unknown_chapter', userId: 'userBot2', username: 'PageExplorer', avatarUrl: 'https://placehold.co/40x40/F28A3A/FFFFFF?text=PE', dataAihint: "user avatar", text: "Can't wait to see what happens next.", timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
      ];
      setChapterComments(initialComments);
    } else {
      setStory(null);
      setDisplayViews(undefined);
      setChapterComments([]);
      setStoryNotFound(true);
    }
    setCurrentChapterIndex(0);
    setUserRating(0);
    setIsLoading(false);
  }, [storyId]);

  useEffect(() => {
    if (story && story.chapters.length > 0) {
      const progress = ((currentChapterIndex + 1) / story.chapters.length) * 100;
      setReadingProgress(progress);
    } else {
      setReadingProgress(0);
    }
  }, [currentChapterIndex, story]);

  const handleRatingSubmit = (rating: number) => {
    setUserRating(rating);
    toast({
      title: "Rating Submitted (Simulated)",
      description: `You rated this story ${rating} out of 5 stars.`,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-150px)]">
        <LoaderIcon className="h-10 w-10 animate-spin text-primary" />
        <p className="ml-2">Loading story...</p>
      </div>
    );
  }

  if (storyNotFound) {
     return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-150px)] text-center p-4">
        <Card className="m-4 max-w-md w-full">
            <CardHeader>
                <CardTitle className="text-destructive flex items-center justify-center gap-2">
                    <AlertTriangle className="h-8 w-8"/> Story Not Found
                </CardTitle>
            </CardHeader>
            <CardContent>
                <AlertDescription className="text-lg">
                    The story you are looking for either does not exist or is not currently published.
                </AlertDescription>
                <Button asChild variant="default" className="mt-6">
                    <Link href="/">Go to Homepage</Link>
                </Button>
            </CardContent>
        </Card>
      </div>
    );
  }

  if (!isUserAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] text-center p-4">
        <Alert variant="default" className="max-w-md w-full shadow-lg">
          <LogIn className="h-5 w-5" />
          <AlertTitle className="text-xl font-semibold">Access Restricted</AlertTitle>
          <AlertDescription className="mt-2 text-base">
            You need to be logged in to read this story. Please log in to continue.
          </AlertDescription>
          <Button asChild className="mt-6 w-full sm:w-auto" onClick={() => setIsUserAuthenticated(true)}>
            <span className="cursor-pointer"><LogIn className="mr-2 h-4 w-4" /> Simulate Login & Read</span>
          </Button>
          <Button asChild className="mt-2 w-full sm:w-auto" variant="outline">
            <Link href="/auth/login">
              <LogIn className="mr-2 h-4 w-4" /> Go to Login Page
            </Link>
          </Button>
        </Alert>
      </div>
    );
  }


  if (!story) {
    return <p className="text-center mt-10">An unexpected error occurred while loading the story.</p>;
  }


  const currentChapter = story.chapters[currentChapterIndex];

  const goToNextChapter = () => {
    if (currentChapterIndex < story.chapters.length - 1) {
      setCurrentChapterIndex(prev => prev + 1);
      // For simulation, reset. In real app, fetch chapter-specific comments or load from story object.
      const nextChapterId = story.chapters[currentChapterIndex + 1]?.id;
      setChapterComments(nextChapterId === `chapComment1-${story.chapters[0]?.id}` ? [ /* mock comments for chapter 1 */ ] : []);
      window.scrollTo(0, 0);
    }
  };

  const goToPrevChapter = () => {
    if (currentChapterIndex > 0) {
      setCurrentChapterIndex(prev => prev - 1);
      const prevChapterId = story.chapters[currentChapterIndex - 1]?.id;
      setChapterComments(prevChapterId === `chapComment1-${story.chapters[0]?.id}` ? [ /* mock comments for chapter 1 */ ] : []);
      window.scrollTo(0, 0);
    }
  };

  const handleChapterSelect = (chapterId: string) => {
    const chapterIdx = story.chapters.findIndex(c => c.id === chapterId);
    if (chapterIdx !== -1) {
      setCurrentChapterIndex(chapterIdx);
      setChapterComments(chapterId === `chapComment1-${story.chapters[0]?.id}` ? [ /* mock comments for chapter 1 */ ] : []);
      window.scrollTo(0, 0);
    }
  };

  const toggleReadingTheme = () => {
    setReadingTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleCommentSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) {
        toast({ title: "Empty Comment", description: "Please write something before submitting.", variant: "destructive"});
        return;
    }
    if (!currentUserProfile || !currentUserProfile.id || !currentUserProfile.username) {
        toast({ title: "Not Logged In", description: "Please log in to comment.", variant: "destructive"});
        return;
    }
    setIsSubmittingComment(true);

    const newComment: PostComment = {
      id: `chapComm-${Date.now()}`,
      postId: currentChapter.id,
      userId: currentUserProfile.id,
      username: currentUserProfile.username,
      avatarUrl: currentUserProfile.avatarUrl || 'https://placehold.co/40x40/CCCCCC/FFFFFF?text=U',
      dataAihint: currentUserProfile.avatarUrl?.includes('placehold.co') ? 'user initial' : 'user avatar',
      text: commentText.trim(),
      timestamp: new Date().toISOString(),
    };

    setTimeout(() => {
      setChapterComments(prevComments => [newComment, ...prevComments]);
      setCommentText('');
      setIsSubmittingComment(false);
      toast({ title: "Comment Submitted", description: "Your comment has been added to this chapter (locally)."});
    }, 300);
  };

  const formatTimestampDisplay = (timestamp: string) => {
    try {
      return formatDistanceToNowStrict(new Date(timestamp), { addSuffix: true });
    } catch (error) {
      return 'just now';
    }
  };


  const readingAreaClasses = readingTheme === 'light'
    ? 'bg-gray-100 text-gray-800'
    : 'bg-gray-900 text-gray-200';

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto">
      <Card className="lg:w-1/4 hidden lg:block sticky top-[76px] h-[calc(100vh-90px)] self-start overflow-y-auto">
        <CardHeader className="p-4">
            <Image src={story.coverImage} alt={story.title} width={300} height={450} className="mb-4 rounded-md object-cover shadow-md" data-ai-hint={story.dataAihint || "book cover story"}/>
          <CardTitle className="text-xl">{story.title}</CardTitle>
          <CardDescription>By {story.author}</CardDescription>
           <div className="flex flex-wrap gap-1 pt-2">
            {story.tags.slice(0,3).map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="mb-3">
            <div className="flex justify-between items-center text-xs text-muted-foreground mb-1">
                <span>Reading Progress</span>
                <span>{Math.round(readingProgress)}%</span>
            </div>
            <Progress value={readingProgress} className="h-2" />
          </div>
          <h4 className="font-semibold mb-2 text-sm text-muted-foreground">Chapters ({story.chapters.length})</h4>
          <ScrollArea className="h-[calc(100vh-520px)] pr-2">
            <ul className="space-y-1">
              {story.chapters.map((chap, index) => (
                <li key={chap.id}>
                  <Button
                    variant={index === currentChapterIndex ? "secondary" : "ghost"}
                    size="sm"
                    className="w-full justify-start text-left h-auto py-2"
                    onClick={() => handleChapterSelect(chap.id)}
                  >
                    <BookOpenText className="mr-2 h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{chap.title}</span>
                  </Button>
                </li>
              ))}
            </ul>
          </ScrollArea>
        </CardContent>
      </Card>

      <div className={`flex-1 min-w-0`}>
        <Card className={`mb-6 ${readingAreaClasses} shadow-lg rounded-lg`}>
            <CardContent className="p-4 md:p-6">
                 <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-start">
                    <Image src={story.coverImage} alt={story.title} width={150} height={225} className="rounded-md object-cover shadow-md lg:hidden" data-ai-hint={story.dataAihint || "book cover story mobile"}/>
                    <div className="flex-grow">
                        <h1 className={`text-2xl md:text-3xl font-bold ${readingTheme === 'light' ? 'text-gray-900' : 'text-white'}`}>{story.title}</h1>
                        <p className={`text-sm ${readingTheme === 'light' ? 'text-gray-600' : 'text-gray-400'} mt-1`}>By {story.author}</p>
                        <div className="flex items-center gap-2 mt-2">
                            <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                            <span className={`font-semibold ${readingTheme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>{story.rating?.toFixed(1)}</span>
                            <span className={`text-xs ${readingTheme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>({displayViews?.toLocaleString() || story.views?.toLocaleString()} views)</span>
                        </div>
                        <div className="mt-3">
                          <p className={`text-sm font-medium ${readingTheme === 'light' ? 'text-gray-700' : 'text-gray-300'} mb-1`}>Rate this story:</p>
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Button
                                key={star}
                                variant="ghost"
                                size="icon"
                                className={`p-1 h-7 w-7 ${readingTheme === 'light' ? 'text-gray-500 hover:text-yellow-500' : 'text-gray-400 hover:text-yellow-400'} ${userRating >= star ? (readingTheme === 'light' ? 'text-yellow-500 fill-yellow-500' : 'text-yellow-400 fill-yellow-400') : ''}`}
                                onClick={() => handleRatingSubmit(star)}
                              >
                                <Star className="h-5 w-5" />
                              </Button>
                            ))}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                            {story.tags.map(tag => <Badge key={tag} variant={readingTheme === 'dark' ? "secondary" : "default"} className="text-xs">{tag}</Badge>)}
                        </div>
                    </div>
                </div>
                <Separator className={`my-4 ${readingTheme === 'light' ? 'bg-gray-300' : 'bg-gray-700'}`} />
                <p className={`text-sm leading-relaxed ${readingTheme === 'light' ? 'text-gray-700' : 'text-gray-300'} mb-4`}>
                    {story.description}
                </p>
                <div className="flex gap-2 items-center">
                    <Button variant="outline" size="sm" className={`${readingTheme === 'light' ? 'border-gray-400 hover:bg-gray-200' : 'border-gray-600 hover:bg-gray-700'}`} onClick={() => toast({title: "Share", description: "Social share placeholder"})}>
                        <Share2 className="mr-2 h-4 w-4"/> Share
                    </Button>
                    <Button variant="outline" size="sm" className={`${readingTheme === 'light' ? 'border-gray-400 hover:bg-gray-200' : 'border-gray-600 hover:bg-gray-700'}`} onClick={() => toast({title: "Share in Chat", description: "Share in chat placeholder"})}>
                        <MessageCircle className="mr-2 h-4 w-4"/> Share in Chat
                    </Button>
                     <Button variant="ghost" size="icon" className={`${readingTheme === 'light' ? 'text-gray-600 hover:text-primary' : 'text-gray-400 hover:text-primary'}`} onClick={() => toast({title: "Bookmark", description: "Bookmark placeholder"})}>
                        <Bookmark className="h-5 w-5" />
                    </Button>
                </div>
            </CardContent>
        </Card>

        {currentChapter && (
        <div className={`${readingAreaClasses} rounded-lg shadow-lg`}>
            <header className="p-4 border-b flex items-center justify-between sticky top-[60px] z-10 bg-inherit rounded-t-lg ${readingTheme === 'light' ? 'border-gray-300' : 'border-gray-700'}">
              <div>
                <h2 className="text-xl font-semibold">{currentChapter.title}</h2>
                 <div className="mt-1">
                    <Progress value={readingProgress} className={`h-1.5 w-full md:w-64 ${readingTheme === 'light' ? 'bg-gray-300 [&>div]:bg-primary' : 'bg-gray-700 [&>div]:bg-primary'}`} />
                </div>
                <div className="lg:hidden mt-2">
                    <Select onValueChange={handleChapterSelect} defaultValue={currentChapter.id}>
                        <SelectTrigger className={`w-[200px] h-9 text-xs ${readingTheme === 'light' ? 'bg-white border-gray-300' : 'bg-gray-800 border-gray-600'}`}>
                            <SelectValue placeholder="Select Chapter" />
                        </SelectTrigger>
                        <SelectContent>
                            {story.chapters.map((chap) => (
                            <SelectItem key={chap.id} value={chap.id}>{chap.title}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
              </div>
              <div className="flex items-center gap-1 md:gap-2">
                <Button variant="ghost" size="icon" onClick={() => setFontSize(s => Math.max(12, s - 1))}><Minus className="h-4 w-4" /></Button>
                <span className="w-6 text-center text-sm tabular-nums">{fontSize}px</span>
                <Button variant="ghost" size="icon" onClick={() => setFontSize(s => Math.min(28, s + 1))}><Plus className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" onClick={toggleReadingTheme}>
                  {readingTheme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                </Button>
              </div>
            </header>

            <ScrollArea className="h-auto max-h-[calc(100vh-300px)] md:max-h-[calc(100vh-250px)]">
               <article
                  className={cn("p-4 md:p-6 prose prose-sm sm:prose lg:prose-lg max-w-none no-select",
                    readingTheme === 'light' ? 'prose-gray' : 'prose-invert'
                  )}
                  style={{ fontSize: `${fontSize}px`, lineHeight: 1.8 }}
                  dangerouslySetInnerHTML={{ __html: currentChapter.content.replace(/\n/g, '<br />') }} // Basic newline to <br> conversion
                />
            </ScrollArea>

            <footer className={`p-4 border-t flex items-center justify-between sticky bottom-0 bg-inherit rounded-b-lg ${readingTheme === 'light' ? 'border-gray-300' : 'border-gray-700'}`}>
              <Button variant="outline" onClick={goToPrevChapter} disabled={currentChapterIndex === 0} className={`${readingTheme === 'light' ? 'border-gray-400 hover:bg-gray-200' : 'border-gray-600 hover:bg-gray-700'}`}>
                <ChevronLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
              <span className="text-sm text-muted-foreground">Chapter {currentChapterIndex + 1} of {story.chapters.length}</span>
              <Button variant="outline" onClick={goToNextChapter} disabled={currentChapterIndex === story.chapters.length - 1} className={`${readingTheme === 'light' ? 'border-gray-400 hover:bg-gray-200' : 'border-gray-600 hover:bg-gray-700'}`}>
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </footer>
        </div>
        )}

        <Card className={`mt-6 ${readingTheme === 'light' ? 'bg-white' : 'bg-gray-800'} shadow-lg rounded-lg`}>
          <CardHeader>
            <CardTitle className={`text-lg font-semibold ${readingTheme === 'light' ? 'text-gray-900' : 'text-white'}`}>Leave a Comment</CardTitle>
            <CardDescription className={`${readingTheme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Share your thoughts on this chapter!</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCommentSubmit} className="space-y-4">
              <Textarea
                placeholder="Write your comment here..."
                rows={4}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className={`${readingTheme === 'light' ? 'bg-gray-50 border-gray-300' : 'bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400'}`}
                disabled={isSubmittingComment}
              />
              <div className="flex justify-end">
                <Button type="submit" variant="default" disabled={isSubmittingComment || !currentUserProfile}>
                  {isSubmittingComment ? <LoaderIcon className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                  {isSubmittingComment ? "Submitting..." : "Submit Comment"}
                </Button>
              </div>
            </form>
          </CardContent>
          {chapterComments.length > 0 && (
            <CardContent className={`mt-6 border-t pt-6 ${readingTheme === 'light' ? 'border-gray-200' : 'border-gray-700'}`}>
              <h3 className={`text-md font-semibold mb-3 ${readingTheme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}>Comments ({chapterComments.length})</h3>
              <ScrollArea className="max-h-96 pr-2">
                <div className="space-y-4">
                  {chapterComments.map(comment => {
                    const displayProfile = (currentUserProfile && comment.userId === currentUserProfile.id)
                                          ? { username: currentUserProfile.username || comment.username, avatarUrl: currentUserProfile.avatarUrl || comment.avatarUrl, dataAihint: currentUserProfile.avatarUrl?.includes('placehold.co') ? 'user initial' : comment.dataAihint }
                                          : { username: comment.username, avatarUrl: comment.avatarUrl, dataAihint: comment.dataAihint };
                    return (
                        <div key={comment.id} className="flex items-start space-x-3">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={displayProfile.avatarUrl} alt={displayProfile.username} data-ai-hint={displayProfile.dataAihint || "user avatar comment"}/>
                                <AvatarFallback>{displayProfile.username.substring(0,1).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className={`flex-1 p-3 rounded-md ${readingTheme === 'light' ? 'bg-gray-100' : 'bg-gray-700/50'}`}>
                                <div className="flex justify-between items-center">
                                    <p className={`text-sm font-medium ${readingTheme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}>{displayProfile.username}</p>
                                    <p className={`text-xs ${readingTheme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>{formatTimestampDisplay(comment.timestamp)}</p>
                                </div>
                                <p className={`mt-1 text-sm ${readingTheme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>{comment.text}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <Button variant="ghost" size="sm" className={`p-1 h-auto text-xs ${readingTheme === 'light' ? 'text-gray-600 hover:text-primary' : 'text-gray-400 hover:text-primary'}`} onClick={() => toast({title: "Like comment (placeholder)"})}><ThumbsUp className="h-3 w-3 mr-1"/> Like</Button>
                                    <Button variant="ghost" size="sm" className={`p-1 h-auto text-xs ${readingTheme === 'light' ? 'text-gray-600 hover:text-primary' : 'text-gray-400 hover:text-primary'}`} onClick={() => toast({title: "Dislike comment (placeholder)"})}><ThumbsDown className="h-3 w-3 mr-1"/> Dislike</Button>
                                </div>
                            </div>
                        </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
