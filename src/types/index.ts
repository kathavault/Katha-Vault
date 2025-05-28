
export type StoryChapter = {
  id: string;
  title: string;
  content: string; // HTML or plain text
  order: number;
  // chapterImageUrl?: string; // Optional: if you want small images per chapter
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
  status: 'Ongoing' | 'Completed'; // Narrative status
  publishedStatus: 'Published' | 'Draft' | 'Review'; // Admin publication status
  rating?: number;
  views?: number;
  isTrending?: boolean;
  isCurated?: boolean;
  category?: 'Trending' | 'Novel' | 'ShortStory' | 'Curated' | 'Romance' | 'SciFi' | string; // Made category more flexible
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
  dataAihint?: string; // Optional for StoryCard and other images
};

export type PostComment = {
  id: string;
  postId: string;
  userId: string;
  username: string;
  avatarUrl: string;
  text: string;
  timestamp: string; // ISO Date string
  dataAihint?: string;
  likes?: number; // Added for UI simulation
  replies?: PostComment[]; // Added for UI simulation
};

export type UserPost = {
  id: string;
  userId: string;
  username: string;
  avatarUrl: string;
  dataAihint?: string;
  content: string;
  timestamp: string; // ISO Date string
  likes: number;
  comments: PostComment[];
  isTrending?: boolean; // For library section
};

export type UserProfile = {
  id: string;
  username: string;
  email: string;
  avatarUrl: string;
  bio?: string;
  readingHistory: Array<{ storyId: string; title: string; lastReadChapterId?: string; progress?: number }>;
  favorites: string[]; // Array of story IDs
  submittedStories: Array<{ storyId: string; title: string }>; // Kept for admin mock data compatibility, but not used by users
  userPosts?: UserPost[]; // User's own text posts
  followers?: number;
  following?: number;
};

export type NavItem = {
  title: string;
  href: string;
  icon: React.ElementType;
  label?: string;
  disabled?: boolean;
  external?: boolean;
};

// Chat specific types
export type ChatMessage = {
  id: string;
  senderId: string;
  text: string;
  timestamp: string; // ISO string
  isCurrentUser?: boolean; // Helper for styling
};

export type ChatUser = {
  id: string;
  username: string;
  avatarUrl: string;
  dataAihint?: string; // Optional hint for AI image generation if needed
};

export type ChatConversation = {
  id: string;
  participant: ChatUser;
  lastMessage: string;
  lastMessageTimestamp: string; // ISO string
  unreadCount?: number;
  messages: ChatMessage[];
};
