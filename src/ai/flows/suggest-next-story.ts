'use server';
/**
 * @fileOverview Suggests new stories to readers based on their reading history.
 *
 * - suggestNextStory - A function that suggests the next story for a user.
 * - SuggestNextStoryInput - The input type for the suggestNextStory function.
 * - SuggestNextStoryOutput - The return type for the suggestNextStory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestNextStoryInputSchema = z.object({
  readingHistory: z
    .string()
    .describe('The reading history of the user, as a comma separated list of story titles.'),
});
export type SuggestNextStoryInput = z.infer<typeof SuggestNextStoryInputSchema>;

const SuggestNextStoryOutputSchema = z.object({
  suggestedStoryTitle: z.string().describe('The title of the suggested story.'),
  reason: z.string().describe('The reason for suggesting this story.'),
});
export type SuggestNextStoryOutput = z.infer<typeof SuggestNextStoryOutputSchema>;

export async function suggestNextStory(input: SuggestNextStoryInput): Promise<SuggestNextStoryOutput> {
  return suggestNextStoryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestNextStoryPrompt',
  input: {schema: SuggestNextStoryInputSchema},
  output: {schema: SuggestNextStoryOutputSchema},
  prompt: `You are a story suggestion expert. Given a user's reading history, you will suggest a new story that they might enjoy.

Reading History: {{{readingHistory}}}

Suggest a story that the user might enjoy, and explain why you are suggesting it.

Return the title of the suggested story and the reason for suggesting it.
`,
});

const suggestNextStoryFlow = ai.defineFlow(
  {
    name: 'suggestNextStoryFlow',
    inputSchema: SuggestNextStoryInputSchema,
    outputSchema: SuggestNextStoryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
