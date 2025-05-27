
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';

// New K-in-a-circle SVG logo
const KCircleLogo = ({ className }: { className?: string }) => (
  <svg
    className={cn("h-7 w-7 shrink-0", className)}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    stroke="currentColor" // Will inherit text-primary
    strokeWidth="2.8" // Increased stroke width for a thicker K
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M10.5 17l-2.5-5M10.5 7l-2.5 5" /> {/* Left part of K */}
    <path d="M8 12h5.5" /> {/* Middle part of K */}
    <path d="M13.5 12l2.5 5" /> {/* Top-right part of K's leg */}
    <path d="M13.5 12l2.5-5" /> {/* Bottom-right part of K's leg */}
  </svg>
);


export function Logo({ collapsed, className }: { collapsed?: boolean, className?: string }) {
  return (
    <div className={cn("flex items-center gap-2 text-lg font-semibold text-primary px-2", className)}>
      <KCircleLogo />
      {!collapsed && <span className="truncate">{siteConfig.name}</span>}
    </div>
  );
}
