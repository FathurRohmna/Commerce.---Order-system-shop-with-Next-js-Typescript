import { ActionTypes } from './Types'
import Cookies from 'js-cookie'

export const CartReducer = (storeData, action) => {
  let newStore = { items: [], cartItems: null, cartPrice: null, ...storeData }

  switch (action.type) {
    case ActionTypes.CART_INIT:
      return {
        ...storeData,
        isLoading: true 
      }

    case ActionTypes.CART:
      return {
        ...storeData,
        isLoading: false,
        isLoaded: true,
        cart: action.payload,
        error: null
      }

    case ActionTypes.CART_ADD_ITEM:
      const product = action.payload.data
      const quantity = action.payload.quantity

      let existing = newStore.items.find(item => item.data._id === product._id)
      if (existing) {
        existing.quantity += quantity
      } else {
        newStore.items = [...newStore.items, action.payload]
      }
      newStore.cartItems += quantity;
      newStore.cartPrice += product.price * quantity

      Cookies.set('cart', JSON.stringify(newStore))

      return newStore
    
    case ActionTypes.CART_UPDATE_ITEM:
      newStore.items = newStore.items.map(item => {
        if (item.data._id === action.payload.data._id) {
          const diff = action.payload.quantity - item.quantity
          newStore.cartItems += diff
          newStore.cartPrice += (item.data.price * diff)

          return action.payload
        } else {
          return item
        }
      })

      Cookies.set('cart', JSON.stringify(newStore))

      return newStore
    
    case ActionTypes.CART_REMOVE_ITEM:
      const productId = action.payload._id

      const findItem = newStore.items.find(item => item.data._id === productId)
      const removeItem = newStore.items.filter(item => item.data._id !== productId)

      newStore.cartItems -= findItem.quantity
      newStore.cartPrice -= findItem.data.price * findItem.quantity

      const newItemsStore = {
        ...newStore,
        items: removeItem
      }

       Cookies.set('cart', JSON.stringify(newItemsStore))

      return newItemsStore
    
    case ActionTypes.SAVE_SHIPPING_ADDRESS:
      const addressData = action.payload

      newStore.shipping_address = addressData
      Cookies.set('cart', JSON.stringify(newStore))

      return newStore
    
    case ActionTypes.SAVE_PAYMENT_METHOD:
      const paymentData = action.payload

      newStore.payment_method = paymentData
      Cookies.set('cart', JSON.stringify(newStore))

      return newStore

    case ActionTypes.CART_FAIL:
      return {
        ...storeData,
        isLoading: false,
        isLoaded: true,
        error: action.payload 
      }
    default: 
      return storeData || {}
  }
}
