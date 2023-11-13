import { z } from "zod"
import {Types} from "mongoose"

const userSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
    forgotPasswordToken: z.string().optional(),
    forgotPasswordExpiry: z.number().optional(),
})

export type userType = z.infer<typeof userSchema>
export const loginUserSchema = userSchema.omit({ name: true })
export const userIdSchema = z.string().refine((val) => Types.ObjectId.isValid(val), { message: "Invalid id" })
export {userSchema}