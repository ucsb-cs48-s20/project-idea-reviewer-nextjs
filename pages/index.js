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

  /**
   * Returns proper html for page body on user role and # of reviews submitted
   */
  function IdeaSubmissionForUser(props) {
    const user = props.user;

    // unauthenticated
    if (!user) {
      return (
        <Alert variant="default">Please log in to use this application</Alert>
      );
    }
    // guest
    if (!user.role || !(user.role == "student" || user.role == "admin")) {
      return (
        <Alert variant="danger">You are not enrolled in this course</Alert>
      );
    }
    // admin
    if (user.role === "admin") {
      return <Alert variant="warning">Admins can not submit ideas</Alert>;
    }

    // authenticated student
    const { data } = useSWR("/api/ideas", (url) =>
      fetch(url).then((_) => _.json())
    );

    // waiting for data
    if (!data) {
      return <h1></h1>;
    }
    //user needs to review
    if (data.length == 0) {
      return <IdeaForm />;
    }
    // user has submitted a review
    return (
      <div>
        <Alert variant="warning">
          You must review x more project ideas.
          <Alert.Link href="#">
            {" "}
            Click here to review other project ideas
          </Alert.Link>
        </Alert>
        <h2>Your Project Idea</h2>
        <table className="table">
          <tbody>
            <tr>
              <th>Title</th>
              <td>{data[0].title}</td>
            </tr>
            <tr>
              <th>Details</th>
              <td>{data[0].description}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <Layout user={user}>
      <Head>
        <title>Project Idea Reviewer</title>
      </Head>
      <h1>Welcome to the Project Idea Reviewer!</h1>
      <IdeaSubmissionForUser user={user} />
    </Layout>
  );
}
