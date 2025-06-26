import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import Home from "./components/Home";
import Movies from "./components/verified/moviesPg/Movies";
import ProtectedRoute from "./components/ProtectedRoute";
import LogsPg from "./components/verified/LogPg";
import Welcome from "./components/verified/Welcome";
import { useContext } from "react";
import { UserContext } from "./components/UserContext";
import UnverifiedHome from "./components/unverified/UnverifiedHome";
import StreamMain from "./components/verified/streams/StreamMain";
import FinanceMain from "./components/verified/finance/FinanceMain";

function App() {
  const [user] = useContext(UserContext);

  return (
    <Router>
      <Routes>
        <Route
          path="/finance"
          element={
            <ProtectedRoute>
              <FinanceMain />
            </ProtectedRoute>
          }
        />
        <Route
          path="/streams"
          element={
            <ProtectedRoute>
              <StreamMain />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ver"
          element={
            <ProtectedRoute>
              <Welcome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/movies"
          element={
            <ProtectedRoute>
              <Movies />
            </ProtectedRoute>
          }
        />
        <Route
          path="/logs"
          element={
            <ProtectedRoute>
              <LogsPg />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Home />} />
        <Route path="/" element={<Navigate to={"/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;
