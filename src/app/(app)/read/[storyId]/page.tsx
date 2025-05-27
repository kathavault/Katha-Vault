
"use client";

import { useState, useEffect, FormEvent } from 'react';
import { useParams } from 'next/navigation';
import type { Story, StoryChapter } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";
import { 
  ChevronLeft, ChevronRight, Settings2, Minus, Plus, Sun, Moon, Bookmark, Share2, MessageCircle, Star, Send, ThumbsUp, ThumbsDown 
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';


const mockStories: Story[] = [
  {
    id: '1',
    title: 'The Whispers of Chronos',
    author: 'Eleanor Vance',
    authorId: 'author1',
    coverImage: 'https://placehold.co/600x900/B4317B/F7F2FA?text=Chronos',
    dataAihint: "futuristic time machine",
    description: 'A thrilling journey through time as a historian uncovers a device that can alter history. This epic saga will take you through myriad timelines, each with its own perils and wonders. Join Dr. Aris Thorne as he grapples with the ethical dilemmas of temporal manipulation and races against a shadowy organization vying for control of time itself.',
    tags: ['sci-fi', 'time travel', 'adventure', 'thriller', 'mystery'],
    chapters: [
      { id: 'c1', title: 'Chapter 1: The Attic Anomaly', content: 'The old grandfather clock in the attic wasn\'t just telling time; it was leaking it. Dr. Aris Thorne discovered this quite by accident, a shimmering distortion around its aged mahogany case... paragraph after paragraph to make it long enough for scrolling. \n\n Another paragraph here. It needs to be fairly substantial to test the reading experience properly. This story delves into the complexities of temporal mechanics and the potential paradoxes that arise. \n\n Third paragraph, still going. Aris felt a cold dread as he realized the implications. If time could leak, could it also be stolen, or worse, rewritten? The thought sent shivers down his spine. He knew he had stumbled upon something monumental, something dangerous. The air in the attic grew heavy, and the rhythmic ticking of the clock seemed to mock his apprehension. What secrets did this ancient timepiece hold, and what destiny had it just thrust upon him? The journey ahead was uncertain, fraught with peril, but the allure of unraveling time\'s mysteries was too strong to resist. He had to know more, even if it meant risking everything.', order: 1 },
      { id: 'c2', title: 'Chapter 2: Echoes of Tomorrow', content: 'His first jump was unintentional, a chaotic tumble into a future he barely recognized. The sky was a permanent twilight, and strange, silent vehicles glided along crystalline roads... The architecture was unlike anything he had ever seen, a blend of organic curves and impossible geometries. People moved with a serene grace, their expressions unreadable. Where had he landed? And more importantly, how could he get back? The temporal device, the clock, was still in his attic, centuries away. He was alone, a relic of the past in a future that felt both wondrous and terrifying.', order: 2 },
      { id: 'c3', title: 'Chapter 3: The Chronos Protocol', content: 'The organization known only as "Veridian" had been tracking temporal disturbances for decades. They knew about Aris, and they wanted the clock. Their methods were... persuasive. Their agents, clad in obsidian suits that seemed to absorb light, moved with unsettling precision. They weren\'t just after the technology; they sought to control history itself, to shape it to their own inscrutable ends. Aris found himself a pawn in a game that spanned millennia, a game where the stakes were reality itself.', order: 3 },
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
    coverImage: 'https://placehold.co/600x900/2A9D8F/FFFFFF?text=Canopy',
    dataAihint: "ancient jungle ruins",
    description: 'Explorers venture deep into an uncharted jungle, finding more than just exotic flora and fauna. A tale of discovery, danger, and the thin veil between worlds.',
    tags: ['fantasy', 'exploration', 'magic', 'adventure'],
    chapters: [
      { id: 'c1', title: 'Chapter 1: The Summons', content: 'The Royal Cartographers Guild had a new assignment, one whispered in hushed tones: map the Serpent\'s Tooth jungle, a place from which no explorer had ever returned. Lyra, a young cartographer with a thirst for the unknown, felt a thrill of anticipation mixed with a healthy dose of fear. This was her chance to make her mark, to chart the unchartable. But the legends of the Serpent\'s Tooth were dark, filled with tales of monstrous beasts and ancient curses.', order: 1 },
      { id: 'c2', title: 'Chapter 2: Whispers in the Leaves', content: 'The jungle was alive, not just with animals, but with something...else. The trees seemed to watch them, and the very air thrummed with an ancient power. Strange glowing fungi illuminated their path at night, and the calls of unseen creatures echoed through the dense undergrowth. Lyra meticulously documented every landmark, every peculiar plant, her senses heightened by the oppressive beauty and hidden dangers of the jungle.', order: 2 },
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
  const [fontSize, setFontSize] = useState(16); 
  const [readingTheme, setReadingTheme] = useState<'light' | 'dark'>('dark');
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    const foundStory = mockStories.find(s => s.id === storyId);
    setStory(foundStory || null);
    setCurrentChapterIndex(0); 
  }, [storyId]);

  if (!story) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="m-4">
            <CardHeader>
                <CardTitle className="text-destructive flex items-center gap-2">
                    <AlertTriangle/> Story not found!
                </CardTitle>
            </CardHeader>
            <CardContent>
                <AlertDescription>The story you are looking for does not exist or could not be loaded. Please check the ID or try again later.</AlertDescription>
                <Button asChild variant="link" className="mt-4">
                    <Link href="/">Go to Homepage</Link>
                </Button>
            </CardContent>
        </Card>
      </div>
    );
  }

  const currentChapter = story.chapters[currentChapterIndex];

  const goToNextChapter = () => {
    if (currentChapterIndex < story.chapters.length - 1) {
      setCurrentChapterIndex(prev => prev + 1);
      window.scrollTo(0, 0); 
    }
  };

  const goToPrevChapter = () => {
    if (currentChapterIndex > 0) {
      setCurrentChapterIndex(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleChapterSelect = (chapterId: string) => {
    const chapterIdx = story.chapters.findIndex(c => c.id === chapterId);
    if (chapterIdx !== -1) {
      setCurrentChapterIndex(chapterIdx);
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
    console.log("Comment Submitted:", commentText);
    toast({ title: "Comment Submitted", description: "Your comment has been (mock) submitted!"});
    setCommentText('');
    // In a real app, this would send the comment to a backend.
  }


  const readingAreaClasses = readingTheme === 'light' 
    ? 'bg-gray-100 text-gray-800' 
    : 'bg-gray-900 text-gray-200';

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto">
      {/* Story Info and Chapter List Sidebar (Desktop) */}
      <Card className="lg:w-1/4 hidden lg:block sticky top-[76px] h-[calc(100vh-90px)] self-start overflow-y-auto">
        <CardHeader className="p-4">
            <AspectRatio ratio={2 / 3} className="mb-4 rounded-md overflow-hidden">
             <Image src={story.coverImage} alt={story.title} layout="fill" className="object-cover" data-ai-hint={story.dataAihint || "book cover story"}/>
            </AspectRatio>
          <CardTitle className="text-xl">{story.title}</CardTitle>
          <CardDescription>By {story.author}</CardDescription>
           <div className="flex flex-wrap gap-1 pt-2">
            {story.tags.slice(0,3).map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <h4 className="font-semibold mb-2 text-sm text-muted-foreground">Chapters</h4>
          <ScrollArea className="h-[calc(100vh-450px)] pr-2"> {/* Adjusted height */}
            <ul className="space-y-1">
              {story.chapters.map((chap, index) => (
                <li key={chap.id}>
                  <Button
                    variant={index === currentChapterIndex ? "secondary" : "ghost"}
                    size="sm"
                    className="w-full justify-start text-left h-auto py-2"
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
      <div className={`flex-1 min-w-0`}>
        {/* Story Info Block - Visible for all screen sizes before chapter content */}
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
                            <span className={`text-xs ${readingTheme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>({story.views} views)</span>
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
                    <Button variant="outline" size="sm" className={`${readingTheme === 'light' ? 'border-gray-400 hover:bg-gray-200' : 'border-gray-600 hover:bg-gray-700'}`}>
                        <Share2 className="mr-2 h-4 w-4"/> Share
                    </Button>
                    <Button variant="outline" size="sm" className={`${readingTheme === 'light' ? 'border-gray-400 hover:bg-gray-200' : 'border-gray-600 hover:bg-gray-700'}`}>
                        <MessageCircle className="mr-2 h-4 w-4"/> Share in Chat
                    </Button>
                     <Button variant="ghost" size="icon" className={`${readingTheme === 'light' ? 'text-gray-600 hover:text-primary' : 'text-gray-400 hover:text-primary'}`}>
                        <Bookmark className="h-5 w-5" />
                    </Button>
                </div>
            </CardContent>
        </Card>
        
        {/* Chapter Reading Section */}
        <div className={`${readingAreaClasses} rounded-lg shadow-lg`}>
            <header className="p-4 border-b flex items-center justify-between sticky top-[60px] z-10 bg-inherit rounded-t-lg ${readingTheme === 'light' ? 'border-gray-300' : 'border-gray-700'}">
              <div>
                <h2 className="text-xl font-semibold">{currentChapter.title}</h2>
                 {/* Mobile Chapter Select */}
                <div className="lg:hidden mt-1">
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
            
            <ScrollArea className="h-auto max-h-[calc(100vh-300px)] md:max-h-[calc(100vh-250px)]"> {/* Adjusted height */}
              <article className="p-4 md:p-6 prose prose-sm sm:prose lg:prose-lg max-w-none" style={{ fontSize: `${fontSize}px`, lineHeight: 1.8 }}>
                {currentChapter.content.split('\n').map((paragraph, index) => (
                  paragraph.trim() !== "" && <p key={index} className="mb-4">{paragraph}</p>
                ))}
              </article>
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

        {/* Comment Section Placeholder */}
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
              />
              <div className="flex justify-end">
                <Button type="submit" variant="default">
                  <Send className="mr-2 h-4 w-4" /> Submit Comment
                </Button>
              </div>
            </form>
          </CardContent>
          <CardContent className="mt-6 border-t pt-6 ${readingTheme === 'light' ? 'border-gray-200' : 'border-gray-700'}">
             <h3 className={`text-md font-semibold mb-3 ${readingTheme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}>Comments (Placeholder)</h3>
             <div className="space-y-4">
                {/* Mock Comment Example 1 */}
                <div className="flex items-start space-x-3">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src="https://placehold.co/40x40/7E3AF2/FFFFFF?text=U1" alt="User1" data-ai-hint="user avatar"/>
                        <AvatarFallback>U1</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <p className={`text-sm font-medium ${readingTheme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}>ReaderFan123</p>
                        <p className={`text-xs ${readingTheme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>2 hours ago</p>
                        <p className={`mt-1 text-sm ${readingTheme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Amazing chapter! Really loved the plot twist.</p>
                         <div className="flex items-center gap-2 mt-1">
                            <Button variant="ghost" size="sm" className="p-1 h-auto text-xs text-muted-foreground hover:text-primary"><ThumbsUp className="h-3 w-3 mr-1"/> Like (10)</Button>
                            <Button variant="ghost" size="sm" className="p-1 h-auto text-xs text-muted-foreground hover:text-primary"><ThumbsDown className="h-3 w-3 mr-1"/> Dislike</Button>
                        </div>
                    </div>
                </div>
                {/* Mock Comment Example 2 */}
                 <div className="flex items-start space-x-3">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src="https://placehold.co/40x40/F28A3A/FFFFFF?text=U2" alt="User2" data-ai-hint="user avatar"/>
                        <AvatarFallback>U2</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <p className={`text-sm font-medium ${readingTheme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}>BookwormBelle</p>
                        <p className={`text-xs ${readingTheme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>1 day ago</p>
                        <p className={`mt-1 text-sm ${readingTheme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>I have a theory about what happens next...</p>
                         <div className="flex items-center gap-2 mt-1">
                            <Button variant="ghost" size="sm" className="p-1 h-auto text-xs text-muted-foreground hover:text-primary"><ThumbsUp className="h-3 w-3 mr-1"/> Like (5)</Button>
                            <Button variant="ghost" size="sm" className="p-1 h-auto text-xs text-muted-foreground hover:text-primary"><ThumbsDown className="h-3 w-3 mr-1"/> Dislike (1)</Button>
                        </div>
                    </div>
                </div>
                <p className={`text-sm text-center p-4 ${readingTheme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                    More comments would load here. Full comment functionality requires backend integration.
                </p>
             </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
