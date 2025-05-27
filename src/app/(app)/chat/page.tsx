
"use client";

import { useState, useEffect, useRef } from 'react';
import type { ChatConversation, ChatMessage, ChatUser } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, SendHorizontal, Paperclip, Smile, Search as SearchIcon } from 'lucide-react';
import { format, formatDistanceToNowStrict } from 'date-fns';

const mockCurrentUser: ChatUser = {
  id: 'currentUser',
  username: 'StorySeeker92',
  avatarUrl: 'https://placehold.co/40x40/E62E9A/FFFFFF?text=ME',
};

const mockOtherUsers: ChatUser[] = [
  { id: 'user1', username: 'BookwormAlice', avatarUrl: 'https://placehold.co/40x40/A1C9F1/FFFFFF?text=BA' },
  { id: 'user2', username: 'NovelNinja', avatarUrl: 'https://placehold.co/40x40/F5D28C/000000?text=NN' },
  { id: 'user3', username: 'PageTurnerPete', avatarUrl: 'https://placehold.co/40x40/82E0AA/FFFFFF?text=PP' },
];

const initialConversationsData: ChatConversation[] = [
  {
    id: 'convo1',
    participant: mockOtherUsers[0],
    lastMessage: "You totally should! The time travel part is so well done.",
    lastMessageTimestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 mins ago
    unreadCount: 2,
    messages: [
      { id: 'msg1a', senderId: mockOtherUsers[0].id, text: "Hey, did you read 'The Whispers of Chronos' yet? It's amazing!", timestamp: new Date(Date.now() - 1000 * 60 * 7).toISOString() },
      { id: 'msg1b', senderId: mockCurrentUser.id, text: "Not yet, but it's on my list! Heard great things.", timestamp: new Date(Date.now() - 1000 * 60 * 6).toISOString() },
      { id: 'msg1c', senderId: mockOtherUsers[0].id, text: "You totally should! The time travel part is so well done.", timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
    ],
  },
  {
    id: 'convo2',
    participant: mockOtherUsers[1],
    lastMessage: "Sure, I can send it over. Which format do you prefer?",
    lastMessageTimestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    unreadCount: 0,
    messages: [
      { id: 'msg2a', senderId: mockCurrentUser.id, text: "Hi Ninja, do you have a copy of 'Beneath the Emerald Canopy' to share?", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2 - 1000 * 60 * 5).toISOString() },
      { id: 'msg2b', senderId: mockOtherUsers[1].id, text: "Sure, I can send it over. Which format do you prefer?", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
    ],
  },
   {
    id: 'convo3',
    participant: mockOtherUsers[2],
    lastMessage: "Haha, true! The ending was a bit rushed though.",
    lastMessageTimestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    messages: [
      { id: 'msg3a', senderId: mockOtherUsers[2].id, text: "Just finished 'The Alchemist of Moonhaven'. What a ride!", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 - 1000*60*10).toISOString() },
      { id: 'msg3b', senderId: mockCurrentUser.id, text: "Oh nice! I loved the steampunk elements in that one.", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 - 1000*60*5).toISOString() },
      { id: 'msg3c', senderId: mockOtherUsers[2].id, text: "Haha, true! The ending was a bit rushed though.", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
    ],
  },
];

export default function ChatPage() {
  const [conversations, setConversations] = useState<ChatConversation[]>(initialConversationsData);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(initialConversationsData[0]?.id || null);
  const [currentMessage, setCurrentMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const selectedConversation = conversations.find(c => c.id === selectedConversationId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [selectedConversation?.messages]);

  const handleSendMessage = () => {
    if (!currentMessage.trim() || !selectedConversation) return;

    const newMessage: ChatMessage = {
      id: `msg${Date.now()}`,
      senderId: mockCurrentUser.id,
      text: currentMessage.trim(),
      timestamp: new Date().toISOString(),
    };

    setConversations(prevConvos =>
      prevConvos.map(convo =>
        convo.id === selectedConversation.id
          ? {
              ...convo,
              messages: [...convo.messages, newMessage],
              lastMessage: newMessage.text,
              lastMessageTimestamp: newMessage.timestamp,
            }
          : convo
      )
    );
    setCurrentMessage('');
  };
  
  const formatTimestamp = (isoString: string) => {
    try {
      return formatDistanceToNowStrict(new Date(isoString), { addSuffix: true });
    } catch (error) {
      return 'Invalid date';
    }
  };


  return (
    <div className="flex h-[calc(100vh-var(--header-height,100px))] border rounded-lg shadow-lg bg-card">
      {/* Conversations Sidebar */}
      <aside className="w-1/3 border-r flex flex-col">
        <CardHeader className="p-4 border-b">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl">Chats</CardTitle>
            <Button variant="ghost" size="icon">
              <MessageSquare className="h-5 w-5" />
              <span className="sr-only">New Message</span>
            </Button>
          </div>
          <div className="relative mt-2">
            <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search chats..." className="pl-8 h-9" />
          </div>
        </CardHeader>
        <ScrollArea className="flex-grow">
          {conversations.map(convo => (
            <Button
              key={convo.id}
              variant={selectedConversationId === convo.id ? "secondary" : "ghost"}
              className="w-full h-auto justify-start p-3 rounded-none border-b"
              onClick={() => setSelectedConversationId(convo.id)}
            >
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src={convo.participant.avatarUrl} alt={convo.participant.username} data-ai-hint="user avatar"/>
                <AvatarFallback>{convo.participant.username.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-grow text-left overflow-hidden">
                <div className="flex justify-between items-center">
                  <p className="font-semibold truncate">{convo.participant.username}</p>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatTimestamp(convo.lastMessageTimestamp)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground truncate">{convo.lastMessage}</p>
                  {convo.unreadCount && convo.unreadCount > 0 ? (
                     <Badge variant="default" className="h-5 px-1.5 text-xs">{convo.unreadCount}</Badge>
                  ) : null}
                </div>
              </div>
            </Button>
          ))}
        </ScrollArea>
      </aside>

      {/* Message View */}
      <main className="w-2/3 flex flex-col bg-background">
        {selectedConversation ? (
          <>
            <CardHeader className="p-4 border-b flex flex-row items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={selectedConversation.participant.avatarUrl} alt={selectedConversation.participant.username} data-ai-hint="user avatar chat"/>
                <AvatarFallback>{selectedConversation.participant.username.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-lg">{selectedConversation.participant.username}</p>
                <p className="text-xs text-muted-foreground">Online</p> {/* Placeholder status */}
              </div>
            </CardHeader>
            
            <ScrollArea className="flex-grow p-4 space-y-4">
              {selectedConversation.messages.map(msg => {
                const isCurrentUserMsg = msg.senderId === mockCurrentUser.id;
                return (
                  <div key={msg.id} className={`flex items-end gap-2 ${isCurrentUserMsg ? 'justify-end' : 'justify-start'}`}>
                    {!isCurrentUserMsg && (
                      <Avatar className="h-8 w-8 self-start">
                         <AvatarImage src={selectedConversation.participant.avatarUrl} alt={selectedConversation.participant.username} data-ai-hint="user avatar small"/>
                         <AvatarFallback>{selectedConversation.participant.username.substring(0,1)}</AvatarFallback>
                      </Avatar>
                    )}
                    <div className={`max-w-[70%] p-3 rounded-xl ${isCurrentUserMsg ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-muted text-muted-foreground rounded-bl-none'}`}>
                      <p className="text-sm">{msg.text}</p>
                      <p className={`text-xs mt-1 ${isCurrentUserMsg ? 'text-primary-foreground/70 text-right' : 'text-muted-foreground/70 text-left'}`}>
                        {format(new Date(msg.timestamp), 'p')}
                      </p>
                    </div>
                     {isCurrentUserMsg && (
                      <Avatar className="h-8 w-8 self-start">
                         <AvatarImage src={mockCurrentUser.avatarUrl} alt={mockCurrentUser.username} data-ai-hint="current user avatar"/>
                         <AvatarFallback>{mockCurrentUser.username.substring(0,1)}</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </ScrollArea>

            <div className="p-4 border-t bg-background">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                  <Paperclip className="h-5 w-5" />
                  <span className="sr-only">Attach file</span>
                </Button>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                  <Smile className="h-5 w-5" />
                  <span className="sr-only">Add emoji</span>
                </Button>
                <Input
                  placeholder="Type a message..."
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-grow"
                />
                <Button size="icon" onClick={handleSendMessage} disabled={!currentMessage.trim()}>
                  <SendHorizontal className="h-5 w-5" />
                  <span className="sr-only">Send message</span>
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-grow flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <MessageSquare className="h-16 w-16 mx-auto mb-4" />
              <p className="text-lg">Select a chat to start messaging</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// Helper to define header height CSS variable (for calc in h-[calc(...)])
// This would typically be in globals.css or a layout component,
// but for a standalone page, we can ensure the class is used.
// Assuming a header height of approx 60px from layout. Add this to main element style or globals
// For this example, I'm using a placeholder var --header-height, which should be defined in globals or a parent layout.
// Defaulting to 100px if not set, can be adjusted.
// The class h-[calc(100vh-var(--header-height,100px))] in the main div handles this.
// The actual AppLayout provides h-14 or h-[60px] for the header.
// So, this chat page will take full height below the main app header.
// No explicit header height var needed here if it's a child of AppLayout.

