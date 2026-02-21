import { ExcalidrawElement } from "@/types/canvas";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { stat } from "fs";

interface HistoryEntry {
    elements: ExcalidrawElement[];
    timestamp: number,
    actionType: string
}

interface HistoryState {
    undoStack: HistoryEntry[],
    redoStack: HistoryEntry[],
    maxHistorySize: number,
}

const initialState: HistoryState = {
    undoStack: [],
    redoStack: [],
    maxHistorySize: 100
}

const historySlice = createSlice({
    name: "history",
    initialState,
    reducers: {
        pushToHistory(state, action: PayloadAction<{elements: ExcalidrawElement[], actionType: string}>){
            const entry: HistoryEntry = {
                elements: action.payload.elements,
                timestamp: Date.now(),
                actionType: action.payload.actionType
            };
            
            state.undoStack.push(entry);
            state.redoStack = [];

            if (state.undoStack.length > state.maxHistorySize){
                state.undoStack.shift()
            }
        },
        undoStack(state){
            const last = state.undoStack.pop();
            if (last) state.redoStack.push(last)
        },
        redoStack(state){
            const next = state.redoStack.pop();
            if (next) state.undoStack.push(next);
        },
        clearHistory(state){
            state.undoStack = [],
            state.redoStack = []
        }
    }
});

export const { pushToHistory, undoStack, redoStack, clearHistory } = historySlice.actions;
export default historySlice.reducer;