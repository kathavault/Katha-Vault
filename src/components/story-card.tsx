import type { Story } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Star, BookOpen } from 'lucide-react';

interface StoryCardProps {
  story: Story & { dataAihint?: string };
}

export function StoryCard({ story }: StoryCardProps) {
  return (
    <Link href={`/read/${story.id}`} className="block group">
      <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 ease-in-out group-hover:shadow-2xl group-hover:border-primary">
        <CardHeader className="p-0 relative">
          <Image
            src={story.coverImage}
            alt={story.title}
            width={300}
            height={450}
            className="object-cover w-full h-64 sm:h-72 md:h-80 transition-transform duration-300 ease-in-out group-hover:scale-105"
            data-ai-hint={story.dataAihint || "book cover"}
          />
          {story.isTrending && (
            <Badge variant="destructive" className="absolute top-2 right-2 bg-primary/90 text-primary-foreground">Trending</Badge>
          )}
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <CardTitle className="text-lg font-semibold mb-1 group-hover:text-primary truncate">
            {story.title}
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground mb-2">
            By {story.author}
          </CardDescription>
          <p className="text-xs text-muted-foreground/80 line-clamp-3 mb-2">
            {story.description}
          </p>
          <div className="flex flex-wrap gap-1 mb-2">
            {story.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter className="p-4 border-t">
          <div className="flex items-center justify-between w-full text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-400" />
              <span>{story.rating?.toFixed(1) || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span>{story.views ? (story.views / 1000).toFixed(1) + 'k' : 'N/A'}</span>
            </div>
             <div className="flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              <span>{story.genre}</span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
