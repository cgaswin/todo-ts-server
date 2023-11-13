import { z } from "zod";

export const todoSchema = z.object({
    id: z.string().uuid(),
    title: z.string(),
    description: z.string(),
    completed: z.boolean(),
})

export const todoIdSchema = z.string().uuid();
export const createTodoSchema = todoSchema.omit({ id: true ,completed:true});

export type TodoType = z.infer<typeof todoSchema>



