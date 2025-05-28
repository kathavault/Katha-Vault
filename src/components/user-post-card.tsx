
"use client";

import type { UserPost, PostComment } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Heart, MessageCircle, MoreHorizontal, Trash2, Loader2 } from "lucide-react";
import { formatDistanceToNowStrict } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import { useState, FormEvent } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Mock current user for comments - in a real app, this would come from auth context
const mockCurrentUserForPostCard = {
  id: 'currentUser', // Or a dynamic ID from auth
  username: 'StorySeeker92',
  avatarUrl: 'https://placehold.co/40x40/E62E9A/FFFFFF?text=ME',
  dataAihint: 'user initial',
};

interface UserPostCardProps {
  post: UserPost;
  // Removed onLike and onComment props as we'll handle state internally for simulation
}

export function UserPostCard({ post }: UserPostCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [currentLikeCount, setCurrentLikeCount] = useState(post.likes);
  const [displayedComments, setDisplayedComments] = useState<PostComment[]>(post.comments || []);
  
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const [commentToDeleteId, setCommentToDeleteId] = useState<string | null>(null);


  const handleLikeToggle = () => {
    setIsLiked(prev => {
      const newLikedState = !prev;
      if (newLikedState) {
        setCurrentLikeCount(count => count + 1);
        toast({ title: "Post Liked!", description: `You liked ${post.username}'s post.` });
      } else {
        setCurrentLikeCount(count => count - 1);
        toast({ title: "Post Unliked", description: `You unliked ${post.username}'s post.` });
      }
      return newLikedState;
    });
  };

  const handleCommentSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) {
        toast({ title: "Empty Comment", description: "Please write something.", variant: "destructive"});
        return;
    }
    setIsSubmittingComment(true);

    // Simulate network delay for comment submission
    setTimeout(() => {
      const newComment: PostComment = {
        id: `comment-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        postId: post.id,
        userId: mockCurrentUserForPostCard.id, 
        username: mockCurrentUserForPostCard.username,
        avatarUrl: mockCurrentUserForPostCard.avatarUrl,
        dataAihint: mockCurrentUserForPostCard.dataAihint,
        text: commentText.trim(),
        timestamp: new Date().toISOString(),
      };
      setDisplayedComments(prevComments => [newComment, ...prevComments]);
      setCommentText('');
      setShowCommentInput(false);
      setIsSubmittingComment(false);
      toast({ title: "Comment Posted!", description: "Your comment has been added locally." });
    }, 500);
  };

  const confirmDeleteComment = (commentId: string) => {
    setCommentToDeleteId(commentId);
  };

  const handleDeleteComment = () => {
    if (!commentToDeleteId) return;
    setDisplayedComments(prevComments => prevComments.filter(comment => comment.id !== commentToDeleteId));
    toast({ title: "Comment Deleted", description: "The comment has been removed locally." });
    setCommentToDeleteId(null); // Close the dialog
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
          <span>{currentLikeCount} Likes</span>
          <span className="mx-1">&middot;</span>
          <span>{displayedComments.length} Comments</span>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={handleLikeToggle} 
            className={cn("hover:text-primary", isLiked ? "text-primary" : "text-muted-foreground")}>
            <Heart className={cn("mr-1.5 h-4 w-4", isLiked && "fill-primary")} /> Like
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setShowCommentInput(!showCommentInput)} className="text-muted-foreground hover:text-primary">
            <MessageCircle className="mr-1.5 h-4 w-4" /> Comment
          </Button>
        </div>
      </CardFooter>
      {showCommentInput && (
        <form onSubmit={handleCommentSubmit} className="px-3 pb-3 border-t pt-3">
          <div className="flex gap-2 items-start">
            <Avatar className="h-8 w-8 mt-1">
              <AvatarImage src={mockCurrentUserForPostCard.avatarUrl} alt="Current User" data-ai-hint="user initial"/>
              <AvatarFallback>{mockCurrentUserForPostCard.username.substring(0,1).toUpperCase()}</AvatarFallback>
            </Avatar>
            <Input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="flex-grow p-2 text-sm border rounded-md focus:ring-1 focus:ring-primary focus:outline-none bg-muted/50"
              disabled={isSubmittingComment}
            />
            <Button type="submit" size="sm" disabled={!commentText.trim() || isSubmittingComment}>
              {isSubmittingComment ? <Loader2 className="h-4 w-4 animate-spin" /> : "Post"}
            </Button>
          </div>
        </form>
      )}
      {displayedComments.length > 0 && (
        <div className="px-4 pb-4 pt-2 border-t mt-2 space-y-3 max-h-60 overflow-y-auto">
            <h4 className="text-xs font-semibold text-muted-foreground mb-1">Comments</h4>
            {displayedComments.map(comment => (
                <div key={comment.id} className="flex items-start space-x-2 text-xs group">
                    <Avatar className="h-6 w-6">
                        <AvatarImage src={comment.avatarUrl} alt={comment.username} data-ai-hint={comment.dataAihint || "user avatar small"}/>
                        <AvatarFallback>{comment.username.substring(0,1).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-grow bg-muted/50 p-2 rounded-md">
                        <div className="flex justify-between items-center">
                            <span className="font-semibold text-foreground">{comment.username}</span>
                            <span className="text-muted-foreground/80">{formatTimestamp(comment.timestamp)}</span>
                        </div>
                        <p className="text-foreground/90 mt-0.5">{comment.text}</p>
                    </div>
                    {/* Simulated delete for any comment - in real app, check ownership */}
                    <AlertDialog open={commentToDeleteId === comment.id} onOpenChange={(open) => !open && setCommentToDeleteId(null)}>
                        <AlertDialogTrigger asChild>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-6 w-6 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 text-muted-foreground hover:text-destructive"
                                onClick={() => confirmDeleteComment(comment.id)}
                            >
                                <Trash2 className="h-3 w-3" />
                                <span className="sr-only">Delete comment</span>
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action will remove the comment locally. This cannot be undone.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setCommentToDeleteId(null)}>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteComment} className="bg-destructive hover:bg-destructive/90">
                                Delete
                            </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            ))}
        </div>
      )}
    </Card>
  );
}
