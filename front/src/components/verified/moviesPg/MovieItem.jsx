import { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Paper,
  Slide,
  Typography,
} from "@mui/material";
import { UserContext } from "../../UserContext";
// import '../../assets/movies.css'

function MoviesItem({
  title,
  original_name,
  poster_path,
  overview,
  vote_average,
  release_date,
  first_air_date,
  id,
  tabType,
  favoriteMovies,
}) {
  const [userContext, setUserContext] = useContext(UserContext);
  const [checked, setChecked] = useState(false);
  const [infoUrl, setInfoUrl] = useState([]);

  useEffect(() => {
    if (original_name === null || original_name === undefined) {
      setInfoUrl([
        "https://www.imdb.com/find/?q=" + title,
        "https://yts.mx/browse-movies/" + title + "/all/all/0/seeds/0/all",
        "https://1337x.to/category-search/" + title + "/Movies/1/",
        "https://www.netflix.com/search?q=" + title,
        "https://www.apps.disneyplus.com/il/explore?search_query=" + title,
        "https://www.primevideo.com/region/eu/search/ref=atv_nb_sug?ie=UTF8&phrase=" +
          title,
      ]);
    } else {
      setInfoUrl([
        "https://www.imdb.com/find/?q=" + original_name,
        "",
        "https://1337x.to/category-search/" + original_name + "/TV/1/",
        "https://www.netflix.com/search?q=" + original_name,
        "https://www.apps.disneyplus.com/il/explore?search_query=" +
          original_name,
        "https://www.primevideo.com/region/eu/search/ref=atv_nb_sug?ie=UTF8&phrase=" +
          original_name,
      ]);
    }
  }, [original_name, title]);

  const setVoteClass = (vote) => {
    if (vote > 7.8) {
      return "green";
    } else if (vote > 6) {
      return "orange";
    } else {
      return "red";
    }
  };
  const moviePoster = import.meta.env.VITE_MOVIE_ENDPOINT_IMG;
  const year = release_date
    ? release_date.split("-")
    : first_air_date
    ? first_air_date.split("-")
    : "";

  const handleClickSave = (event) => {
    fetch(import.meta.env.VITE_API_ENDPOINT + "movies/saveMovie", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userContext.token}`,
      },
      body: JSON.stringify({
        title: title,
        original_name: original_name,
        poster_path: poster_path,
        overview: overview,
        vote_average: vote_average,
        release_date: release_date,
        first_air_date: first_air_date,
        id: id,
      }),
    })
      .then(async (response) => {
        if (!response.ok) {
          console.log("error occurred.");
        } else {
          const data = await response.json();
          // console.log(data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleClickRemove = (event) => {
    fetch(import.meta.env.VITE_API_ENDPOINT + "movies/removeMovie", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userContext.token}`,
      },
      body: JSON.stringify({
        title: title,
        id: id,
      }),
    })
      .then(async (response) => {
        if (!response.ok) {
          console.log("error occurred.");
        } else {
          const data = await response.json();
          favoriteMovies();
          // console.log(data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleClickInfo = (event) => {
    setChecked(!checked);
  };

  const icon1 = () => {
    return (
      <Paper elevation={4} sx={{ backgroundColor: "black" }}>
        <Box sx={{ marginTop: 1 }}>
          <Button
            variant="contained"
            href={infoUrl[0]}
            sx={{ marginRight: 1 }}
            target="_blank"
            rel="noopener noreferrer"
            color="warning"
          >
            IMDB
          </Button>
          {infoUrl[1] !== "" ? (
            <Button
              variant="contained"
              href={infoUrl[1]}
              sx={{ marginRight: 1 }}
              target="_blank"
              rel="noopener noreferrer"
              color="warning"
            >
              YTS
            </Button>
          ) : null}
          <Button
            variant="contained"
            href={infoUrl[2]}
            target="_blank"
            rel="noopener noreferrer"
            color="warning"
          >
            1337X
          </Button>
        </Box>
        <Box sx={{ marginTop: 1 }}>
          <Button
            variant="contained"
            href={infoUrl[3]}
            sx={{ marginRight: 1 }}
            target="_blank"
            rel="noopener noreferrer"
            color="warning"
          >
            Netfilx
          </Button>
          <Button
            variant="contained"
            href={infoUrl[4]}
            sx={{ marginRight: 1 }}
            target="_blank"
            rel="noopener noreferrer"
            color="warning"
          >
            Disney+
          </Button>
          <Button
            variant="contained"
            href={infoUrl[5]}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ marginTop: 1 }}
            color="warning"
          >
            Prime Videos
          </Button>
        </Box>
      </Paper>
    );
  };

  const roundedVoteAverage = vote_average.toFixed(1);
  // const roundedVoteAverage = vote_average;

  return (
    <div className="movie-item">
      <Card
        sx={{ width: "100%", height: "100%", minHeight: 600, maxHeight: 600 }}
      >
        <CardMedia
          // className='movie-item-img'
          component="img"
          alt="movie-img"
          height="450"
          image={moviePoster + poster_path}
        />
        <CardContent>
          <Typography
            gutterBottom
            variant="h5"
            component="div"
            sx={{ fontSize: 20, fontWeight: "bold" }}
          >
            {title}
            {original_name}
          </Typography>
          <Typography
            gutterBottom
            variant="h6"
            component="div"
            sx={{ fontSize: 14 }}
          >
            Year of Release: {year[0]}
          </Typography>
          <Box sx={{ position: "absolute", bottom: 15, left: 10 }}>
            <span className={`tag ${setVoteClass(roundedVoteAverage)}`}>
              {roundedVoteAverage}
            </span>
          </Box>
          <div className="movie-overview">
            <h2>Overview</h2>
            <p>{overview}</p>
            {tabType === "favorites" ? (
              <Button
                variant="contained"
                onClick={handleClickRemove}
                color="secondary"
              >
                Remove
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleClickSave}
                color="secondary"
              >
                Save
              </Button>
            )}
            <Box sx={{ marginTop: 1 }}>
              <Button variant="contained" onClick={handleClickInfo}>
                Watch-Info
              </Button>
            </Box>
            {checked ? (
              <Slide direction="up" in={checked} mountOnEnter unmountOnExit>
                <Box>{icon1()}</Box>
              </Slide>
            ) : null}
          </div>
        </CardContent>
        {/* <CardActions>
        <Button size="small">Share</Button>
        <Button size="small">Learn More</Button>
      </CardActions> */}
      </Card>
    </div>
  );
}

export default MoviesItem;
