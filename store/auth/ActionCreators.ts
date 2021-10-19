import { ActionTypes } from './Types'

export const authLogged = () => ({
  type: ActionTypes.AUTH_LOGGED
})

export const userLogin = (data) => ({
  type: ActionTypes.USER_LOGIN,
  payload: {
    dataUser: data
  }
})

export const userRegister = (data) => ({
  type: ActionTypes.USER_REGISTER,
  payload: {
    dataUser: data
  }
})

export const getUser = ({data}) => ({
  type: ActionTypes.GET_USER,
  payload: {
    dataUser: data
  }
})

export const authFail = (error) => ({
  type: ActionTypes.AUTH_FAIL,
  payload: {
    error: error
  }
})
