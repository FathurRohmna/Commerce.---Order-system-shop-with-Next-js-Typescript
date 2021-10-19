import { ActionTypes } from './Types'

export const cartInit = () => ({
  type: ActionTypes.CART_INIT 
})

export const cart = (data) => ({
  type: ActionTypes.CART,
  payload: data
})

export const addCartItem = (data, quantity) => ({
  type: ActionTypes.CART_ADD_ITEM,
  payload: {
    data: data,
    quantity: quantity || 1
  } 
})

export const updateCartQuantity = (product, quantity) => ({
  type: ActionTypes.CART_UPDATE_ITEM,
  payload: { data: product, quantity }
})

export const saveShippingAddress = (data) => ({
  type: ActionTypes.SAVE_SHIPPING_ADDRESS,
  payload: data
})

export const savePaymentMethod = (data) => ({
  type: ActionTypes.SAVE_PAYMENT_METHOD,
  payload: data
})

export const removeCartItem = (data) => ({
  type: ActionTypes.CART_REMOVE_ITEM,
  payload: data
})

export const cartFail = (error) => ({
  type: ActionTypes.CART_FAIL,
  payload: error
})
