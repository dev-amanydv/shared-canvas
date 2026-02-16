"use client"
import { initDraw } from "@/draw"
import { useEffect, useRef } from "react"
import Nav from "./Nav"

export default function Canvas ({ roomId, socket }: {
    roomId: string,
    socket: WebSocket
}) {
    const canvasRef = useRef(null)

    useEffect(() => {
        if (canvasRef.current){
            const canvas = canvasRef.current
            initDraw(canvas, roomId, socket)
        }
    }, [canvasRef])

    return (
        <div className="w-full h-full">
            <div className="flex justify-center w-full">
                <Nav />
            </div>
            <canvas width={2000} height={1000} ref={canvasRef} ></canvas>
        </div>
    )
}