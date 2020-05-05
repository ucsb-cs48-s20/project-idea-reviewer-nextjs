import Link from "next/link";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";

function roleToString(role) {
  switch (role) {
    case "admin":
      return "Admin";
    case "student":
      return "Student";
    default:
      return "Guest";
  }
}

function AppNavbar(props) {
  const user = props.user;

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Link href="/" passHref={true}>
          <Navbar.Brand>Project Idea Reviewer</Navbar.Brand>
        </Link>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Nav className="mr-auto">
            {user?.role === "admin" && (
              <>
                <Link href="/ideas" passHref>
                  <Nav.Link>Ideas</Nav.Link>
                </Link>
                <Link href="/reviews" passHref>
                  <Nav.Link>Reviews</Nav.Link>
                </Link>
                <NavDropdown title="Admin">
                  <Link href="/admin/admins" passHref>
                    <NavDropdown.Item href="/admin/admins">
                      Manage Admins
                    </NavDropdown.Item>
                  </Link>
                  <Link href="/admin/students" passHref>
                    <NavDropdown.Item href="/admin/students">
                      Manage Students
                    </NavDropdown.Item>
                  </Link>
                </NavDropdown>
              </>
            )}
          </Nav>
          <Nav>
            {user ? (
              <NavDropdown
                title={
                  <>
                    Hi, {user.name} ({roleToString(user.role)})
                    <Image
                      className="ml-2"
                      src={user.picture}
                      width={24}
                      height={24}
                    />
                  </>
                }
              >
                <NavDropdown.Item className="text-danger" href="/api/logout">
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Button data-cy="login" href="/api/login">
                Login
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
