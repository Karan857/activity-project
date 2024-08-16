import * as React from "react";
import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Divider from "@mui/material/Divider";
import NewsList from "./NewsList.jsx";
import MailBox from "./MailBox.jsx";
import axios from "axios";

export default function SlideBar() {
  const [state, setState] = React.useState({ right: false });
  const [news, setNews] = React.useState([]);
  const drawerRef = React.useRef(null);
  const id = localStorage.getItem("name");

  React.useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(`/api/notify?id=${id}`);
        setNews(response.data);
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };

    fetchNews();
  }, [id]);
  const toggleDrawer = (open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    if (open) {
      setState({ right: open });
    } else {
      setState({ right: open });
    }
  };

  const handleDrawerClick = (event) => {
    event.stopPropagation();
  };

  const list = () => (
    <Box sx={{ width: 400 }} role="presentation" onClick={handleDrawerClick}>
      <NewsList news={news} id={id} />
      <Divider />
    </Box>
  );

  return (
    <div>
      <MailBox onClick={toggleDrawer(true)} news={news} />
      <SwipeableDrawer
        anchor="right"
        open={state.right}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        onClick={(event) => {
          if (drawerRef.current && drawerRef.current.contains(event.target)) {
            event.stopPropagation();
          }
        }}
      >
        <div ref={drawerRef}>{list()}</div>
      </SwipeableDrawer>
    </div>
  );
}
