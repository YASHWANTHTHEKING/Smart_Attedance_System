/**
 * @fileOverview Schemas and types for the facial recognition AI agent.
 *
 * - EnrolledUserSchema - Zod schema for an enrolled user.
 * - RecognizeFacesInputSchema - Zod schema for the face recognition input.
 * - RecognizeFacesOutputSchema - Zod schema for the face recognition output.
 * - RecognizeFacesInput - The input type for the recognizeFaces function.
 * - RecognizeFacesOutput - The return type for the recognizeFaces function.
 */
import { z } from 'zod';

// Define a schema for a single enrolled user
export const EnrolledUserSchema = z.object({
  id: z.string().describe('The unique identifier for the user.'),
  name: z.string().describe('The name of the user.'),
  image: z.string().describe("A data URI of the user's enrolled image."),
});

// Define the input schema for the face recognition flow
export const RecognizeFacesInputSchema = z.object({
  webcamImage: z
    .string()
    .describe(
      "A photo from the webcam, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  enrolledUsers: z.array(EnrolledUserSchema).describe('A list of all enrolled users with their images.'),
});
export type RecognizeFacesInput = z.infer<typeof RecognizeFacesInputSchema>;


const MatchedUserSchema = z.object({
    userId: z.string().describe('The ID of the matched user.'),
    name: z.string().describe('The name of the matched user.'),
});

// Define the output schema for the face recognition flow
export const RecognizeFacesOutputSchema = z.object({
    matches: z.array(MatchedUserSchema).describe('An array of all recognized users found in the image.'),
});
export type RecognizeFacesOutput = z.infer<typeof RecognizeFacesOutputSchema>;
