
"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { UserPlus, Mail, Lock, Loader2 } from "lucide-react";
import { auth, googleProvider, facebookProvider } from "@/lib/firebase";
import { createUserWithEmailAndPassword, sendEmailVerification, signInWithPopup, getAdditionalUserInfo, type AuthProvider, type User as FirebaseUser } from "firebase/auth";
import { useRouter } from 'next/navigation';

const GoogleIconPlaceholder = () => <Mail className="mr-2 h-4 w-4" />; 
const FacebookIconPlaceholder = () => <Mail className="mr-2 h-4 w-4" />;

const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"], 
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { formState: { isSubmitting: isEmailPassSubmitting } } = form;
  const [isSocialSubmitting, setIsSocialSubmitting] = useState(false);
  const isSubmitting = isEmailPassSubmitting || isSocialSubmitting;

  const handleNewUserRedirect = (user: FirebaseUser) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('pendingUserProfileCompletion', JSON.stringify({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName, 
        photoURL: user.photoURL 
      }));
    }
    router.push('/auth/complete-profile');
  };


  const onSubmit: SubmitHandler<SignupFormData> = async (data) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      await sendEmailVerification(userCredential.user);

      toast({
        title: "Account Created!",
        description: "A verification email has been sent. Please check your inbox. Next, complete your profile.",
        variant: "default",
        duration: 7000,
      });
      handleNewUserRedirect(userCredential.user);
    } catch (error: any) {
      let errorMessage = "An unexpected error occurred during sign up.";
      if (error.code) {
        switch (error.code) {
          case "auth/email-already-in-use":
            errorMessage = "This email address is already in use by another account.";
            break;
          case "auth/weak-password":
            errorMessage = "The password is too weak. Please choose a stronger password.";
            break;
          case "auth/invalid-email":
            errorMessage = "The email address is not valid.";
            break;
          default:
            errorMessage = `Sign up failed: ${error.message}`;
        }
      }
      console.error("Signup error:", error);
      toast({
        title: "Sign Up Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleSocialSignup = async (providerType: "Google" | "Facebook") => {
    setIsSocialSubmitting(true);
    const provider: AuthProvider = providerType === "Google" ? googleProvider : facebookProvider;
    try {
        const result = await signInWithPopup(auth, provider);
        const additionalInfo = getAdditionalUserInfo(result);

        if (additionalInfo?.isNewUser) {
            toast({
                title: "Account Created!",
                description: `Welcome! Please complete your profile to get started.`,
                variant: "default",
                duration: 5000,
              });
            handleNewUserRedirect(result.user);
        } else {
            // Existing user logged in via social
            const userProfileToStore = {
                id: result.user.uid,
                email: result.user.email || 'unknown@example.com',
                name: result.user.displayName || result.user.email?.split('@')[0],
                username: result.user.email?.split('@')[0],
                avatarUrl: result.user.photoURL || `https://placehold.co/150x150/B4317B/F7F2FA?text=${(result.user.email?.substring(0,1) || 'U').toUpperCase()}`,
                bio: "Welcome back to Katha Vault!",
                readingHistory: [], favorites: [], submittedStories: [], followers: 0, following: 0,
            };
            localStorage.setItem('currentUser', JSON.stringify({ email: result.user.email, uid: result.user.uid, displayName: result.user.displayName, photoURL: result.user.photoURL }));
            localStorage.setItem('userProfileData', JSON.stringify(userProfileToStore));
            toast({
                title: "Login Successful!",
                description: `Welcome back, ${result.user.displayName || result.user.email}!`,
                variant: "default"
            });
            router.push('/');
        }
    } catch (error: any) {
        let errorMessage = `Failed to sign up with ${providerType}.`;
         if (error.code) {
            switch(error.code) {
                case 'auth/popup-closed-by-user':
                    errorMessage = `Sign-up popup closed by user. Please try again.`;
                    break;
                case 'auth/account-exists-with-different-credential':
                    errorMessage = `An account already exists with this email using a different sign-in method. Try logging in with that method.`;
                    break;
                 case 'auth/operation-not-allowed':
                     errorMessage = `${providerType} sign-in is not enabled. Please contact support.`;
                     break;
                 case 'auth/popup-blocked':
                    errorMessage = `Popup blocked by browser. Please allow popups for this site.`;
                    break;
                default:
                    errorMessage = error.message;
            }
        }
        console.error(`${providerType} signup error:`, error);
        toast({
            title: `${providerType} Sign Up Failed`,
            description: errorMessage,
            variant: "destructive",
        });
    } finally {
        setIsSocialSubmitting(false);
    }
  };

  return (
    <Card className="w-full shadow-xl">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <UserPlus className="h-6 w-6 text-primary" /> Create an Account
        </CardTitle>
        <CardDescription>Step 1: Enter your email and password to join Katha Vault.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input type="email" placeholder="you@example.com" {...field} className="pl-10" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                     <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input type="password" placeholder="Create a strong password" {...field} className="pl-10" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input type="password" placeholder="Re-enter your password" {...field} className="pl-10" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isEmailPassSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isEmailPassSubmitting ? "Creating Account..." : "Create Account & Continue"}
            </Button>
            
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or sign up with</span>
              </div>
            </div>

             <div className="grid grid-cols-2 gap-2 w-full">
                <Button variant="outline" type="button" onClick={() => handleSocialSignup("Google")} disabled={isSubmitting}>
                   {isSocialSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GoogleIconPlaceholder />} Google
                </Button>
                <Button variant="outline" type="button" onClick={() => handleSocialSignup("Facebook")} disabled={isSubmitting}>
                    {isSocialSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FacebookIconPlaceholder />} Facebook
                </Button>
            </div>

            <p className="mt-2 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/auth/login" className="font-medium text-primary hover:underline">
                Login
              </Link>
            </p>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}


    