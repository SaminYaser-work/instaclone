export enum ActionTypesEnum {
  SET_USER,
  SET_LOADING,
  SET_IS_AUTHENTICATED,
  SET_IS_ONBOARDED,
  SET_ERROR,
}

export type actionType = {
  type: ActionTypesEnum;
  payload: {
    isLoading?: boolean;
    isAuthenticated?: boolean;
    isOnboarded?: boolean;
    isError?: boolean;
  };
};
