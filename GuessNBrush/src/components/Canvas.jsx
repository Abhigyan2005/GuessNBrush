import { useEffect, useRef, useState } from "react";
import { getSocket } from "../utilities/socket.js";
import { hexToRgba, floodFill } from "../utilities/CanvasTool.js";

function Canvas({ roomID, isDrawer }) {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [colour, setColor] = useState("#000000");
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
    const onDrawStart = ({ x, y, colour, brushSize, mode }) => {
      const ctx = ctxRef.current;
      ctx.strokeStyle = colour;
      ctx.lineWidth = Number(brushSize);
      ctx.lineCap = "round";
      ctx.globalCompositeOperation =
        mode === "erase" ? "destination-out" : "source-over";
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y);
      ctx.stroke();
    };

    const onDrawMove = ({ x, y }) => {
      const ctx = ctxRef.current;
      ctx.lineTo(x, y);
      ctx.stroke();
    };

    const onDrawFill = ({ x, y, colour }) => {
      floodFill(ctxRef.current, canvas, x, y, hexToRgba(colour));
    };

    const onDrawClear = () => {
      const ctx = ctxRef.current;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    socket.on("draw-start", onDrawStart);
    socket.on("draw-move", onDrawMove);
    socket.on("draw-fill", onDrawFill);
    socket.on("draw-clear", onDrawClear);

    return () => {
      socket.off("draw-start", onDrawStart);
      socket.off("draw-move", onDrawMove);
      socket.off("draw-fill", onDrawFill);
      socket.off("draw-clear", onDrawClear);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let mousedown = false;

    const handleMouseDown = (e) => {
      if (!isDrawer) {
        return;
      }
      if (e.button !== 0) return;
      if (mode === "fill") {
        console.log(colour)
        floodFill(ctx, canvas, e.offsetX, e.offsetY, hexToRgba(colour));
        socket.emit("draw-fill", { roomID, x: e.offsetX, y: e.offsetY, colour });
        return;
      }
      mousedown = true;
      ctx.strokeStyle = colour;
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
        colour,
        brushSize,
        mode,
      });
    };

    const handleMouseMove = (e) => {
      if (!isDrawer) {
        return;
      }
      if (!mousedown) return;
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
      socket.emit("draw-move", { roomID, x: e.offsetX, y: e.offsetY });
    };

    const handleMouseUp = () => {
      if (!isDrawer) {
        return;
      }
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
  }, [mode, brushSize, roomID, isDrawer, colour]);

  return (
    <div className="bg-white rounded-xl shadow-md p-4 h-full flex flex-col">
      <h2 className="text-lg font-semibold mb-3 text-center">Drawing Board</h2>
      <div className="flex-1 flex justify-center items-center">
        <canvas
          ref={canvasRef}
          className="border rounded-lg w-full max-w-112.5 aspect-square"
        />
      </div>
      {isDrawer ? (
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => setMode("draw")}
            className={`px-3 py-1.5 ${mode === "draw" ? "bg-amber-200" : "bg-gray-200"} shadow-md text-white rounded-lg text-sm`}
          >
            ✏️
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
          <button
            onClick={() => setMode("erase")}
            className={`px-3 py-1.5 ${mode === "erase" ? "bg-amber-200" : "bg-gray-200"} shadow-md text-white rounded-lg text-sm`}
          >
            🧽
          </button>
          <button
            onClick={() => setMode("fill")}
            className={`px-3 py-1.5 ${mode === "fill" ? "bg-amber-200" : "bg-gray-200"} shadow-md text-white rounded-lg text-sm`}
          >
            🪣
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
          <input
            type="color"
            defaultValue="#000000"
            className="w-8 h-8 cursor-pointer"
            onChange={(e) => setColor(e.target.value)}
          />
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}

export default Canvas;
