import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { UserContext } from "../../UserContext";

function NavbarWelcome(props) {
  const [user, setUser] = useContext(UserContext);
  const navigate = useNavigate();

  function signOut() {
    fetch(import.meta.env.VITE_API_ENDPOINT + "users/logout", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    })
      .then(async (response) => {
        if (!response.ok) {
          console.log("error occurred");
          console.log(response);
        } else {
          const data = await response.json();
          // setUser({});
          window.location.reload();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function homeClick() {
    navigate("/ver");
  }

  function logClick() {
    navigate("/logs");
  }

  return (
    <AppBar
      sx={{
        position: "fixed",
        top: 0,
        zIndex: 1,
        backgroundColor: "#404040",
        width: "100%",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Button onClick={homeClick} sx={{ marginLeft: 5 }}>
              Home
            </Button>
            <Button onClick={logClick} sx={{ marginLeft: 5 }}>
              Logs
            </Button>
            <Button onClick={signOut} sx={{ marginLeft: 5 }}>
              Sign-out
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default NavbarWelcome;
