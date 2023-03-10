import { DocumentData } from "firebase/firestore";

export enum ActionTypesEnum {
  SET_USER,
  SET_LOADING,
  SET_IS_AUTHENTICATED,
  SET_IS_ONBOARDED,
  SET_ERROR,
  SET_IS_UPLOAD_MODAL_OPEN,
}

export type actionType = {
  type: ActionTypesEnum;
  payload: {
    user?: DocumentData;
    isLoading?: boolean;
    isAuthenticated?: boolean;
    isOnboarded?: boolean;
    isError?: boolean;
    isUploadModalOpen?: boolean;
  };
};
