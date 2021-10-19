import { ActionTypes } from './Types';

export const AuthReducer = (storeData, action) => {

  switch(action.type) {
    case ActionTypes.AUTH_LOGGED:
      return {
        ...storeData,
        isLoading: true
      }

    case ActionTypes.USER_LOGIN || ActionTypes.USER_REGISTER || ActionTypes.GET_USER:
      return {
        ...storeData,
        user: action.payload.dataUser,
        isLoading: false,
        isLoaded: true,
        error: null
      }

    case ActionTypes.AUTH_FAIL:
      return {
        ...storeData,
        isLoading: false,
        isLoaded: true,
        error: action.payload.error
      }
    default:
      return storeData || {}
  }
} 