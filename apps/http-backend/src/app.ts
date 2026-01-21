import express, { Express } from "express";
import jwt from "jsonwebtoken";
import { authMiddleware } from "./middlewares/auth.middleware";

const app: Express = express();

app.get('/', (req, res) => {
    res.json({
        message: "Server is running"
    })
});

app.post('/signup', (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password){
            throw new Error("Username and password are required");
        }
        //db call
        const token = jwt.sign({username: username}, 'secret');

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
        const { username, password } = req.body;

        if (!username || !password){
            throw new Error("Username and password are required");
        }
        //db call

        const token = jwt.sign({username: username}, 'secret');

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
    
})

export default app;

