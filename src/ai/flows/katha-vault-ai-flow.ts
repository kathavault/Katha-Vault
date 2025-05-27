
'use server';
/**
 * @fileOverview A conversational AI for Katha Vault.
 *
 * - kathaVaultAiChat - A function that handles chat interactions with the Katha Vault AI.
 * - KathaVaultAiInput - The input type for the kathaVaultAiChat function.
 * - KathaVaultAiOutput - The return type for the kathaVaultAiChat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const KathaVaultAiInputSchema = z.object({
  userInput: z.string().describe('The user message to the AI.'),
  // Optional: You could add chatHistory here later if needed for more context
  // chatHistory: z.array(z.object({ role: z.enum(['user', 'model']), content: z.string() })).optional(),
});
export type KathaVaultAiInput = z.infer<typeof KathaVaultAiInputSchema>;

const KathaVaultAiOutputSchema = z.object({
  aiResponse: z.string().describe('The AI response to the user.'),
});
export type KathaVaultAiOutput = z.infer<typeof KathaVaultAiOutputSchema>;

export async function kathaVaultAiChat(input: KathaVaultAiInput): Promise<KathaVaultAiOutput> {
  return kathaVaultAiFlow(input);
}

const kathaVaultAiPrompt = ai.definePrompt({
  name: 'kathaVaultAiPrompt',
  input: {schema: KathaVaultAiInputSchema},
  output: {schema: KathaVaultAiOutputSchema},
  prompt: `You are Katha Vault AI, a friendly and helpful assistant for the Katha Vault website, a platform for reading and discovering stories and novels.

Your primary role is to help users by:
- Answering questions about stories and novels available on Katha Vault (if you have access to that information).
- Suggesting stories based on genres or themes if the user asks.
- Providing information about how to use the Katha Vault website (e.g., how to find stories, how to use features, if this information is made available to you).

You MUST NOT:
- Share any personal information about any user of Katha Vault. This includes usernames, emails, reading history, or any other private data.
- Reveal any internal or confidential details about the Katha Vault website's operations, database, or non-public data.
- Engage in conversations outside the scope of Katha Vault stories and website features.
- Generate or discuss harmful, offensive, or inappropriate content.

You can converse in both English and Hindi. Respond in the language the user primarily uses in their message. If the user uses a mix, prefer English unless explicitly asked for Hindi.

User's current message: {{{userInput}}}

Provide a helpful and relevant response based on the user's message, adhering to all the rules above.
`,
  config: {
    safetySettings: [
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
    ],
  },
});

const kathaVaultAiFlow = ai.defineFlow(
  {
    name: 'kathaVaultAiFlow',
    inputSchema: KathaVaultAiInputSchema,
    outputSchema: KathaVaultAiOutputSchema,
  },
  async (input) => {
    // For more advanced scenarios, you might fetch story data here using a tool
    // or service before calling the prompt if the AI needs specific context.
    const {output} = await kathaVaultAiPrompt(input);
    return output!;
  }
);
