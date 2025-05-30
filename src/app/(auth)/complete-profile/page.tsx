
"use client";

import { useEffect, useState, type ChangeEvent } from 'react';
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { UserCircle2, Save, Image as ImageIcon, Loader2 } from "lucide-react";
import { useRouter } from 'next/navigation';
import { auth } from "@/lib/firebase";
import { updateProfile, type User } from "firebase/auth";
import type { UserProfile } from '@/types';

const completeProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name must be at most 50 characters"),
  username: z.string().min(3, "Username must be at least 3 characters").max(30, "Username must be at most 30 characters").regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  gender: z.enum(["Male", "Female", "Other", "Prefer not to say"]),
  avatarDataUrl: z.string().optional(), // Will store Data URI
});

type CompleteProfileFormData = z.infer<typeof completeProfileSchema>;

export default function CompleteProfilePage() {
  const router = useRouter();
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const form = useForm<CompleteProfileFormData>({
    resolver: zodResolver(completeProfileSchema),
    defaultValues: {
      name: "",
      username: "",
      gender: undefined,
      avatarDataUrl: "",
    },
  });
  const { formState: { isSubmitting } } = form;

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setFirebaseUser(user);
        setEmail(user.email);
        // Pre-fill username if email exists
        if (user.email && !form.getValues("username")) {
          form.setValue("username", user.email.split('@')[0]);
        }
      } else {
        // If no user, redirect to signup or login, as this page requires a pending user
        toast({ title: "Session Error", description: "Please sign up or log in first.", variant: "destructive" });
        router.push('/auth/signup');
      }
    });

    // Check for pending completion data from localStorage if direct auth state is not yet available
    if (typeof window !== 'undefined' && !auth.currentUser) {
        const pendingDataString = localStorage.getItem('pendingUserProfileCompletion');
        if (pendingDataString) {
            try {
                const pendingData = JSON.parse(pendingDataString);
                if (pendingData.email && !form.getValues("username")) {
                     setEmail(pendingData.email);
                     form.setValue("username", pendingData.email.split('@')[0]);
                }
            } catch (e) {
                console.error("Error parsing pending profile data", e);
            }
        }
    }


    return () => unsubscribe();
  }, [router, form]);

  const handleAvatarFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setAvatarPreview(dataUrl);
        form.setValue("avatarDataUrl", dataUrl);
      };
      reader.readAsDataURL(file);
    } else {
      setAvatarPreview(null);
      form.setValue("avatarDataUrl", "");
    }
  };

  const onSubmit: SubmitHandler<CompleteProfileFormData> = async (data) => {
    const currentUser = auth.currentUser; // Get current user again at submission time
    if (!currentUser) {
      toast({ title: "Error", description: "No active user session. Please try logging in.", variant: "destructive" });
      router.push('/auth/login');
      return;
    }

    try {
      // Update Firebase Profile (displayName and photoURL)
      await updateProfile(currentUser, {
        displayName: data.name, // Using full name for displayName
        photoURL: data.avatarDataUrl || null, 
      });

      // Prepare data for localStorage
      const userProfileToStore: UserProfile = {
        id: currentUser.uid,
        email: currentUser.email || 'unknown@example.com', // Should always exist here
        name: data.name,
        username: data.username,
        avatarUrl: data.avatarDataUrl || `https://placehold.co/150x150/CCCCCC/FFFFFF?text=${data.username.substring(0,2).toUpperCase()}`,
        gender: data.gender,
        bio: "", // Default empty bio
        readingHistory: [],
        favorites: [],
        submittedStories: [],
        userPosts: [],
        followers: 0,
        following: 0,
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem('userProfileData', JSON.stringify(userProfileToStore));
        localStorage.setItem('currentUser', JSON.stringify({ email: currentUser.email, uid: currentUser.uid })); // Mark as fully logged in
        localStorage.removeItem('pendingUserProfileCompletion'); // Clean up
      }

      toast({
        title: "Profile Completed!",
        description: "Your profile has been set up.",
        variant: "default",
      });
      router.push('/account'); // Redirect to account page or home
    } catch (error: any) {
      console.error("Error completing profile:", error);
      toast({
        title: "Profile Update Failed",
        description: error.message || "Could not update your profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!firebaseUser && !email) { // Show loader if still determining user state
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card className="w-full shadow-xl">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <UserCircle2 className="h-6 w-6 text-primary" /> Complete Your Profile
        </CardTitle>
        <CardDescription>Just a few more details to get you started on Katha Vault.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl><Input placeholder="Your full name" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl><Input placeholder="Choose a unique username" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                      <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormItem>
              <FormLabel>Profile Picture (DP)</FormLabel>
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20 border">
                  <AvatarImage src={avatarPreview || undefined} alt="Avatar preview" data-ai-hint="avatar preview" />
                  <AvatarFallback>
                    {form.getValues("username")?.substring(0,2).toUpperCase() || <ImageIcon className="h-8 w-8 text-muted-foreground"/>}
                  </AvatarFallback>
                </Avatar>
                <FormControl>
                  <Input type="file" accept="image/*" onChange={handleAvatarFileChange} className="flex-grow" />
                </FormControl>
              </div>
              {form.formState.errors.avatarDataUrl && <FormMessage>{form.formState.errors.avatarDataUrl.message}</FormMessage>}
            </FormItem>
            <p className="text-sm text-muted-foreground">
                Your email: <strong>{email || "Loading..."}</strong> (This cannot be changed here).
            </p>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              {isSubmitting ? "Saving Profile..." : "Save Profile & Finish"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
