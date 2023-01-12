import Image from "next/image";
import { BsSearch } from "react-icons/bs";
import {
  AiOutlineHome,
  AiOutlinePlusCircle,
  AiOutlineHeart,
} from "react-icons/ai";
import { RiMessengerLine } from "react-icons/ri";
import { FiCompass } from "react-icons/fi";
import { IoPersonCircleOutline } from "react-icons/io5";
import Link from "next/link";
import Button from "./Button";
import { useContext } from "react";
import {
  GlobalContext,
  GlobalDispatch,
} from "../state/context/GlobalContextProvider";
import { ActionTypesEnum } from "../types/GRTypes";
import { auth } from "../lib/firebase";
import { signOut } from "firebase/auth";

export default function NavBar() {
  const dispatch = useContext(GlobalDispatch);
  const ctx = useContext(GlobalContext);

  const logout = () => {
    signOut(auth)
      .then(() => {
        dispatch({
          type: ActionTypesEnum.SET_LOADING,
          payload: {
            isLoading: false,
          },
        });
        dispatch({
          type: ActionTypesEnum.SET_IS_AUTHENTICATED,
          payload: {
            isAuthenticated: false,
          },
        });
        dispatch({
          type: ActionTypesEnum.SET_IS_ONBOARDED,
          payload: {
            isOnboarded: false,
          },
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleOpenModal = () => {
    console.log("opening upload modal");
    dispatch({
      type: ActionTypesEnum.SET_IS_UPLOAD_MODAL_OPEN,
      payload: {
        isUploadModalOpen: true,
      },
    });
  };

  const todo = () => {
    alert("This feature is not yet implemented!");
  };

  return (
    <nav className="flex py-3 items-center justify-around gap-10 fixed top-0 left-0 w-screen bg-white shadow-xl">
      <div className="flex items-center justify-between w-full md:w-fit mx-4">
        <Link href={"/"}>
          <Image
            priority={true}
            src={"/pics/logo.webp"}
            height={150}
            width="150"
            alt="instaclone logo"
            className="cursor-pointer"
          />
        </Link>
        <AiOutlinePlusCircle
          onClick={handleOpenModal}
          className="hover:text-gray-500 text-3xl cursor-pointer transition ease-linear md:hidden"
        />
      </div>
      <div className="hidden md:flex items-center group focus-within:border-black focus-within:bg-white justify-start gap-5 border border-gray-300 bg-gray-50 focus:bg-white rounded-md px-5 py-2">
        <label htmlFor="search">
          <BsSearch className="text-xl text-gray-400" />
        </label>
        <input
          type="search"
          name="search"
          placeholder="Search"
          // value={formData.email}
          // onChange={onChangeHandler}
          className="text-2xl outline-none bg-transparent"
        />
      </div>
      <div className="hidden md:flex items-center justify-center gap-8 text-3xl">
        <AiOutlineHome
          onClick={todo}
          className="hover:text-gray-500 cursor-pointer transition ease-linear"
        />
        <RiMessengerLine
          onClick={todo}
          className="hover:text-gray-500 cursor-pointer transition ease-linear"
        />

        <AiOutlinePlusCircle
          onClick={handleOpenModal}
          className="hover:text-gray-500 cursor-pointer transition ease-linear"
        />

        <FiCompass
          onClick={todo}
          className="hover:text-gray-500 cursor-pointer transition ease-linear"
        />
        <AiOutlineHeart
          onClick={todo}
          className="hover:text-gray-500 cursor-pointer transition ease-linear"
        />
        <IoPersonCircleOutline
          onClick={todo}
          className="hover:text-gray-500 cursor-pointer transition ease-linear"
        />
        <Button
          children={"Logout"}
          type="button"
          disabled={false}
          clickHandler={logout}
          className="px-4 py-2 bg-[#0095f6] disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed rounded-lg text-white active:scale-95 transform transition text-2xl font-semibold"
        />
      </div>
    </nav>
  );
}
