import type { ToolOptions } from "@/store/slices/toolSlice";
import { RectangleElement } from "@/types/canvas";
import { nanoid } from "@reduxjs/toolkit";

export function createRectangleElement (
    startX: number,
    startY: number,
    options: ToolOptions
): RectangleElement {
    return {
        id: nanoid(),
        type: "rectangle",
        x: startX,
        y: startY,
        height: 0,
        width: 0,
        angle: 0,
        strokeColor: options.strokeColor,
        backgroundColor: options.backgroundColor,
        fillStyle: options.fillStyle,
        strokeWidth: options.strokeWidth,
        strokeStyle: options.strokeStyle,
        opacity: options.opacity,
        roughness: options.roughness,
        edgeStyle: options.edgeStyle,
        isDeleted: false,
        isLocked: false,
        seed: Math.floor(Math.random() * 100000),
        version: 1,
        createdAt: Date.now(),
        updatedAt: Date.now()

    }
}