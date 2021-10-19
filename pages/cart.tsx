import { useContext, useState } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Head from 'next/head'

import Popup from '../components/Popup'

import http from '../utils/http-instance'
import { Store } from '../store'
import * as actions from '../store/cart/ActionCreators'

export default function Cart() {
  const { state, dispatch } = useContext(Store)
  const [limitPopup, setLimitPopup] = useState(false)

  const router = useRouter()

  const {
    cart
  } = state;

  const handleClick = async (product, value) => {
    const productData = await http.get(`/api/products/${product._id}`)

    if (productData.data.data.count < value) {
      setLimitPopup(true)
      return
    }
    dispatch(actions.updateCartQuantity(product, value))
  }

  return (
    <div className="w-full">
      <Head>
        <title>Cart - Ecommerce</title>
      </Head>
      <div className="w-full min-h-screen relative bg-gray-100 bg-opacity-30">
        <div className="max-w-5xl mx-auto">

          <div className="pt-12 px-4 sm:px-6 lg:px-8 text-gray-600">
            <div className="relative mb-4">
              <h1 className="text-4xl font-extralight inline">Your Cart</h1>
            </div>

            <div className="relative w-full mt-8">
              {cart.items && cart.items.map(item => (
                <div key={item._id} className="w-full h-24 my-6 box-border bg-white rounded-lg border border-gray-100 grid grid-cols-8 gap-2">
                  <div className="relative bg-gray-400 rounded-lg">
                    <Image src={item.data.imagesUrls} layout="fill" alt="No Image" objectFit="cover" />
                  </div>
                  <div className="col-span-2 flex items-center">
                    <div>
                      <p className="leading-6 m-0">{item.data.shopId.name}</p>
                      <h4 className="leading-6 m-0">{item.data.name}</h4>
                      <p className="leading-6">{item.data.rating || 0}</p>
                    </div>
                  </div>
                  <div></div>
                  <div className="flex items-center">
                    <div className="custom-number-input w-32">
                      <div className="flex flex-row w-full rounded-lg relative bg-transparent">
                        <button onClick={() => handleClick(item.data, item.quantity - 1)} className="bg-gray-50 text-gray-600 hover:text-gray-700 h-full w-20 rounded-l cursor-pointer outline-none">
                          <span className="m-auto text-2xl font-thin">-</span>
                        </button>
                        <input readOnly type="number" className="outline-none focus:outline-none text-center w-full bg-gray-50 font-semibold text-md hover:text-black focus:text-black  md:text-basecursor-default flex items-center text-gray-700" value={item.quantity}/>
                        <button onClick={() => handleClick(item.data, item.quantity + 1)} className="bg-gray-50 text-gray-600 hover:text-gray-700 h-full w-20 rounded-r cursor-pointer outline-none">
                          <span className="m-auto text-2xl font-thin">+</span>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div></div><div></div>
                  <div className="flex items-center">
                    <div>
                      <h4 className="leading-6 m-0">$ {item.data.price}</h4>
                      <p className="leading-6 m-0">count: {item.data.count}</p>
                      <button className="text-red-400 underline cursor-pointer" onClick={() => dispatch(actions.removeCartItem(item.data))}>
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <div className="w-full relative flex justify-end mt-12 mb-16">
                <div className="">
                  <h3>Sub Total: $ {cart.cartPrice}</h3>
                  <p>{cart.cartItems} Items</p>
                  <button onClick={() => router.push('/shipping')} className="font-semibold px-5 py-2 w-full text-center text-white rounded-md bg-primary">Checkout</button>
                  <button onClick={() => router.push('/')} className="font-semibold px-5 py-2 w-full text-center rounded-md text-primary mt-4">Continue Shopping</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative max-w-xs mx-auto">
        <Popup
          open={limitPopup}
          setOpen={setLimitPopup}
        >
          <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:items-center">
                <div className="mt-3 text-center sm:mt-0 w-full">
                  <h3 className="text-red-700 font-light">Sory item limit of order</h3>
                </div>
                <div className="w-full flex justify-end">
                  <button
                    type="button"
                    className="w-full font-bold inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-base text-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => setLimitPopup(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
          </div>
        </Popup>
      </div>
    </div>
  )
}