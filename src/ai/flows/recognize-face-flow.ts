'use server';
/**
 * @fileOverview A facial recognition AI agent.
 *
 * - recognizeFace - A function that handles the facial recognition process.
 */

import {ai} from '@/ai/genkit';
import { RecognizeFaceInput, RecognizeFaceInputSchema, RecognizeFaceOutputSchema, RecognizeFaceOutput } from '@/ai/schemas/face-recognition-schemas';


// Create the prompt for the AI model
const recognizeFacePrompt = ai.definePrompt({
    name: 'recognizeFacePrompt',
    input: { schema: RecognizeFaceInputSchema },
    output: { schema: RecognizeFaceOutputSchema },
    prompt: `You are an advanced facial recognition system. 
    Your task is to identify a person from a webcam image by comparing it against a list of enrolled users.

    Analyze the webcam image provided.
    Webcam Image: {{media url=webcamImage}}
    
    Now, compare the face in the webcam image with each of the following enrolled users:
    {{#each enrolledUsers}}
    - User ID: {{this.id}}, Name: {{this.name}}
      Image: {{media url=this.image}}
    {{/each}}
    
    Determine which enrolled user is the best match.
    - If you find a confident match, set "match" to true and provide the "userId" of the matched user.
    - If the person in the webcam image does not match any of the enrolled users, set "match" to false and set "reason" to "No matching user".
    - If you cannot detect a clear face in the webcam image, set "match" to false and set "reason" to "No face detected".
    
    Provide your response in the specified JSON format.`,
});

// Define the Genkit flow for face recognition
const recognizeFaceFlow = ai.defineFlow(
  {
    name: 'recognizeFaceFlow',
    inputSchema: RecognizeFaceInputSchema,
    outputSchema: RecognizeFaceOutputSchema,
  },
  async (input) => {
    // If there are no enrolled users, we can't find a match.
    if (input.enrolledUsers.length === 0) {
      return { match: false, reason: 'No users are enrolled in the system.' };
    }

    const { output } = await recognizeFacePrompt(input);
    if (!output) {
      return { match: false, reason: 'The AI model did not return a response.' };
    }
    return output;
  }
);

// Export a wrapper function to be called from the application
export async function recognizeFace(input: RecognizeFaceInput): Promise<RecognizeFaceOutput> {
  return recognizeFaceFlow(input);
}
