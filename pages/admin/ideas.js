import { useCallback, useState } from "react";
import Head from "next/head";
import useSWR from "swr";
import fetch from "isomorphic-unfetch";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import BootstrapTable from "react-bootstrap-table-next";
import { getIdeas } from "../api/ideas";
import Layout from "../../components/Layout";
import { createRequiredAuth } from "../../utils/ssr";
import { serializeDocument } from "../../utils/mongodb";
import { useToasts } from "../../components/Toasts";

export const getServerSideProps = async ({ req, res }) => {
  const ssr = await createRequiredAuth({ roles: ["admin"] })({ req, res });

  ssr.props.initialData = (await getIdeas()).map(serializeDocument);

  return ssr;
};

function getColumns() {
  return [
    {
      dataField: "_id",
      text: "User ID",
    },
    {
      dataField: "author",
      text: "Author",
    },
    {
      dataField: "title",
      text: "Title",
    },
    {
      dataField: "description",
      text: "Description",
    },
    {
      dataField: "df1",
      isDummyField: true,
      text: "# Reviews",
      formatter: (_, row) => row?.reviews?.length || 0,
    },
    {
      dataField: "df2",
      isDummyField: true,
      text: "Average Rating",
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
  ];
}

const rowStyle = { wordBreak: "break-all" };

export default function ManageAdminsPage(props) {
  const { user, initialData } = props;
  const { data } = useSWR("/api/ideas", { initialData });

  const columns = getColumns();

  return (
    <Layout user={user}>
      <Head>
        <title>Manage Ideas</title>
      </Head>
      <h1>Manage Ideas</h1>
      <BootstrapTable
        keyField="_id"
        data={data}
        columns={columns}
        rowStyle={rowStyle}
      />
    </Layout>
  );
}
