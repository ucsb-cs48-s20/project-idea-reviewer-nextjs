import { useCallback, useState } from "react";
import Head from "next/head";
import useSWR from "swr";
import fetch from "isomorphic-unfetch";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import BootstrapTable from "react-bootstrap-table-next";
import Layout from "../../components/Layout";
import { createRequiredAuth } from "../../utils/ssr";
import { serializeDocument } from "../../utils/mongodb";
import { useToasts } from "../../components/Toasts";
import { getStudents } from "../api/students";

export const getServerSideProps = async ({ req, res }) => {
  const ssr = await createRequiredAuth({ roles: ["admin"] })({ req, res });

  ssr.props.initialData = (await getStudents()).map(serializeDocument);

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
      dataField: "section",
      text: "Section",
    },
    {
      dataField: "df1",
      isDummyField: true,
      text: "Actions",
      formatter: actionsFn,
    },
  ];
}

export default function ManageStudentsPage(props) {
  const { user, initialData } = props;
  const { showToast } = useToasts();
  const { data, mutate } = useSWR("/api/students", { initialData });
  const [newStudentEmail, setNewStudentEmail] = useState("");
  const [newStudentSection, setNewStudentSection] = useState("");
  const addStudent = useCallback(
    async (e) => {
      // override default form submission behavior
      e.preventDefault();
      e.stopPropagation();

      setNewStudentEmail("");
      setNewStudentSection("");

      showToast(`Added student ${newStudentEmail}`);
      await mutate(
        [...data, { email: newStudentEmail, section: newStudentSection }],
        false
      );
      await fetch("/api/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: newStudentEmail,
          section: newStudentSection,
        }),
      });
      await mutate();
    },
    [newStudentEmail, newStudentSection]
  );

  const deleteStudent = useCallback(async (studentId) => {
    console.log(studentId);
    showToast(`Deleted student ${data.find((u) => u._id === studentId).email}`);
    await mutate(
      data.filter((u) => u._id !== studentId),
      false
    );
    await fetch(`/api/students/${studentId}`, { method: "DELETE" });
    await mutate();
  }, []);

  const columns = getColumnsWithActions((_, row) => {
    return (
      <Button variant="danger" onClick={() => deleteStudent(row._id)}>
        Delete
      </Button>
    );
  });
  return (
    <Layout user={user}>
      <Head>
        <title>Manage Students</title>
      </Head>
      <h1>Manage Students</h1>
      <Form onSubmit={addStudent} className="mb-5">
        <Form.Group>
          <Form.Label>Email Address</Form.Label>
          <FormControl
            type="text"
            value={newStudentEmail}
            onChange={(e) => setNewStudentEmail(e.target.value)}
          />
          <Form.Label>Section</Form.Label>
          <FormControl
            type="text"
            value={newStudentSection}
            onChange={(e) => setNewStudentSection(e.target.value)}
          />
        </Form.Group>
        <Button type="submit">Add Student</Button>
      </Form>
      <BootstrapTable keyField="_id" data={data} columns={columns} />
    </Layout>
  );
}
