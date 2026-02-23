import { useEffect, useRef, useState } from "react";

function Canvas() {
  const canvasRef = useRef(null);
  const colorRef = useRef(null);
  // const isDrawingRef = useRef(false);

  const [mode, setMode] = useState("draw");
  
 

  return (
    <div className="bg-white rounded-xl shadow-md p-4 h-full flex flex-col">
      <h2 className="text-lg font-semibold mb-3 text-center">Drawing Board</h2>

      <div className="flex-1 flex justify-center items-center">
        <canvas
          ref={canvasRef}
          className="border rounded-lg w-full max-w-[450px] aspect-square"
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
