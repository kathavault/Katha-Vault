
import { StoryCard } from '@/components/story-card';
import type { Story } from '@/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Sparkles, TrendingUp } from 'lucide-react';

const mockStories: Story[] = [
  {
    id: '1',
    title: 'The Whispers of Chronos',
    author: 'Eleanor Vance',
    authorId: 'author1',
    coverImage: 'https://placehold.co/300x450/E62E9A/FFFFFF?text=Chronos', // Updated placeholder color
    description: 'A thrilling journey through time as a historian uncovers a device that can alter history.',
    tags: ['sci-fi', 'time travel', 'adventure'],
    chapters: [{ id: 'c1', title: 'The Discovery', content: '...', order: 1 }],
    genre: 'Science Fiction',
    status: 'Completed',
    rating: 4.8,
    views: 25000,
    isTrending: true,
    isCurated: true,
    category: 'Trending',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    dataAihint: "futuristic city"
  },
  {
    id: '2',
    title: 'Beneath the Emerald Canopy',
    author: 'Marcus Stone',
    authorId: 'author2',
    coverImage: 'https://placehold.co/300x450/E62E9A/FFFFFF?text=Canopy', // Updated placeholder color
    description: 'Explorers venture deep into an uncharted jungle, finding more than just exotic flora and fauna.',
    tags: ['fantasy', 'exploration', 'magic'],
    chapters: [{ id: 'c1', title: 'The Summons', content: '...', order: 1 }],
    genre: 'Fantasy',
    status: 'Ongoing',
    rating: 4.5,
    views: 18000,
    isTrending: true,
    category: 'Trending',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    dataAihint: "lush jungle"
  },
  {
    id: '3',
    title: 'The Alchemist of Moonhaven',
    author: 'Seraphina Gold',
    authorId: 'author3',
    coverImage: 'https://placehold.co/300x450/E62E9A/FFFFFF?text=Moonhaven', // Updated placeholder color
    description: 'In a city powered by moonlight, a young alchemist seeks a forbidden truth.',
    tags: ['steampunk', 'mystery', 'alchemy'],
    chapters: [{ id: 'c1', title: 'First Transmutation', content: '...', order: 1 }],
    genre: 'Steampunk',
    status: 'Completed',
    rating: 4.2,
    views: 12000,
    isCurated: true,
    category: 'Novel',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
    dataAihint: "mystical city"
  },
  {
    id: '4',
    title: 'Echoes of the Void',
    author: 'Orion Nebula',
    authorId: 'author4',
    coverImage: 'https://placehold.co/300x450/E62E9A/FFFFFF?text=Void', // Updated placeholder color
    description: 'A lone astronaut confronts an ancient cosmic entity at the edge of known space.',
    tags: ['space opera', 'horror', 'existential'],
    chapters: [{ id: 'c1', title: 'The Signal', content: '...', order: 1 }],
    genre: 'Space Opera',
    status: 'Ongoing',
    rating: 4.9,
    views: 35000,
    isTrending: true,
    isCurated: true,
    category: 'Novel',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
    dataAihint: "galaxy stars"
  },
  {
    id: '5',
    title: 'The Last Cyberpunk',
    author: 'Nova Byte',
    authorId: 'author5',
    coverImage: 'https://placehold.co/300x450/E62E9A/FFFFFF?text=Cyber', // Updated placeholder color
    description: 'In a neon-drenched city, one hacker fights for freedom.',
    tags: ['cyberpunk', 'dystopian', 'action'],
    chapters: [{ id: 'c1', title: 'The Glitch', content: '...', order: 1 }],
    genre: 'Cyberpunk',
    status: 'Ongoing',
    rating: 4.6,
    views: 22000,
    isTrending: true,
    category: 'Trending',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    updatedAt: new Date().toISOString(),
    dataAihint: "neon city"
  },
  {
    id: '6',
    title: 'A Stitch in Time',
    author: 'Penelope Weave',
    authorId: 'author6',
    coverImage: 'https://placehold.co/300x450/E62E9A/FFFFFF?text=Stitch', // Updated placeholder color
    description: 'A short story about a magical tailor who can mend fate.',
    tags: ['short story', 'urban fantasy', 'magic'],
    chapters: [{ id: 'c1', title: 'The Golden Thread', content: '...', order: 1 }],
    genre: 'Fantasy',
    status: 'Completed',
    rating: 4.3,
    views: 9000,
    category: 'ShortStory',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 40).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    dataAihint: "magic thread"
  },
   {
    id: '7',
    title: 'The Clockwork Heart',
    author: 'Cogsworth Tinkerton',
    authorId: 'author7',
    coverImage: 'https://placehold.co/300x450/E62E9A/FFFFFF?text=Clockwork', // Updated placeholder color
    description: 'A short tale of love and machinery in a Victorian-inspired world.',
    tags: ['short story', 'steampunk', 'romance'],
    chapters: [{ id: 'c1', title: 'The Unveiling', content: '...', order: 1 }],
    genre: 'Steampunk',
    status: 'Completed',
    rating: 4.7,
    views: 15000,
    category: 'ShortStory',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    dataAihint: "gears heart"
  }
];

interface StorySectionProps {
  title: string;
  stories: Story[];
  showSeeAll?: boolean;
  icon?: React.ElementType;
}

const StorySection: React.FC<StorySectionProps> = ({ title, stories, showSeeAll = false, icon: Icon }) => {
  if (stories.length === 0) return null;
  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold flex items-center">
          {Icon && <Icon className="mr-3 h-6 w-6 text-primary" />}
          {title}
        </h2>
        {showSeeAll && (
           <Button variant="link" asChild className="text-sm text-primary hover:text-primary/80">
            <Link href={`/library?category=${title.toLowerCase().replace(' ', '-')}`}>
              See All <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        )}
      </div>
      <div className="flex overflow-x-auto space-x-4 pb-4 -mx-1 px-1">
        {stories.map((story) => (
          <div key={story.id} className="flex-shrink-0 w-64 sm:w-72"> {/* Adjust width as needed */}
            <StoryCard story={story} />
          </div>
        ))}
      </div>
    </section>
  );
};

// ChevronRight icon for "See All" link (if not already imported elsewhere)
import { ChevronRight } from 'lucide-react';

export default function HomePage() {
  const trendingStories = mockStories.filter(story => story.category === 'Trending');
  const novelStories = mockStories.filter(story => story.category === 'Novel');
  const shortStories = mockStories.filter(story => story.category === 'ShortStory');
  const curatedStories = mockStories.filter(story => story.isCurated && !story.isTrending);


  return (
    <div className="space-y-10">
      <section className="bg-card dark:bg-background py-12 px-6 rounded-lg shadow-xl text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="text-primary">Your Next</span> <span className="text-primary">Obsession</span> <span className="text-foreground">Awaits</span>
          <br />
          <span className="text-foreground">at</span> <span className="text-primary">Katha Vault</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          Join a global community of readers and writers. Discover original stories
          across all genres, or share your own voice with the world.
        </p>
        <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-6 text-lg">
          <Link href="/library"> 
            Start Reading
          </Link>
        </Button>
         <Button variant="outline" size="lg" asChild className="ml-4 px-10 py-6 text-lg">
          <Link href="/suggestions">
            <Sparkles className="mr-2 h-5 w-5" /> Get AI Suggestions
          </Link>
        </Button>
      </section>

      <StorySection title="Trending Now" stories={trendingStories} showSeeAll icon={TrendingUp}/>
      <StorySection title="Full-Length Novels" stories={novelStories} showSeeAll />
      <StorySection title="Short Stories & Quick Reads" stories={shortStories} showSeeAll />
      
      {/* Example of another section */}
      {/* <section>
        <h2 className="text-2xl font-semibold mb-4">Editor's Picks</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {curatedStories.slice(0,4).map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
      </section> */}
    </div>
  );
}
