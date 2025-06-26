import { useContext, useState } from "react";
import { UserContext } from "../UserContext";
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Stack,
  Alert,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import "../../App.css";
import { useNavigate } from "react-router-dom";
import { Call, CallOutlined } from "@mui/icons-material";

function Login() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useContext(UserContext);
  const navigation = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const genericErrorMessage = "Something went wrong! Please try again later.";

    fetch(import.meta.env.VITE_API_ENDPOINT + "users/login", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: email, password }),
    })
      .then(async (response) => {
        setIsSubmitting(false);
        if (!response.ok) {
          if (response.status === 400) {
            setError("Please fill all the fields correctly!");
          } else if (response.status === 401) {
            setError("Invalid Email and password combination.");
          } else {
            setError(genericErrorMessage);
          }
        } else {
          const data = await response.json();
          setUser((oldValue) => {
            return { ...oldValue, token: data.token };
          });
          navigation("/ver");
        }
      })
      .catch((error) => {
        setIsSubmitting(false);
        setError(genericErrorMessage);
      });
  };

  return (
    <div>
      <Card sx={{ maxWidth: 800, minWidth: 800, minHeight: 650 }}>
        {error && <Alert severity="error"> {error} </Alert>}
        <CardMedia
          component="img"
          height="450"
          image="movies_image.avif"
          alt="some pic"
        />
        <CardContent>
          <Stack spacing={2} sx={{ maxWidth: 300 }}>
            <TextField
              label="Email"
              variant="outlined"
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              id="outlined-password-input"
              label="Password"
              type="password"
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </Stack>
        </CardContent>

        <CardActions>
          <Button
            size="large"
            color="primary"
            sx={{ marginTop: 5, marginLeft: 90 }}
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            Login
          </Button>
        </CardActions>
      </Card>
    </div>
  );
}

export default Login;
