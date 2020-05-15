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
function csvToStudents(csv) {
  var lines = csv.split("\n");
  var result = [];
  for (var i = 1; i < lines.length; i++) {
    var obj = {};
    if (lines[i] == undefined || lines[i].trim() == "") {
      continue;
    }
    var words = lines[i].split(",");
    for (let j = 0; j < words.length; j++) {
      (obj.permNum = words[1]),
        (obj.email = reformatEmail(words[10])),
        (obj.lname = words[4]),
        (obj.fname = words[5]),
        (obj.section = words[8]);
    }
    result.push(obj);
  }
  return result;
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
      var csvToText = e.target.result;
      var output = csvToStudents(csvToText);
      output.forEach(async (element, index) => {
        await mutate(
          [
            ...data,
            {
              email: element.email,
              section: element.section,
              fname: element.fname,
              lname: element.lname,
              permNum: element.permNum,
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
            email: element.email,
            section: element.section,
            fname: element.fname,
            lname: element.lname,
            permNum: element.permNum,
          }),
        });
        await mutate();
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
            name="fname"
            value={newStudentFname}
            onChange={(e) => setNewStudentFname(e.target.value)}
          />
          <Form.Label>Last Name</Form.Label>
          <FormControl
            type="text"
            name="lname"
            value={newStudentLname}
            onChange={(e) => setNewStudentLname(e.target.value)}
          />
          <Form.Label>Perm</Form.Label>
          <FormControl
            type="text"
            name="perm"
            value={newStudentPermNum}
            onChange={(e) => setNewStudentPermNum(e.target.value)}
          />
          <Form.Label>Email Address</Form.Label>
          <FormControl
            type="text"
            name="email"
            value={newStudentEmail}
            onChange={(e) => setNewStudentEmail(e.target.value)}
          />
          <Form.Label>Section</Form.Label>
          <FormControl
            type="text"
            name="section"
            value={newStudentSection}
            onChange={(e) => setNewStudentSection(e.target.value)}
          />
        </Form.Group>
        <Button type="submit" name="submit">
          Add Student
        </Button>
      </Form>
      <ReactFileReader
        fileTypes={[".csv"]}
        multipleFiles={true}
        handleFiles={handleFiles}
      >
        <Button name="uploadcsv">Upload CSV</Button>
      </ReactFileReader>
      <br />
      <BootstrapTable keyField="_id" data={data} columns={columns} />
    </Layout>
  );
}
