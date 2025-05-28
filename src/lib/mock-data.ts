
import type { Story, UserPost, PostComment } from '@/types';

export const mockStories: Story[] = [
  {
    id: '1',
    title: 'The Whispers of Chronos',
    author: 'Eleanor Vance',
    authorId: 'author1',
    coverImage: 'https://placehold.co/300x450/E62E9A/FFFFFF?text=Chronos',
    description: 'A thrilling journey through time as a historian uncovers a device that can alter history.',
    tags: ['sci-fi', 'time travel', 'adventure'],
    chapters: [
        { id: 'c1_1', title: 'Chapter 1: The Attic Anomaly', content: 'The old grandfather clock in the attic wasn\'t just telling time; it was leaking it...', order: 1 },
        { id: 'c1_2', title: 'Chapter 2: Echoes of Tomorrow', content: 'His first jump was unintentional, a chaotic tumble into a future he barely recognized...', order: 2 },
        { id: 'c1_3', title: 'Chapter 3: The Chronos Protocol', content: 'The organization known only as "Veridian" had been tracking temporal disturbances...', order: 3 },
    ],
    genre: 'Science Fiction',
    status: 'Completed', // Narrative status
    publishedStatus: 'Published', // Publication status
    rating: 4.8,
    views: 25000,
    isTrending: true,
    isCurated: true,
    category: 'Trending',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    dataAihint: "futuristic city"
  },
  {
    id: '2',
    title: 'Beneath the Emerald Canopy',
    author: 'Marcus Stone',
    authorId: 'author2',
    coverImage: 'https://placehold.co/300x450/E62E9A/FFFFFF?text=Canopy',
    description: 'Explorers venture deep into an uncharted jungle, finding more than just exotic flora and fauna.',
    tags: ['fantasy', 'exploration', 'magic'],
    chapters: [
        { id: 'c2_1', title: 'Chapter 1: The Summons', content: 'The Royal Cartographers Guild had a new assignment...', order: 1 },
        { id: 'c2_2', title: 'Chapter 2: Whispers in the Leaves', content: 'The jungle was alive, not just with animals, but with something...else.', order: 2 },
    ],
    genre: 'Fantasy',
    status: 'Ongoing',
    publishedStatus: 'Published',
    rating: 4.5,
    views: 18000,
    isTrending: true,
    category: 'Trending',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    dataAihint: "lush jungle"
  },
  {
    id: '3',
    title: 'The Alchemist of Moonhaven',
    author: 'Seraphina Gold',
    authorId: 'author3',
    coverImage: 'https://placehold.co/300x450/E62E9A/FFFFFF?text=Moonhaven',
    description: 'In a city powered by moonlight, a young alchemist seeks a forbidden truth.',
    tags: ['steampunk', 'mystery', 'alchemy'],
    chapters: [{ id: 'c3_1', title: 'First Transmutation', content: 'The first attempt was a disaster, turning lead into... slightly shinier lead.', order: 1 }],
    genre: 'Steampunk',
    status: 'Completed',
    publishedStatus: 'Published',
    rating: 4.2,
    views: 12000,
    isCurated: true,
    category: 'Novel',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
    dataAihint: "mystical city"
  },
  {
    id: '4',
    title: 'Echoes of the Void',
    author: 'Orion Nebula',
    authorId: 'author4',
    coverImage: 'https://placehold.co/300x450/E62E9A/FFFFFF?text=Void',
    description: 'A lone astronaut confronts an ancient cosmic entity at the edge of known space.',
    tags: ['space opera', 'horror', 'existential'],
    chapters: [{ id: 'c4_1', title: 'The Signal', content: 'The long-range sensors picked up an anomaly unlike anything ever recorded.', order: 1 }],
    genre: 'Space Opera',
    status: 'Ongoing',
    publishedStatus: 'Published', // Changed from Draft for testing display
    rating: 4.9,
    views: 35000,
    isTrending: true,
    isCurated: true,
    category: 'SciFi',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
    dataAihint: "galaxy stars"
  },
];

const mockPostComments: PostComment[] = [
  { id: 'comment1', postId: 'post1', userId: 'user001', username: 'ReaderRiley', avatarUrl: 'https://placehold.co/40x40/8E7CC3/FFFFFF?text=RR', text: "Great point!", timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), dataAihint: "user avatar" },
  { id: 'comment2', postId: 'post1', userId: 'user002', username: 'AuthorAlex', avatarUrl: 'https://placehold.co/40x40/E8A87C/FFFFFF?text=AA', text: "I agree completely.", timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(), dataAihint: "user avatar" },
  { id: 'comment3', postId: 'post2', userId: 'user001', username: 'ReaderRiley', avatarUrl: 'https://placehold.co/40x40/8E7CC3/FFFFFF?text=RR', text: "Interesting thought!", timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(), dataAihint: "user avatar" },
];

export const mockUserPosts: UserPost[] = [
  {
    id: 'post1',
    userId: 'user123', // Corresponds to StorySeeker92
    username: 'StorySeeker92',
    avatarUrl: 'https://placehold.co/40x40/B4317B/F7F2FA?text=SS',
    dataAihint: 'user initial',
    content: "Just finished reading 'The Whispers of Chronos' and my mind is blown! The ending was incredible. Has anyone else read it? What were your theories?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    likes: 152,
    comments: mockPostComments.filter(c => c.postId === 'post1'),
    isTrending: true,
  },
  {
    id: 'post2',
    userId: 'user123',
    username: 'StorySeeker92',
    avatarUrl: 'https://placehold.co/40x40/B4317B/F7F2FA?text=SS',
    dataAihint: 'user initial',
    content: "Looking for recommendations for a good space opera. Something with epic battles and cool alien races. Any suggestions from the Katha Vault community?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    likes: 78,
    comments: mockPostComments.filter(c => c.postId === 'post2'),
  },
  {
    id: 'post3',
    userId: 'user001', // ReaderRiley
    username: 'ReaderRiley',
    avatarUrl: 'https://placehold.co/40x40/8E7CC3/FFFFFF?text=RR',
    dataAihint: 'user avatar',
    content: "What's everyone's favorite genre to read on a rainy day? For me, it's definitely a cozy mystery novel. ☕📚",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    likes: 205,
    comments: [],
    isTrending: true,
  },
  {
    id: 'post4',
    userId: 'user002', // AuthorAlex
    username: 'AuthorAlex',
    avatarUrl: 'https://placehold.co/40x40/E8A87C/FFFFFF?text=AA',
    dataAihint: 'user avatar',
    content: "Working on a new chapter for my steampunk adventure! It's so exciting to see the world come to life. #WritingCommunity #Steampunk",
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    likes: 95,
    comments: [],
  },
];
