import { z } from 'zod';

export const SubmitEntrySchema = z.object({
  submissionUrl: z.string().url('Must be a valid video or file submission URL'),
  notes: z.string().max(500, 'Notes cannot exceed 500 characters').optional().default(''),
});

export type SubmitEntryDto = z.infer<typeof SubmitEntrySchema>;

