import { Router } from "express";
import { handleLogin, handleSignup } from "../controllers/auth.controller.js";

const router: Router = Router();

router.post('/signup', handleSignup);
router.post('/signin', handleLogin);

export default router;