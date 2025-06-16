import * as z from "zod"

export const createPostSchema = z.object({
    thumbnail: z.string(),
    title: z.string().min(1).min(20).max(100),
    content: z.string().min(100).max(4000),
    category: z.string().min(0).max(100),
    summary: z.string().optional(),
    tags: z.array(z.string()).optional(),
    published: z.boolean(),
});