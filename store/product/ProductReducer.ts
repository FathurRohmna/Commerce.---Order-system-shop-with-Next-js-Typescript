import { ActionTypes } from './Types'

export const ProductReducer = (storeData, action) => {
  const newStore = { products: [], isLoaded: false, error: null, ...storeData}

  switch(action.type) {
    case ActionTypes.PRODUCT_INIT:
      const topSale = action.payload.topSale
      const topRated = action.payload.topRated

      newStore.products = [
          {
            id: 'topSale',
            data: action.payload.topSale
          },
          {
            id: 'topRated',
            data: action.payload.topRated
          },
          {
            id: 'allProducts',
            data: action.payload.allProducts
          }
        ]

      return newStore
    
    case ActionTypes.PRODUCT_ADDED_TOCART:
      const productId = action.payload

      let product = newStore.products
        .filter(item => item.data.some(it => it._id === productId))
        .map(item => item.data.filter(i => i._id === productId))
      console.log(product)
      product[0][0].addedToCart = true
      
      return newStore

    default:
      return storeData || {}
  }
} 
