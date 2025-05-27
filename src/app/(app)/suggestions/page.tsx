"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Sparkles, Lightbulb, BookHeart, Loader2 } from "lucide-react";
import { suggestNextStory, type SuggestNextStoryInput, type SuggestNextStoryOutput } from "@/ai/flows/suggest-next-story"; // Correct path

const suggestionsSchema = z.object({
  readingHistory: z.string().min(5, "Please enter some of your reading history (e.g., titles of books you liked)."),
});

type SuggestionsFormData = z.infer<typeof suggestionsSchema>;

// Mock user reading history for pre-fill
const mockUserReadingHistory = "The Lost City of Zorath, Chronicles of the Starfarers, A Tale of Two Planets";

export default function AISuggestionsPage() {
  const [suggestion, setSuggestion] = useState<SuggestNextStoryOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<SuggestionsFormData>({
    resolver: zodResolver(suggestionsSchema),
    defaultValues: {
      readingHistory: mockUserReadingHistory, // Pre-fill with mock data
    },
  });

  const onSubmit: SubmitHandler<SuggestionsFormData> = async (data) => {
    setIsLoading(true);
    setError(null);
    setSuggestion(null);
    try {
      const result = await suggestNextStory(data);
      setSuggestion(result);
    } catch (e) {
      console.error("Error fetching suggestions:", e);
      setError("Failed to fetch story suggestions. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <header className="flex items-center gap-4">
        <Sparkles className="h-10 w-10 text-primary" />
        <h1 className="text-3xl font-bold text-primary">AI Story Suggestions</h1>
      </header>
      <p className="text-muted-foreground">
        Tell us about stories you've enjoyed, and our AI will suggest your next great read!
        The more titles you provide, the better the suggestions.
      </p>

      <Card className="shadow-lg">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle>Your Reading Preferences</CardTitle>
              <CardDescription>Enter titles of stories or books you've liked, separated by commas.</CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="readingHistory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="readingHistoryInput">Reading History</FormLabel>
                    <FormControl>
                      <Textarea
                        id="readingHistoryInput"
                        placeholder="e.g., Dune, Harry Potter and the Sorcerer's Stone, The Martian"
                        {...field}
                        rows={5}
                        className="resize-none"
                      />
                    </FormControl>
                    <FormDescription>
                      The more books you list, the better the AI can understand your taste.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Getting Suggestions...
                  </>
                ) : (
                  <>
                    <Lightbulb className="mr-2 h-4 w-4" /> Get Suggestions
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {suggestion && !isLoading && (
        <Card className="mt-8 animate-in fade-in-50 duration-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <BookHeart className="h-6 w-6" /> Here's a suggestion for you:
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <h3 className="text-xl font-semibold text-accent-foreground">{suggestion.suggestedStoryTitle}</h3>
            <div>
                <p className="font-medium text-muted-foreground">Reasoning:</p>
                <p className="text-foreground/90 leading-relaxed">{suggestion.reason}</p>
            </div>
            {/* You could add a Link here if you can map suggestedStoryTitle to an actual story in your DB */}
            {/* <Button asChild variant="link" className="p-0"><Link href={`/search?q=${encodeURIComponent(suggestion.suggestedStoryTitle)}`}>Find this story</Link></Button> */}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
