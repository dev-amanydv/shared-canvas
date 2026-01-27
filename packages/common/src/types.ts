import z from "zod";

export const CreateUserSchema = z.object({
    "email": z.email(),
    "password": z.string().min(4),
    "name": z.string().min(4).max(20)
})

export const SigninSchema = z.object({
    "email": z.email(),
    "password": z.string().min(3),
})

export const CreateRoomSchema = z.object({
    "name": z.string().min(3).max(20),
    "slug": z.string().min(3).max(20),
})