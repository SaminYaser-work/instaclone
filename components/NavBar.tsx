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

export default function NavBar() {
  return (
    <nav className="flex py-3 items-center justify-around gap-10 fixed top-0 left-0 w-screen bg-white shadow-xl">
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
      <div className="flex items-center group focus-within:border-black focus-within:bg-white justify-start gap-5 border border-gray-300 bg-gray-50 focus:bg-white rounded-md px-5 py-2">
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
      <div className="flex items-center justify-center gap-8 text-3xl">
        <AiOutlineHome className="hover:text-gray-500 cursor-pointer transition ease-linear" />
        <RiMessengerLine className="hover:text-gray-500 cursor-pointer transition ease-linear" />
        <AiOutlinePlusCircle className="hover:text-gray-500 cursor-pointer transition ease-linear" />
        <FiCompass className="hover:text-gray-500 cursor-pointer transition ease-linear" />
        <AiOutlineHeart className="hover:text-gray-500 cursor-pointer transition ease-linear" />
        <IoPersonCircleOutline className="hover:text-gray-500 cursor-pointer transition ease-linear" />
        <Button
          children={"Logout"}
          type="button"
          disabled={false}
          clickHandler={() => console.log("clicked")}
          className="px-4 py-2 bg-[#0095f6] disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed rounded-lg text-white active:scale-95 transform transition text-2xl font-semibold"
        />
      </div>
    </nav>
  );
}
