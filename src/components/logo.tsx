import { BookHeart } from 'lucide-react';
import Link from 'next/link';
import { siteConfig } from '@/config/site';

export function Logo({ collapsed } : { collapsed?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-primary px-2">
      <BookHeart className="h-7 w-7 shrink-0" />
      {!collapsed && <span className="truncate">{siteConfig.name}</span>}
    </Link>
  );
}
