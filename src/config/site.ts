import type { NavItem } from '@/types';
import { Home, Library, Search, UserCircle2, UploadCloud, Sparkles, Settings2 } from 'lucide-react';

export const siteConfig = {
  name: 'Katha Vault',
  description: 'A vault for your favorite stories and new adventures.',
  url: 'https://kathavault.example.com', // Replace with your actual URL
  ogImage: 'https://kathavault.example.com/og.jpg', // Replace with your actual OG image
  links: {
    twitter: 'https://twitter.com/kathavault', // Replace with your actual Twitter
    github: 'https://github.com/yourusername/kathavault', // Replace with your actual GitHub
  },
  mainNav: [
    {
      title: 'Home',
      href: '/',
      icon: Home,
    },
    {
      title: 'Library',
      href: '/library',
      icon: Library,
    },
    {
      title: 'Search',
      href: '/search',
      icon: Search,
    },
    {
      title: 'Submit Story',
      href: '/submit',
      icon: UploadCloud,
    },
    {
      title: 'Suggestions',
      href: '/suggestions',
      icon: Sparkles,
    },
    {
      title: 'Account',
      href: '/account',
      icon: UserCircle2,
    },
  ] satisfies NavItem[],
};
