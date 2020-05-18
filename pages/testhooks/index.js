import Layout from "../../components/Layout";
import TestHooks from "../../components/TestHooks";
import Head from "next/head";

export default function TestHooksPage(props) {
  const user = props.user;

  return (
    <Layout user={user}>
      <Head>
        <title>Test Hooks</title>
      </Head>
      <h1>Test Hooks</h1>
      <TestHooks />
    </Layout>
  );
}
