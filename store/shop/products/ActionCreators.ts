import { ActionTypes } from './Types'

export const getProductsShop = (products, total) => ({
  type: ActionTypes.GET_PRODUCT_SHOP,
  payload: {
    data: products,
    total: total,
  }
})

export const postProductShop = (data) => ({
  type: ActionTypes.POST_PRODUCT_SHOP,
  payload: data
})

export const editProductShop = (data) => ({
  type: ActionTypes.EDIT_PRODUCT_SHOP,
  payload: data
})

export const deleteProductShop = (data) => ({
  type: ActionTypes.DELETE_PRODUCT_SHOP,
  payload: data
})
