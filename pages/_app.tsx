import "../styles/globals.css";
import type { AppProps } from "next/app";
import GlobalContextProvider from "../state/context/GlobalContextProvider";
import { Toaster } from "react-hot-toast";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <GlobalContextProvider>
      <Toaster />
      <Component {...pageProps} />
    </GlobalContextProvider>
  );
}

export default MyApp;
