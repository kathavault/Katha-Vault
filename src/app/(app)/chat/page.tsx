
"use client";

import { useState, useEffect, useRef, ChangeEvent, FormEvent } from 'react';
import type { ChatConversation, ChatMessage, ChatUser, UserProfile } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, SendHorizontal, Smile, Search as SearchIcon, Loader2, Pencil, Save, MoreVertical, Trash2, Eraser } from 'lucide-react';
import { format, formatDistanceToNowStrict } from 'date-fns';
import { kathaVaultAiChat, type KathaVaultAiInput, type KathaVaultAiOutput } from '@/ai/flows/katha-vault-ai-flow';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { toast } from '@/hooks/use-toast';
import { cn } from "@/lib/utils";

const mockCurrentUser: ChatUser = {
  id: 'currentUser', 
  username: 'StorySeeker92',
  avatarUrl: 'https://placehold.co/40x40/E62E9A/FFFFFF?text=ME',
  dataAihint: 'user initial',
};

const kathaVaultAiUser: ChatUser = {
  id: 'kathaVaultAi',
  username: 'Katha Vault AI',
  avatarUrl: 'https://placehold.co/40x40/8A2BE2/FFFFFF?text=KV',
  dataAihint: 'brand logo K',
};

const generateInitialConversationsData = (customAiName?: string | null, customAiAvatar?: string | null): ChatConversation[] => [
  {
    id: 'convoWithAi',
    participant: {
      ...kathaVaultAiUser,
      username: customAiName || kathaVaultAiUser.username,
      avatarUrl: customAiAvatar || kathaVaultAiUser.avatarUrl,
    },
    lastMessage: "Hello! How can I help you with Katha Vault stories today?",
    lastMessageTimestamp: new Date().toISOString(),
    unreadCount: 0,
    messages: [
      { id: 'aiMsg1', senderId: kathaVaultAiUser.id, text: "Hello! How can I help you with Katha Vault stories today? You can ask me about novels on the site or for suggestions. I can chat in English or Hindi! Feel free to use emojis where appropriate to make our chat more engaging. My goal is to be a friendly and helpful companion for users exploring Katha Vault.", timestamp: new Date().toISOString() },
    ],
    isAiChat: true,
  },
];

const initialActiveUsersList: ChatUser[] = [ // Renamed to avoid conflict
  kathaVaultAiUser,
];


export default function ChatPage() {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoadingInitialData, setIsLoadingInitialData] = useState(true);
  const [isAiResponding, setIsAiResponding] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const [aiCustomNickname, setAiCustomNickname] = useState<string>('');
  const [aiCustomAvatarDataUri, setAiCustomAvatarDataUri] = useState<string>('');
  const [isEditingAiProfile, setIsEditingAiProfile] = useState(false);
  const [tempNickname, setTempNickname] = useState('');
  const [tempAvatarDataUri, setTempAvatarDataUri] = useState<string>('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const [conversationToClear, setConversationToClear] = useState<string | null>(null);
  const [conversationToDelete, setConversationToDelete] = useState<string | null>(null);
  const [messageToDeleteId, setMessageToDeleteId] = useState<string | null>(null);

  const [activeUsers, setActiveUsers] = useState<ChatUser[]>([]);
  const [currentLoggedInUser, setCurrentLoggedInUser] = useState<UserProfile | null>(null);
  const [chatSearchTerm, setChatSearchTerm] = useState(''); // New state for chat search

  useEffect(() => {
    let loggedInUserProfile: UserProfile | null = null;
    if (typeof window !== 'undefined') {
      const storedProfile = localStorage.getItem('userProfileData');
      if (storedProfile) {
        try {
          loggedInUserProfile = JSON.parse(storedProfile);
          setCurrentLoggedInUser(loggedInUserProfile);
          mockCurrentUser.id = loggedInUserProfile?.id || 'currentUser';
          mockCurrentUser.username = loggedInUserProfile?.username || 'StorySeeker92';
          mockCurrentUser.avatarUrl = loggedInUserProfile?.avatarUrl || 'https://placehold.co/40x40/E62E9A/FFFFFF?text=ME';
        } catch (e) {
          console.error("Failed to parse user profile for chat page", e);
        }
      }

      const storedNickname = localStorage.getItem('kathaAiNickname');
      const storedAvatarDataUri = localStorage.getItem('kathaAiAvatarDataUri');
      if (storedNickname) setAiCustomNickname(storedNickname);
      if (storedAvatarDataUri) setAiCustomAvatarDataUri(storedAvatarDataUri);

      let initialConvos = generateInitialConversationsData(storedNickname, storedAvatarDataUri);

      const chatToInitiateJson = localStorage.getItem('initiateChatWithUser');
      if (chatToInitiateJson) {
        try {
          const userToChatWith: ChatUser = JSON.parse(chatToInitiateJson);
          localStorage.removeItem('initiateChatWithUser'); 

          if (!initialConvos.find(c => c.participant.id === userToChatWith.id)) {
            const newConversation: ChatConversation = {
              id: `convoWith_${userToChatWith.id}`,
              participant: userToChatWith,
              lastMessage: "Chat started.",
              lastMessageTimestamp: new Date().toISOString(),
              unreadCount: 0,
              messages: [],
              isAiChat: false,
            };
            initialConvos = [newConversation, ...initialConvos];
            setSelectedConversationId(newConversation.id);
          } else {
            setSelectedConversationId(initialConvos.find(c => c.participant.id === userToChatWith.id)!.id);
          }
        } catch (e) {
          console.error("Error initiating chat from localStorage", e);
        }
      }
      
      setConversations(initialConvos);
      if (!selectedConversationId && initialConvos.length > 0) {
        setSelectedConversationId(initialConvos[0].id);
      }
      
      const updatedActiveUsers = initialActiveUsersList.map(user =>
        user.id === kathaVaultAiUser.id
        ? { ...user, username: storedNickname || kathaVaultAiUser.username, avatarUrl: storedAvatarDataUri || kathaVaultAiUser.avatarUrl }
        : user
      );
      setActiveUsers(updatedActiveUsers);
    }
    setIsLoadingInitialData(false);
  }, []); 

  useEffect(() => {
    const updatedAiUserName = aiCustomNickname || kathaVaultAiUser.username;
    const updatedAiAvatarUrl = aiCustomAvatarDataUri || kathaVaultAiUser.avatarUrl;

    setConversations(prevConvos =>
      prevConvos.map(convo =>
        convo.participant.id === kathaVaultAiUser.id
        ? { ...convo, participant: { ...convo.participant, username: updatedAiUserName, avatarUrl: updatedAiAvatarUrl } }
        : convo
      )
    );
    setActiveUsers(prevActiveUsers =>
      prevActiveUsers.map(user =>
        user.id === kathaVaultAiUser.id
        ? { ...user, username: updatedAiUserName, avatarUrl: updatedAiAvatarUrl }
        : user
      )
    );
  }, [aiCustomNickname, aiCustomAvatarDataUri]);


  const selectedConversation = conversations.find(c => c.id === selectedConversationId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [selectedConversation?.messages]);

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || !selectedConversation) return;
    if (!currentLoggedInUser) {
        toast({title: "Not Logged In", description: "Please log in to send messages.", variant: "destructive"});
        return;
    }

    const userMessage: ChatMessage = {
      id: `msgUser${Date.now()}`,
      senderId: currentLoggedInUser.id,
      text: currentMessage.trim(),
      timestamp: new Date().toISOString(),
    };

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
    setCurrentMessage('');

    if (selectedConversation.isAiChat) {
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
                  lastMessage: aiMessage.text.substring(0, 50) + (aiMessage.text.length > 50 ? "..." : ""),
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
    } else {
      setTimeout(() => {
        toast({ title: "Message Sent (Simulated)", description: `Your message to ${selectedConversation.participant.username} has been sent locally.`});
      }, 300);
    }
  };

  const formatDisplayTimestamp = (isoString: string) => {
    try {
      return formatDistanceToNowStrict(new Date(isoString), { addSuffix: true });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const handleOpenEditAiProfileDialog = () => {
    setTempNickname(aiCustomNickname || kathaVaultAiUser.username);
    setTempAvatarDataUri(aiCustomAvatarDataUri || kathaVaultAiUser.avatarUrl);
    setAvatarFile(null);
    setIsEditingAiProfile(true);
  };

  const handleAvatarFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempAvatarDataUri(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setAvatarFile(null);
      setTempAvatarDataUri(aiCustomAvatarDataUri || kathaVaultAiUser.avatarUrl);
    }
  };

  const handleSaveAiProfile = (e: FormEvent) => {
    e.preventDefault();
    setAiCustomNickname(tempNickname);
    localStorage.setItem('kathaAiNickname', tempNickname);

    if (tempAvatarDataUri && (avatarFile || tempAvatarDataUri !== kathaVaultAiUser.avatarUrl)) {
      setAiCustomAvatarDataUri(tempAvatarDataUri);
      localStorage.setItem('kathaAiAvatarDataUri', tempAvatarDataUri);
    }

    setIsEditingAiProfile(false);
    setAvatarFile(null);
    toast({ title: "AI Profile Updated", description: "Katha Vault AI's appearance has been updated for you." });
  };

  const handleConfirmClearChat = (convoId: string) => {
    setConversationToClear(convoId);
  };

  const handleClearChat = () => {
    if (!conversationToClear) return;
    setConversations(prev => prev.map(c =>
      c.id === conversationToClear
      ? { ...c, messages: [], lastMessage: "Chat cleared", lastMessageTimestamp: new Date().toISOString() }
      : c
    ));
    toast({ title: "Chat Cleared", description: "The conversation messages have been removed locally." });
    setConversationToClear(null);
  };

  const handleConfirmDeleteChat = (convoId: string) => {
    setConversationToDelete(convoId);
  };

  const handleDeleteChat = () => {
    if (!conversationToDelete) return;
    setConversations(prev => prev.filter(c => c.id !== conversationToDelete));
    if (selectedConversationId === conversationToDelete) {
      setSelectedConversationId(conversations.length > 1 ? conversations.find(c => c.id !== conversationToDelete)?.id || null : null);
    }
    toast({ title: "Chat Deleted", description: "The conversation has been removed locally." });
    setConversationToDelete(null);
  };

  const handleConfirmDeleteMessage = (msgId: string) => {
    setMessageToDeleteId(msgId);
  };

  const handleDeleteMessage = () => {
    if (!messageToDeleteId || !selectedConversationId) return;
    setConversations(prevConvos =>
      prevConvos.map(convo =>
        convo.id === selectedConversationId
          ? { ...convo, messages: convo.messages.filter(msg => msg.id !== messageToDeleteId) }
          : convo
      )
    );
    toast({ title: "Message Deleted", description: "The message has been removed from your view." });
    setMessageToDeleteId(null);
  };


  if (isLoadingInitialData) {
    return (
      <div className="flex h-[calc(100vh-var(--header-height,100px))] items-center justify-center border rounded-lg shadow-lg bg-card">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="ml-3 text-lg text-muted-foreground">Loading chats...</p>
      </div>
    );
  }

  const displayedAiName = aiCustomNickname || kathaVaultAiUser.username;
  const displayedAiAvatar = aiCustomAvatarDataUri || kathaVaultAiUser.avatarUrl;
  const displayedAiDataAihint = kathaVaultAiUser.dataAihint;

  const filteredConversations = conversations.filter(convo => 
    convo.participant.username.toLowerCase().includes(chatSearchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-var(--header-height,100px))] border rounded-lg shadow-lg bg-card">
      <aside className="w-full md:w-1/3 border-b md:border-b-0 md:border-r flex flex-col">
        <CardHeader className="p-4 border-b">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl">Chats</CardTitle>
          </div>
          <div className="relative mt-2">
            <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search chats..." 
              className="pl-8 h-9" 
              value={chatSearchTerm}
              onChange={(e) => setChatSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>

        <div className="p-3 border-b">
            <ScrollArea className="w-full whitespace-nowrap">
                <div className="flex space-x-4 pb-2">
                    {activeUsers.map(user => (
                        <div key={user.id} className="flex-shrink-0 relative" title={user.username}>
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={user.avatarUrl} alt={user.username} data-ai-hint={user.dataAihint || "user avatar active"} />
                                <AvatarFallback>{user.username.substring(0,1).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 ring-2 ring-background" />
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </div>

        <ScrollArea className="flex-grow">
          {filteredConversations.map(convo => { // Use filteredConversations here
            const participant = convo.isAiChat ? { ...kathaVaultAiUser, username: displayedAiName, avatarUrl: displayedAiAvatar, dataAihint: displayedAiDataAihint } : convo.participant;
            return (
            <div key={convo.id} className="relative group">
              <Button
                variant={selectedConversationId === convo.id ? "secondary" : "ghost"}
                className="w-full h-auto justify-start p-3 rounded-none border-b"
                onClick={() => setSelectedConversationId(convo.id)}
              >
                <div className="relative">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage
                      src={participant.avatarUrl}
                      alt={participant.username}
                      data-ai-hint={participant.dataAihint || "user avatar"}
                    />
                    <AvatarFallback>
                      {participant.username.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {(convo.isAiChat || activeUsers.find(u => u.id === participant.id)) && ( // Updated logic for green dot
                     <span className="absolute bottom-0 right-2 block h-3 w-3 rounded-full bg-green-500 ring-2 ring-background" />
                  )}
                </div>
                <div className="flex-grow text-left overflow-hidden">
                  <div className="flex justify-between items-center">
                    <p className="font-semibold truncate">
                      {participant.username}
                    </p>
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="absolute top-1/2 right-2 -translate-y-1/2 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 h-7 w-7">
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">Conversation options</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleConfirmClearChat(convo.id)}>
                    <Eraser className="mr-2 h-4 w-4" /> Clear Chat (for me)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleConfirmDeleteChat(convo.id)} className="text-destructive focus:text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" /> Delete Chat (for me)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )})}
        </ScrollArea>
      </aside>

      <main className="w-full md:w-2/3 flex flex-col bg-background flex-grow">
        {selectedConversation ? (
          <>
            <CardHeader className="p-4 border-b flex flex-row items-center justify-between space-x-3">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={selectedConversation.isAiChat ? displayedAiAvatar : selectedConversation.participant.avatarUrl}
                      alt={selectedConversation.isAiChat ? displayedAiName : selectedConversation.participant.username}
                      data-ai-hint={selectedConversation.isAiChat ? displayedAiDataAihint : selectedConversation.participant.dataAihint || "user avatar chat"}
                    />
                    <AvatarFallback>
                      {(selectedConversation.isAiChat ? displayedAiName : selectedConversation.participant.username).substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {(selectedConversation.isAiChat || activeUsers.find(u => u.id === selectedConversation.participant.id)) && ( // Updated logic for green dot
                     <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 ring-2 ring-card" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-lg">
                    {selectedConversation.isAiChat ? displayedAiName : selectedConversation.participant.username}
                  </p>
                  {selectedConversation.isAiChat && (
                    <p className="text-xs text-muted-foreground">AI Assistant &bull; Online</p>
                  )}
                   {!selectedConversation.isAiChat && (
                    <p className="text-xs text-muted-foreground">Online (Simulated)</p>
                  )}
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <MoreVertical className="h-5 w-5" />
                        <span className="sr-only">Chat Options</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    {selectedConversation.isAiChat && (
                        <DropdownMenuItem onClick={handleOpenEditAiProfileDialog}>
                            <Pencil className="mr-2 h-4 w-4" /> Customize AI Appearance
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => handleConfirmClearChat(selectedConversation.id)}>
                        <Eraser className="mr-2 h-4 w-4" /> Clear Chat (for me)
                    </DropdownMenuItem>
                     {!selectedConversation.isAiChat && (
                        <DropdownMenuItem disabled>
                           <span className="text-muted-foreground text-xs">More options soon...</span>
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
              </DropdownMenu>

            </CardHeader>

            <ScrollArea className="flex-grow p-4 space-y-2">
              {selectedConversation.messages.map(msg => {
                const isCurrentUserMsg = msg.senderId === currentLoggedInUser?.id;
                const isAiMsg = msg.senderId === kathaVaultAiUser.id;

                let participantToDisplay: ChatUser;
                if (isCurrentUserMsg && currentLoggedInUser) {
                    participantToDisplay = { id: currentLoggedInUser.id, username: currentLoggedInUser.username, avatarUrl: currentLoggedInUser.avatarUrl || mockCurrentUser.avatarUrl, dataAihint: currentLoggedInUser.avatarUrl?.includes("placehold.co") ? "user initial" : "user avatar"};
                } else if (isAiMsg) {
                    participantToDisplay = { ...kathaVaultAiUser, username: displayedAiName, avatarUrl: displayedAiAvatar, dataAihint: displayedAiDataAihint };
                } else {
                    participantToDisplay = selectedConversation.participant;
                }

                return (
                  <div key={msg.id} className={`flex items-end gap-2 group ${isCurrentUserMsg ? 'justify-end' : 'justify-start'}`}>
                    {!isCurrentUserMsg && (
                      <div className="relative self-start">
                        <Avatar className="h-8 w-8">
                           <AvatarImage src={participantToDisplay.avatarUrl} alt={participantToDisplay.username} data-ai-hint={participantToDisplay.dataAihint || "user avatar small"}/>
                           <AvatarFallback>{participantToDisplay.username.substring(0,1).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        {(isAiMsg || activeUsers.find(u=> u.id === participantToDisplay.id)) && ( // Updated logic for green dot
                           <span className="absolute bottom-0 -right-0.5 block h-2.5 w-2.5 rounded-full bg-green-500 ring-1 ring-background" />
                        )}
                      </div>
                    )}
                    <div className={cn(
                        "max-w-[70%] p-3 rounded-xl relative",
                        isCurrentUserMsg ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-muted text-muted-foreground rounded-bl-none',
                        isAiMsg && 'no-select'
                      )}>
                      <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                      <p className={`text-xs mt-1 ${isCurrentUserMsg ? 'text-primary-foreground/70 text-right' : 'text-muted-foreground/70 text-left'}`}>
                        {format(new Date(msg.timestamp), 'p')}
                      </p>
                       <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className={`absolute ${isCurrentUserMsg ? 'left-[-28px]' : 'right-[-28px]'} top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 h-6 w-6 p-1`}>
                            <MoreVertical className="h-3.5 w-3.5" />
                            <span className="sr-only">Message options</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align={isCurrentUserMsg ? "start" : "end"}>
                          <DropdownMenuItem onClick={() => handleConfirmDeleteMessage(msg.id)} className="text-destructive focus:text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete for me
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                     {isCurrentUserMsg && (
                       <div className="relative self-start">
                        <Avatar className="h-8 w-8">
                           <AvatarImage src={participantToDisplay.avatarUrl} alt={participantToDisplay.username} data-ai-hint={participantToDisplay.dataAihint || "current user avatar"}/>
                           <AvatarFallback>{participantToDisplay.username.substring(0,1).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span className="absolute bottom-0 -right-0.5 block h-2.5 w-2.5 rounded-full bg-green-500 ring-1 ring-background" />
                       </div>
                    )}
                  </div>
                );
              })}
              {isAiResponding && (
                <div className="flex items-end gap-2 justify-start">
                    <div className="relative self-start">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={displayedAiAvatar} alt={displayedAiName} data-ai-hint={displayedAiDataAihint || "brand logo K small"}/>
                            <AvatarFallback>{displayedAiName.substring(0,1).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span className="absolute bottom-0 -right-0.5 block h-2.5 w-2.5 rounded-full bg-green-500 ring-1 ring-background" />
                    </div>
                    <div className="max-w-[70%] p-3 rounded-xl bg-muted text-muted-foreground rounded-bl-none no-select">
                        <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                </div>
              )}
              {aiError && (
                 <div className="flex items-end gap-2 justify-start">
                     <div className="relative self-start">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={displayedAiAvatar} alt={displayedAiName} data-ai-hint={displayedAiDataAihint}/>
                            <AvatarFallback>{displayedAiName.substring(0,1).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span className="absolute bottom-0 -right-0.5 block h-2.5 w-2.5 rounded-full bg-green-500 ring-1 ring-background" />
                    </div>
                    <div className="max-w-[70%] p-3 rounded-xl bg-destructive/20 text-destructive-foreground rounded-bl-none no-select">
                        <p className="text-sm">{aiError}</p>
                    </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </ScrollArea>

            <div className="p-4 border-t bg-background">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary" onClick={() => toast({title: "Emoji Picker", description: "Emoji picker functionality is not yet implemented."})}>
                  <Smile className="h-5 w-5" />
                  <span className="sr-only">Add emoji</span>
                </Button>
                <Input
                  placeholder="Type a message..."
                  value={currentMessage}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setCurrentMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !isAiResponding && handleSendMessage()}
                  className="flex-grow"
                  disabled={isAiResponding || !currentLoggedInUser}
                />
                <Button size="icon" onClick={handleSendMessage} disabled={!currentMessage.trim() || isAiResponding || !currentLoggedInUser}>
                  <SendHorizontal className="h-5 w-5" />
                  <span className="sr-only">Send message</span>
                </Button>
              </div>
            </div>
            <Dialog open={isEditingAiProfile} onOpenChange={setIsEditingAiProfile}>
                  <DialogContent className="sm:max-w-[425px]">
                    <form onSubmit={handleSaveAiProfile}>
                      <DialogHeader>
                        <DialogTitle>Customize Katha Vault AI</DialogTitle>
                        <DialogDescription>
                          Personalize how the AI appears to you. These changes are local to your browser.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="ai-nickname" className="text-right">
                            Nickname
                          </Label>
                          <Input
                            id="ai-nickname"
                            value={tempNickname}
                            onChange={(e) => setTempNickname(e.target.value)}
                            className="col-span-3"
                            placeholder={kathaVaultAiUser.username}
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="ai-avatar-file" className="text-right">
                            Avatar
                          </Label>
                          <Input
                            id="ai-avatar-file"
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarFileChange}
                            className="col-span-3"
                          />
                        </div>
                        {tempAvatarDataUri && (
                            <div className="grid grid-cols-4 items-center gap-4">
                                <div className="col-start-2 col-span-3">
                                     <Label className="text-xs text-muted-foreground">Preview:</Label>
                                    <Avatar className="mt-1 h-20 w-20">
                                        <AvatarImage src={tempAvatarDataUri} alt="Avatar Preview" data-ai-hint="avatar preview" />
                                        <AvatarFallback>??</AvatarFallback>
                                    </Avatar>
                                </div>
                            </div>
                        )}
                      </div>
                      <DialogFooter>
                        <Button type="submit"><Save className="mr-2 h-4 w-4"/>Save Changes</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
            </Dialog>
          </>
        ) : (
          <div className="flex-grow flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <MessageSquare className="h-16 w-16 mx-auto mb-4" />
              <p className="text-lg">No chat selected</p>
              {conversations.length > 0 && <p className="text-sm">Select a conversation to start messaging.</p>}
              {conversations.length === 0 && <p className="text-sm">You currently have no active conversations. Click on a user's profile to start a chat.</p>}
            </div>
          </div>
        )}
      </main>

      <AlertDialog open={!!conversationToClear} onOpenChange={(open) => !open && setConversationToClear(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to clear this chat?</AlertDialogTitle>
            <AlertDialogDescription>
              All messages in this conversation will be removed from your view. This action cannot be undone for you.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setConversationToClear(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleClearChat} className="bg-destructive hover:bg-destructive/90">Clear Chat</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!conversationToDelete} onOpenChange={(open) => !open && setConversationToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this chat?</AlertDialogTitle>
            <AlertDialogDescription>
              This conversation will be removed from your chat list (for you only). This action cannot be undone for you.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setConversationToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteChat} className="bg-destructive hover:bg-destructive/90">Delete Chat</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

       <AlertDialog open={!!messageToDeleteId} onOpenChange={(open) => !open && setMessageToDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete message?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the message from your view. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setMessageToDeleteId(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteMessage} className="bg-destructive hover:bg-destructive/90">Delete for me</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

    