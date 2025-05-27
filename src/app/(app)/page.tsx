
import { StoryCard } from '@/components/story-card';
import type { Story } from '@/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Sparkles, TrendingUp, Heart, Atom, ChevronRight } from 'lucide-react';
import { mockStories } from '@/lib/mock-data'; // Import shared mock data

interface StorySectionProps {
  title: string;
  stories: Story[];
  showSeeAll?: boolean;
  icon?: React.ElementType;
  categorySlug?: string;
}

const StorySection: React.FC<StorySectionProps> = ({ title, stories, showSeeAll = false, icon: Icon, categorySlug }) => {
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
            <Link href={`/library?category=${categorySlug || title.toLowerCase().replace(/\s+/g, '-')}`}>
              See All <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        )}
      </div>
      <div className="flex overflow-x-auto space-x-4 pb-4 -mx-1 px-1">
        {stories.map((story) => (
          <div key={story.id} className="flex-shrink-0 w-64 sm:w-72">
            <StoryCard story={story} />
          </div>
        ))}
         {stories.length === 0 && <p className="text-muted-foreground">No stories in this section yet.</p>}
      </div>
    </section>
  );
};


export default function HomePage() {
  const publishedStories = mockStories.filter(story => story.publishedStatus === 'Published');

  const trendingStories = publishedStories.filter(story => story.category === 'Trending');
  const novelStories = publishedStories.filter(story => story.category === 'Novel');
  const shortStories = publishedStories.filter(story => story.category === 'ShortStory');
  const romanceStories = publishedStories.filter(story => story.category === 'Romance');
  const scifiStories = publishedStories.filter(story => story.category === 'SciFi');


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
          <Link href="/chat">
            <Sparkles className="mr-2 h-5 w-5" /> Get AI Assistance
          </Link>
        </Button>
      </section>

      <StorySection title="Trending Now" stories={trendingStories} showSeeAll icon={TrendingUp} categorySlug="trending"/>
      <StorySection title="Full-Length Novels" stories={novelStories} showSeeAll categorySlug="novel"/>
      <StorySection title="Short Stories & Quick Reads" stories={shortStories} showSeeAll categorySlug="shortstory"/>
      <StorySection title="Romance Reads" stories={romanceStories} showSeeAll icon={Heart} categorySlug="romance"/>
      <StorySection title="Sci-Fi Adventures" stories={scifiStories} showSeeAll icon={Atom} categorySlug="scifi"/>
      
    </div>
  );
}
