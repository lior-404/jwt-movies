import { useState, useEffect, useContext } from "react";
import { Box, InputLabel, MenuItem, FormControl, Select } from "@mui/material";
import NavbarWelcome from "../navbar/NavbarWelcome";
import { UserContext } from "../../UserContext";
import PlayVideo from "./PlayVideo";

function StreamMain() {
  const [videoNames, setVideoNames] = useState([]);
  const [videoToPlay, setVideoToPlay] = useState("");
  const [user] = useContext(UserContext);

  const handleChange = (event) => {
    setVideoToPlay(event.target.value); // Update selected video name
  };

  useEffect(() => {
    // Fetch video names from the backend
    fetch(import.meta.env.VITE_API_ENDPOINT + `streams/list`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    })
      .then(async (response) => {
        if (!response.ok) {
          setVideoNames([]);
          console.log("Error occurred");
        } else {
          const data = await response.json();
          setVideoNames(data.list || []);
        }
      })
      .catch((err) => {
        setVideoNames([]);
        console.log(err);
      });
  }, []);

  return (
    <Box>
      <NavbarWelcome />

      <Box sx={{ minWidth: 120, marginTop: 2 }}>
        <FormControl fullWidth>
          <InputLabel id="video-select-label">Video</InputLabel>
          <Select
            labelId="video-select-label"
            id="video-select"
            value={videoToPlay}
            label="Video"
            onChange={handleChange}
          >
            {videoNames.map((item, i) => (
              <MenuItem value={item.name} key={i}>
                {item.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {videoToPlay && (
        <Box mt={4}>
          <PlayVideo filename={videoToPlay} />
        </Box>
      )}
    </Box>
  );
}

export default StreamMain;
