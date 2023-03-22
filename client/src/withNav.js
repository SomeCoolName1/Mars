import React from "react";
import { Outlet } from "react-router";
import Friends from "./components/friends/friendsList";
import NavBar from "./components/nav";

const styles = {
  content: {
    color: "white",
    overflowY: "scroll",
    minHeight: "100vh",
    height: "100vh",
    paddingLeft: "16px",
    paddingRight: "16px",
  },

  dashboard: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
};

export default () => {
  return (
    <div style={styles.dashboard}>
      <NavBar />
      <div style={styles.content}>
        <Outlet />
      </div>
      <Friends />
    </div>
  );
};
