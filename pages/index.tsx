import type { NextPage } from "next";
import Head from "next/head";
import Auth from "../components/Auth";
import Feed from "../components/Feed";
import { useContext, useState } from "react";
import { GlobalContext } from "../state/context/GlobalContextProvider";

const Home: NextPage = () => {
  const { isAuthenticated, isOnboarded, isUploadModalOpen } =
    useContext(GlobalContext);

  console.log(isAuthenticated, isOnboarded, isUploadModalOpen);

  return (
    <>
      <Head>
        <title>Instaclone</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      {isAuthenticated && isOnboarded ? <Feed /> : <Auth />}
    </>
  );
};

export default Home;
