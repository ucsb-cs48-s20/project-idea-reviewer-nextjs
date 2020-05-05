import Layout from "../components/Layout";
import IdeaForm from "../components/IdeaForm";
import { optionalAuth } from "../utils/ssr";
import { Alert } from "react-bootstrap";
import Head from "next/head";
import { useCallback, useState } from "react";
import fetch from "isomorphic-unfetch";
import useSWR from "swr";

export const getServerSideProps = optionalAuth;

export default function HomePage(props) {
  const user = props.user;

  const { ideas } = useSWR("/api/ideas", fetch, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  if (!ideas) {
    return <h1>Loading</h1>;
  }

  return (
    <Layout user={user}>
      <Head>
        <title>Project Idea Reviewer</title>
      </Head>
      <h1>Welcome to the Project Idea Reviewer!</h1>
      {!user && (
        <Alert variant="default">Please log in to use this application</Alert>
      )}
      {user.role == "guest" && (
        <Alert variant="danger">You are not enrolled in this course</Alert>
      )}
      {user.role == "admin" && (
        <Alert variant="warning">Admins can not submit project ideas</Alert>
      )}
      {user.role == "student" && ideas != null && ideas == 0 && <IdeaForm />}
      {user.role == "student" && ideas != null && ideas == 1 && (
        <p>you have an idea (describe it here)</p>
      )}
    </Layout>
  );
}
