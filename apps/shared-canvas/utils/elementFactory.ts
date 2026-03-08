import type { ToolOptions } from "@/store/slices/toolSlice";
import {
  CircleElement,
  DiamondElement,
  LineElement,
  RectangleElement,
} from "@/types/canvas";
import { nanoid } from "@reduxjs/toolkit";

export function createRectangleElement(
  startX: number,
  startY: number,
  options: ToolOptions,
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
    updatedAt: Date.now(),
  };
}

export function createCircleElement(
  startX: number,
  startY: number,
  options: ToolOptions,
): CircleElement {
  return {
    id: nanoid(),
    type: "circle",
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
    isDeleted: false,
    isLocked: false,
    seed: Math.floor(Math.random() * 100000),
    version: 1,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

export function createDiamondElement(
  startX: number,
  startY: number,
  options: ToolOptions,
): DiamondElement {
  return {
    id: nanoid(),
    type: "diamond",
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
    isDeleted: false,
    isLocked: false,
    seed: Math.floor(Math.random() * 100000),
    version: 1,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

export function createLineElement(
  startX: number,
  startY: number,
  options: ToolOptions,
): LineElement {
  return {
    id: nanoid(),
    type: "line",
    strokeColor: options.strokeColor,
    strokeStyle: options.strokeStyle,
    strokeWidth: options.strokeWidth,
    points: [{ x: 0, y: 0 }, { x: 0, y: 0 }],
    lastCommittedPoint: null,
    x: startX,
    y: startY,
    width: 0,
    height: 0,
    angle: 0,
    backgroundColor: options.backgroundColor,
    fillStyle: options.fillStyle,
    opacity: options.opacity,
    roughness: options.roughness,
    isDeleted: false,
    isLocked: false,
    seed: Math.floor(Math.random() * 1000000),
    version: 1,
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
}
