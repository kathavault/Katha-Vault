
"use client";

import type { UserPost, PostComment, UserProfile } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Heart, MessageCircle, MoreHorizontal, Trash2, Loader2, MessageSquareReply } from "lucide-react";
import { formatDistanceToNowStrict } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import { useState, FormEvent, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import Link from 'next/link';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { ScrollArea } from './ui/scroll-area';

const mockLikersList = ["UserAlpha", "BookLover22", "PageTurnerPro", "ReaderX", "AnotherUser", "BookwormBelle", "SciFiFan", "FantasyGuru", "NovelNinja", "WordSmith"];

// Minimal mock for current user ID to be used within the card if currentUserId prop is not passed
// In a real app, this would come from an auth context.
const MOCK_FALLBACK_USER_ID = "tempUser";


interface UserPostCardProps {
  post: UserPost;
  currentUserId?: string;
  onLike?: (postId: string) => void;
  onComment?: (postId: string, commentText: string) => void;
}

export function UserPostCard({ post, currentUserId, onLike, onComment }: UserPostCardProps) {
  const effectiveCurrentUserId = currentUserId || MOCK_FALLBACK_USER_ID;

  const [isLiked, setIsLiked] = useState(false);
  const [currentLikeCount, setCurrentLikeCount] = useState(post.likes);
  const [displayedComments, setDisplayedComments] = useState<PostComment[]>([]);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [commentToDeleteId, setCommentToDeleteId] = useState<string | null>(null);
  const [showAllComments, setShowAllComments] = useState(false);
  const [isLikersDialogOpen, setIsLikersDialogOpen] = useState(false);
  const [commentLikes, setCommentLikes] = useState<Record<string, { count: number; liked: boolean }>>({});

  const [postAuthorProfile, setPostAuthorProfile] = useState<{username: string; avatarUrl: string; dataAihint?: string; name?: string}>({
    username: post.username,
    avatarUrl: post.avatarUrl,
    dataAihint: post.dataAihint,
    name: post.name 
  });
  const [commenterProfiles, setCommenterProfiles] = useState<Record<string, {username: string; avatarUrl: string; dataAihint?: string}>>({});

  useEffect(() => {
    setCurrentLikeCount(post.likes);
    const initialComments = post.comments || [];
    setDisplayedComments(initialComments);

    const initialCommentLikes: Record<string, { count: number; liked: boolean }> = {};
    initialComments.forEach(comment => {
      initialCommentLikes[comment.id] = { count: comment.likes || 0, liked: false };
    });
    setCommentLikes(initialCommentLikes);

    let currentUserProfileData: Partial<UserProfile> | null = null;
    if (typeof window !== 'undefined') {
        const storedProfile = localStorage.getItem('userProfileData');
        if (storedProfile) {
            try {
                currentUserProfileData = JSON.parse(storedProfile) as Partial<UserProfile>;
            } catch (e) {
                console.error("Failed to parse userProfileData in UserPostCard", e);
            }
        }
    }

    if (post.userId === (currentUserProfileData?.id || effectiveCurrentUserId)) {
      setPostAuthorProfile(prev => ({
        ...prev,
        username: currentUserProfileData?.username || prev.username,
        avatarUrl: currentUserProfileData?.avatarUrl || prev.avatarUrl,
        name: currentUserProfileData?.name || prev.name,
      }));
    } else {
       setPostAuthorProfile({
        username: post.username,
        avatarUrl: post.avatarUrl,
        dataAihint: post.dataAihint,
        name: post.name 
      });
    }
    
    const updatedCommenterProfiles: Record<string, {username: string; avatarUrl: string; dataAihint?: string}> = {};
    initialComments.forEach(comment => {
        if (comment.userId === (currentUserProfileData?.id || effectiveCurrentUserId)) {
            updatedCommenterProfiles[comment.id] = {
                username: currentUserProfileData?.username || comment.username,
                avatarUrl: currentUserProfileData?.avatarUrl || comment.avatarUrl,
                dataAihint: comment.dataAihint 
            };
        } else {
            updatedCommenterProfiles[comment.id] = {
                 username: comment.username,
                 avatarUrl: comment.avatarUrl,
                 dataAihint: comment.dataAihint
            };
        }
    });
    setCommenterProfiles(prev => ({...prev, ...updatedCommenterProfiles}));

  }, [post.likes, post.comments, post.userId, effectiveCurrentUserId, post.username, post.avatarUrl, post.dataAihint, post.name]);

  const handleLikeToggle = () => {
    setIsLiked(prev => {
      const newLikedState = !prev;
      if (newLikedState) {
        setCurrentLikeCount(count => {
          console.log(`UserPostCard: Liking post ${post.id}. Current likes: ${count}. New likes: ${count + 1}`);
          return count + 1;
        });
        setTimeout(() => {
          toast({ title: "Post Liked!", description: `You liked ${postAuthorProfile.username}'s post.` });
        }, 0);
      } else {
        setCurrentLikeCount(count => {
          console.log(`UserPostCard: Unliking post ${post.id}. Current likes: ${count}. New likes: ${Math.max(0, count - 1)}`);
          return Math.max(0, count - 1);
        });
        setTimeout(() => {
          toast({ title: "Post Unliked", description: `You unliked ${postAuthorProfile.username}'s post.` });
        }, 0);
      }
      if (onLike) onLike(post.id);
      return newLikedState;
    });
  };

  const handleCommentSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) {
      setTimeout(() => {
        toast({ title: "Empty Comment", description: "Please write something.", variant: "destructive" });
      }, 0);
      return;
    }
    setIsSubmittingComment(true);

    let currentUserCommentingProfile: Partial<UserProfile> & {id: string; username: string; avatarUrl: string} = {
        id: effectiveCurrentUserId,
        username: 'You',
        avatarUrl: 'https://placehold.co/40x40/CCCCCC/FFFFFF?text=U',
        dataAihint: 'user initial'
    };

    if (typeof window !== 'undefined') {
        const storedProfile = localStorage.getItem('userProfileData');
        if (storedProfile) {
            try {
                const parsedProfile = JSON.parse(storedProfile) as Partial<UserProfile>;
                currentUserCommentingProfile = {
                    id: parsedProfile.id || effectiveCurrentUserId,
                    username: parsedProfile.username || 'You',
                    avatarUrl: parsedProfile.avatarUrl || currentUserCommentingProfile.avatarUrl,
                    dataAihint: parsedProfile.avatarUrl?.includes('placehold.co') ? 'user initial' : undefined,
                };
            } catch (err) {
                console.error("Failed to parse stored profile for commenting", err);
            }
        }
    }

    setTimeout(() => {
      const newComment: PostComment = {
        id: `comment-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        postId: post.id,
        userId: currentUserCommentingProfile.id,
        username: currentUserCommentingProfile.username,
        avatarUrl: currentUserCommentingProfile.avatarUrl,
        dataAihint: currentUserCommentingProfile.dataAihint,
        text: commentText.trim(),
        timestamp: new Date().toISOString(),
        likes: 0,
        replies: [],
      };
      setDisplayedComments(prevComments => [newComment, ...prevComments]);
      setCommentLikes(prev => ({ ...prev, [newComment.id]: { count: 0, liked: false } }));
      
      setCommenterProfiles(prev => ({ // Ensure new comment by current user uses latest profile
          ...prev,
          [newComment.id]: { 
              username: newComment.username,
              avatarUrl: newComment.avatarUrl,
              dataAihint: newComment.dataAihint
          }
      }));

      setCommentText('');
      setShowCommentInput(false);
      setIsSubmittingComment(false);
      toast({ title: "Comment Posted!", description: "Your comment has been added locally." });
      if (onComment) onComment(post.id, newComment.text);
    }, 500);
  };

  const confirmDeleteComment = (commentId: string) => {
    setCommentToDeleteId(commentId);
  };

  const handleDeleteComment = () => {
    if (!commentToDeleteId) return;
    setDisplayedComments(prevComments => prevComments.filter(comment => comment.id !== commentToDeleteId));
    setCommentLikes(prev => {
      const newLikes = { ...prev };
      delete newLikes[commentToDeleteId];
      return newLikes;
    });
     setCommenterProfiles(prev => {
        const newProfiles = {...prev};
        delete newProfiles[commentToDeleteId];
        return newProfiles;
    });
    setTimeout(() => {
      toast({ title: "Comment Deleted", description: "The comment has been removed locally." });
    }, 0);
    setCommentToDeleteId(null);
  };

  const handleLikeComment = (commentId: string) => {
    setCommentLikes(prev => {
      const currentCommentLikeState = prev[commentId] || { count: 0, liked: false };
      const newLikedState = !currentCommentLikeState.liked;
      const newCount = newLikedState ? currentCommentLikeState.count + 1 : Math.max(0, currentCommentLikeState.count - 1);
      setTimeout(() => {
        if (newLikedState) {
          toast({ title: "Comment Liked!", variant: "default" });
        } else {
          toast({ title: "Comment Unliked", variant: "default" });
        }
      }, 0);
      return {
        ...prev,
        [commentId]: { count: newCount, liked: newLikedState }
      };
    });
  };

  const handleReplyToComment = (commentId: string, username: string) => {
    setTimeout(() => {
      toast({
        title: "Reply to Comment",
        description: `Simulated: Replying to ${username}'s comment. A reply input would open here.`,
      });
    }, 0);
  };

  const formatTimestamp = (timestamp: string) => {
    try {
      return formatDistanceToNowStrict(new Date(timestamp), { addSuffix: true });
    } catch (error) {
      console.error("Error formatting timestamp:", error);
      return "some time ago";
    }
  };

  const commentsToDisplay = showAllComments ? displayedComments : displayedComments.slice(0, 2);
  
  let canCurrentUserDeletePost = false;
  let isPostOwnerViewing = false;

  if (typeof window !== 'undefined') {
      const storedProfile = localStorage.getItem('userProfileData');
      if (storedProfile) {
          try {
              const parsedCurrentUserProfile: Partial<UserProfile> = JSON.parse(storedProfile);
              if (parsedCurrentUserProfile.id === post.userId) {
                  canCurrentUserDeletePost = true; // User can delete their own post
                  isPostOwnerViewing = true;
              }
          } catch(e) { /* ignore */ }
      }
  }

  return (
    <Card className="w-full shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-start gap-3 space-y-0 p-4">
        <Link href={`/profile/${post.userId}`} className="cursor-pointer">
          <Avatar className="h-10 w-10 border">
            <AvatarImage src={postAuthorProfile.avatarUrl} alt={postAuthorProfile.username} data-ai-hint={postAuthorProfile.dataAihint || "user avatar"}/>
            <AvatarFallback>{postAuthorProfile.username.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex-grow">
          <Link href={`/profile/${post.userId}`} className="cursor-pointer hover:underline">
            <CardTitle className="text-base font-semibold">{postAuthorProfile.name || postAuthorProfile.username}</CardTitle>
             {postAuthorProfile.name && <CardDescription className="text-xs -mt-0.5">@{postAuthorProfile.username}</CardDescription>}
          </Link>
          <CardDescription className="text-xs mt-0.5">{formatTimestamp(post.timestamp)}</CardDescription>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => {
          setTimeout(() => {
            toast({title: "More options placeholder (e.g., delete own post, report)"});
          }, 0);
        }}>
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
          <Dialog open={isLikersDialogOpen} onOpenChange={setIsLikersDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="link" className="p-0 h-auto text-xs text-muted-foreground hover:text-primary">
                {currentLikeCount} Like{currentLikeCount !== 1 ? 's' : ''}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Liked by</DialogTitle>
                <DialogDescription>Users who liked this post. (Mock Data)</DialogDescription>
              </DialogHeader>
              <ScrollArea className="max-h-60">
                <div className="space-y-2 py-2">
                  {mockLikersList.slice(0, currentLikeCount > mockLikersList.length ? mockLikersList.length : currentLikeCount).map((liker, index) => (
                    <div key={index} className="flex items-center gap-2 p-1.5 rounded-md hover:bg-muted">
                      <Avatar className="h-7 w-7">
                        <AvatarImage src={`https://placehold.co/40x40/A0A0A0/FFFFFF?text=${liker.substring(0,1)}`} alt={liker} data-ai-hint="user initial"/>
                        <AvatarFallback>{liker.substring(0,1).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{liker}</span>
                    </div>
                  ))}
                  {currentLikeCount === 0 && <p className="text-sm text-center text-muted-foreground">No likes yet.</p>}
                </div>
              </ScrollArea>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Close
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <span className="mx-1">&middot;</span>
          {displayedComments.length > 0 ? (
            <Button
              variant="link"
              className="p-0 h-auto text-xs text-muted-foreground hover:text-primary"
              onClick={() => setShowAllComments(!showAllComments)}
            >
              {displayedComments.length > 2 ? (showAllComments ? "Hide comments" : `View all ${displayedComments.length} comments`) : `${displayedComments.length} Comment${displayedComments.length !== 1 ? 's' : ''}`}
            </Button>
          ) : (
             <span>0 Comments</span>
          )}
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
                <AvatarImage src={(typeof window !== 'undefined' && JSON.parse(localStorage.getItem('userProfileData') || '{}').avatarUrl) || 'https://placehold.co/40x40/CCCCCC/FFFFFF?text=U'} alt="Current User" data-ai-hint="user initial"/>
                <AvatarFallback>{((typeof window !== 'undefined' && JSON.parse(localStorage.getItem('userProfileData') || '{}').username) || 'U').substring(0,1).toUpperCase()}</AvatarFallback>
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
      {commentsToDisplay.length > 0 && (
        <div className="px-4 pb-4 pt-2 border-t mt-2 space-y-3 max-h-60 overflow-y-auto">
            {(showAllComments || displayedComments.length > 2) && displayedComments.length > 0 && (
                 <h4 className="text-xs font-semibold text-muted-foreground mb-1">Comments ({displayedComments.length})</h4>
            )}
            {commentsToDisplay.map(comment => {
              const commentLikeState = commentLikes[comment.id] || { count: 0, liked: false };
              const profile = commenterProfiles[comment.id] || { username: comment.username, avatarUrl: comment.avatarUrl, dataAihint: comment.dataAihint };
              
              let canDeleteThisComment = false;
              if (typeof window !== 'undefined') {
                  const storedProfile = localStorage.getItem('userProfileData');
                  if (storedProfile) {
                      try {
                          const parsedCurrentUserProfile: Partial<UserProfile> = JSON.parse(storedProfile);
                          if (parsedCurrentUserProfile.id === comment.userId || isPostOwnerViewing) {
                              canDeleteThisComment = true;
                          }
                      } catch(e) { /* ignore */ }
                  }
              }
              
              return (
                <div key={comment.id} className="flex items-start space-x-2 text-xs group">
                  <Link href={`/profile/${comment.userId}`} className="cursor-pointer">
                    <Avatar className="h-6 w-6">
                        <AvatarImage src={profile.avatarUrl} alt={profile.username} data-ai-hint={profile.dataAihint || "user avatar small"}/>
                        <AvatarFallback>{profile.username.substring(0,1).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Link>
                    <div className="flex-grow bg-muted/50 p-2 rounded-md">
                        <div className="flex justify-between items-center">
                          <Link href={`/profile/${comment.userId}`} className="cursor-pointer hover:underline">
                            <span className="font-semibold text-foreground">{profile.username}</span>
                          </Link>
                            <span className="text-muted-foreground/80">{formatTimestamp(comment.timestamp)}</span>
                        </div>
                        <p className="text-foreground/90 mt-0.5">{comment.text}</p>
                        <div className="mt-1.5 flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                className={cn("p-0 h-auto text-xs hover:text-primary", commentLikeState.liked ? "text-primary" : "text-muted-foreground")}
                                onClick={() => handleLikeComment(comment.id)}
                            >
                                <Heart className={cn("mr-1 h-3 w-3", commentLikeState.liked && "fill-primary")} />
                                {commentLikeState.count > 0 ? commentLikeState.count : 'Like'}
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="p-0 h-auto text-xs text-muted-foreground hover:text-primary"
                                onClick={() => handleReplyToComment(comment.id, profile.username)}
                            >
                                <MessageSquareReply className="mr-1 h-3 w-3" /> Reply
                            </Button>
                            {canDeleteThisComment && (
                                <AlertDialog open={commentToDeleteId === comment.id} onOpenChange={(open) => !open && setCommentToDeleteId(null)}>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-5 w-5 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 text-muted-foreground hover:text-destructive ml-auto"
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
                            )}
                        </div>
                    </div>
                </div>
              );
            })}
        </div>
      )}
    </Card>
  );
}
