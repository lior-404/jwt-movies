import { useContext } from "react";
import { UserContext } from "../components/UserContext";
import "../App.css";
import UnverifiedHome from "./unverified/UnverifiedHome";
import { Navigate } from "react-router-dom";

function Home() {
  const [user] = useContext(UserContext);

  if (user.token === undefined || user.token === null) {
    return <UnverifiedHome />;
  } else {
    return <Navigate to={"/ver"} />;
  }
}

export default Home;
