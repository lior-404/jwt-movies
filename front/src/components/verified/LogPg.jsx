import Box from "@mui/material/Box";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";
import {
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Typography,
} from "@mui/material";
import NavbarWelcome from "../verified/navbar/NavbarWelcome";
import { parseDate } from "../../utils/ParseDate";

export default function LogsPg() {
  const [user, setUser] = useContext(UserContext);
  const [logs, setLogs] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(import.meta.env.VITE_API_ENDPOINT + "users/logs", {
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
        } else {
          const data = await response.json();
          // console.log(data.logs);
          const sortedLogs = data.logs.reverse();
          parseDate(sortedLogs);
          setLogs(sortedLogs);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setLogs({});
        setLoading(false);
      });
  }, []);

  return (
    <Box>
      {loading ? (
        <CircularProgress />
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "white",
            minWidth: 600,
            margin: 12,
          }}
        >
          <NavbarWelcome />
          {logs.map((item, i) => (
            <Card sx={{ minWidth: 600 }} key={i}>
              <CardContent>
                <Typography variant="h5" component="div" sx={{ mb: 1.5 }}>
                  {item.url}
                </Typography>
                <Typography sx={{ marginBottom: 1 }}>{item.extra}</Typography>
                <Typography variant="body2" sx={{ mb: 1.5 }}>
                  {item.username}
                </Typography>
                <Typography variant="body2">{item.date}</Typography>
              </CardContent>
              <Divider
                sx={{
                  borderBottomWidth: 3,
                  borderColor: "primary.main",
                  my: 2,
                }}
              />
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
}
