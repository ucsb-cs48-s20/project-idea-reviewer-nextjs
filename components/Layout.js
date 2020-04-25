import Container from "react-bootstrap/Container";
import AppNavbar from "./AppNavbar";
import AppFooter from "./AppFooter";

function Layout(props) {
  const user = props.user;

  return (
    <>
      <AppNavbar user={user} />
      <Container className="py-3">
        {props.children}
        <AppFooter />
      </Container>
    </>
  );
}

export default Layout;
