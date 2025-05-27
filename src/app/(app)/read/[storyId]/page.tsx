"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import type { Story, StoryChapter } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Settings2, Minus, Plus, Sun, Moon, Bookmark, Share2, MessageCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from '@/components/ui/badge';


const mockStories: Story[] = [
  {
    id: '1',
    title: 'The Whispers of Chronos',
    author: 'Eleanor Vance',
    authorId: 'author1',
    coverImage: 'https://placehold.co/600x900/B4317B/F7F2FA?text=Chronos',
    description: 'A thrilling journey through time as a historian uncovers a device that can alter history. This epic saga will take you through myriad timelines, each with its own perils and wonders. Join Dr. Aris Thorne as he grapples with the ethical dilemmas of temporal manipulation and races against a shadowy organization vying for control of time itself.',
    tags: ['sci-fi', 'time travel', 'adventure', 'thriller', 'mystery'],
    chapters: [
      { id: 'c1', title: 'Chapter 1: The Attic Anomaly', content: 'The old grandfather clock in the attic wasn\'t just telling time; it was leaking it. Dr. Aris Thorne discovered this quite by accident, a shimmering distortion around its aged mahogany case...', order: 1 },
      { id: 'c2', title: 'Chapter 2: Echoes of Tomorrow', content: 'His first jump was unintentional, a chaotic tumble into a future he barely recognized. The sky was a permanent twilight, and strange, silent vehicles glided along crystalline roads...', order: 2 },
      { id: 'c3', title: 'Chapter 3: The Chronos Protocol', content: 'The organization known only as "Veridian" had been tracking temporal disturbances for decades. They knew about Aris, and they wanted the clock. Their methods were... persuasive.', order: 3 },
    ],
    genre: 'Science Fiction',
    status: 'Completed',
    rating: 4.8,
    views: 25000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
   {
    id: '2',
    title: 'Beneath the Emerald Canopy',
    author: 'Marcus Stone',
    authorId: 'author2',
    coverImage: 'https://placehold.co/600x900/B4317B/F7F2FA?text=Canopy',
    description: 'Explorers venture deep into an uncharted jungle, finding more than just exotic flora and fauna.',
    tags: ['fantasy', 'exploration', 'magic'],
    chapters: [
      { id: 'c1', title: 'Chapter 1: The Summons', content: 'The Royal Cartographers Guild had a new assignment, one whispered in hushed tones: map the Serpent\'s Tooth jungle, a place from which no explorer had ever returned.', order: 1 },
      { id: 'c2', title: 'Chapter 2: Whispers in the Leaves', content: 'The jungle was alive, not just with animals, but with something...else. The trees seemed to watch them, and the very air thrummed with an ancient power.', order: 2 },
    ],
    genre: 'Fantasy',
    status: 'Ongoing',
    rating: 4.5,
    views: 18000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];


export default function ReadingPage() {
  const params = useParams();
  const storyId = params.storyId as string;
  
  const [story, setStory] = useState<Story | null>(null);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [fontSize, setFontSize] = useState(16); // Default 16px
  const [readingTheme, setReadingTheme] = useState<'light' | 'dark'>('dark'); // Default to app's dark theme

  useEffect(() => {
    const foundStory = mockStories.find(s => s.id === storyId);
    setStory(foundStory || null);
    setCurrentChapterIndex(0); // Reset to first chapter on story change
  }, [storyId]);

  if (!story) {
    return (
      <div className="flex items-center justify-center h-full">
        <Alert variant="destructive">
            <CardTitle>Story not found!</CardTitle>
            <AlertDescription>The story you are looking for does not exist or could not be loaded.</AlertDescription>
        </Alert>
      </div>
    );
  }

  const currentChapter = story.chapters[currentChapterIndex];

  const goToNextChapter = () => {
    if (currentChapterIndex < story.chapters.length - 1) {
      setCurrentChapterIndex(prev => prev + 1);
    }
  };

  const goToPrevChapter = () => {
    if (currentChapterIndex > 0) {
      setCurrentChapterIndex(prev => prev - 1);
    }
  };

  const handleChapterSelect = (chapterId: string) => {
    const chapterIdx = story.chapters.findIndex(c => c.id === chapterId);
    if (chapterIdx !== -1) {
      setCurrentChapterIndex(chapterIdx);
    }
  };

  const toggleReadingTheme = () => {
    setReadingTheme(prev => prev === 'light' ? 'dark' : 'light');
  };


  const readingAreaClasses = readingTheme === 'light' 
    ? 'bg-gray-100 text-gray-800' 
    : 'bg-gray-900 text-gray-200'; // Specific to reading area

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto">
      {/* Story Info and Chapter List Sidebar (optional for large screens) */}
      <Card className="lg:w-1/4 hidden lg:block sticky top-[76px] h-[calc(100vh-90px)] self-start">
        <CardHeader>
            <AspectRatio ratio={2 / 3} className="mb-4">
             <Image src={story.coverImage} alt={story.title} layout="fill" className="rounded-md object-cover" data-ai-hint="book cover story"/>
            </AspectRatio>
          <CardTitle>{story.title}</CardTitle>
          <CardDescription>By {story.author}</CardDescription>
           <div className="flex flex-wrap gap-1 pt-2">
            {story.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
          </div>
        </CardHeader>
        <CardContent>
          <h4 className="font-semibold mb-2 text-sm">Chapters</h4>
          <ScrollArea className="h-[calc(100vh-380px)] pr-3"> {/* Adjust height as needed */}
            <ul className="space-y-1">
              {story.chapters.map((chap, index) => (
                <li key={chap.id}>
                  <Button
                    variant={index === currentChapterIndex ? "default" : "ghost"}
                    size="sm"
                    className="w-full justify-start text-left"
                    onClick={() => handleChapterSelect(chap.id)}
                  >
                    {chap.title}
                  </Button>
                </li>
              ))}
            </ul>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Main Reading Area */}
      <div className={`flex-1 ${readingAreaClasses} rounded-lg shadow-lg`}>
        <header className="p-4 border-b flex items-center justify-between sticky top-[76px] z-10 bg-inherit rounded-t-lg">
          <div>
            <h2 className="text-xl font-semibold">{currentChapter.title}</h2>
            <p className="text-sm text-muted-foreground">{story.title} - By {story.author}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setFontSize(s => Math.max(12, s - 2))}><Minus className="h-4 w-4" /></Button>
            <span className="w-6 text-center text-sm">{fontSize}px</span>
            <Button variant="ghost" size="icon" onClick={() => setFontSize(s => Math.min(32, s + 2))}><Plus className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" onClick={toggleReadingTheme}>
              {readingTheme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Button>
            <Select onValueChange={handleChapterSelect} defaultValue={currentChapter.id}>
                <SelectTrigger className="w-[180px] lg:hidden">
                    <SelectValue placeholder="Select Chapter" />
                </SelectTrigger>
                <SelectContent>
                    {story.chapters.map((chap) => (
                    <SelectItem key={chap.id} value={chap.id}>{chap.title}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </div>
        </header>
        
        <ScrollArea className="h-[calc(100vh-200px)] lg:h-[calc(100vh-150px)]"> {/* Adjust height */}
          <article className="p-6 prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none" style={{ fontSize: `${fontSize}px`, lineHeight: 1.8 }}>
            {currentChapter.content.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4">{paragraph}</p>
            ))}
          </article>
        </ScrollArea>

        <footer className="p-4 border-t flex items-center justify-between sticky bottom-0 bg-inherit rounded-b-lg">
          <Button variant="outline" onClick={goToPrevChapter} disabled={currentChapterIndex === 0}>
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon"><Bookmark className="h-5 w-5" /></Button>
            <Button variant="ghost" size="icon"><Share2 className="h-5 w-5" /></Button>
            <Button variant="ghost" size="icon"><MessageCircle className="h-5 w-5" /></Button>
          </div>
          <Button variant="outline" onClick={goToNextChapter} disabled={currentChapterIndex === story.chapters.length - 1}>
            Next <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </footer>
      </div>
    </div>
  );
}
