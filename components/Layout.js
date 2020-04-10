import Container from "react-bootstrap/Container";
import AppNavbar from "./AppNavbar";
import AppFooter from "./AppFooter";

function Layout(props) {
  const user = props.user;

  return (
    <>
      <AppNavbar user={user} />
      <Container>{props.children}</Container>
      <AppFooter />
    </>
  );
}

export default Layout;
