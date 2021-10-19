import { ActionTypes } from './Types'

export const ProductShopReducer = (storeData, action) => {
  let newStore = { products: [], products_length: null, loaded: false, error: null, ...storeData}

  switch (action.type) {
    case ActionTypes.GET_PRODUCT_SHOP:
      newStore.products = action.payload.data
      newStore.products_length = action.payload.total
      newStore.loded = true

      return newStore
    
    case ActionTypes.POST_PRODUCT_SHOP:
      newStore.products.products = [...newStore.products.products, action.payload]
      newStore.products_length += 1

      return newStore
    
    case ActionTypes.DELETE_PRODUCT_SHOP:
      const deleteId = action.payload._id
      
      newStore.products.products = newStore.products.products.filter(product => product._id !== deleteId)

      return newStore
    
    case ActionTypes.EDIT_PRODUCT_SHOP:
      const itemId = action.payload._id
      const recordIndex = newStore.products.products.findIndex(product => product._id === itemId)

      newStore.products.products[recordIndex] = {...action.payload}

      return newStore
    
    default:
      return storeData || {}
  }
}
