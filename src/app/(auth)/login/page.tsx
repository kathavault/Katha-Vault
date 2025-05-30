
"use client";

import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { LogIn, Mail, Lock, Loader2 } from "lucide-react"; 
import { auth, googleProvider, facebookProvider } from "@/lib/firebase"; 
import { signInWithEmailAndPassword, signInWithPopup, FirebaseError, type AuthProvider } from "firebase/auth";
import { useRouter } from 'next/navigation';
import type { UserProfile } from '@/types';


const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const defaultUserProfilePlaceholder: Partial<UserProfile> = {
  name: 'Katha User',
  username: 'katha_user',
  bio: "Welcome to Katha Vault!",
  avatarUrl: 'https://placehold.co/150x150/7E3AF2/FFFFFF?text=KU',
};


export default function LoginPage() {
  const router = useRouter();
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { formState: { isSubmitting: isEmailPassSubmitting } } = form;
  const [isSocialSubmitting, setIsSocialSubmitting] = useState(false);
  const isSubmitting = isEmailPassSubmitting || isSocialSubmitting;

  const handleSuccessfulLogin = (user: import('firebase/auth').User) => {
    const userProfileToStore: UserProfile = {
        id: user.uid,
        email: user.email || 'unknown@example.com',
        name: user.displayName || user.email?.split('@')[0] || defaultUserProfilePlaceholder.name,
        username: user.email?.split('@')[0] || defaultUserProfilePlaceholder.username,
        avatarUrl: user.photoURL || `https://placehold.co/150x150/B4317B/F7F2FA?text=${(user.email?.substring(0,1) || 'U').toUpperCase()}`,
        bio: defaultUserProfilePlaceholder.bio,
        readingHistory: [],
        favorites: [],
        submittedStories: [],
        followers: 0,
        following: 0,
      };
      localStorage.setItem('currentUser', JSON.stringify({ email: user.email, uid: user.uid, displayName: user.displayName, photoURL: user.photoURL }));
      localStorage.setItem('userProfileData', JSON.stringify(userProfileToStore));

      toast({
        title: "Login Successful!",
        description: `Welcome back, ${user.displayName || user.email}!`,
        variant: "default"
      });
      router.push('/'); 
      // router.refresh(); // Force refresh to update layout state
  }

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      
      if (!userCredential.user.emailVerified) {
        toast({
          title: "Email Not Verified",
          description: "Please verify your email address before logging in. Check your inbox for a verification link.",
          variant: "destructive",
          duration: 7000,
        });
        // await auth.signOut(); 
        return;
      }
      handleSuccessfulLogin(userCredential.user);
    } catch (error) {
      let errorMessage = "An unexpected error occurred during login.";
       if (error instanceof FirebaseError) {
        switch (error.code) {
          case "auth/user-not-found":
          case "auth/wrong-password":
          case "auth/invalid-credential": 
            errorMessage = "Invalid email or password. Please try again.";
            break;
          case "auth/invalid-email":
            errorMessage = "The email address is not valid.";
            break;
          case "auth/user-disabled":
            errorMessage = "This user account has been disabled.";
            break;
          default:
            errorMessage = `Login failed: ${error.message}`;
        }
      }
      console.error("Login error:", error);
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleSocialLogin = async (providerType: "Google" | "Facebook") => {
    setIsSocialSubmitting(true);
    const provider: AuthProvider = providerType === "Google" ? googleProvider : facebookProvider;
    try {
        const result = await signInWithPopup(auth, provider);
        handleSuccessfulLogin(result.user);
    } catch (error: any) {
        let errorMessage = `Failed to sign in with ${providerType}.`;
        if (error instanceof FirebaseError) {
            switch(error.code) {
                case 'auth/popup-closed-by-user':
                    errorMessage = `Sign-in popup closed by user. Please try again.`;
                    break;
                case 'auth/account-exists-with-different-credential':
                    errorMessage = `An account already exists with the same email address but different sign-in credentials. Sign in using a provider associated with this email address.`;
                    break;
                case 'auth/cancelled-popup-request':
                    errorMessage = 'Sign-in cancelled. Please try again.';
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
        console.error(`${providerType} login error:`, error);
        toast({
            title: `${providerType} Login Failed`,
            description: errorMessage,
            variant: "destructive",
        });
    } finally {
        setIsSocialSubmitting(false);
    }
  };

  const GoogleIconPlaceholder = () => <Mail className="mr-2 h-4 w-4" />; 
  const FacebookIconPlaceholder = () => <Mail className="mr-2 h-4 w-4" />; 


  return (
    <Card className="w-full shadow-xl">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <LogIn className="h-6 w-6 text-primary" /> Login to Katha Vault
        </CardTitle>
        <CardDescription>Enter your credentials to access your account.</CardDescription>
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
                       <Input type="password" placeholder="••••••••" {...field} className="pl-10" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="text-sm text-right">
              <Link href="/auth/forgot-password" className="font-medium text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isEmailPassSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isEmailPassSubmitting ? "Logging in..." : "Login"}
            </Button>
            
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 w-full">
                <Button variant="outline" type="button" onClick={() => handleSocialLogin("Google")} disabled={isSubmitting}>
                    {isSocialSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GoogleIconPlaceholder />} Google
                </Button>
                <Button variant="outline" type="button" onClick={() => handleSocialLogin("Facebook")} disabled={isSubmitting}>
                    {isSocialSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FacebookIconPlaceholder />} Facebook
                </Button>
            </div>

            <p className="mt-2 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link 
                href="/auth/signup" 
                className="font-medium text-primary hover:underline"
              >
                Sign Up
              </Link>
            </p>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
