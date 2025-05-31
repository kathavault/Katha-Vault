
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
import { Mail, KeyRound, ArrowLeft, Loader2 } from "lucide-react"; // Added Loader2
import { auth } from "@/lib/firebase"; // Import Firebase auth instance
import { sendPasswordResetEmail } from "firebase/auth"; // Import FirebaseError from firebase/auth
import { FirebaseError } from "firebase/app";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const { formState: { isSubmitting } } = form;

  const onSubmit: SubmitHandler<ForgotPasswordFormData> = async (data) => {
    try {
      await sendPasswordResetEmail(auth, data.email);
      toast({
        title: "Password Reset Initiated",
        description: `If an account exists for ${data.email}, a password reset link has been sent. Please check your inbox.`,
        variant: "default",
      });
      form.reset();
    } catch (error) {
      let errorMessage = "An unexpected error occurred.";
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case "auth/user-not-found":
            // It's common practice not to reveal if an email exists for security reasons
            // So, show a generic message.
            errorMessage = `If an account exists for ${data.email}, a password reset link has been sent. Please check your inbox.`;
            break;
          case "auth/invalid-email":
            errorMessage = "The email address is not valid.";
            break;
          default:
            errorMessage = `Failed to send reset email: ${error.message}`;
        }
      }
      console.error("Forgot password error:", error);
      toast({
        title: "Error Sending Reset Email",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full shadow-xl">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <KeyRound className="h-6 w-6 text-primary" /> Forgot Your Password?
        </CardTitle>
        <CardDescription>No worries! Enter your email and we&apos;ll send you a reset link.</CardDescription>
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
                       <Input type="email" placeholder="Enter your registered email" {...field} className="pl-10" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isSubmitting ? "Sending..." : "Send Reset Link"}
            </Button>
             <Button variant="outline" className="w-full" asChild>
                <Link href="/auth/login">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Login
                </Link>
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
