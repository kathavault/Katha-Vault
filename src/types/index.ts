
export type StoryChapter = {
  id: string;
  title: string;
  content: string; // Can be HTML from rich text editor or plain text
  order: number;
};

export type Story = {
  id: string;
  title: string;
  author: string;
  authorId: string;
  coverImage: string; // Can be a URL or a Data URI string
  description: string;
  tags: string[];
  chapters: StoryChapter[];
  genre: string;
  status: 'Ongoing' | 'Completed';
  publishedStatus: 'Published' | 'Draft' | 'Review';
  rating?: number;
  views?: number;
  isTrending?: boolean;
  isCurated?: boolean;
  category?: 'Trending' | 'Novel' | 'ShortStory' | 'Curated' | 'Romance' | 'SciFi' | 'General' | string;
  createdAt: string;
  updatedAt: string;
  dataAihint?: string;
};

export type PostComment = {
  id: string;
  postId: string; // ID of the UserPost or StoryChapter
  userId: string;
  username: string;
  avatarUrl: string;
  text: string;
  timestamp: string;
  dataAihint?: string;
  likes?: number;
  replies?: PostComment[];
};

export type UserPost = {
  id: string;
  userId: string;
  name?: string; // User's full name
  username: string;
  avatarUrl: string;
  dataAihint?: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: PostComment[];
  isTrending?: boolean;
};

export type UserProfile = {
  id: string;
  name?: string;
  username: string;
  email: string;
  avatarUrl: string; // Can be a URL or a Data URI string
  bio?: string;
  readingHistory: Array<{ storyId: string; title: string; lastReadChapterId?: string; progress?: number }>;
  favorites: string[];
  submittedStories: Array<{ storyId: string; title: string }>;
  userPosts?: UserPost[];
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

export type ChatMessage = {
  id: string;
  senderId: string; // Can be current user's ID, AI's ID, or another user's ID
  text: string;
  timestamp: string;
  isCurrentUser?: boolean; // This might be redundant if comparing senderId with current user ID
};

export type ChatUser = {
  id: string;
  username: string;
  avatarUrl: string;
  dataAihint?: string;
};

export type ChatConversation = {
  id: string; // e.g., 'convoWithAi' or 'convoWith_userId123'
  participant: ChatUser;
  lastMessage: string;
  lastMessageTimestamp: string;
  unreadCount?: number;
  messages: ChatMessage[];
  isAiChat?: boolean; // To distinguish AI chat from user chats
};
