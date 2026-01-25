import express, { Express } from "express";
import jwt from "jsonwebtoken";
import { authMiddleware } from "./middlewares/auth.middleware.js";
import { JWT_SECRET } from "@repo/backend-common/config";
import {
  CreateUserSchema,
  SigninSchema,
  CreateRoomSchema,
} from "@repo/common/types";
import { prismaClient } from "@repo/db/client";

const app: Express = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Server is running",
  });
});

app.post("/signup", async (req, res) => {
  try {
    const parsedData = CreateUserSchema.safeParse(req.body);
    if (!parsedData.success) {
      console.error("Invalid inputs");
      return;
    }

    const newUser = await prismaClient.user.create({
      data: {
        name: parsedData.data.name,
        password: parsedData.data.password,
        email: parsedData.data.email,
        id: "123",
      },
    });
    console.log("newUser: ", newUser);

    const token = jwt.sign({ email: newUser.email }, JWT_SECRET);

    res.json({
      msg: "Account created successfully",
      token: token,
    });
  } catch (error) {
    console.log("Error in signup: ", error);
    res.json({
      msg: "Internal Server Error",
    });
  }
});

app.post("/signin", (req, res) => {
  try {
    const data = SigninSchema.safeParse(req.body);
    if (!data.success) {
      console.error("Invalid inputs");
      return;
    }

    const token = jwt.sign({ username: data }, JWT_SECRET);

    res.json({
      msg: "Account logged in successfully",
      token: token,
    });
  } catch (error) {
    console.log("Error in signin: ", error);
    res.json({
      msg: "Internal Server Error",
    });
  }
});

app.post("/create-room", authMiddleware, (req, res) => {
  const data = CreateRoomSchema.safeParse(req.body);
  if (!data.success) {
    console.error("Invalid inputs");
    return;
  }
});

export default app;
