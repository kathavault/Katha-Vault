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
    coverImage: 'https://placehold.co/300x450/B4317B/F7F2FA?text=Chronos',
    description: 'A thrilling journey through time as a historian uncovers a device that can alter history.',
    tags: ['sci-fi', 'time travel', 'adventure'],
    chapters: [{ id: 'c1', title: 'The Discovery', content: '...', order: 1 }],
    genre: 'Science Fiction',
    status: 'Completed',
    rating: 4.8,
    views: 25000,
    isTrending: true,
    isCurated: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    dataAihint: "futuristic city"
  },
  {
    id: '2',
    title: 'Beneath the Emerald Canopy',
    author: 'Marcus Stone',
    authorId: 'author2',
    coverImage: 'https://placehold.co/300x450/B4317B/F7F2FA?text=Canopy',
    description: 'Explorers venture deep into an uncharted jungle, finding more than just exotic flora and fauna.',
    tags: ['fantasy', 'exploration', 'magic'],
    chapters: [{ id: 'c1', title: 'The Summons', content: '...', order: 1 }],
    genre: 'Fantasy',
    status: 'Ongoing',
    rating: 4.5,
    views: 18000,
    isTrending: true,
    isCurated: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    dataAihint: "lush jungle"
  },
  {
    id: '3',
    title: 'The Alchemist of Moonhaven',
    author: 'Seraphina Gold',
    authorId: 'author3',
    coverImage: 'https://placehold.co/300x450/B4317B/F7F2FA?text=Moonhaven',
    description: 'In a city powered by moonlight, a young alchemist seeks a forbidden truth.',
    tags: ['steampunk', 'mystery', 'alchemy'],
    chapters: [{ id: 'c1', title: 'First Transmutation', content: '...', order: 1 }],
    genre: 'Steampunk',
    status: 'Completed',
    rating: 4.2,
    views: 12000,
    isTrending: false,
    isCurated: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
    dataAihint: "mystical city"
  },
    {
    id: '4',
    title: 'Echoes of the Void',
    author: 'Orion Nebula',
    authorId: 'author4',
    coverImage: 'https://placehold.co/300x450/B4317B/F7F2FA?text=Void',
    description: 'A lone astronaut confronts an ancient cosmic entity at the edge of known space.',
    tags: ['space opera', 'horror', 'existential'],
    chapters: [{ id: 'c1', title: 'The Signal', content: '...', order: 1 }],
    genre: 'Space Opera',
    status: 'Ongoing',
    rating: 4.9,
    views: 35000,
    isTrending: true,
    isCurated: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
    dataAihint: "galaxy stars"
  },
];

export default function HomePage() {
  const curatedStories = mockStories.filter(story => story.isCurated);
  const trendingStories = mockStories.filter(story => story.isTrending);

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

      <section>
        <h2 className="text-2xl font-semibold mb-4">Curated For You</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {curatedStories.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Trending Stories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {trendingStories.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
      </section>
    </div>
  );
}
