import {
  selectActiveTool,
  selectAllElements,
  selectElementById,
  selectSelectedIds,
  selectToolOptions,
  selectVisibleElements,
} from "@/store/selectors";
import {
  addElement,
  deleteElement,
  updateElement,
} from "@/store/slices/canvasSlice";
import { pushToHistory } from "@/store/slices/historySlice";
import {
  addToSelection,
  clearSelection,
  removeFromSelection,
  selectElement,
  selectElements,
  setBoundingBox,
  setEditingElement,
} from "@/store/slices/selectionSlice";
import { revertToSelect } from "@/store/slices/toolSlice";
import { store, useAppDispatch, useAppSelector } from "@/store/store";
import { BoundingBox, ExcalidrawElement, PencilElement, TextElement } from "@/types/canvas";
import {
  createCircleElement,
  createDiamondElement,
  createLineElement,
  createPencilElement,
  createRectangleElement,
  createArrowElement,
  createTextElement,
} from "@/utils/elementFactory";
import { findElementAtPoint } from "@/utils/hitTest";
import { renderCanvas, renderSelectionHighlight } from "@/utils/renderCanvas";
import { mountTextArea } from "@/utils/textAreaManager";
import { useEffect, useRef } from "react";

function calculateCombinedBoundingBox (elements: ExcalidrawElement[]): BoundingBox | null{
  if (elements.length === 0) return null;

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  elements.forEach((el) => {
    minX = Math.min(Infinity, el.x);
    minY = Math.min(Infinity, el.y);
    maxX = Math.max(-Infinity, el.x + el.width);
    maxY = Math.max(-Infinity, el.y + el.height)
  })

  return {
    x: minX,
    y: minY,
    height: maxY - minY,
    width: maxX - minX,
    angle: 0
  }
}

export function useCanvasDraw(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  socket: WebSocket,
  roomId: string,
) {
  const dispatch = useAppDispatch();
  const activeTool = useAppSelector(selectActiveTool);
  console.log("activeTool: ", activeTool);
  const toolOptions = useAppSelector(selectToolOptions);
  const elements = useAppSelector(selectVisibleElements);
  const selectedIds = useAppSelector(selectSelectedIds);
  const boundingBox = useAppSelector((state) => state.selection.boundingBox);

  console.log(
    "textElement: ",
    elements.find((el) => el.type === "text"),
  );
  const isDrawing = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const activeId = useRef<string | null>(null);
  const hasLoadedInitialData = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      hasLoadedInitialData.current = true;
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    renderCanvas(ctx, canvas, elements);
    renderSelectionHighlight(ctx, boundingBox, selectedIds);
    if (hasLoadedInitialData.current) {
      localStorage.setItem("canvas", JSON.stringify(elements));
    }
  }, [elements, canvasRef, boundingBox, selectedIds]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2x");

    const onMouseDown = (e: MouseEvent) => {
      if (activeTool === "hand") return;
      if (activeTool === "select"){
        handleSelectionClick(e);
        return;
      }
      isDrawing.current = true;
      startX.current = e.clientX;
      startY.current = e.clientY;
      console.log("startX: ", startX.current, " startY: ", startY.current);
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
      if (activeTool === "circle") {
        dispatch(
          pushToHistory({
            elements,
            actionType: "add-circle",
          }),
        );

        const newCircle = createCircleElement(
          e.clientX,
          e.clientY,
          toolOptions,
        );
        dispatch(addElement(newCircle));
        activeId.current = newCircle.id;
      }
      if (activeTool === "diamond") {
        dispatch(
          pushToHistory({
            elements,
            actionType: "add-diamond",
          }),
        );

        const newDiamond = createDiamondElement(
          e.clientX,
          e.clientY,
          toolOptions,
        );

        dispatch(addElement(newDiamond));
        activeId.current = newDiamond.id;
      }

      if (activeTool === "line") {
        dispatch(
          pushToHistory({
            elements,
            actionType: "add-line",
          }),
        );

        const newLine = createLineElement(e.clientX, e.clientY, toolOptions);
        dispatch(addElement(newLine));
        activeId.current = newLine.id;
      }

      if (activeTool === "arrow") {
        dispatch(
          pushToHistory({
            elements,
            actionType: "add-arrow",
          }),
        );

        const newArrow = createArrowElement(e.clientX, e.clientY, toolOptions);
        dispatch(addElement(newArrow));
        activeId.current = newArrow.id;
      }

      if (activeTool === "pencil") {
        dispatch(
          pushToHistory({
            elements,
            actionType: "add-pencil",
          }),
        );

        const newPencil = createPencilElement(
          e.clientX,
          e.clientY,
          toolOptions,
        );
        dispatch(addElement(newPencil));
        activeId.current = newPencil.id;
      }

      if (activeTool === "text") {
        const clickedText = findElementAtPoint(elements, e.clientX, e.clientY);

        if (clickedText && clickedText.type === "text") {
          openTextEditor(clickedText);
        }

        dispatch(
          pushToHistory({
            elements,
            actionType: "add-text",
          }),
        );

        const newText = createTextElement(e.clientX, e.clientY, toolOptions);

        dispatch(addElement(newText));
        dispatch(setEditingElement(newText.id));
        openTextEditor(newText);
        return;
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
      if (activeTool === "circle") {
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
      if (activeTool === "diamond") {
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
      if (activeTool === "line") {
        dispatch(
          updateElement({
            id: activeId.current,
            updates: {
              width,
              height,
              points: [
                { x: 0, y: 0 },
                {
                  x: e.clientX - startX.current,
                  y: e.clientY - startY.current,
                },
              ],
            },
          }),
        );
      }

      if (activeTool === "arrow") {
        dispatch(
          updateElement({
            id: activeId.current,
            updates: {
              width,
              height,
              points: [
                { x: 0, y: 0 },
                {
                  x: e.clientX - startX.current,
                  y: e.clientY - startY.current,
                },
              ],
            },
          }),
        );
      }

      if (activeTool === "pencil") {
        const pencilElement = elements.find(
          (el) => el.id === activeId.current && el.type === "pencil",
        ) as PencilElement;
        if (pencilElement) {
          dispatch(
            updateElement({
              id: activeId.current,
              updates: {
                width,
                height,
                points: [
                  ...pencilElement.points,
                  {
                    x: e.clientX - startX.current,
                    y: e.clientY - startY.current,
                  },
                ],
              },
            }),
          );
        }
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
      if (activeTool === "circle") {
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
      if (activeTool === "diamond") {
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
      if (activeTool === "line") {
        dispatch(
          updateElement({
            id: activeId.current,
            updates: {
              width,
              height,
              points: [
                { x: 0, y: 0 },
                {
                  x: e.clientX - startX.current,
                  y: e.clientY - startY.current,
                },
              ],
            },
          }),
        );
      }
      if (activeTool === "arrow") {
        dispatch(
          updateElement({
            id: activeId.current,
            updates: {
              width,
              height,
              points: [
                { x: 0, y: 0 },
                {
                  x: e.clientX - startX.current,
                  y: e.clientY - startY.current,
                },
              ],
            },
          }),
        );
      }
      if (activeTool === "pencil") {
        const pencilElement = elements.find(
          (el) => el.id === activeId.current && el.type === "pencil",
        ) as PencilElement;
        if (pencilElement) {
          dispatch(
            updateElement({
              id: activeId.current,
              updates: {
                width,
                height,
                points: [
                  ...pencilElement.points,
                  {
                    x: e.clientX - startX.current,
                    y: e.clientY - startY.current,
                  },
                ],
              },
            }),
          );
        }
      }

      if (activeId.current) {
        const allElements = store.getState().canvas.elements;
        const drawnElement = allElements.find(
          (el) => el.id === activeId.current,
        );

        if (drawnElement) {
          dispatch(selectElement(drawnElement.id));

          dispatch(
            setBoundingBox({
              x: drawnElement.x,
              y: drawnElement.y,
              width: drawnElement.width,
              height: drawnElement.height,
              angle: drawnElement.angle,
            }),
          );
        }
      }

      isDrawing.current = false;
      activeId.current = null;
      dispatch(revertToSelect());
    };

    const onDoubleClick = (e: MouseEvent) => {
      const clickedElement = findElementAtPoint(elements, e.clientX, e.clientY);

      if (clickedElement?.type === "text") {
        dispatch(
          updateElement({
            id: clickedElement.id,
            updates: {
              isEditing: true,
            },
          }),
        );
        dispatch(setEditingElement(clickedElement.id));

        openTextEditor(clickedElement);
      }
    };

    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("dblclick", onDoubleClick);

    function handleSelectionClick(e: MouseEvent) {
      if (activeTool !== "select") return;

      const clickedElement = findElementAtPoint(elements, e.clientX, e.clientY);

      if (clickedElement){
        if (e.shiftKey){
          dispatch(addToSelection(clickedElement.id));
          const allSelected = [...selectedIds, clickedElement.id];
          const selectedElements = elements.filter((el) => allSelected.includes(el.id));
          const combinedBox = calculateCombinedBoundingBox(selectedElements);
          dispatch(setBoundingBox(combinedBox))
        } else {
          if (!selectedIds.includes(clickedElement.id)){
            dispatch(selectElement(clickedElement.id));
            dispatch(setBoundingBox({
              x: clickedElement.x,
              y: clickedElement.y,
              width: clickedElement.width,
              height: clickedElement.height,
              angle: clickedElement.angle
            }))
          }
        }
      } else {
        dispatch(clearSelection())
      }
    }

    function openTextEditor(element: TextElement) {
      const { zoom, scrollX, scrollY } = store.getState().ui;

      mountTextArea({
        element,
        zoom,
        scrollX,
        scrollY,
        onInput: (text, width, height) => {
          dispatch(
            updateElement({
              id: element.id,
              updates: {
                text,
                originalText: text,
                width,
                height,
                isEditing: true,
              },
            }),
          );
        },
        onCommit: (text, width, height) => {
          if (text.trim() === "") {
            dispatch(deleteElement([element.id]));
          } else {
            dispatch(
              updateElement({
                id: element.id,
                updates: {
                  text,
                  originalText: text,
                  width,
                  height,
                  isEditing: false,
                },
              }),
            );
          }
          dispatch(setEditingElement(null));
          dispatch(revertToSelect());
        },
      });
    }

    return () => {
      canvas.removeEventListener("mousedown", onMouseDown);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseup", onMouseUp);
      canvas.removeEventListener("dblclick", onDoubleClick);
    };
  }, [activeTool, toolOptions, elements, dispatch, roomId, socket, canvasRef]);
}
