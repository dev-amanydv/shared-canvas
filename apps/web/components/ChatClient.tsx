"use client";
import { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket";
import { chat } from "../types/types";
import { parse } from "path";

export default function ChatClient({
  chats,
  roomId,
}: {
  chats: chat[];
  roomId: number;
}) {
  const [messages, setMessages] = useState<chat[]>(chats);
  const { socket, loading } = useSocket();

  useEffect(() => {
    if (socket && !loading) {
      socket.send(
        JSON.stringify({
          type: "join-room",
          roomId: roomId,
        }),
      );

      socket.onmessage = (event) => {
        const parsedData = JSON.parse(event.data);
        if (parsedData.type === "chat") {
          setMessages((c) => [...c, {id: 0, message: parsedData.message, userId: "0", roomId: parsedData.roomId}]);
        }
      };
    }
    return () => {
      socket?.close();
    };
  }, [socket, loading]);
  return <div>{messages.map((m) => m.message)}</div>;
}
