import { useLocation, Navigate } from "react-router-dom";
import GameRoom from "../pages/GameRoom";

function ProtectedGameRoom() {
  const location = useLocation();

  if (!location.state) {
    return <Navigate to="/" replace />;
  }

  return <GameRoom />;
}

export default ProtectedGameRoom;