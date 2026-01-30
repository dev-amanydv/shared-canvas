import axios from "axios";
import { BACKEND_URL } from "../config";
import ChatClient from "./ChatClient";
import { chat } from "../types/types";

async function getChats(roomId: number): Promise<[chat]> {
  try {
    const res = await axios.get(`${BACKEND_URL}/chat/${roomId}`);
    return res.data.data.chats;
  } catch (error) {
    console.error("error getting chats: ", error);
    return [
      {
        id: 0,
        message: "",
        userId: "",
        roomId: 0,
      },
    ];
  }
}

export default async function ChatRoom({ roomId }: { roomId: number }) {
  const chats = await getChats(roomId);

  return <ChatClient roomId={roomId} chats={chats} />;
}
