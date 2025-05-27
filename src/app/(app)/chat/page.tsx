
"use client";

import { useState, useEffect, useRef } from 'react';
import type { ChatConversation, ChatMessage, ChatUser } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, SendHorizontal, Smile, Search as SearchIcon, Loader2 } from 'lucide-react';
import { format, formatDistanceToNowStrict } from 'date-fns';
import { kathaVaultAiChat, type KathaVaultAiInput, type KathaVaultAiOutput } from '@/ai/flows/katha-vault-ai-flow';

const mockCurrentUser: ChatUser = {
  id: 'currentUser',
  username: 'StorySeeker92',
  avatarUrl: 'https://placehold.co/40x40/E62E9A/FFFFFF?text=ME',
  dataAihint: 'user initial',
};

const kathaVaultAiUser: ChatUser = {
  id: 'kathaVaultAi',
  username: 'Katha Vault AI',
  avatarUrl: 'https://placehold.co/40x40/8A2BE2/FFFFFF?text=KV', // Purple avatar for AI, KV initials
  dataAihint: 'brand logo K', // Updated data-ai-hint
};

const generateInitialConversationsData = (): ChatConversation[] => [
  {
    id: 'convoWithAi',
    participant: kathaVaultAiUser,
    lastMessage: "Hello! How can I help you with Katha Vault stories today?",
    lastMessageTimestamp: new Date().toISOString(),
    unreadCount: 0,
    messages: [
      { id: 'aiMsg1', senderId: kathaVaultAiUser.id, text: "Hello! How can I help you with Katha Vault stories today? You can ask me about novels on the site or for suggestions. I can chat in English or Hindi!", timestamp: new Date().toISOString() },
    ],
  },
];

export default function ChatPage() {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoadingInitialData, setIsLoadingInitialData] = useState(true);
  const [isAiResponding, setIsAiResponding] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mockData = generateInitialConversationsData();
    setConversations(mockData);
    if (mockData.length > 0) {
      setSelectedConversationId(mockData[0].id);
    }
    setIsLoadingInitialData(false);
  }, []);

  const selectedConversation = conversations.find(c => c.id === selectedConversationId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [selectedConversation?.messages]);

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || !selectedConversation) return;

    const userMessage: ChatMessage = {
      id: `msgUser${Date.now()}`,
      senderId: mockCurrentUser.id,
      text: currentMessage.trim(),
      timestamp: new Date().toISOString(),
    };

    // Optimistically update UI with user's message
    setConversations(prevConvos =>
      prevConvos.map(convo =>
        convo.id === selectedConversation.id
          ? {
              ...convo,
              messages: [...convo.messages, userMessage],
              lastMessage: userMessage.text,
              lastMessageTimestamp: userMessage.timestamp,
            }
          : convo
      )
    );
    const userInput = currentMessage.trim();
    setCurrentMessage(''); // Clear input after sending
    
    if (selectedConversation.participant.id === kathaVaultAiUser.id) {
      setIsAiResponding(true);
      setAiError(null);
      try {
        const aiResult: KathaVaultAiOutput = await kathaVaultAiChat({ userInput });
        const aiMessage: ChatMessage = {
          id: `msgAi${Date.now()}`,
          senderId: kathaVaultAiUser.id,
          text: aiResult.aiResponse,
          timestamp: new Date().toISOString(),
        };
        setConversations(prevConvos =>
          prevConvos.map(convo =>
            convo.id === selectedConversation.id
              ? {
                  ...convo,
                  messages: [...convo.messages, aiMessage],
                  lastMessage: aiMessage.text.substring(0, 50) + (aiMessage.text.length > 50 ? "..." : ""), // Truncate for last message preview
                  lastMessageTimestamp: aiMessage.timestamp,
                }
              : convo
          )
        );
      } catch (error) {
        console.error("Error fetching AI response:", error);
        setAiError("Sorry, I couldn't process that. Please try again.");
        const errorMessage: ChatMessage = {
            id: `msgErr${Date.now()}`,
            senderId: kathaVaultAiUser.id,
            text: "Sorry, I encountered an error. Please try asking something else.",
            timestamp: new Date().toISOString(),
          };
        setConversations(prevConvos =>
          prevConvos.map(convo =>
            convo.id === selectedConversation.id
              ? { ...convo, messages: [...convo.messages, errorMessage] }
              : convo
          )
        );
      } finally {
        setIsAiResponding(false);
      }
    }
  };
  
  const formatDisplayTimestamp = (isoString: string) => {
    try {
      return formatDistanceToNowStrict(new Date(isoString), { addSuffix: true });
    } catch (error) {
      return 'Invalid date';
    }
  };


  if (isLoadingInitialData) {
    return (
      <div className="flex h-[calc(100vh-var(--header-height,100px))] items-center justify-center border rounded-lg shadow-lg bg-card">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="ml-3 text-lg text-muted-foreground">Loading chats...</p>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-var(--header-height,100px))] border rounded-lg shadow-lg bg-card">
      {/* Conversations Sidebar */}
      <aside className="w-1/3 border-r flex flex-col">
        <CardHeader className="p-4 border-b">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl">Chats</CardTitle>
            {/* Removed new message button as AI is the only chat for now */}
          </div>
          <div className="relative mt-2">
            <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search chats..." className="pl-8 h-9" disabled />
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
                <AvatarImage src={convo.participant.avatarUrl} alt={convo.participant.username} data-ai-hint={convo.participant.dataAihint || "user avatar"}/>
                <AvatarFallback>{convo.participant.username.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-grow text-left overflow-hidden">
                <div className="flex justify-between items-center">
                  <p className="font-semibold truncate">{convo.participant.username}</p>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatDisplayTimestamp(convo.lastMessageTimestamp)}
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
            <CardHeader className="p-4 border-b flex flex-row items-center justify-between space-x-3">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={selectedConversation.participant.avatarUrl} alt={selectedConversation.participant.username} data-ai-hint={selectedConversation.participant.dataAihint || "user avatar chat"}/>
                  <AvatarFallback>{selectedConversation.participant.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-lg">{selectedConversation.participant.username}</p>
                  {selectedConversation.participant.id === kathaVaultAiUser.id && (
                    <p className="text-xs text-muted-foreground">AI Assistant</p>
                  )}
                </div>
              </div>
              {/* Removed dropdown menu for AI chat */}
            </CardHeader>
            
            <ScrollArea className="flex-grow p-4 space-y-4">
              {selectedConversation.messages.map(msg => {
                const isCurrentUserMsg = msg.senderId === mockCurrentUser.id;
                const participantToDisplay = isCurrentUserMsg ? mockCurrentUser : selectedConversation.participant;
                return (
                  <div key={msg.id} className={`flex items-end gap-2 ${isCurrentUserMsg ? 'justify-end' : 'justify-start'}`}>
                    {!isCurrentUserMsg && (
                      <Avatar className="h-8 w-8 self-start">
                         <AvatarImage src={participantToDisplay.avatarUrl} alt={participantToDisplay.username} data-ai-hint={participantToDisplay.dataAihint || "user avatar small"}/>
                         <AvatarFallback>{participantToDisplay.username.substring(0,1)}</AvatarFallback>
                      </Avatar>
                    )}
                    <div className={`max-w-[70%] p-3 rounded-xl ${isCurrentUserMsg ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-muted text-muted-foreground rounded-bl-none'}`}>
                      <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                      <p className={`text-xs mt-1 ${isCurrentUserMsg ? 'text-primary-foreground/70 text-right' : 'text-muted-foreground/70 text-left'}`}>
                        {format(new Date(msg.timestamp), 'p')}
                      </p>
                    </div>
                     {isCurrentUserMsg && (
                      <Avatar className="h-8 w-8 self-start">
                         <AvatarImage src={participantToDisplay.avatarUrl} alt={participantToDisplay.username} data-ai-hint={participantToDisplay.dataAihint || "current user avatar"}/>
                         <AvatarFallback>{participantToDisplay.username.substring(0,1)}</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                );
              })}
              {isAiResponding && (
                <div className="flex items-end gap-2 justify-start">
                    <Avatar className="h-8 w-8 self-start">
                        <AvatarImage src={kathaVaultAiUser.avatarUrl} alt={kathaVaultAiUser.username} data-ai-hint="brand logo K small"/>
                        <AvatarFallback>{kathaVaultAiUser.username.substring(0,1)}</AvatarFallback>
                    </Avatar>
                    <div className="max-w-[70%] p-3 rounded-xl bg-muted text-muted-foreground rounded-bl-none">
                        <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                </div>
              )}
              {aiError && (
                 <div className="flex items-end gap-2 justify-start">
                    <Avatar className="h-8 w-8 self-start">
                        <AvatarImage src={kathaVaultAiUser.avatarUrl} alt={kathaVaultAiUser.username} />
                        <AvatarFallback>{kathaVaultAiUser.username.substring(0,1)}</AvatarFallback>
                    </Avatar>
                    <div className="max-w-[70%] p-3 rounded-xl bg-destructive/20 text-destructive-foreground rounded-bl-none">
                        <p className="text-sm">{aiError}</p>
                    </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </ScrollArea>

            <div className="p-4 border-t bg-background">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                  <Smile className="h-5 w-5" />
                  <span className="sr-only">Add emoji</span>
                </Button>
                <Input
                  placeholder="Type a message..."
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !isAiResponding && handleSendMessage()}
                  className="flex-grow"
                  disabled={isAiResponding}
                />
                <Button size="icon" onClick={handleSendMessage} disabled={!currentMessage.trim() || isAiResponding}>
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
              <p className="text-sm">Or, if no chats loaded, something went wrong.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

