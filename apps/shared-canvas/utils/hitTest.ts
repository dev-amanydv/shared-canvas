import { ExcalidrawElement } from "@/types/canvas";

export function findElementAtPoint(elements: ExcalidrawElement[], x: number, y: number) {
    for (let i = elements.length - 1; i >= 0; i--){
        const el = elements[i];

        if (el.isDeleted) continue;
        if (isPointInElement(el, x, y)) return el;
    };
    return null;
}

export function isPointInElement (
    element: ExcalidrawElement,
    x: number,
    y: number
): boolean {
    const minX = Math.min(element.x, element.x + element.width);
    const minY = Math.min(element.y, element.y + element.height);
    const maxX = Math.max(element.x, element.x + element.width);
    const maxY = Math.max(element.y, element.y + element.height);
    return x >= minX && x<=maxX && y <= maxY && y >= minY
}