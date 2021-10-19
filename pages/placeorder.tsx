import { useContext } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

import { Store } from '../store'
import http from '../utils/http-instance'

export default function PlaceOrder() {
  const { state, dispatch } = useContext(Store)

  const router = useRouter()

  const {
    cart, auth
  } = state;

  const orderItems = cart.items.map(item => ({productId: item.data._id, quantity: item.quantity, shopId: item.data.shopId._id}))

  const placeOrderHandler = async () => {
    console.log(orderItems);
    
    try {
      const { data } = await http.post('/api/order', {
        user: auth.email,
        orderItems: orderItems,
        shippingAddress: cart.shipping_address,
        paymentMethod: cart.payment_method,
        cartItems: cart.cartItems,
        cartPrice: cart.cartPrice
      })
      console.log(data);
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <div className="w-full">
      <Head>
        <title>Placeorder - Ecommerce</title>
      </Head>
      <div className="w-full relative bg-opacity-30">
        <div className="max-w-5xl mx-auto bg-gray-400 bg-opacity-50 pb-20">

          <div className="pt-12 px-4 sm:px-6 lg:px-8 text-gray-700">
            <div className="relative mb-4">
              <h1 className="text-4xl font-bold inline text-gray-900">Place Order</h1>
            </div>

            <div className="relative w-full my-8 grid grid-cols-2 gap-4 bg-white px-6 py-8 rounded-3xl shadow-xl">
              <div className="mt-4">
                <p>Fullname : </p>
                <p className="font-bold">{cart.shipping_address?.name}</p>
              </div>
              <div className="mt-4">
                <p>Address : </p>
                <p className="font-bold">{cart.shipping_address?.address.district}</p>
              </div>
              <div className="mt-4">
                <p>City : </p>
                <p className="font-bold">{cart.shipping_address?.address.city}, {cart.shipping_address?.address.county}</p>
              </div>
              <div className="mt-4">
                <p>Portal Code : </p>
                <p className="font-bold">{cart.shipping_address?.address.postalCode}</p>
              </div>
            </div>

            <div className="my-8 bg-white px-6 py-8 rounded-xl">
              <p>Payment Method : </p>
              <p className="font-bold">{cart.payment_method}</p>
            </div>

            <div className="my-8">
              <h4>Order Items: </h4>

              <div className="relative w-full mt-8">

              <div className="md:relative w-full mt-8">
                <div className="h-full w-1/5 bg-gray-400 rounded-lg">
                  
                </div>

                {cart.items && cart.items.map((item) => {
                  return (
                    <div key={item._id} className="w-full h-24 my-6 box-border bg-white flex rounded-lg border border-gray-100">
                      <div className="h-full w-1/5 bg-gray-400 rounded-lg">
                        
                      </div>

                      <div className="relative mx-8 my-2 flex justify-between w-full items-center h-full">
                        <div className="">
                          <p className="leading-6 m-0">{item.data.shopId.name}</p>
                          <h4 className="leading-6 m-0">{item.data.name}</h4>
                          <p className="leading-6">{item.data.rating}</p>
                        </div>
                        <div>
                          <div className="custom-number-input h-full w-32">
                          <div className="flex flex-row w-full rounded-lg relative bg-transparent">
                            <input readOnly type="number" className="outline-none focus:outline-none text-center w-full bg-gray-50 font-semibold text-md hover:text-black focus:text-black  md:text-basecursor-default flex items-center text-gray-700" value={item.quantity}/>
                          </div>
                        </div>
                        </div>
                        <div className="">
                          <h4 className="leading-6 m-0">$ {item.data.price}</h4>
                          <p className="leading-6 m-0">Count: {item.data.count}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}

              <div className="w-full relative flex justify-end mt-12">
                <div className="bg-white px-6 py-8 rounded-xl shadow-xl">
                  <h3 className="font-extralight">Order Sumary :</h3>
                  <h2>Total       :     <b>{cart.cartPrice}</b></h2>
                  <button onClick={placeOrderHandler} className="font-semibold px-5 py-2 w-full text-center text-white rounded-md bg-primary">Place Order</button>
                </div>
              </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}