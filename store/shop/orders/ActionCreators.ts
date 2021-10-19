import { ActionTypes } from './Types'

export const getOrderShop = (orders) => ({
  type: ActionTypes.GET_ORDER_SHOP,
  payload: orders
})

export const confirmApproveOrder = (data) => ({
  type: ActionTypes.CONFIRM_ORDER,
  payload: data
})
