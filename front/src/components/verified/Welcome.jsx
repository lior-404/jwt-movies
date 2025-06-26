import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import "../../App.css";
import { Box } from "@mui/material";
import { useSprings, animated } from "@react-spring/web";
import NavbarWelcome from "./navbar/NavbarWelcome";

function Welcome() {
  const navigation = useNavigate();
  const cards = ["movies", "stream"];
  const cards1 = ["finance"];
  const imagePath = [
    "welcome_movie.avif",
    "stream_image.avif",
    "finance_image.avif",
  ];
  const paths = ["/movies", "/streams", "/finance"];

  const springs = useSprings(2, [
    {
      from: { transform: "translateX(-100%)" },
      to: { transform: "translateX(0%)" },
    },
    {
      from: { transform: "translateX(100%)" },
      to: { transform: "translateX(0%)" },
    },
    {
      from: { transform: "translateY(-100%)" },
      to: { transform: "translateY(0%)" },
    },
  ]);

  function navigateTo(e, path) {
    navigation(path);
  }

  return (
    <Box>
      <NavbarWelcome />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: 30, // adds space between cards
        }}
      >
        {cards.map((value, index) => (
          <animated.div style={springs[index]} key={index}>
            <Card sx={{ minWidth: 445, minHeight: 300 }}>
              <CardMedia
                sx={{ height: 300 }}
                image={imagePath[index]}
                title="movie-img"
              />
              <CardActions
                sx={{
                  display: "flex",
                  alignContent: "center",
                  justifyContent: "center",
                  marginBottom: 2,
                }}
              >
                <Button
                  size="large"
                  onClick={(e) => navigateTo(e, paths[index])}
                  sx={{ width: 300 }}
                >
                  {value}
                </Button>
              </CardActions>
            </Card>
          </animated.div>
        ))}
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: 30, // adds space between cards
        }}
      >
        {cards1.map((value, index) => (
          <animated.div style={springs[index]} key={index}>
            <Card sx={{ minWidth: 445, minHeight: 300, marginTop: 5 }}>
              <CardMedia
                sx={{ height: 300 }}
                image={imagePath[2]}
                title="movie-img"
              />
              <CardActions
                sx={{
                  display: "flex",
                  alignContent: "center",
                  justifyContent: "center",
                  marginBottom: 2,
                }}
              >
                <Button
                  size="large"
                  onClick={(e) => navigateTo(e, paths[2])}
                  sx={{ width: 300 }}
                >
                  {value}
                </Button>
              </CardActions>
            </Card>
          </animated.div>
        ))}
      </Box>
    </Box>
  );
}

export default Welcome;
