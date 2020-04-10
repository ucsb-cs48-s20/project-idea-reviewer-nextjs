import Layout from "../components/Layout";
import { optionalAuth } from "../utils/ssr";

export const getServerSideProps = optionalAuth;

export default function HomePage(props) {
  const user = props.user;
  return (
    <Layout user={user}>
    </Layout>
  );
}
