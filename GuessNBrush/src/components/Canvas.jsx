function Canvas() {
  return (
    <>
      <div className="flex-col">
        <canvas
        id="myCanvas"
        width="500"
        height="500"
        style={{ border: "1px solid #000000" }}
      ></canvas>
      <div className="bg-amber-950 text-white" width="500">
        canvas tools
      </div>
      </div>
    </>
  );
}

export default Canvas;
