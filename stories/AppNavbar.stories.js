import React from "react";
import { select, text } from "@storybook/addon-knobs";
import AppNavbar from "../components/AppNavbar";

export default {
  title: "Navbar",
  component: AppNavbar,
};

export const loggedOut = () => {
  return <AppNavbar />;
};

export const loggedIn = () => {
  const name = text("Name", "Phill Conrad");
  const role = select("Role", ["admin", "student", "guest"], "guest");
  const picture = text(
    "Image URL",
    "https://avatars3.githubusercontent.com/u/1119017"
  );
  return <AppNavbar user={{ name, role, picture }} />;
};
