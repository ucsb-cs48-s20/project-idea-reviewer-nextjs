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
import ReactFileReader from "react-file-reader";
import { reformatEmail } from "../../utils/email";

export const getServerSideProps = async ({ req, res }) => {
  const ssr = await createRequiredAuth({ roles: ["admin"] })({ req, res });

  ssr.props.initialData = (await getStudents()).map(serializeDocument);

  return ssr;
};

function getColumnsWithActions(actionsFn) {
  return [
    {
      dataField: "fname",
      text: "First Name",
    },
    {
      dataField: "lname",
      text: "Last Name",
    },
    {
      dataField: "permNum",
      text: "Perm",
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
  const [newStudentFname, setNewStudentFname] = useState("");
  const [newStudentLname, setNewStudentLname] = useState("");
  const [newStudentPermNum, setNewStudentPermNum] = useState("");
  const addStudent = useCallback(
    async (e) => {
      // override default form submission behavior
      e.preventDefault();
      e.stopPropagation();

      setNewStudentEmail("");
      setNewStudentSection("");
      setNewStudentFname("");
      setNewStudentLname("");
      setNewStudentPermNum("");
      showToast(`Added student ${reformatEmail(newStudentEmail)}`);
      await mutate(
        [
          ...data,
          {
            email: reformatEmail(newStudentEmail),
            section: newStudentSection,
            fname: newStudentFname,
            lname: newStudentLname,
            permNum: newStudentPermNum,
          },
        ],
        false
      );
      await fetch("/api/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: reformatEmail(newStudentEmail),
          section: newStudentSection,
          fname: newStudentFname,
          lname: newStudentLname,
          permNum: newStudentPermNum,
        }),
      });
      await mutate();
    },
    [
      newStudentEmail,
      newStudentSection,
      newStudentFname,
      newStudentLname,
      newStudentPermNum,
    ]
  );

  const deleteStudent = useCallback(async (studentId) => {
    console.log(studentId);
    showToast(
      `Deleted student ${data.find((u) => u._id === studentId)?.email}`
    );
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
  const handleFiles = (files) => {
    var reader = new FileReader();
    reader.onload = (e) => {
      //Split csv file data by new line so that we can skip first row which is header
      let jsonData = reader.result.split("\n");
      jsonData.forEach(async (element, index) => {
        if (index) {
          //Split csv file data by comma so that we will have column data
          const elementRaw = element.split(",");
          if (element) {
            let param = {
              permNum: elementRaw[1],
              email: reformatEmail(elementRaw[10]),
              lname: elementRaw[4],
              fname: elementRaw[5],
              section: elementRaw[8],
            };
            await mutate(
              [
                ...data,
                {
                  permNum: param.permNum,
                  email: param.email,
                  lName: param.lName,
                  fName: param.fName,
                  section: param.section,
                },
              ],
              false
            );
            await fetch("/api/students", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                permNum: param.permNum,
                email: param.email,
                lname: param.lname,
                fname: param.fname,
                section: param.section,
              }),
            });
            await mutate();
          }
        }
      });
    };
    reader.readAsText(files[0]);
  };
  return (
    <Layout user={user}>
      <Head>
        <title>Manage Students</title>
      </Head>
      <h1>Manage Students</h1>
      <Form onSubmit={addStudent} className="mb-5">
        <Form.Group>
          <Form.Label>First Name</Form.Label>
          <FormControl
            type="text"
            value={newStudentFname}
            onChange={(e) => setNewStudentFname(e.target.value)}
          />
          <Form.Label>Last Name</Form.Label>
          <FormControl
            type="text"
            value={newStudentLname}
            onChange={(e) => setNewStudentLname(e.target.value)}
          />
          <Form.Label>Perm</Form.Label>
          <FormControl
            type="text"
            value={newStudentPermNum}
            onChange={(e) => setNewStudentPermNum(e.target.value)}
          />
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
      <ReactFileReader
        fileTypes={[".csv"]}
        multipleFiles={true}
        handleFiles={handleFiles}
      >
        <Button>Upload CSV</Button>
      </ReactFileReader>
      <br />
      <BootstrapTable keyField="_id" data={data} columns={columns} />
    </Layout>
  );
}
