import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import {
  Divider,
  Pagination,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import DrawerAnchor from "./DrawerAnchor";
import { IoMenu, IoStar } from "react-icons/io5";
import { TbJewishStar, TbMovie } from "react-icons/tb";
import { BiCameraMovie } from "react-icons/bi";
import { FaRegStar } from "react-icons/fa";
import { IoMdStar } from "react-icons/io";
import { Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { UserContext } from "../../UserContext";
import { MdChat } from "react-icons/md";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

function ResponsiveAppBar(props) {
  const [user, setUser] = useContext(UserContext);
  const [numPages, setNumPages] = useState(20);
  const navigate = useNavigate();

  useEffect(() => {
    if (props.tabType.includes("trending") || props.tabType === "favorites") {
      setNumPages(1);
    } else {
      setNumPages(20);
    }
  }, [props.tabType]);

  const searchChange = (event) => {
    event.preventDefault();
    props.setSearchTerm(event.target.value);
  };

  const pageChange = (event, value) => {
    // event.preventDefault()
    // console.log(value)
    props.setPage(value);
    props.changePage(value, props.tabType);
  };

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

  function handleHomeClick() {
    navigate("/ver");
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
      <Container maxWidth="xxl">
        <Toolbar
          disableGutters
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              alignItems: "center",
            }}
          >
            {/* --------Side menu-------- */}
            <DrawerAnchor
              popularHandler={props.popularHandler}
              trendingHandler={props.trendingHandler}
              topRatedMovies={props.topRatedMovies}
              popularTVHandler={props.popularTVHandler}
              trendingTVHandler={props.trendingTVHandler}
              topRatedTV={props.topRatedTV}
              favoriteMovies={props.favoriteMovies}
            />
            {/* --------Buttons Top menu-------- */}
            <Button onClick={props.popularHandler} sx={{ color: "orange" }}>
              <BiCameraMovie /> {"\u00A0"} {"Movies"}
            </Button>
            <Button onClick={props.popularTVHandler} sx={{ color: "orange" }}>
              {" "}
              <TbMovie /> {"\u00A0"} {"TV"}
            </Button>
            <Button onClick={props.favoriteMovies} sx={{ color: "orange" }}>
              {" "}
              <IoStar /> {"\u00A0"} {"Favorites"}
            </Button>
            {/* --------chat button-------- */}
            <Button
              sx={{ marginLeft: 3 }}
              onClick={() => props.setOpenChat(true)}
            >
              <MdChat size={25} />
            </Button>
            <Button onClick={handleHomeClick}>Home</Button>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {/* --------Page selection-------- */}
            <Pagination
              count={numPages}
              color="primary"
              sx={{ marginRight: "25rem" }}
              onChange={pageChange}
              page={props.page}
            />

            {/* --------Toggle movie/tv-------- */}
            <ToggleButtonGroup
              color="primary"
              value={props.type1}
              exclusive
              onChange={(e) => props.setType1(e.target.value)}
              aria-label="Platform"
            >
              <ToggleButton value="movies">Movies</ToggleButton>
              <ToggleButton value="tv">TV</ToggleButton>
            </ToggleButtonGroup>
            {/* --------Search-------- */}
            <form onSubmit={props.searchMovie}>
              <Search sx={{ color: "black" }}>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>

                <StyledInputBase
                  placeholder="Search…"
                  inputProps={{ "aria-label": "search" }}
                  onChange={searchChange}
                  value={props.searchTerm}
                />
              </Search>
            </form>
            <Button onClick={signOut} sx={{ marginLeft: 5 }}>
              Sign-out
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
