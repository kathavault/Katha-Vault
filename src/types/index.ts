
export type StoryChapter = {
  id: string;
  title: string;
  content: string; // Markdown or plain text
  order: number;
};

export type Story = {
  id: string;
  title: string;
  author: string;
  authorId: string;
  coverImage: string;
  description: string;
  tags: string[];
  chapters: StoryChapter[];
  genre: string;
  status: 'Ongoing' | 'Completed';
  rating?: number; 
  views?: number;
  isTrending?: boolean;
  isCurated?: boolean;
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
};

export type UserProfile = {
  id: string;
  username: string;
  email: string;
  avatarUrl: string;
  bio?: string;
  readingHistory: Array<{ storyId: string; title: string; lastReadChapterId?: string; progress?: number }>;
  favorites: string[]; // Array of story IDs
  submittedStories: Array<{ storyId: string; title: string }>;
};

export type NavItem = {
  title: string;
  href: string;
  icon: React.ElementType;
  label?: string;
  disabled?: boolean;
  external?: boolean;
};
