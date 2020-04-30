import { useCallback } from "react";
import Head from "next/head";
import useSWR from "swr";
import fetch from "isomorphic-unfetch";
import Button from "react-bootstrap/Button";
import BootstrapTable from "react-bootstrap-table-next";
import { getIdeas } from "./api/ideas";
import Layout from "../components/Layout";
import { createRequiredAuth } from "../utils/ssr";
import { serializeDocument } from "../utils/mongodb";
import { useToasts } from "../components/Toasts";

export const getServerSideProps = async ({ req, res }) => {
  const ssr = await createRequiredAuth({ roles: ["admin"] })({ req, res });

  ssr.props.initialData = (await getIdeas()).map(serializeDocument);

  return ssr;
};

const sortCaret = (order) => {
  if (!order) return <span>&nbsp;&nbsp;Down/Up</span>;
  else if (order === "asc")
    return (
      <span>
        &nbsp;&nbsp;Down/<span style={{ color: "var(--red)" }}>Up</span>
      </span>
    );
  else if (order === "desc")
    return (
      <span>
        &nbsp;&nbsp;<span style={{ color: "var(--red)" }}>Down</span>/Up
      </span>
    );
  return null;
};

function getColumnsWithActions(actionsFn) {
  return [
    {
      dataField: "_id",
      text: "id",
      sort: true,
    },
    {
      dataField: "df1",
      isDummyField: true,
      text: "# reviews",
      sort: true,
      sortCaret,
      sortValue: (_, row) => row?.reviews?.length || 0,
      formatter: (_, row) => row?.reviews?.length || 0,
    },
    {
      dataField: "df2",
      isDummyField: true,
      text: "avg rating",
      formatter: (_, row) => {
        const reviews = row?.reviews;

        if (!reviews?.length) {
          return "--";
        }

        const totalScore = reviews
          .map((review) => review.rating)
          .reduce((a, b) => a + b);

        return totalScore / reviews.length;
      },
    },
    {
      dataField: "title",
      text: "title",
    },
    {
      dataField: "description",
      text: "details",
    },
    {
      dataField: "author.fname",
      text: "first",
      isDummyField: true,
    },
    {
      dataField: "author.lname",
      text: "last",
      isDummyField: true,
    },
    {
      dataField: "author.email",
      text: "email",
      isDummyField: true,
    },
    {
      dataField: "df3",
      isDummyField: true,
      text: "delete",
      formatter: actionsFn,
    },
  ];
}

export default function ManageIdeasPage(props) {
  const { user, initialData } = props;
  const { showToast } = useToasts();
  const { data, mutate } = useSWR("/api/ideas", { initialData });

  const deleteId = useCallback(async (ideaId) => {
    showToast(`Deleted idea ${data.find((u) => u._id === ideaId)?.title}`);
    await mutate(
      data.filter((u) => u._id !== ideaId),
      false
    );
    await fetch(`/api/ideas/${ideaId}`, { method: "DELETE" });
    await mutate();
  }, []);

  const columns = getColumnsWithActions((_, row) => {
    return (
      <Button variant="danger" onClick={() => deleteId(row._id)}>
        Delete
      </Button>
    );
  });

  return (
    <Layout user={user}>
      <Head>
        <title>Manage Ideas</title>
      </Head>
      <h1>Manage Ideas</h1>
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
