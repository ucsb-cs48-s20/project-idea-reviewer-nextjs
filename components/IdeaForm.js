import Form from "react-bootstrap/Form";
import { FormControl, Alert } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { useCallback, useState } from "react";
import fetch from "isomorphic-unfetch";

export default function IdeaForm(props) {
  const user = props.user;
  const [ideaTitle, setIdeaTitle] = useState("");
  const [ideaBody, setIdeaBody] = useState("");
  const [ideaError, setIdeaError] = useState("");
  const submitIdea = useCallback(
    async (e) => {
      // override default form submission behavior
      e.preventDefault();
      e.stopPropagation();

      await fetch("/api/ideas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: ideaTitle,
          description: ideaBody,
        }),
      })
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          if (data.message) {
            // we have an error message, display to user
            console.log("error message: ", data.message);
            setIdeaError(data.message);
          } else {
            // success
            console.log("Success", data);
            window.location.replace("./");
          }
        });

      console.log(
        "Submitted: title={" + ideaTitle + "}, body={" + ideaBody + "}"
      );
    },
    [ideaTitle, ideaBody, ideaError]
  );
  return (
    <div>
      <p>
        To get started, submit your project idea below. After you submit your
        project idea, you can rate other students project ideas as they become
        available for rating.
      </p>

      <Alert show={ideaError.length > 0} variant="danger">
        {ideaError}
      </Alert>

      <Form onSubmit={submitIdea} className="mb-5">
        <Form.Group>
          <Form.Label style={{ fontWeight: "bold" }}>Title</Form.Label>
          <FormControl
            type="text"
            value={ideaTitle}
            onChange={(e) => setIdeaTitle(e.target.value)}
          />
          <p>
            Please give your project a short title. Minimum chars: 4, maximum
            chars: 60. The best title is one that strikes the right balance
            between conveying lots of information, while being as short as
            possible. Take a moment to try to strike the right balance before
            submitting.
          </p>
          <Form.Label style={{ fontWeight: "bold" }}>Idea Details</Form.Label>
          <FormControl
            as="textarea"
            rows="3"
            value={ideaBody}
            onChange={(e) => setIdeaBody(e.target.value)}
          />
          <p>
            Please provide a brief description of your project idea. Minimum
            chars: 30, maximum chars: 255. Focus on what the app does for the
            user of the app, rather than on what you as the programmer will
            build. What is the need that this app addresses for the user, or the
            wish that it helps them fulfill?
          </p>
        </Form.Group>
        <Button type="submit">Submit Idea</Button>
      </Form>
    </div>
  );
}
