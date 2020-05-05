import Layout from "../components/Layout";
import IdeaForm from "../components/IdeaForm";
import { optionalAuth } from "../utils/ssr";
import Head from "next/head";
import { useCallback, useState } from "react";

export const getServerSideProps = optionalAuth;

export default function HomePage(props) {
  const user = props.user;

  return (
    <Layout user={user}>
      <Head>
        <title>Project Idea Reviewer</title>
      </Head>
      <h1>Welcome to the Project Idea Reviewer!</h1>
      <IdeaForm></IdeaForm>
    </Layout>
  );
}
