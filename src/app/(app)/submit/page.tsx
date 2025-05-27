"use client";

import { useForm, useFieldArray, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { PlusCircle, Trash2, UploadCloud } from "lucide-react";

const chapterSchema = z.object({
  title: z.string().min(3, "Chapter title must be at least 3 characters"),
  content: z.string().min(100, "Chapter content must be at least 100 characters"),
});

const storySchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  genre: z.string().min(1, "Please select a genre"),
  tags: z.string().refine(value => value.split(',').every(tag => tag.trim().length > 0) && value.split(',').length > 0, {
    message: "Please provide at least one tag, separated by commas.",
  }),
  coverImage: z.string().url("Must be a valid URL").optional().or(z.literal('')),
  chapters: z.array(chapterSchema).min(1, "At least one chapter is required"),
});

type StoryFormData = z.infer<typeof storySchema>;

export default function SubmitStoryPage() {
  const form = useForm<StoryFormData>({
    resolver: zodResolver(storySchema),
    defaultValues: {
      title: "",
      description: "",
      genre: "",
      tags: "",
      coverImage: "",
      chapters: [{ title: "", content: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "chapters",
  });

  const onSubmit: SubmitHandler<StoryFormData> = (data) => {
    console.log("Story Submitted:", data);
    toast({
      title: "Story Submitted!",
      description: `"${data.title}" has been successfully submitted for review.`,
      variant: "default",
    });
    form.reset(); 
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <header className="flex items-center gap-4">
        <UploadCloud className="h-10 w-10 text-primary" />
        <h1 className="text-3xl font-bold text-primary">Submit Your Story</h1>
      </header>
      <p className="text-muted-foreground">Share your masterpiece with the world. Fill out the details below to submit your story. Make sure to follow our content guidelines.</p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Story Details</CardTitle>
              <CardDescription>Provide the main information about your story.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl><Input placeholder="The Adventure of the Lost Key" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description / Synopsis</FormLabel>
                    <FormControl><Textarea placeholder="A short summary of your story..." {...field} rows={4} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="genre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Genre</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select a genre" /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="fantasy">Fantasy</SelectItem>
                          <SelectItem value="sci-fi">Science Fiction</SelectItem>
                          <SelectItem value="mystery">Mystery</SelectItem>
                          <SelectItem value="romance">Romance</SelectItem>
                          <SelectItem value="thriller">Thriller</SelectItem>
                          <SelectItem value="historical">Historical Fiction</SelectItem>
                          <SelectItem value="horror">Horror</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <FormControl><Input placeholder="e.g., magic, space, detective" {...field} /></FormControl>
                      <FormDescription>Comma-separated list of tags.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="coverImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cover Image URL (Optional)</FormLabel>
                    <FormControl><Input type="url" placeholder="https://example.com/cover.jpg" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Chapters</CardTitle>
              <CardDescription>Add the content for each chapter of your story.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {fields.map((field, index) => (
                <div key={field.id} className="p-4 border rounded-md space-y-4 relative">
                  <h4 className="font-semibold">Chapter {index + 1}</h4>
                  <FormField
                    control={form.control}
                    name={`chapters.${index}.title`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Chapter Title</FormLabel>
                        <FormControl><Input placeholder={`Chapter ${index + 1}: The Beginning`} {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`chapters.${index}.content`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Chapter Content</FormLabel>
                        <FormControl><Textarea placeholder="Start writing your chapter here..." {...field} rows={10} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => remove(index)}
                      className="absolute top-2 right-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => append({ title: "", content: "" })}
                className="w-full"
              >
                <PlusCircle className="mr-2 h-4 w-4" /> Add Chapter
              </Button>
            </CardContent>
          </Card>

          <CardFooter className="flex justify-end p-0 pt-6">
            <Button type="submit" size="lg" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Submitting..." : "Submit Story"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </div>
  );
}
