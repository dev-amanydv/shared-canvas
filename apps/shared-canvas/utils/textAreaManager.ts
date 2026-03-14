import { TextElement } from "@/types/canvas";

const FONT_FAMILY_MAP: Record<string, string> = {
    "hand-drawn": "Caveat, cursive",
    "normal": "Inter, sans-serif",
    "monospace": "'Courier New', monospace"
};

interface TextAreaOptions {
    element: TextElement,
    zoom: number,
    scrollX: number,
    scrollY: number, 
    onInput: (text: string, width: number, height: number) => void;
    onCommit: (text: string, width: number, height: number) => void;
}

export function mountTextArea({
    element,
    zoom,
    scrollX,
    scrollY,
    onInput,
    onCommit
}: TextAreaOptions){
    const textarea = document.createElement("textarea");
    textarea.id = `text-editor-${element.id}`;

    const screenX = element.x * zoom + scrollX;
    const screenY = element.y * zoom + scrollY;

    Object.assign(textarea.style, {
        position: "fixed",
        left: `${screenX}px`,
        top: `${screenY}px`,
        minWidth: "2px",
        minHeight: `${element.fontSize * element.lineHeight * zoom}px`,
        maxWidth: "90vw",
        fontSize: `${element.fontSize * zoom}px`,
        fontFamily: FONT_FAMILY_MAP[element.fontFamily] ?? "sans-serif",
        lineHeight: String(element.lineHeight),
        textAlign: element.textAlign,
        color: element.strokeColor,
        background: "transparent",
        border: "none",
        outline: "none",
        resize: "none",
        overflow: "hidden",
        whiteSpace: "pre",
        padding: "0",
        margin: "0",
        zIndex: "100",
        boxSizing: "content-box",
        caretColor: element.strokeColor,
        opacity: String(element.opacity/100),
        transformOrigin: "top left",
        transform: element.angle !== 0 ? `rotate ${element.angle}rad` : "none"
    });

    textarea.value = element.text;
    const autoResize = () => {
        textarea.style.height = "auto";
        textarea.style.width = "auto";

        const scrollH = textarea.scrollHeight;
        const scrollW = Math.max(textarea.scrollWidth, 2);

        textarea.style.height = `${scrollH}px`;
        textarea.style.width = `${scrollW}px`;

        const canvasWidth = scrollW / zoom;
        const canvasHeight = scrollH / zoom;

        onInput(textarea.value, canvasWidth, canvasHeight);
    };

    textarea.addEventListener("input", autoResize);

    const commit = () => {
        textarea.style.height = "auto";
        textarea.style.width = "auto";

        const canvasWidth = textarea.scrollWidth / zoom;
        const canvasHeight = textarea.scrollHeight / zoom;

        onCommit(textarea.value, canvasWidth, canvasHeight);
        unmountTextArea(element.id)
    };
    textarea.addEventListener("keydown", (e) => {
        if (e.key === "Escape"){
            e.preventDefault();
            commit();
        };

        e.stopPropagation();
    });

    textarea.addEventListener("blur", commit);
    
    document.body.appendChild(textarea);

    requestAnimationFrame(() => {
        textarea.focus();
        textarea.selectionStart = textarea.value.length;
        autoResize()
    });

    return textarea;
};

export function unmountTextArea(elementId: string) {
  const textarea = document.getElementById(`text-editor-${elementId}`);
  if (textarea) {
    textarea.removeEventListener("blur", () => {});
    textarea.remove();
  }
};

export function repositionTextArea(
    elementId: string,
    element: TextElement,
    zoom: number,
    scrollX: number,
    scrollY: number
){
    const textarea = document.getElementById(
        `text-editor-${elementId}`
    ) as HTMLTextAreaElement | null;

    if (!textarea) return;

    textarea.style.left     = `${element.x * zoom + scrollX}px`;
    textarea.style.top      = `${element.y * zoom + scrollY}px`;
    textarea.style.fontSize = `${element.fontSize * zoom}px`;
}