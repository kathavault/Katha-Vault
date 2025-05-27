import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils'; // Added this import

// New X-in-a-circle SVG logo
const XCircleLogo = ({ className }: { className?: string }) => (
  <svg 
    className={cn("h-7 w-7 shrink-0", className)} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    stroke="currentColor" // Will inherit text-primary
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
);


export function Logo({ collapsed } : { collapsed?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-primary px-2">
      <XCircleLogo />
      {!collapsed && <span className="truncate">{siteConfig.name}</span>}
    </Link>
  );
}
