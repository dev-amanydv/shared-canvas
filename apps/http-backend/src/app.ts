import express, { Express } from "express";
import authRouter from "./routes/auth.route.js";
import roomRouter from "./routes/room.route.js";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/error.middleware.js";

const app: Express = express();

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({
    message: "Server is running",
  });
});

app.use("/auth", authRouter);
app.use("/room", roomRouter);

app.use(errorHandler);

export default app;
