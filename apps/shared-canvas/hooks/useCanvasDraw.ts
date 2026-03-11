import {
  selectActiveTool,
  selectToolOptions,
  selectVisibleElements,
} from "@/store/selectors";
import { addElement, updateElement } from "@/store/slices/canvasSlice";
import { pushToHistory } from "@/store/slices/historySlice";
import { revertToSelect } from "@/store/slices/toolSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { createCircleElement, createDiamondElement, createLineElement, createPencilElement, createRectangleElement } from "@/utils/elementFactory";
import { renderCanvas } from "@/utils/renderCanvas";
import { useEffect, useRef } from "react";

export function useCanvasDraw(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  socket: WebSocket,
  roomId: string,
) {
  const dispatch = useAppDispatch();
  const activeTool = useAppSelector(selectActiveTool);
  const toolOptions = useAppSelector(selectToolOptions);
  const elements = useAppSelector(selectVisibleElements);
  console.log("line elements: ", elements.find((el) => el.type === "rectangle"))
  const isDrawing = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const activeId = useRef<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    renderCanvas(ctx, canvas, elements);
  }, [elements, canvasRef]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2x");

    const onMouseDown = (e: MouseEvent) => {
      if (activeTool === "hand" || activeTool === "select") return;
      isDrawing.current = true;
      startX.current = e.clientX;
      startY.current = e.clientY;
      console.log("startX: ", startX.current, " startY: ", startY.current)
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
      if (activeTool === "circle"){
        dispatch(pushToHistory({
          elements,
          actionType: "add-circle"
        }));

        const newCircle = createCircleElement(
          e.clientX,
          e.clientY,
          toolOptions
        );
        dispatch(addElement(newCircle));
        activeId.current = newCircle.id
      }
      if (activeTool === "diamond"){
        dispatch(pushToHistory({
          elements,
          actionType: "add-diamond"
        }));

        const newDiamond = createDiamondElement(
          e.clientX,
          e.clientY,
          toolOptions
        );

        dispatch(addElement(newDiamond));
        activeId.current = newDiamond.id
      }

      if (activeTool === "line"){
        dispatch(pushToHistory({
          elements,
          actionType: "add-line"
        }));

        const newLine = createLineElement(
          e.clientX,
          e.clientY,
          toolOptions
        );
        dispatch(addElement(newLine));
        activeId.current = newLine.id
      }

      if (activeTool === "pencil"){
        dispatch(pushToHistory({
          elements,
          actionType: "add-pencil"
        }));

        const newPencil = createPencilElement(e.clientX, e.clientY, toolOptions);
        dispatch(addElement(newPencil));
        activeId.current = newPencil.id;
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
      };
      if (activeTool === "circle"){
        dispatch(
          updateElement({
            id: activeId.current,
            updates: {
             width,
             height
            }
          })
        )
      };
      if (activeTool === "diamond"){
        dispatch(
          updateElement({
            id: activeId.current,
            updates: {
              width,
              height
            }
          })
        )
      };
      if (activeTool === "line"){
        dispatch(updateElement({
          id: activeId.current,
          updates: {
            width,
            height,
            points: [{x: 0, y: 0}, {x: e.clientX - startX.current, y: e.clientY - startY.current}]
          }
        }))
      };

      if (activeTool === "pencil"){
        dispatch(updateElement({
          id: activeId.current,
          updates: {
            width,
            height,
            points: []
          }
        }))
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

        // socket.send(
        //   JSON.stringify({
        //     type: "chat",
        //     message: JSON.stringify(finalElement),
        //     roomId,
        //   }),
        // );
      }
      if (activeTool === "circle"){
        dispatch(updateElement({
          id: activeId.current,
          updates: {
            width,
            height
          }
        }))
      };
      if (activeTool === "diamond"){
        dispatch(updateElement({
          id: activeId.current,
          updates: {
            width,
            height
          }
        }))
      }
      if (activeTool === "line"){
        dispatch(updateElement({
          id: activeId.current,
          updates: {
            width,
            height,
            points: [{ x: 0, y: 0 }, { x: e.clientX - startX.current, y: e.clientY - startY.current}]
          }
        }))
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
