
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
import { auth } from "@/lib/firebase"; 
import { signInWithEmailAndPassword, FirebaseError } from "firebase/auth";
import { useRouter } from 'next/navigation';

const GoogleIcon = () => <Mail className="mr-2 h-4 w-4" />; 
const FacebookIcon = () => <Mail className="mr-2 h-4 w-4" />; 

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { formState: { isSubmitting } } = form;

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      
      if (!userCredential.user.emailVerified) {
        toast({
          title: "Email Not Verified",
          description: "Please verify your email address before logging in. Check your inbox for a verification link.",
          variant: "destructive",
        });
        // await auth.signOut(); // Optionally sign out
        return;
      }
      
      // Store minimal user info to indicate logged-in state
      localStorage.setItem('currentUser', JSON.stringify({ email: userCredential.user.email }));

      toast({
        title: "Login Successful!",
        description: `Welcome back, ${userCredential.user.email}!`,
        variant: "default"
      });
      router.push('/'); 
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

  const handleSocialLogin = (provider: "Google" | "Facebook") => {
    toast({
        title: `${provider} Login (Simulated)`,
        description: `This would initiate ${provider} OAuth flow. (Not implemented)`,
    });
  };

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
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isSubmitting ? "Logging in..." : "Login"}
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
                <Button variant="outline" type="button" onClick={() => handleSocialLogin("Google")}>
                    <GoogleIcon /> Google
                </Button>
                <Button variant="outline" type="button" onClick={() => handleSocialLogin("Facebook")}>
                    <FacebookIcon /> Facebook
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
