import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

function AppFooter() {
  return (
    <footer className="footer">
      <Card style={{ maxWidth: "60rem" }}>
        <Card.Body>
          <Card.Text>
            <p>
              This project from{" "}
              <a href="http://ucsb-cs48.github.io">CMPSC 48</a> at{" "}
              <a href="http://www.ucsb.edu">UC&nbsp;Santa&nbsp;Barbara</a>{" "}
              adapts{" "}
              <a href="http://www.liberatingstructures.com/12-2510-crowd-sourcing/">
                25/10 Crowdsourcing
              </a>{" "}
              for remote instruction, to generate project ideas for a software
              engineering course. Check out the source code on{" "}
              <a href="https://github.com/ucsb-cs48-s20/project-idea-reviewer-nextjs">
                GitHub
              </a>
              .
            </p>
          </Card.Text>
        </Card.Body>
      </Card>
    </footer>
  );
}

export default AppFooter;
