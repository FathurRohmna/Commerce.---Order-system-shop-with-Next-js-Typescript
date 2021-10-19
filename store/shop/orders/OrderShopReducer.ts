import { ActionTypes } from './Types'

export const OrderShopReducer = (storeData, action) => {
  let newStore = { orders: [], loaded: false }

  switch (action.type) {
    case ActionTypes.GET_ORDER_SHOP:
      newStore.orders = action.payload.orders
      
      return newStore
    
    case ActionTypes.CONFIRM_ORDER:
      const orderId = action.payload._id
      const recordIndex = newStore.orders.findIndex(order => order._id === orderId)

      newStore.orders[recordIndex] = {...action.payload}

      return newStore

    default:
      return storeData || {} 
  }
}
