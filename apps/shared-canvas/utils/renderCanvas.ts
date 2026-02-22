import { ExcalidrawElement } from "@/types/canvas";


export function renderCanvas (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    elements: ExcalidrawElement[]
) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    console.log("elements: ", elements)
    elements.forEach((el) => {
        if (el.isDeleted) return;
        ctx.save();

        ctx.globalAlpha = el.opacity / 100;
        ctx.strokeStyle = el.strokeStyle;
        ctx.lineWidth = el.strokeWidth;

        if (el.strokeStyle === "dashed") ctx.setLineDash([8, 4])
        else if (el.strokeStyle === "dotted") ctx.setLineDash([2, 4]) 
        else ctx.setLineDash([]);
        
        switch (el.type){
            case "rectangle":
                drawRectangle(ctx, el);
                break;
            
            case "circle":
                drawCircle(ctx, el);
                break;

            case "diamond":
                drawDiamond(ctx, el);
                break;

            case "line":
                drawLine(ctx, el);
                break;
            
            case "arrow": 
                drawArrow(ctx, el);
                break;

            case "pencil": 
                drawPencil(ctx, el);
                break;

            case "text": 
                drawText(ctx, el);
                break;
        }
        ctx.restore();
    });
}

function drawRectangle (
    ctx: CanvasRenderingContext2D,
    el: Extract<ExcalidrawElement, { type: "rectangle"}>
) {
    if (el.backgroundColor !== "transparent"){
        ctx.fillStyle = el.backgroundColor;
        ctx.fillRect(el.x, el.y, el.width, el.height)
    };
    ctx.strokeRect(el.x, el.y, el.width, el.height)
};

function drawCircle (
    ctx: CanvasRenderingContext2D,
    el: Extract<ExcalidrawElement, { type: "circle" }>
){
    const radiusX = Math.abs(el.width / 2);
    const radiusY = Math.abs(el.height / 2);
    const cx = el.x + el.width / 2;
    const cy = el.y + el.height / 2;

    ctx.beginPath();
    ctx.ellipse(cx, cy, radiusX, radiusY, 0, 0, Math.PI * 2);

    if (el.backgroundColor !== "transparent"){
        ctx.fillStyle = el.backgroundColor;
        ctx.fill()
    };
    ctx.stroke()
};

function drawDiamond (
    ctx: CanvasRenderingContext2D,
    el: Extract<ExcalidrawElement, { type: "diamond" }>
){
    const cx = el.x + el.width / 2;
    const cy = el.y + el.height / 2;

    ctx.beginPath();
    ctx.moveTo(cx, el.y);
    ctx.lineTo(el.x + el.width, cy);
    ctx.lineTo(cx, el.y + el.height);
    ctx.lineTo(el.x, cy);

    if (el.backgroundColor !== "transparent"){
        ctx.fillStyle = el.backgroundColor;
        ctx.fill();
    };

    ctx.stroke()
};

function drawLine (
    ctx: CanvasRenderingContext2D,
    el: Extract<ExcalidrawElement, { type: "line" }>
){
    if (el.points.length < 2) return;

    ctx.beginPath();
    ctx.moveTo(el.x + el.points[0].x, el.y + el.points[0].y);
    el.points.slice(1).forEach((p) => {
        ctx.lineTo(el.x + p.x, el.y + p.y)
    });
    ctx.stroke
}

function drawArrow (
    ctx: CanvasRenderingContext2D,
    el: Extract<ExcalidrawElement, { type: "arrow" }>
){
    if (el.points.length < 2) return;

    ctx.beginPath();
    ctx.moveTo(el.x + el.points[0].x, el.y + el.points[0].y);
    el.points.slice(1).forEach((p) => {
        ctx.lineTo(el.x + p.x, el.y + p.y)
    });
    ctx.stroke
}

function drawPencil(
  ctx: CanvasRenderingContext2D,
  el: Extract<ExcalidrawElement, { type: "pencil" }>
) {
  if (el.points.length < 2) return;
  ctx.beginPath();
  ctx.moveTo(el.x + el.points[0].x, el.y + el.points[0].y);
  el.points.slice(1).forEach((p) => {
    ctx.lineTo(el.x + p.x, el.y + p.y);
  });
  ctx.stroke();
}

function drawText (
    ctx: CanvasRenderingContext2D,
    el: Extract<ExcalidrawElement, { type: "text" }>
){
    ctx.font = `${el.fontSize}px ${el.fontFamily}`;
    ctx.fillStyle = el.strokeColor;
    ctx.textAlign = el.textAlign;
    ctx.fillText(el.text, el.x, el.y + el.fontSize)
}