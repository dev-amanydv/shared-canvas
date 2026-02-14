"use client"
import { initDraw } from "@/draw"
import { useEffect, useRef } from "react"

export default function CanvasPage () {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    useEffect(() => {
        if (canvasRef.current){
            const canvas = canvasRef.current
            initDraw(canvas)
        }
    }, [canvasRef]) 
    return (
        <div className="w-full h-full">
            <canvas width={2000} height={1000} ref={canvasRef} ></canvas>
        </div>
    )
}