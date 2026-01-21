import express, { Express } from "express";
import jwt from "jsonwebtoken";
import { authMiddleware } from "./middlewares/auth.middleware";
import { JWT_SECRET } from "@repo/backend-common/config";
import { CreateUserSchema, SigninSchema, CreateRoomSchema } from "@repo/common/types";

const app: Express = express();

app.get('/', (req, res) => {
    res.json({
        message: "Server is running"
    })
});

app.post('/signup', (req, res) => {
    try {
        const data = CreateUserSchema.safeParse(req.body);
        if (!data.success){
            console.error("Invalid inputs");
            return;
        }
        //db call
        const token = jwt.sign({username: data.username}, JWT_SECRET);

        res.json({
            msg: "Account created successfully",
            token: token
        })
    } catch (error) {
        console.log('Error in signup: ', error);
        res.json({
            msg: "Internal Server Error"
        })
    }
})

app.post('/signin', (req, res) => {
    try {
        const data = SigninSchema.safeParse(req.body);
        if (!data.success){
            console.error("Invalid inputs");
            return;
        }
        //db call

        const token = jwt.sign({username: data.username}, JWT_SECRET);

        res.json({
            msg: "Account logged in successfully",
            token: token
        })
    } catch (error) {
        console.log('Error in signin: ', error);
        res.json({
            msg: "Internal Server Error"
        })
    }
})

app.post('/create-room', authMiddleware,  (req, res) => {

    const data = CreateRoomSchema.safeParse(req.body);
    if (!data.success){
        console.error("Invalid inputs");
        return;
    }

    
})

export default app;

