
"use client";

import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { UserCircle2, Save, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from "react";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name must be at most 50 characters").optional().or(z.literal('')),
  username: z.string().min(3, "Username must be at least 3 characters").max(30, "Username must be at most 30 characters"),
  bio: z.string().max(200, "Bio must be at most 200 characters").optional(),
  avatarUrl: z.string().url("Must be a valid URL for avatar image").optional().or(z.literal('')),
  email: z.string().email("Invalid email address").optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

// Mock existing user data - this will be updated by localStorage if present
let mockExistingUser = {
  name: "Katha Seeker",
  username: "StorySeeker92",
  bio: "Avid reader and aspiring author. Always on the lookout for the next great adventure within the pages of a book. Favorite genres: Sci-Fi and Fantasy.",
  avatarUrl: "https://placehold.co/150x150/B4317B/F7F2FA?text=SS",
  email: "story.seeker@example.com",
};

export default function EditProfilePage() {
  const [initialValues, setInitialValues] = useState(mockExistingUser);
  const [avatarPreview, setAvatarPreview] = useState(mockExistingUser.avatarUrl);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedProfile = localStorage.getItem('userProfileData');
      if (storedProfile) {
        try {
          const parsedProfile = JSON.parse(storedProfile);
          const updatedInitialValues = {
            ...mockExistingUser, // keep email and other base fields
            name: parsedProfile.name || mockExistingUser.name,
            username: parsedProfile.username || mockExistingUser.username,
            bio: parsedProfile.bio || mockExistingUser.bio,
            avatarUrl: parsedProfile.avatarUrl || mockExistingUser.avatarUrl,
          };
          mockExistingUser = updatedInitialValues; // Update module-level mock
          setInitialValues(updatedInitialValues);
          setAvatarPreview(updatedInitialValues.avatarUrl);
        } catch (e) {
          console.error("Failed to parse stored profile data for edit page", e);
          setInitialValues(mockExistingUser);
          setAvatarPreview(mockExistingUser.avatarUrl);
        }
      } else {
        setInitialValues(mockExistingUser);
        setAvatarPreview(mockExistingUser.avatarUrl);
      }
    }
  }, []);


  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    values: { // Use 'values' to make form re-initialize when initialValues change
      name: initialValues.name,
      username: initialValues.username,
      bio: initialValues.bio,
      avatarUrl: initialValues.avatarUrl,
      email: initialValues.email,
    },
  });
  
  useEffect(() => {
    // Reset form with potentially updated initialValues from localStorage
    form.reset({
      name: initialValues.name,
      username: initialValues.username,
      bio: initialValues.bio,
      avatarUrl: initialValues.avatarUrl,
      email: initialValues.email,
    });
    setAvatarPreview(initialValues.avatarUrl);
  }, [initialValues, form]);


  const onSubmit: SubmitHandler<ProfileFormData> = (data) => {
    console.log("Profile Updated:", data);

    const profileToSave = {
      name: data.name || initialValues.name, // Keep existing name if new one is empty
      username: data.username,
      bio: data.bio || initialValues.bio, // Keep existing bio if new one is empty
      avatarUrl: data.avatarUrl || initialValues.avatarUrl, // Keep existing avatar if new one is empty
      email: initialValues.email, // Email is not editable here
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem('userProfileData', JSON.stringify(profileToSave));
      // Update module-level mock for immediate reflection if page isn't reloaded
      mockExistingUser = profileToSave;
      setInitialValues(profileToSave); // Update state to reflect saved data
      setAvatarPreview(profileToSave.avatarUrl); // Update preview
    }

    toast({
      title: "Profile Updated!",
      description: "Your profile has been successfully updated.",
      variant: "default",
    });
  };

  const handleAvatarUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue("avatarUrl", e.target.value);
    if (form.getValues("avatarUrl")?.match(/^https?:\/\/.+\..+/)) {
       setAvatarPreview(e.target.value);
    } else {
       setAvatarPreview(""); 
    }
  };


  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <header className="flex items-center gap-4">
        <UserCircle2 className="h-10 w-10 text-primary" />
        <h1 className="text-3xl font-bold text-primary">Edit Profile</h1>
      </header>
      <p className="text-muted-foreground">
        Update your personal information. Changes will be reflected across Katha Vault.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Manage your public profile details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
                <Avatar className="h-24 w-24 border-2 border-primary">
                  <AvatarImage src={avatarPreview || undefined} alt={form.getValues("username")} data-ai-hint="user avatar preview"/>
                  <AvatarFallback className="text-3xl">
                    {form.getValues("username")?.substring(0, 2).toUpperCase() || <ImageIcon className="h-10 w-10 text-muted-foreground"/>}
                  </AvatarFallback>
                </Avatar>
                <FormField
                  control={form.control}
                  name="avatarUrl"
                  render={({ field }) => (
                    <FormItem className="flex-grow w-full">
                      <FormLabel>Avatar Image URL</FormLabel>
                      <FormControl>
                        <Input 
                          type="url" 
                          placeholder="https://example.com/your-avatar.png" 
                          {...field} 
                          onChange={handleAvatarUrlChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl><Input placeholder="Your full name" {...field} /></FormControl>
                    <FormDescription>This name may be displayed on your profile.</FormDescription>
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
                    <FormControl><Input placeholder="Your unique username" {...field} /></FormControl>
                    <FormDescription>This is your public display name (e.g., @username).</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl><Input type="email" placeholder="your.email@example.com" {...field} disabled /></FormControl>
                     <FormDescription>Your email address is not publicly visible and cannot be changed here.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl><Textarea placeholder="Tell us a little about yourself..." {...field} rows={4} /></FormControl>
                    <FormDescription>A short description about you (max 200 characters).</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
               <Button variant="outline" asChild>
                <Link href="/account">Cancel</Link>
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                <Save className="mr-2 h-4 w-4" />
                {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}
