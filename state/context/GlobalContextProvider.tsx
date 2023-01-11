import React, {
  Dispatch,
  ReactNode,
  createContext,
  useEffect,
  useReducer,
} from "react";
import GlobalReducer from "../reducers/GlobalReducer";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { ActionTypesEnum } from "../../types/GRTypes";

type authCtxType = {
  user: object;
  isAuthenticated: boolean;
  isOnboarded: boolean;
  isLoading: boolean;
  isError: boolean;
};

const initialState: authCtxType = {
  user: {},
  isAuthenticated: false,
  isOnboarded: false,
  isLoading: false,
  isError: false,
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
        const uid = user.uid;
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
