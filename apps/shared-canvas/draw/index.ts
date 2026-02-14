type Shape =
  | {
      shape: "rectangle";
      width: number;
      height: number;
      startX: number;
      startY: number;
    }
  | {
      shape: "circle";
      radius: number;
      centerX: number;
      centerY: number;
      startAngle: number,
      endAngle: number
    };

export const initDraw = (canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return;
  }

  const existingShapes: Shape[] = [];
  const selectedShape = "circle";
  let startX = 0;
  let startY = 0;
  let endX = 0;
  let endY = 0;
  let clicked = false;
  canvas.addEventListener("mouseup", (e) => {
    clicked = false;
    endX = e.clientX;
    endY = e.clientY;
    if (selectedShape === "rectangle") {
      const height = endY - startY;
      const width = endX - startX;
      existingShapes.push({
        shape: "rectangle",
        startX: startX,
        startY: startY,
        height: height,
        width: width,
      });
    } else if (selectedShape === "circle") {
        const radius = Math.hypot(e.clientX - startX, e.clientY - startY);
        existingShapes.push({
            shape: "circle",
            centerX: startX,
            centerY: startY,
            radius: radius,
            startAngle: 0,
            endAngle: 360
        })
    }
  });
  canvas.addEventListener("mousedown", (e) => {
    clicked = true;
    startX = e.clientX;
    startY = e.clientY;
  });
  canvas.addEventListener("mousemove", (e) => {
    if (clicked) {
      ctx.strokeStyle = "white";
      clearCanvas(ctx, canvas, existingShapes);

      if (selectedShape === "rectangle") {
        const height = e.clientY - startY;
        const width = e.clientX - startX;
        console.log("Height: ", height);
        console.log("Width: ", width);
        ctx.strokeRect(startX, startY, width, height);
      } else if (selectedShape === "circle") {
        const radius = Math.hypot(e.clientX - startX, e.clientY - startY);
        ctx.beginPath();
        ctx.arc(startX, startY, radius, 0, 360);
        ctx.stroke();
      }
    }
  });
};

function clearCanvas(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  existingShapes: Shape[],
) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  existingShapes.map((shape) => {
    if (shape.shape === "rectangle") {
      ctx.strokeRect(shape.startX, shape.startY, shape.width, shape.height);
    } else if (shape.shape === "circle"){
        ctx.beginPath();
        ctx.arc(shape.centerX, shape.centerY, shape.radius, shape.startAngle, shape.endAngle)
        ctx.stroke()
    }
  });
}
