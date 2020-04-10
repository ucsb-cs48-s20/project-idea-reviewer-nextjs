import { SWRConfig } from "swr";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import fetch from "isomorphic-unfetch";

function MyApp({ Component, pageProps }) {
  return (
    <SWRConfig
      value={{ fetcher: (...args) => fetch(...args).then((res) => res.json()) }}
    >
      <Component {...pageProps} />
    </SWRConfig>
  );
}

export default MyApp;
