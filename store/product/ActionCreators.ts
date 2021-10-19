import { ActionTypes } from './Types'

export const productInit = (topSale, topRated, allProducts) => ({
  type: ActionTypes.PRODUCT_INIT,
  payload: {
    topSale,
    topRated,
    allProducts
  }
})

export const productAddedToCart = (id) => ({
  type: ActionTypes.PRODUCT_ADDED_TOCART,
  payload: id
})
