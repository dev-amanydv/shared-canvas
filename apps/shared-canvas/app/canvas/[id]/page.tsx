"use client"
import { useEffect, useRef } from "react"

export default function CanvasPage () {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    useEffect(() => {
        if (canvasRef.current){
            const canvas = canvasRef.current
            const ctx = canvas.getContext('2d')
            if (!ctx){
                return
            }
            let startX = 0
            let startY = 0
            let endX = 0
            let endY = 0
            let clicked = false
            canvas.addEventListener("mouseup", (e) => {
                clicked = false
                endX = e.clientX
                endY = e.clientY
                console.log("x: ", e.clientX)
                console.log("y: ", e.clientY)
            })
            canvas.addEventListener("mousedown", (e) => {
                clicked = true
                startX = e.clientX
                startY = e.clientY
                console.log("x: ", e.clientX)
                console.log("y: ", e.clientY)
            })
            canvas.addEventListener("mousemove", (e)=> {
                if(clicked){
                const height = e.clientY - startY
                const width = e.clientX - startX
                console.log("Height: ", height)
                console.log("Width: ", width)
                ctx.clearRect(0, 0, canvas.width, canvas.height)
                ctx.strokeStyle = "white"
                ctx.strokeRect(startX, startY, width, height)
                }
            })
        }
    }, [canvasRef]) 
    return (
        <div className="w-full h-full">
            <canvas width={1000} height={1000} ref={canvasRef} ></canvas>
        </div>
    )
}