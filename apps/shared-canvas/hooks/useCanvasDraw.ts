import {
  selectActiveTool,
  selectToolOptions,
  selectVisibleElements,
} from "@/store/selectors";
import { addElement, updateElement } from "@/store/slices/canvasSlice";
import { pushToHistory } from "@/store/slices/historySlice";
import { revertToSelect } from "@/store/slices/toolSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { createRectangleElement } from "@/utils/elementFactory";
import { useEffect, useRef } from "react";

export function useCanvasDraw(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  socket: WebSocket,
  roomId: string,
) {
  const dispatch = useAppDispatch();

  const activeTool = useAppSelector(selectActiveTool);
  const toolOptions = useAppSelector(selectToolOptions);
  const elements = useAppSelector(selectVisibleElements);

  const isDrawing = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const activeId = useRef<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    renderCanvas(ctx, canvas, elements);
  }, [elements, canvasRef]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2x");
    if (!ctx) return;

    const onMouseDown = (e: MouseEvent) => {
      if (activeTool === "hand" || activeTool === "select") return;
      isDrawing.current = true;
      startX.current = e.clientX;
      startY.current = e.clientY;

      if (activeTool === "rectangle") {
        dispatch(
          pushToHistory({
            elements,
            actionType: "add-rectangle",
          }),
        );

        const newRect = createRectangleElement(
          e.clientX,
          e.clientY,
          toolOptions,
        );
        dispatch(addElement(newRect));
        activeId.current = newRect.id;
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDrawing.current || !activeId.current) return;

      const width = e.clientX - startX.current;
      const height = e.clientY - startY.current;

      if (activeTool === "rectangle") {
        dispatch(
          updateElement({
            id: activeId.current,
            updates: {
              width,
              height,
            },
          }),
        );
      }
    };

    const onMouseUp = (e: MouseEvent) => {
      if (!isDrawing.current || !activeId.current) return;

      const width = e.clientX - startX.current;
      const height = e.clientY - startY.current;

      if (activeTool === "rectangle") {
        dispatch(
          updateElement({
            id: activeId.current,
            updates: {
              width,
              height,
            },
          }),
        );

        const finalElement = {
          id: activeId.current,
          type: "rectangle",
          startX: startX.current,
          startY: startY.current,
          width: width,
          height: height,
        };

        socket.send(
          JSON.stringify({
            type: "chat",
            message: JSON.stringify(finalElement),
            roomId,
          }),
        );
      }
      activeId.current = null;
      dispatch(revertToSelect());
    };

    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseup", onMouseUp);

    return () => {
      canvas.removeEventListener("mousedown", onMouseDown);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseup", onMouseUp);
    };
  }, [activeTool, toolOptions, elements, dispatch, roomId, socket, canvasRef]);
}
