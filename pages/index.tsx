import type { NextPage } from "next";
import Head from "next/head";
import Auth from "../components/Auth";
import Feed from "../components/Feed";
import { useContext, useState } from "react";
import { GlobalContext } from "../state/context/GlobalContextProvider";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const Home: NextPage = () => {
  const { isAuthenticated, isOnboarded, isUploadModalOpen, isLoading } =
    useContext(GlobalContext);

  console.log(isAuthenticated, isOnboarded, isUploadModalOpen);

  return (
    <>
      <Head>
        <title>Instaclone</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      {isLoading && (
        <>
          <div className="w-screen h-screen opacity-50 bg-black absolute grid place-content-center z-10">
            <AiOutlineLoading3Quarters className="text-6xl animate-spin text-white opacity-100 " />
          </div>
        </>
      )}

      {isAuthenticated && isOnboarded ? <Feed /> : <Auth />}
    </>
  );
};

export default Home;
