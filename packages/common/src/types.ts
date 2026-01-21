import z from "zod";

export const CreateUserSchema = z.object({
    "username": z.string().max(4),
    "password": z.string().min(4),
})

export const SigninSchema = z.object({
    "username": z.string().min(3).max(30),
    "password": z.string().min(3),
})

export const CreateRoomSchema = z.object({
    "name": z.string().min(3).max(20)
})