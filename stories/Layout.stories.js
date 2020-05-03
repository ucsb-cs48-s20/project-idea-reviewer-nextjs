import React from "react";
import Layout from "../components/Layout";

import Container from "react-bootstrap/Container";
import { text } from "@storybook/addon-knobs";
import { sampleUser } from "./setup";

export default {
  title: "Layout",
  component: Layout,
};

export const loggedOutEmpty = () => {
  return <Layout />;
};

export const loggedInWithContentInContainer = () => {
  const content = text("Sample Content", "This is sample content");
  const user = sampleUser();
  return (
    <Layout user={user}>
      <Container className="py-3">{content}</Container>
    </Layout>
  );
};
