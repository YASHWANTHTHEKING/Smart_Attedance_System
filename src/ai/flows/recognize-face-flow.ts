'use server';
/**
 * @fileOverview A facial recognition AI agent.
 *
 * - recognizeFace - A function that handles the facial recognition process.
 */

import {ai} from '@/ai/genkit';
import { RecognizeFacesInput, RecognizeFacesInputSchema, RecognizeFacesOutputSchema, RecognizeFacesOutput } from '@/ai/schemas/face-recognition-schemas';


// Create the prompt for the AI model
const recognizeFacesPrompt = ai.definePrompt({
    name: 'recognizeFacesPrompt',
    input: { schema: RecognizeFacesInputSchema },
    output: { schema: RecognizeFacesOutputSchema },
    prompt: `You are an advanced facial recognition system. 
    Your task is to identify all known people from a webcam image by comparing them against a list of enrolled users.

    Analyze the webcam image provided.
    Webcam Image: {{media url=webcamImage}}
    
    Now, compare all the faces you can find in the webcam image with each of the following enrolled users:
    {{#each enrolledUsers}}
    - User ID: {{this.id}}, Name: {{this.name}}
      Image: {{media url=this.image}}
    {{/each}}
    
    For each person in the webcam image that you can confidently match to an enrolled user, add them to the 'matches' array in the output.
    - If no faces are detected, or no faces match any enrolled users, return an empty 'matches' array.
    
    Provide your response in the specified JSON format.`,
});

// Define the Genkit flow for face recognition
const recognizeFacesFlow = ai.defineFlow(
  {
    name: 'recognizeFacesFlow',
    inputSchema: RecognizeFacesInputSchema,
    outputSchema: RecognizeFacesOutputSchema,
  },
  async (input) => {
    // If there are no enrolled users, we can't find a match.
    if (input.enrolledUsers.length === 0) {
      return { matches: [] };
    }

    const { output } = await recognizeFacesPrompt(input);
    if (!output) {
      return { matches: [] };
    }
    return output;
  }
);

// Export a wrapper function to be called from the application
export async function recognizeFaces(input: RecognizeFacesInput): Promise<RecognizeFacesOutput> {
  return recognizeFacesFlow(input);
}
