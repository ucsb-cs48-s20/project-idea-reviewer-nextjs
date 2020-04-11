import { useCallback } from "react";
import Head from "next/head";
import useSWR from "swr";
import fetch from "isomorphic-unfetch";
import Button from "react-bootstrap/Button";
import BootstrapTable from "react-bootstrap-table-next";
import { getAdmins } from "../api/admins";
import Layout from "../../components/Layout";
import { createRequiredAuth } from "../../utils/ssr";
import { serializeDocument } from "../../utils/mongodb";

export const getServerSideProps = async ({ req, res }) => {
  const ssr = await createRequiredAuth({ roles: ["admin"] })({ req, res });

  ssr.props.initialData = (await getAdmins()).map(serializeDocument);

  return ssr;
};

function getColumnsWithActions(actionsFn) {
  return [
    {
      dataField: "_id",
      text: "User ID",
    },
    {
      dataField: "email",
      text: "Email",
    },
    {
      dataField: "df1",
      isDummyField: true,
      text: "Actions",
      formatter: actionsFn,
    },
  ];
}

export default function ManageAdminsPage(props) {
  const { user, initialData } = props;

  const { data, mutate } = useSWR("/api/admins", { initialData });

  const deleteAdmin = useCallback(async (adminId) => {
    await mutate(
      data.filter((u) => u._id !== adminId),
      false
    );
    await fetch(`/api/admins/${adminId}`, { method: "DELETE" });
    await mutate();
  }, []);

  const columns = getColumnsWithActions((_, row) => {
    if (row._id === user._id) {
      return "(You)";
    }

    return (
      <Button variant="danger" onClick={() => deleteAdmin(row._id)}>
        Delete
      </Button>
    );
  });

  return (
    <Layout user={user}>
      <Head>
        <title>Manage Admins</title>
      </Head>
      <h1>Manage Admins</h1>
      <BootstrapTable keyField="_id" data={data} columns={columns} />
    </Layout>
  );
}
