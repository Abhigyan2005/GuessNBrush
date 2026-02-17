import paintGif from "../assets/200.gif";

function Paint() {
  return (
      <div className="w-full h-full flex justify-center items-center">
          <img src={paintGif} alt="" className="max-h-full max-w-full object-contain"/>
    </div>
  )
}

export default Paint