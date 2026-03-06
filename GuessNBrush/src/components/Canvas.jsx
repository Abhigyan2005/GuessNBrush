import { useEffect, useRef, useState } from "react";
import { getSocket } from "../utilities/socket.js";
import { hexToRgba, floodFill } from "../utilities/CanvasTool.js";

function Canvas({ roomID }) {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null); 
  const colorRef = useRef(null);
  const [mode, setMode] = useState("draw");
  const [brushSize, setBrushSize] = useState(2);
  const socket = getSocket();

  useEffect(() => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    ctxRef.current = canvas.getContext("2d");
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let mousedown = false;

    const handleMouseDown = (e) => {
      if (e.button !== 0) return;
      if (mode === "fill") {
        const color = colorRef.current.value;
        floodFill(ctx, canvas, e.offsetX, e.offsetY, hexToRgba(color));
        socket.emit("draw-fill", { roomID, x: e.offsetX, y: e.offsetY, color });
        return;
      }
      mousedown = true;
      const color = colorRef.current.value;
      ctx.strokeStyle = color;
      ctx.lineWidth = Number(brushSize);
      ctx.lineCap = "round";
      ctx.globalCompositeOperation =
        mode === "erase" ? "destination-out" : "source-over";
      ctx.beginPath();
      ctx.moveTo(e.offsetX, e.offsetY);
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
      socket.emit("draw-start", {
        roomID,
        x: e.offsetX,
        y: e.offsetY,
        color,
        brushSize,
        mode,
      });
    };

    const handleMouseMove = (e) => {
      if (!mousedown) return;
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
      socket.emit("draw-move", { roomID, x: e.offsetX, y: e.offsetY });
    };

    const handleMouseUp = () => {
      mousedown = false;
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
    };
  }, [mode, brushSize, roomID]);

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
            ctxRef.current.clearRect(0, 0, canvas.width, canvas.height);
            socket.emit("draw-clear", { roomID });
          }}
          className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-sm"
        >
          Clear
        </button>
        <select
          value={brushSize}
          onChange={(e) => setBrushSize(e.target.value)}
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
