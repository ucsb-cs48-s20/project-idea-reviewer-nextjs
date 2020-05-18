import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

import fetch from "isomorphic-unfetch";
import { useState, useCallback } from "react";

function TestHooks() {
  const [databaseState, setResetStatus] = useState({
    success: false,
    error: false,
    status: 0,
  });
  const postPrepareDatabase = useCallback(async () => {
    let response;
    try {
      response = await fetch("/api/testhooks/prepareDatabase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });
    } catch (e) {
      setResetStatus({ success: false, error: true, status: 0 });
    }
    let data = await response.json();
    if (response.status != 200) {
      setResetStatus({ success: false, error: true, status: response.status });
    } else {
      setResetStatus({ success: true, error: false, status: 200 });
    }
  }, [setResetStatus]);

  return process.env.USE_TEST_AUTH ? (
    <Card style={{ maxWidth: "60rem" }}>
      <Card.Body>
        <Card.Text>
          <span>
            Clicking the "Prepare Database" button will clear the database of
            all data except the minimum needed to run the cypress test suite.
          </span>
          <br />
          <Button onClick={postPrepareDatabase}>Prepare Database</Button>
          <br />
          {databaseState.success ? (
            <span>Database has been reset; ready to run tests.</span>
          ) : (
            <span>Database has not been reset</span>
          )}{" "}
          <br />
          {databaseState.status != 0 ? (
            <span>Status code: {databaseState.status}</span>
          ) : (
            <span></span>
          )}
          <br />
        </Card.Text>
      </Card.Body>
    </Card>
  ) : (
    <p>This page is only valid when running Cypress Tests.</p>
  );
}

export default TestHooks;
