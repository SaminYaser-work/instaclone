import type { NextPage } from "next";
import {
  ChangeEvent,
  MouseEvent,
  useContext,
  useEffect,
  useState,
} from "react";
import Button from "../components/Button";
import Image from "next/image";
import {
  GlobalContext,
  GlobalDispatch,
} from "../state/context/GlobalContextProvider";
import { auth, db } from "../lib/firebase";
import { ActionTypesEnum, actionType } from "../types/GRTypes";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "react-hot-toast";

const fetchData = async (email: string) => {
  const docRef = doc(db, "cities", "SF");
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
  } else {
    // doc.data() will be undefined in this case
    console.log("No such document!");
  }
};

const Auth: NextPage = () => {
  useEffect(() => {
    import("@lottiefiles/lottie-player");
  });

  const { isAuthenticated, isLoading } = useContext(GlobalContext);
  const dispatch = useContext(GlobalDispatch);

  const [isSignUp, setIsSignUp] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: MouseEvent<HTMLElement>) => {
    e.preventDefault();

    dispatch({
      type: ActionTypesEnum.SET_LOADING,
      payload: {
        isLoading: true,
      },
    });

    if (isSignUp) {
      console.log("trying to signing up");
      createUserWithEmailAndPassword(auth, formData.email, formData.password)
        .then((userCredentials) => {
          const user = userCredentials.user;
          console.log(user);
          toast.success("Signed up successfully!");

          dispatch({
            type: ActionTypesEnum.SET_USER,
            payload: {
              user,
            },
          });

          dispatch({
            type: ActionTypesEnum.SET_LOADING,
            payload: {
              isLoading: false,
            },
          });
          dispatch({
            type: ActionTypesEnum.SET_ERROR,
            payload: {
              isError: false,
            },
          });
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode, errorMessage);
          toast.error(errorMessage);

          dispatch({
            type: ActionTypesEnum.SET_USER,
            payload: {
              user: {},
            },
          });

          dispatch({
            type: ActionTypesEnum.SET_LOADING,
            payload: {
              isLoading: false,
            },
          });
          dispatch({
            type: ActionTypesEnum.SET_ERROR,
            payload: {
              isError: true,
            },
          });
        });
    } else {
      console.log("trying to signing in");
      signInWithEmailAndPassword(auth, formData.email, formData.password)
        .then((userCredentials) => {
          const user = userCredentials.user;
          console.log(user);

          dispatch({
            type: ActionTypesEnum.SET_USER,
            payload: {
              user,
            },
          });

          dispatch({
            type: ActionTypesEnum.SET_LOADING,
            payload: {
              isLoading: false,
            },
          });
          dispatch({
            type: ActionTypesEnum.SET_ERROR,
            payload: {
              isError: false,
            },
          });
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          toast.error(errorMessage);
          console.log(errorCode, errorMessage);

          dispatch({
            type: ActionTypesEnum.SET_USER,
            payload: {
              user: {},
            },
          });

          dispatch({
            type: ActionTypesEnum.SET_LOADING,
            payload: {
              isLoading: false,
            },
          });
          dispatch({
            type: ActionTypesEnum.SET_ERROR,
            payload: {
              isError: true,
            },
          });
        });
    }
  };

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="flex w-4/6">
        <div className="w-full hidden md:block">
          <lottie-player
            id="firstLottie"
            autoplay
            loop
            mode="normal"
            src="/lottie/auth.json"
            style={{ width: "100%", height: "100%" }}
          ></lottie-player>
        </div>

        <div className="w-full">
          <div className=" bg-white border border-gray-300 shadow-md rounded-md">
            <form
              action=""
              className="flex flex-col justify-start items-center gap-5"
            >
              <Image
                src={"/pics/logo.webp"}
                height={300}
                width="300"
                alt="instaclone logo"
                className="mt-16 mb-10 mx-auto"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={onChangeHandler}
                className="border border-gray-300 outline-none bg-gray-50 focus:bg-white rounded-md px-5 py-2 text-xl w-4/5"
              />
              <input
                type="password"
                name="password"
                onChange={onChangeHandler}
                placeholder="Password"
                value={formData.password}
                className="border border-gray-300 outline-none bg-gray-50 focus:bg-white rounded-lg px-5 py-2 text-xl w-4/5"
              />
              <Button
                children={
                  (isLoading && "Please Wait...") ||
                  (isSignUp ? "Sign Up" : "Login")
                }
                type="submit"
                disabled={formData.email === "" || formData.password === ""}
                clickHandler={handleSubmit}
                className="px-4 py-2 bg-[#0095f6] disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed rounded-lg text-white active:scale-95 transform transition w-4/5 text-2xl font-semibold"
              />
            </form>
            <div className="w-4/5 mx-auto mt-10">
              <div className="w-full flex justify-center items-center gap-10">
                <div className="h-[1px] bg-slate-400 w-full"></div>
                <p className="text-lg font-semibold text-gray-400">OR</p>
                <div className="h-[1px] bg-slate-400 w-full"></div>
              </div>
            </div>
            <div className="w-4/5 mx-auto mt-10 mb-10">
              <div className="flex justify-center items-center flex-col gap-10">
                <p className="font-bold text-xl text-[#385395]">
                  Log in with Facebook
                </p>
                {!isSignUp && <p className="text-lg">Fogot password?</p>}
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-300 shadow-md mt-5 rounded-md text-xl grid place-content-center h-[100px]">
            <p
              className="cursor-pointer"
              onClick={(e: MouseEvent<HTMLParagraphElement>) => {
                setIsSignUp((prev) => !prev);
              }}
            >
              {isSignUp
                ? "Alread have an account? "
                : "Don't have an account? "}
              <span className="text-blue-500 font-semibold">
                {isSignUp ? "Login" : "Sign Up"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;