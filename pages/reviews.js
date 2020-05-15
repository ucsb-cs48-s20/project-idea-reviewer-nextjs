import { useCallback } from "react";
import Head from "next/head";
import useSWR from "swr";
import fetch from "isomorphic-unfetch";
import Button from "react-bootstrap/Button";
import BootstrapTable from "react-bootstrap-table-next";
import { getReviews } from "./api/reviews";
import Layout from "../components/Layout";
import { createRequiredAuth } from "../utils/ssr";
import { serializeDocument } from "../utils/mongodb";
import { useToasts } from "../components/Toasts";

export const getServerSideProps = async ({ req, res }) => {
  const ssr = await createRequiredAuth({ roles: ["admin"] })({ req, res });

  ssr.props.initialData = (await getReviews()).map(serializeDocument);

  return ssr;
};

function getColumnsWithActions(actionsFn) {
  return [
    {
      dataField: "_id",
      text: "id",
      sort: true,
    },
    {
      dataField: "title",
      text: "idea title",
    },
    {
      dataField: "reviews.rating",
      text: "rating",
    },
    {
      dataField: "reviews.description",
      text: "review details",
    },
    {
      dataField: "reviews.author.fname",
      text: "first",
    },
    {
      dataField: "reviews.author.lname",
      text: "last",
    },
    {
      dataField: "reviews.author.email",
      text: "email",
    },
    {
      dataField: "df1",
      isDummyField: true,
      text: "delete",
      formatter: actionsFn,
    },
  ];
}

export default function ManageReviewsPage(props) {
  const { user, initialData } = props;
  const { showToast } = useToasts();
  const { data, mutate } = useSWR("/api/reviews", { initialData });

  const deleteId = useCallback(async (ideaId, authorId) => {
    showToast(
      `Deleted review by ${
        data.find((u) => u._id === ideaId && u.reviews.author._id === authorId)
          ?.reviews.author.email
      }`
    );
    await mutate(
      data.filter((u) => u.reviews.author._id !== authorId),
      false
    );
    await fetch(`/api/reviews/${ideaId}/${authorId}`, { method: "DELETE" });
    await mutate();
  }, []);

  // We need to pass the _id of the idea and the authorId of rating AND the message
  const columns = getColumnsWithActions((_, row) => {
    return (
      <Button
        variant="danger"
        onClick={() => deleteId(row._id, row.reviews.author._id)}
      >
        Delete
      </Button>
    );
  });

  return (
    <Layout user={user}>
      <Head>
        <title>Manage Reviews</title>
      </Head>
      <h1>Manage Reviews</h1>
      <BootstrapTable keyField="_id" data={data} columns={columns} />
      <style jsx global>{`
        .table {
          overflow: auto;
          display: block;
          table-layout: auto;
        }
      `}</style>
    </Layout>
  );
}
