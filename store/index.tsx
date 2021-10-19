import React from 'react'
import { createContext, useReducer } from 'react'
import Cookies from 'js-cookie'

import { combineReducers } from './CommonReducer'
import { AuthReducer } from './auth/AuthReducer'
import { ProductReducer } from './product/ProductReducer'
import { CartReducer } from './cart/CartReducer'
import { ProductShopReducer } from './shop/products/ProductShopReducer'
import { OrderShopReducer } from './shop/orders/OrderShopReducer'

interface Props {
  children: React.ReactNode
}

const initialState = {
  auth: Cookies.get('userInfo')
    ? JSON.parse(Cookies.get('userInfo'))
    : null,
  cart: Cookies.get('cart')
    ? JSON.parse(Cookies.get('cart'))
    : {
      items: [],
      cartItems: 0,
      cartPrice: 0
    },
  products: [],
  isLoading: false,
  isLoaded: false,
  error: null
}

const appReducers = combineReducers({
  product: ProductReducer,
  cart: CartReducer,
  auth: AuthReducer,
  productShop: ProductShopReducer,
  orderShop: OrderShopReducer
})


export const Store = createContext()

export function StoreProvider(props: Props) {
  const [state, dispatch] = useReducer(appReducers, initialState)
  const value = { state, dispatch }

  return <Store.Provider value={value}>{props.children}</Store.Provider>
}
