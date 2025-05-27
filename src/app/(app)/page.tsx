
import { StoryCard } from '@/components/story-card';
import type { Story } from '@/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

const mockStories: Story[] = [
  {
    id: '1',
    title: 'The Whispers of Chronos',
    author: 'Eleanor Vance',
    authorId: 'author1',
    coverImage: 'https://placehold.co/300x450/4A90E2/FFFFFF?text=Chronos',
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
    coverImage: 'https://placehold.co/300x450/50E3C2/FFFFFF?text=Canopy',
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
    coverImage: 'https://placehold.co/300x450/F5A623/FFFFFF?text=Moonhaven',
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
    coverImage: 'https://placehold.co/300x450/BD10E0/FFFFFF?text=Void',
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
    coverImage: 'https://placehold.co/300x450/7ED321/FFFFFF?text=Cyber',
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
    coverImage: 'https://placehold.co/300x450/D0021B/FFFFFF?text=Stitch',
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
    coverImage: 'https://placehold.co/300x450/AE4DE8/FFFFFF?text=Clockwork',
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
}

const StorySection: React.FC<StorySectionProps> = ({ title, stories }) => {
  if (stories.length === 0) return null;
  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
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

export default function HomePage() {
  const trendingStories = mockStories.filter(story => story.category === 'Trending');
  const novelStories = mockStories.filter(story => story.category === 'Novel');
  const shortStories = mockStories.filter(story => story.category === 'ShortStory');
  const curatedStories = mockStories.filter(story => story.isCurated && !story.isTrending);


  return (
    <div className="space-y-8">
      <section className="bg-card p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-primary">Welcome to Katha Vault</h1>
          <Button asChild>
            <Link href="/suggestions">
              <Sparkles className="mr-2 h-4 w-4" /> Get Story Suggestions
            </Link>
          </Button>
        </div>
        <p className="text-muted-foreground">
          Discover your next favorite story. Explore curated collections, trending tales, and personalized recommendations.
        </p>
      </section>

      <StorySection title="Trending Stories" stories={trendingStories} />
      <StorySection title="Full-Length Novels" stories={novelStories} />
      <StorySection title="Short Stories" stories={shortStories} />
      <StorySection title="Curated For You" stories={curatedStories} />
      
      {/* Placeholder for "koi di table vegar" - This could be another category or a different type of content display */}
      {/* <section>
        <h2 className="text-2xl font-semibold mb-4">Community Picks</h2>
        <p className="text-muted-foreground">This section is a placeholder for other content types.</p>
      </section> */}
    </div>
  );
}
