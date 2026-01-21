import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface AuthJwtPayload extends JwtPayload {
    userId: string;
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers["authorization"] ?? "";
    const decoded = jwt.verify(token, 'secret') as AuthJwtPayload;

    if (decoded){
        req.userId = decoded.userId;
        next();
    } else {
        res.status(403).json({
            msg: "Unauthorized"
        })
    }
}