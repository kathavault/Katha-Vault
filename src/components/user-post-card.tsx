
"use client";

import type { UserPost } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Heart, MessageCircle, MoreHorizontal } from "lucide-react";
import { formatDistanceToNowStrict } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import { useState } from 'react';

interface UserPostCardProps {
  post: UserPost;
  onLike?: (postId: string) => void; // Optional: for simulated like update
  onComment?: (postId: string, commentText: string) => void; // Optional: for simulated comment
}

export function UserPostCard({ post, onLike, onComment }: UserPostCardProps) {
  const [localLikes, setLocalLikes] = useState(post.likes);
  // In a real app, comments would be part of post object or fetched separately
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentText, setCommentText] = useState('');

  const handleLike = () => {
    // Simulate liking
    setLocalLikes(prev => prev + 1);
    if (onLike) {
      onLike(post.id);
    } else {
        toast({ title: "Liked! (Simulated)", description: `You liked ${post.username}'s post.` });
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
     if (onComment) {
      onComment(post.id, commentText);
    } else {
        toast({ title: "Comment Posted! (Simulated)", description: `Your comment on ${post.username}'s post: "${commentText}"` });
    }
    setCommentText('');
    setShowCommentInput(false);
  };

  const formatTimestamp = (timestamp: string) => {
    try {
      return formatDistanceToNowStrict(new Date(timestamp), { addSuffix: true });
    } catch (error) {
      console.error("Error formatting timestamp:", error);
      return "some time ago";
    }
  };

  return (
    <Card className="w-full shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-start gap-3 space-y-0 p-4">
        <Avatar className="h-10 w-10 border">
          <AvatarImage src={post.avatarUrl} alt={post.username} data-ai-hint={post.dataAihint || "user avatar"}/>
          <AvatarFallback>{post.username.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-grow">
          <CardTitle className="text-base font-semibold">{post.username}</CardTitle>
          <CardDescription className="text-xs">{formatTimestamp(post.timestamp)}</CardDescription>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toast({title: "More options placeholder"})}>
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">More options</span>
        </Button>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-sm whitespace-pre-wrap leading-relaxed">{post.content}</p>
      </CardContent>
      <Separator />
      <CardFooter className="p-3 flex justify-between items-center">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <span>{localLikes} Likes</span>
          <span className="mx-1">&middot;</span>
          <span>{post.comments.length} Comments</span>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={handleLike} className="text-muted-foreground hover:text-primary">
            <Heart className="mr-1.5 h-4 w-4" /> Like
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setShowCommentInput(!showCommentInput)} className="text-muted-foreground hover:text-primary">
            <MessageCircle className="mr-1.5 h-4 w-4" /> Comment
          </Button>
        </div>
      </CardFooter>
      {showCommentInput && (
        <form onSubmit={handleCommentSubmit} className="px-3 pb-3 border-t pt-3">
          <div className="flex gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://placehold.co/40x40/E62E9A/FFFFFF?text=ME" alt="Current User" data-ai-hint="user initial"/>
              <AvatarFallback>ME</AvatarFallback>
            </Avatar>
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="flex-grow p-2 text-sm border rounded-md focus:ring-1 focus:ring-primary focus:outline-none bg-muted/50"
            />
            <Button type="submit" size="sm" disabled={!commentText.trim()}>Post</Button>
          </div>
        </form>
      )}
    </Card>
  );
}
