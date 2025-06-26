import { useContext, useEffect, useState } from "react";
import "../../../assets/styles/movies.css";
import MoviesItem from "./MovieItem";
import { Grid } from "@mui/material";
import { UserContext } from "../../UserContext";
import Navbar from "../navbar/NavbarMvoies";
import ChatMovies from "./ChatMovies";

function Movies() {
  const [user, setUser] = useContext(UserContext);
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [type1, setType1] = useState("movies");
  const [page, setPage] = useState(1);
  const [tabType, setTabType] = useState("movies");
  const [openChat, setOpenChat] = useState(false);

  const searchMovie = (event) => {
    event.preventDefault();
    if (searchTerm !== "") {
      let url = "";
      type1 === "movies"
        ? (url = import.meta.env.VITE_MOVIE_ENDPOINT_SEARCH + searchTerm)
        : (url = import.meta.env.VITE_TV_ENDPOINT_SEARCH + searchTerm);
      // console.log("in Search movie: ", url)
      getMovieDetails(url);
      // setSearchTerm("");
      setTabType("trending0123");
    }
  };
  const getMovieDetails = (urlString) => {
    fetch(urlString, { mode: "cors" })
      .then((res) => res.json())
      .then((data) => {
        data.results = data.results.sort((a, b) => b.popularity - a.popularity);
        setMovies(data.results);
        // console.log(data)
      });
  };

  const changePage = (value = 1, type) => {
    if (type === "movies") {
      getMovieDetails(import.meta.env.VITE_MOVIE_ENDPOINT_HOME + value);
    }
    if (type === "tv") {
      getMovieDetails(import.meta.env.VITE_TV_ENDPOINT_HOME + value);
    }
    if (type === "topRated") {
      getMovieDetails(import.meta.env.VITE_MOVIE_TOP_RATED + value);
    }
    if (type == "topRatedTV") {
      getMovieDetails(import.meta.env.VITE_TV_TOP_RATED + value);
    }
  };

  const favoriteMovies = () => {
    // console.log('in favorite handler')
    setTabType("favorites");
    fetch(import.meta.env.VITE_API_ENDPOINT + "movies/favorites", {
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
          // console.log(data.movieList);
          setMovies(data.movieList);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const popularHandler = () => {
    // console.log('in popular handler')
    setTabType("movies");
    setPage(1);
    getMovieDetails(import.meta.env.VITE_MOVIE_ENDPOINT_HOME + 1);
  };
  const popularTVHandler = () => {
    // console.log('in popular TV handler')
    setTabType("tv");
    setPage(1);
    getMovieDetails(import.meta.env.VITE_TV_ENDPOINT_HOME + 1);
  };
  const trendingHandler = () => {
    setTabType("trending");
    setPage(1);
    getMovieDetails(import.meta.env.VITE_MOVIE_TRENDING);
  };
  const trendingTVHandler = () => {
    setTabType("trendingTV");
    setPage(1);
    getMovieDetails(import.meta.env.VITE_TV_TRENDING);
  };
  const topRatedMovies = () => {
    setTabType("topRated");
    setPage(1);
    getMovieDetails(import.meta.env.VITE_MOVIE_TOP_RATED + 1);
  };
  const topRatedTV = () => {
    setTabType("topRatedTV");
    setPage(1);
    getMovieDetails(import.meta.env.VITE_TV_TOP_RATED + 1);
  };

  useEffect(() => {
    getMovieDetails(import.meta.env.VITE_MOVIE_ENDPOINT_HOME + 1);
  }, []);

  return (
    <div className="movie-pg">
      <Navbar
        // logoutHandler={props.logoutHandler}
        favoriteMovies={favoriteMovies}
        popularHandler={popularHandler}
        getMovieDetails={getMovieDetails}
        searchMovie={searchMovie}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        popularTVHandler={popularTVHandler}
        trendingHandler={trendingHandler}
        trendingTVHandler={trendingTVHandler}
        type1={type1}
        setType1={setType1}
        changePage={changePage}
        tabType={tabType}
        page={page}
        setPage={setPage}
        topRatedTV={topRatedTV}
        topRatedMovies={topRatedMovies}
        setOpenChat={setOpenChat}
        // showCards={showCards}
      />

      <ChatMovies setOpen={setOpenChat} open={openChat} />

      <div className="movie-container">
        <Grid container spacing={3}>
          {movies.map((card) => (
            <Grid item xs={12} sm={6} md={4} lg={2} key={card.id}>
              <MoviesItem
                {...card}
                tabType={tabType}
                favoriteMovies={favoriteMovies}
              />
            </Grid>
          ))}
        </Grid>
      </div>
    </div>
  );
}

export default Movies;
