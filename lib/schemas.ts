import { z } from 'zod'

const nonEmptyString = z.string().min(1, 'Obavezno polje')

export const adminLoginSchema = z.object({
  action: z.literal('login'),
  password: nonEmptyString,
})

export const adminToggleApprovalSchema = z.object({
  action: z.literal('toggleApproval'),
  storyId: nonEmptyString,
})

export const adminDeleteStorySchema = z.object({
  action: z.literal('deleteStory'),
  storyId: nonEmptyString,
})

export const createStorySchema = z.object({
  title: nonEmptyString.max(200),
  author: nonEmptyString.max(100),
  body: nonEmptyString.max(50_000),
})

export const createCommentSchema = z.object({
  storyId: nonEmptyString,
  authorName: z.string().max(100).optional(),
  content: z.string().min(3).max(1000),
  mathAnswer: z.coerce.number().int().min(0).max(20),
  honeypot: z.string().max(0).optional(),
})

export const submitRatingSchema = z.object({
  storyId: nonEmptyString,
  rating: z.number().int().min(1).max(5),
  userId: z.string().max(200).optional(),
})

export type CreateStoryInput = z.infer<typeof createStorySchema>
export type CreateCommentInput = z.infer<typeof createCommentSchema>
export type SubmitRatingInput = z.infer<typeof submitRatingSchema>
