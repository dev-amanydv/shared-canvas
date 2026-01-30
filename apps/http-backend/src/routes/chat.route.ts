import { Router } from "express";
import { getRoomChats } from "../controllers/chat.controller.js";

const router: Router = Router();

router.get('/:roomId', getRoomChats);

export default router;