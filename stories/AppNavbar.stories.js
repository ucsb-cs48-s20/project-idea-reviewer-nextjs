import React from "react";
import { sampleUser } from "./setup";
import AppNavbar from "../components/AppNavbar";

export default {
  title: "AppNavbar",
  component: AppNavbar,
};

export const loggedOut = () => {
  return <AppNavbar />;
};

export const loggedIn = () => {
  const user = sampleUser();
  return <AppNavbar user={user} />;
};
