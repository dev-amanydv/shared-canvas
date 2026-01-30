import { Router } from "express";
import { getRoomId, handleCreateRoom } from "../controllers/room.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router: Router = Router();

router.post('/create', authMiddleware, handleCreateRoom);
router.get('/:slug', getRoomId)
export default router;