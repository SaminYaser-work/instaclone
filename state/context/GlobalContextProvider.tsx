import React, {
  Dispatch,
  ReactNode,
  createContext,
  useEffect,
  useReducer,
} from "react";
import GlobalReducer from "../reducers/GlobalReducer";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import { ActionTypesEnum } from "../../types/GRTypes";
import { DocumentData, doc, getDoc } from "firebase/firestore";

type authCtxType = {
  user: DocumentData;
  isAuthenticated: boolean;
  isOnboarded: boolean;
  isLoading: boolean;
  isError: boolean;
  isUploadModalOpen: boolean;
};

const initialState: authCtxType = {
  user: {},
  isAuthenticated: false,
  isOnboarded: false,
  isLoading: false,
  isError: false,
  isUploadModalOpen: false,
};

export const GlobalContext = createContext<authCtxType>(initialState);
export const GlobalDispatch = createContext<Dispatch<any>>(() => {});

type Props = {
  children: ReactNode;
};

const GlobalContextProvider = ({ children }: Props) => {
  const [state, dispatch] = useReducer(GlobalReducer, initialState);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        dispatch({
          type: ActionTypesEnum.SET_IS_AUTHENTICATED,
          payload: { isAuthenticated: true },
        });
        // const uid = user.uid;

        dispatch({
          type: ActionTypesEnum.SET_LOADING,
          payload: { isLoading: true },
        });

        const fetchData = async (email: string | null) => {
          if (!email) return;
          const docRef = doc(db, "users", email);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
            dispatch({
              type: ActionTypesEnum.SET_IS_ONBOARDED,
              payload: {
                isOnboarded: true,
              },
            });
            dispatch({
              type: ActionTypesEnum.SET_USER,
              payload: {
                user: docSnap.data(),
              },
            });

            dispatch({
              type: ActionTypesEnum.SET_LOADING,
              payload: {
                isLoading: false,
              },
            });
          } else {
            // doc.data() will be undefined in this case
            console.log("User is not onboarded");
            dispatch({
              type: ActionTypesEnum.SET_LOADING,
              payload: { isLoading: false },
            });
          }
        };

        fetchData(user?.email);
      }
    });

    return () => unsub();
  }, []);

  return (
    <GlobalContext.Provider value={state}>
      <GlobalDispatch.Provider value={dispatch}>
        {children}
      </GlobalDispatch.Provider>
    </GlobalContext.Provider>
  );
};

export default GlobalContextProvider;
