import { useEffect, useRef, useState } from "react";

function Canvas() {
  const canvasRef = useRef(null);
  const colorRef = useRef(null);

  const [mode, setMode] = useState("draw");
  const [brushSize, setBrushSize] = useState(2);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width;
    canvas.height = rect.height;
  }, []);

  useEffect(() => {
    const Canvas = canvasRef.current;
    const ctx = Canvas.getContext("2d");

    function hexToRgba(hex) {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return [r, g, b, 255];
    }

    function floodFill(startX, startY, fillColor) {
      const imageData = ctx.getImageData(0, 0, Canvas.width, Canvas.height);
      const data = imageData.data;

      const width = Canvas.width;
      const height = Canvas.height;

      const stack = [[startX, startY]];

      const startIndex = (startY * width + startX) * 4;
      const startColor = [
        data[startIndex],
        data[startIndex + 1],
        data[startIndex + 2],
        data[startIndex + 3],
      ];

      // If same color, stop
      if (
        startColor[0] === fillColor[0] &&
        startColor[1] === fillColor[1] &&
        startColor[2] === fillColor[2]
      ) {
        return;
      }

      while (stack.length) {
        const [x, y] = stack.pop();
        const index = (y * width + x) * 4;

        if (
          data[index] === startColor[0] &&
          data[index + 1] === startColor[1] &&
          data[index + 2] === startColor[2] &&
          data[index + 3] === startColor[3]
        ) {
          data[index] = fillColor[0];
          data[index + 1] = fillColor[1];
          data[index + 2] = fillColor[2];
          data[index + 3] = 255;

          if (x > 0) stack.push([x - 1, y]);
          if (x < width - 1) stack.push([x + 1, y]);
          if (y > 0) stack.push([x, y - 1]);
          if (y < height - 1) stack.push([x, y + 1]);
        }
      }

      ctx.putImageData(imageData, 0, 0);
    }
    
    let mousedown = false;
    const handleMouseDown = (e) => {
      if (e.button === 0) {
        if (mode === "fill") {
          const fillColor = hexToRgba(colorRef.current.value);
          floodFill(e.offsetX, e.offsetY, fillColor);
          return;
        }
        mousedown = true;
        ctx.strokeStyle = colorRef.current.value;
        ctx.lineWidth = Number(brushSize);
        ctx.lineCap = "round";
        let x = e.offsetX;
        let y = e.offsetY;
        if (mode === "erase") {
          ctx.globalCompositeOperation = "destination-out";
        } else {
          ctx.globalCompositeOperation = "source-over";
        }
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y);
        ctx.stroke();
      }
    };

    const handleMouseMove = (e) => {
      if (mousedown) {
        let x = e.offsetX;
        let y = e.offsetY;
        ctx.lineTo(x, y);
        ctx.stroke();
      }
    };

    const handleMouseUp = () => {
      mousedown = false;
    };

    Canvas.addEventListener("mouseup", handleMouseUp);

    Canvas.addEventListener("mousedown", handleMouseDown);
    Canvas.addEventListener("mousemove", handleMouseMove);

    return () => {
      Canvas.removeEventListener("mousedown", handleMouseDown);
      Canvas.removeEventListener("mousemove", handleMouseMove);
      Canvas.removeEventListener("mouseup", handleMouseUp);
    };
  }, [mode, brushSize]);

  return (
    <div className="bg-white rounded-xl shadow-md p-4 h-full flex flex-col">
      <h2 className="text-lg font-semibold mb-3 text-center">Drawing Board</h2>

      <div className="flex-1 flex justify-center items-center">
        <canvas
          ref={canvasRef}
          className="border rounded-lg w-full max-w-112.5 aspect-square"
        />
      </div>

      <div className="mt-3 flex flex-wrap justify-center gap-2">
        <button
          onClick={() => setMode("draw")}
          className="px-3 py-1.5 bg-black text-white rounded-lg text-sm"
        >
          Brush
        </button>

        <button
          onClick={() => setMode("erase")}
          className="px-3 py-1.5 bg-gray-200 rounded-lg text-sm"
        >
          Eraser
        </button>

        <button
          onClick={() => setMode("fill")}
          className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-sm"
        >
          Fill
        </button>

        <button
          onClick={() => {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height);
          }}
          className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-sm"
        >
          Clear
        </button>
        <select
          value={brushSize}
          onChange={(e) => {
            setBrushSize(e.target.value);
          }}
          className="px-2 py-1.5 border rounded-lg text-sm"
        >
          <option value="2">Small</option>
          <option value="6">Medium</option>
          <option value="12">Large</option>
        </select>
        <input
          ref={colorRef}
          type="color"
          defaultValue="#000000"
          className="w-8 h-8 cursor-pointer"
        />
      </div>
    </div>
  );
}

export default Canvas;
