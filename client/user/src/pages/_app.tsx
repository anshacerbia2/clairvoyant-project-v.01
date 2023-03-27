import "@/styles/globals.scss";
import type { AppProps } from "next/app";
import type { NextComponentType } from "next";

type PageProps = {
  [key: string]: any;
};

type ComponentWithLayout = NextComponentType & {
  getLayout?: (page: JSX.Element) => JSX.Element;
};

function App({ Component, pageProps }: AppProps<PageProps>) {
  const getLayout =
    (Component as ComponentWithLayout).getLayout ||
    ((page: JSX.Element) => page);
  return getLayout(<Component {...pageProps} />);
}

export default App;
