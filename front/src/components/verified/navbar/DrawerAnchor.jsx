import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Fragment, useState } from "react";
import { TbMovie } from "react-icons/tb";
import { BiCameraMovie } from "react-icons/bi";
import { IoMenu, IoStar } from "react-icons/io5";
import { MdMenu, MdMenuOpen } from "react-icons/md";

export default function DrawerAnchor(props) {
  const [state, setState] = useState({
    left: false,
  });
  const clickHandlers = [
    props.popularHandler,
    props.trendingHandler,
    props.topRatedMovies,
    props.popularTVHandler,
    props.trendingTVHandler,
    props.topRatedTV,
    props.favoriteMovies,
  ];

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {[
          "Movies",
          "Trending Movies",
          "Top-Rated Movies",
          "TV",
          "Trending TV",
          "Top-Rated TV",
          "Favorites",
        ].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {text.includes("TV") ? (
                  <TbMovie />
                ) : text.includes("Favorites") ? (
                  <IoStar />
                ) : (
                  <BiCameraMovie />
                )}
              </ListItemIcon>
              <ListItemText primary={text} onClick={clickHandlers[index]} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <div>
      {["left"].map((anchor) => (
        <Fragment key={anchor}>
          <Button onClick={toggleDrawer(anchor, true)} sx={{ color: "orange" }}>
            {" "}
            <MdMenu /> {"\u00A0"} {"Menu"}
          </Button>
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
          >
            {list(anchor)}
          </Drawer>
        </Fragment>
      ))}
    </div>
  );
}
