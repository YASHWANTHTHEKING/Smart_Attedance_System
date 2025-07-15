/**
 * @fileOverview Schemas and types for the facial recognition AI agent.
 *
 * - EnrolledUserSchema - Zod schema for an enrolled user.
 * - RecognizeFaceInputSchema - Zod schema for the face recognition input.
 * - RecognizeFaceOutputSchema - Zod schema for the face recognition output.
 * - RecognizeFaceInput - The input type for the recognizeFace function.
 * - RecognizeFaceOutput - The return type for the recognizeFace function.
 */
import { z } from 'zod';

// Define a schema for a single enrolled user
export const EnrolledUserSchema = z.object({
  id: z.string().describe('The unique identifier for the user.'),
  name: z.string().describe('The name of the user.'),
  image: z.string().describe("A data URI of the user's enrolled image."),
});

// Define the input schema for the face recognition flow
export const RecognizeFaceInputSchema = z.object({
  webcamImage: z
    .string()
    .describe(
      "A photo from the webcam, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  enrolledUsers: z.array(EnrolledUserSchema).describe('A list of all enrolled users with their images.'),
});
export type RecognizeFaceInput = z.infer<typeof RecognizeFaceInputSchema>;

// Define the output schema for the face recognition flow
export const RecognizeFaceOutputSchema = z.object({
    match: z.boolean().describe('Whether a match was found.'),
    userId: z.string().optional().describe('The ID of the matched user if a match was found.'),
    reason: z.string().optional().describe('The reason for no match, e.g. "No face detected" or "No matching user".'),
});
export type RecognizeFaceOutput = z.infer<typeof RecognizeFaceOutputSchema>;
