"use client";
import { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket";
import { chat } from "../types/types";

export default function ChatClient({
  chats,
  roomId,
}: {
  chats: chat[];
  roomId: number;
}) {
  const [messages, setMessages] = useState<chat[]>(chats);
  const [currentMessage, setCurrentMessage] = useState("");
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
          setMessages((c) => [
            ...c,
            {
              id: parsedData.id,
              message: parsedData.message,
              userId: parsedData.userId,
              roomId: parsedData.roomId,
            },
          ]);
        }
      };
    }
    return () => {
      socket?.close();
    };
  }, [socket, loading]);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100vw",
        height: "100vh",
      }}
    >
      {messages.map((m) => (
        <div key={m.id}>{m.message}</div>
      ))}
      <div>
        <input type="text" value={currentMessage} onChange={(e) => {
          setCurrentMessage(e.target.value)
        }} placeholder="message"  />
        <button onClick={() => {
          socket?.send(JSON.stringify({
            type: "chat",
            roomId: roomId,
            message: currentMessage
          }));
          setCurrentMessage("")
        }}>Send</button>
      </div>
    </div>
  );
}
