import { BinaryFile, ExcalidrawElement } from "@/types/canvas";
import { createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit";
import { stat } from "fs";
import { act } from "react";

interface CanvasState {
  elements: ExcalidrawElement[];
  files: Record<string, BinaryFile>;
}

const initialState: CanvasState = {
  elements: [],
  files: {},
};

const canvasSlice = createSlice({
  name: "canvas",
  initialState,
  reducers: {
    addElement(state, action: PayloadAction<ExcalidrawElement>) {
      state.elements.push(action.payload);
    },

    updateElement(
      state,
      action: PayloadAction<{
        id: string;
        updates: Partial<ExcalidrawElement>;
      }>,
    ) {
      const { id, updates } = action.payload;
      const index = state.elements.findIndex((el) => el.id === id);

      if (index === -1) return;

      state.elements[index] = {
        ...state.elements[index],
        ...updates,
        version: state.elements[index].version + 1,
        updatedAt: Date.now(),
      } as ExcalidrawElement;
    },

    deleteElement(state, action: PayloadAction<string[]>) {
      const ids = new Set(action.payload);
      state.elements.forEach((el) => {
        if (ids.has(el.id)) {
          el.isDeleted = true;
        }
      });
    },

    duplicateElements(state, action: PayloadAction<string[]>) {
      const ids = new Set(action.payload);
      const toDuplicate = state.elements.filter((el) => {
        ids.has(el.id) && !el.isDeleted;
      });
      const OFFSET = 10;
      const duplicates = toDuplicate.map((el) => ({
        ...el,
        id: nanoid(),
        x: el.x + OFFSET,
        y: el.x + OFFSET,
        version: 1,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }));
      state.elements.push(...duplicates);
    },

    moveElements(
      state,
      action: PayloadAction<{ ids: string[]; dx: number; dy: number }>,
    ) {
      const { ids, dx, dy } = action.payload;
      const idSet = new Set(ids);
      state.elements.forEach((el) => {
        if (idSet.has(el.id)) {
          el.x += dx;
          el.y += dy;
          el.version += 1;
          el.updatedAt = Date.now();
        }
      });
    },

    resizeElement(state, action: PayloadAction<{id: string, x: number, y: number, height: number, width: number}>){
        const { id, x, y, width, height } = action.payload;
        const index = state.elements.findIndex((el) => el.id === id);

        if (index === -1) return;

        state.elements[index] = {
            ...state.elements[index],
            x: x,
            y: y,
            height: height,
            width: width,
            version: state.elements[index].version + 1,
            updatedAt: Date.now()
        }
    },

    rotateElement(state, action: PayloadAction<{ids: string[], angle: number}>){
        const { ids, angle } = action.payload;
        const idsSet = new Set(ids);
        
        state.elements.forEach((el) => {
            if (idsSet.has(el.id)){
                el.angle = angle,
                el.version += 1,
                el.updatedAt = Date.now()
            }
        })
    },

    bringToFront(state, action: PayloadAction<string[]>){
        const ids = new Set(action.payload);
        const [targets, rest] = partion(state.elements, (el) => ids.has(el.id));
        state.elements = [...rest, ...targets]
    },

    sendToBack(state, action: PayloadAction<string[]>){
        const ids = new Set(action.payload);
        const [targets, rest] = partion(state.elements, (el) => ids.has(el.id))
        state.elements = [...targets, ...rest]
    }

    
    
  },
});

function partion<T>(arr: T[], predicate: (item: T) => boolean ): [T[], T[]]{
    const truthy: T[] = []
    const falsy: T[] = []
    arr.forEach((item) => (predicate(item) ? truthy : falsy).push(item));
    return [truthy, falsy]
}
