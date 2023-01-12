import { ActionTypesEnum, actionType } from "../../types/GRTypes";

export default function GlobalReducer(state: any, action: actionType) {
  switch (action.type) {
    case ActionTypesEnum.SET_USER:
      return {
        ...state,
        user: action.payload,
      };

    case ActionTypesEnum.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload.isLoading,
      };
    case ActionTypesEnum.SET_IS_AUTHENTICATED:
      return {
        ...state,
        isAuthenticated: action.payload.isAuthenticated,
      };
    case ActionTypesEnum.SET_IS_ONBOARDED:
      return {
        ...state,
        isOnboarded: action.payload.isOnboarded,
      };

    case ActionTypesEnum.SET_ERROR:
      return {
        ...state,
        isError: action.payload.isError,
      };

    case ActionTypesEnum.SET_IS_UPLOAD_MODAL_OPEN:
      return {
        ...state,
        isUploadModalOpen: action.payload.isUploadModalOpen,
      };

    default:
      throw Error("Unknown action: " + action.type);
  }
}
