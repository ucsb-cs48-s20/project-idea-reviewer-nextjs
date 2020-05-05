import Layout from "../components/Layout";
import IdeaForm from "../components/IdeaForm";
import { optionalAuth } from "../utils/ssr";
import { Alert } from "react-bootstrap";
import Head from "next/head";
import { useCallback, useState } from "react";

export const getServerSideProps = optionalAuth;

function getPageContents(user) {
  if (!user) {
    return <Alert variant="default">Please log in to use this app</Alert>;
  } else if (!user.role) {
    // guest user
    return <Alert variant="danger">You are not enrolled in this course!</Alert>;
  } else if (user.role === "admin") {
    return (
      <Alert variant="warning">Admins can not submit project ideas!</Alert>
    );
  } else {
    return <IdeaForm />;
  }
}

export default function HomePage(props) {
  const user = props.user;
  getPageContents(user);
  return (
    <Layout user={user}>
      <Head>
        <title>Project Idea Reviewer</title>
      </Head>
      <h1>Welcome to the Project Idea Reviewer!</h1>
      {getPageContents(user)}
    </Layout>
  );
}
