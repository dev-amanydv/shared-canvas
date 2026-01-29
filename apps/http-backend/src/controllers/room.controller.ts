import { CreateRoomSchema } from "@repo/common/types"
import { BadRequestError, ConflictError } from "../middlewares/errors/errorTypes.js";
import { prismaClient } from "@repo/db/client";
import { Request, Response } from "express";
import AsyncHandler from "../utils/AsyncHandler.js";

export const handleCreateRoom = AsyncHandler(async (req: Request, res: Response) => {
    const parsedData = CreateRoomSchema.safeParse(req.body);
    if (!parsedData.success){
        throw new BadRequestError('Invalid body type')
    }

    const userId = req.userId || "";
    
    const roomExist = await prismaClient.room.findUnique({
        where: {
            slug: parsedData.data.slug
        }
    });
    if (roomExist) {
        throw new ConflictError('Slug not available')
    }

    const room = await prismaClient.room.create({
        data: {
            slug: parsedData.data.slug,
            name: parsedData.data.name,
            adminId: userId
        }
    });

    res.status(203).json({
        msg: "Room created successfully!",
        data: {
            room: {
                roomId: room.id,
                slug: room.slug,
                name: room.name,
            }
        }
    })
})