import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import InputBase from "@mui/material/InputBase";
import {
  forwardRef,
  Fragment,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { UserContext } from "../../UserContext";
import { Box, Divider } from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import { ImFileText } from "react-icons/im";
import { parseDate } from "../../../utils/ParseDate";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
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

export default function ChatMovies({ setOpen, open }) {
  const [user] = useContext(UserContext);
  const [msgList, setMsgList] = useState([]);
  const [msgContent, setMsgContent] = useState("");
  const dialogContentRef = useRef(null);

  const handleClose = () => {
    setOpen(false);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (msgContent === "") {
      return;
    }
    fetch(import.meta.env.VITE_API_ENDPOINT + "chat/msgsend", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({
        msg: msgContent,
      }),
    })
      .then(async (response) => {
        setMsgContent("");
        if (!response.ok) {
          console.log("error occurred");
        } else {
          const data = await response.json();
          //   console.log(data);
          if (data.message == "OK") {
            parseDate(data.msglist);
            setMsgList(data.msglist);
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const msgContentChange = (event) => {
    event.preventDefault();
    setMsgContent(event.target.value);
  };

  useEffect(() => {
    // Scroll to the bottom of the DialogContent when new messages are added
    if (dialogContentRef.current) {
      dialogContentRef.current.scrollTop =
        dialogContentRef.current.scrollHeight;
    }
  }, [msgList]);

  useEffect(() => {
    fetch(import.meta.env.VITE_API_ENDPOINT + "chat/msgget", {
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
          console.log(data);
          parseDate(data.msglist);
          setMsgList(data.msglist);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function handleDeleteMessage(e, msgIndex) {
    e.preventDefault();
    fetch(import.meta.env.VITE_API_ENDPOINT + "chat/msgremoveone", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({
        msgId: msgList[msgIndex],
        msg: msgList[msgIndex].message,
      }),
    })
      .then(async (response) => {
        if (!response.ok) {
          console.log("error occurred");
        } else {
          const data = await response.json();
          if (data.message == "OK") {
            parseDate(data.msglist);
            setMsgList(data.msglist);
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <Fragment>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
        sx={{ "& .MuiDialog-paper": { minWidth: "40rem" } }}
      >
        <DialogTitle
          sx={{
            alignContent: "center",
            justifyContent: "center",
            display: "flex",
          }}
        >
          {"Chat"}
        </DialogTitle>
        <DialogContent
          ref={dialogContentRef}
          sx={{ maxHeight: "50vh", overflowY: "auto" }}
        >
          {msgList &&
            msgList.map((v, i) => (
              <Box key={i}>
                <DialogTitle>{v.message}</DialogTitle>
                <DialogContentText
                  id="alert-dialog-slide-description"
                  sx={{ display: "flex" }}
                >
                  {v.username} {" :: "} {v.date}
                </DialogContentText>
                {v.username === user.username ? (
                  <Button
                    onClick={(e) => handleDeleteMessage(e, i)}
                    sx={{ backgroundColor: "black", marginTop: 1 }}
                  >
                    Delete
                  </Button>
                ) : null}
                <Divider
                  sx={{
                    borderBottomWidth: 3,
                    borderColor: "primary.main",
                    my: 1,
                  }}
                />
              </Box>
            ))}
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: "space-between",
            backgroundColor: "#404040",
            alignItems: "center",
          }}
        >
          <form
            onSubmit={handleSendMessage}
            style={{ display: "flex", width: "100%" }}
          >
            <Search
              sx={{
                color: "black",
                flexGrow: 1, // Allows Search to take up available space
                marginLeft: 0,
                width: "70%", // Increases width of the Search component
              }}
            >
              <SearchIconWrapper>
                <ImFileText />
              </SearchIconWrapper>

              <StyledInputBase
                placeholder="Message..."
                inputProps={{ "aria-label": "search" }}
                onChange={msgContentChange}
                value={msgContent}
              />
            </Search>
            <Button
              onClick={handleSendMessage}
              sx={{ marginLeft: "auto", flexShrink: 0 }}
              type="submit"
            >
              Send
            </Button>
          </form>
          {/* <Button onClick={handleClose}>Agree</Button> */}
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
