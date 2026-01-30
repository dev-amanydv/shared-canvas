import { prismaClient } from "@repo/db/client";
import AsyncHandler from "../utils/AsyncHandler.js";

export const getRoomChats = AsyncHandler(async (req, res) => {
    const roomId = Number(req.params.roomId);

    const chats = await prismaClient.chat.findMany({
        where: {
            roomId: roomId
        },
        orderBy: {
            id: "asc"
        },
        take: 2
    });

    res.status(200).json({
        status: "success",
        data: {
            chats
        }
    })
})