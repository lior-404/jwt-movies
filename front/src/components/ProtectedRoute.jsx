import { useContext } from "react";
import { UserContext } from "./UserContext";
import { Navigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";

function ProtectedRouteProvider({ children }) {
  const [user, setUser, loading] = useContext(UserContext);

  if (loading) {
    return <CircularProgress />;
  }

  return user.token ? children : <Navigate to={"/login"} />;
}

export default ProtectedRouteProvider;
