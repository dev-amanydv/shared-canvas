"use client";
import { initDraw } from "@/draw";
import { useEffect, useRef } from "react";
import Nav from "./Nav";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { selectActiveTool } from "@/store/selectors";
import axios from "axios";
import { HTTP_BACKEND } from "@/config";
import { addElement, loadElements } from "@/store/slices/canvasSlice";
import { useCanvasDraw } from "@/hooks/useCanvasDraw";

const CURSOR_MAP: Record<string, string> = {
  select: "default",
  hand: "grab",
  rectangle: "crosshair",
  circle: "crosshair",
  diamond: "crosshair",
  line: "crosshair",
  arrow: "crosshair",
  pencil: "url('/cursors/pencil.cur'), crosshair",
  text: "text",
  eraser: "url('/cursors/eraser.cur'), cell",
};

export default function Canvas({
  roomId,
  socket,
}: {
  roomId: string;
  socket: WebSocket;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dispatch = useAppDispatch();
  const activeTool = useAppSelector(selectActiveTool);

  useEffect(() => {
    const loadExisting = async () => {
        const res = await axios.get(`${HTTP_BACKEND}/chats/${roomId}`)
        const messages = res.data.data.chats;

        const elements = messages.map((x: { message: string }) => JSON.parse(x.message))
        dispatch(loadElements(elements));
    }
    // loadExisting();
  }, [roomId, dispatch])

  useEffect(() => {
    // socket.onmessage = (event) => {
    //     const message = JSON.parse(event.data);
    //     if (message.type === "chat"){
    //         const element = JSON.parse(message.message);
    //         dispatch(addElement(element))
    //     }
    // }
  }, [socket, dispatch]);

  useCanvasDraw(canvasRef, socket, roomId)

  return (
    <div className="w-full h-full">
      <div className="flex justify-center w-full">
        <Nav />
      </div>
      <canvas
        width={window.innerWidth}
        height={window.innerHeight}
        style={{cursor: CURSOR_MAP[activeTool] ?? "crosshair"}}
        ref={canvasRef}
        className="absolute inset-0 bg-white"
      ></canvas>
    </div>
  );
}
