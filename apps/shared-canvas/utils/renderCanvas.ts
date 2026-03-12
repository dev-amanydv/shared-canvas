import { ExcalidrawElement } from "@/types/canvas";
import rough from "roughjs";
import type { Options } from "roughjs/bin/core";

export function renderCanvas(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  elements: ExcalidrawElement[],
) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const rc = rough.canvas(canvas);

  elements.forEach((el) => {
    if (el.isDeleted) return;
    ctx.save();
    ctx.globalAlpha = el.opacity / 100;

    const roughOptions: Options = {
      seed: el.seed,
      roughness: el.roughness,
      strokeWidth: el.strokeWidth,
      stroke: el.strokeColor,
      fill:
        el.backgroundColor !== "transparent" ? el.backgroundColor : undefined,
      fillStyle:
        el.fillStyle === "none"
          ? undefined
          : (el.fillStyle as "solid" | "hachure" | "cross-hatch"),
      strokeLineDash:
        el.strokeStyle === "dashed"
          ? [12, 8]
          : el.strokeStyle === "dotted"
            ? [3, 6]
            : undefined,
    };

    switch (el.type) {
      case "rectangle":
        drawRectangle(rc, ctx, el, roughOptions);
        break;

      case "circle":
        drawCircle(rc, el, roughOptions);
        break;

      case "diamond":
        drawDiamond(rc, el, roughOptions);
        break;

      case "line":
        drawLine(rc, el, roughOptions);
        break;

      case "arrow":
        drawArrow(rc, el, roughOptions);
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

function drawRectangle(
  rc: ReturnType<typeof rough.canvas>,
  ctx: CanvasRenderingContext2D,
  el: Extract<ExcalidrawElement, { type: "rectangle" }>,
  options: Options,
) {
  if (el.edgeStyle === "round") {
    const radius = Math.min(
      Math.min(Math.abs(el.width), Math.abs(el.height)) * 0.25,
      32,
    );
    const x = el.x;
    const y = el.y;
    const w = el.width;
    const h = el.height;
    const r = radius;

    const nx = w < 0 ? x + w : x;
    const ny = h < 0 ? y + h : y;
    const nw = Math.abs(w);
    const nh = Math.abs(h);
    const nr = Math.min(r, nw / 2, nh / 2);

    const path = `M ${nx + nr} ${ny} 
      L ${nx + nw - nr} ${ny} 
      Q ${nx + nw} ${ny} ${nx + nw} ${ny + nr} 
      L ${nx + nw} ${ny + nh - nr} 
      Q ${nx + nw} ${ny + nh} ${nx + nw - nr} ${ny + nh} 
      L ${nx + nr} ${ny + nh} 
      Q ${nx} ${ny + nh} ${nx} ${ny + nh - nr} 
      L ${nx} ${ny + nr} 
      Q ${nx} ${ny} ${nx + nr} ${ny} Z`;

    rc.path(path, options);
  } else {
    rc.rectangle(el.x, el.y, el.width, el.height, options);
  }
}

function drawCircle(
  rc: ReturnType<typeof rough.canvas>,
  el: Extract<ExcalidrawElement, { type: "circle" }>,
  options: Options,
) {
  const cx = el.x + el.width / 2;
  const cy = el.y + el.height / 2;
  rc.ellipse(cx, cy, Math.abs(el.width), Math.abs(el.height), options);
}

function drawDiamond(
  rc: ReturnType<typeof rough.canvas>,
  el: Extract<ExcalidrawElement, { type: "diamond" }>,
  options: Options,
) {
  const cx = el.x + el.width / 2;
  const cy = el.y + el.height / 2;
  const points: [number, number][] = [
    [cx, el.y],
    [el.x + el.width, cy],
    [cx, el.y + el.height],
    [el.x, cy],
  ];
  rc.polygon(points, options);
}

function drawLine(
  rc: ReturnType<typeof rough.canvas>,
  el: Extract<ExcalidrawElement, { type: "line" }>,
  options: Options,
) {
  if (el.points.length < 2) return;
  const points: [number, number][] = el.points.map((p) => [
    el.x + p.x,
    el.y + p.y,
  ]);
  rc.linearPath(points, options);
}

function drawArrow(
  rc: ReturnType<typeof rough.canvas>,
  el: Extract<ExcalidrawElement, { type: "arrow" }>,
  options: Options,
) {
  if (el.points.length < 2) return;

  // Draw the shaft
  const points: [number, number][] = el.points.map((p) => [
    el.x + p.x,
    el.y + p.y,
  ]);
  rc.linearPath(points, options);

  // Draw arrowhead at the end
  const lastPoint = points[points.length - 1]!;
  const secondLast = points[points.length - 2]!;

  const angle = Math.atan2(
    lastPoint[1] - secondLast[1],
    lastPoint[0] - secondLast[0],
  );

  const arrowLength = 15;
  const arrowAngle = Math.PI / 6; // 30 degrees

  const x1 = lastPoint[0] - arrowLength * Math.cos(angle - arrowAngle);
  const y1 = lastPoint[1] - arrowLength * Math.sin(angle - arrowAngle);
  const x2 = lastPoint[0] - arrowLength * Math.cos(angle + arrowAngle);
  const y2 = lastPoint[1] - arrowLength * Math.sin(angle + arrowAngle);

  rc.line(lastPoint[0], lastPoint[1], x1, y1, options);
  rc.line(lastPoint[0], lastPoint[1], x2, y2, options);
}

function drawPencil(
  ctx: CanvasRenderingContext2D,
  el: Extract<ExcalidrawElement, { type: "pencil" }>,
) {
  if (el.points.length < 2) return;
  ctx.strokeStyle = el.strokeColor;
  ctx.lineWidth = el.strokeWidth;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  ctx.beginPath();
  ctx.moveTo(el.x + el.points[0].x, el.y + el.points[0].y);

  if (el.points.length === 2) {
    ctx.lineTo(el.x + el.points[1].x, el.y + el.points[1].y);
  } else {
    for (let i = 1; i < el.points.length - 1; i++) {
        const p1 = el.points[i];
        const p2 = el.points[i + 1];
        
        const midPointX = el.x + p1.x + (p2.x - p1.x) / 2;
        const midPointY = el.y + p1.y + (p2.y - p1.y) / 2;
        
        ctx.quadraticCurveTo(el.x + p1.x, el.y + p1.y, midPointX, midPointY);
    }
    const lastPoint = el.points[el.points.length - 1];
    ctx.lineTo(el.x + lastPoint.x, el.y + lastPoint.y);
  }

  ctx.stroke();
}

function drawText(
  ctx: CanvasRenderingContext2D,
  el: Extract<ExcalidrawElement, { type: "text" }>,
) {
  ctx.font = `${el.fontSize}px ${el.fontFamily}`;
  ctx.fillStyle = el.strokeColor;
  ctx.textAlign = el.textAlign;
  ctx.fillText(el.text, el.x, el.y + el.fontSize);
}
