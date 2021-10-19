import { useEffect, useContext, useState } from 'react'
import Image from 'next/image'
import Head from 'next/head'

import { Store } from '../store'

import http from '../utils/http-instance'

const OrderHistory = () => {
  const { state, dispatch } = useContext(Store)
  const [orderHistory, setOrderHistory] = useState(null)

  const user = state.auth
  console.log(orderHistory)

  useEffect(() => {
    async function getOrderHistory() {
      const response = await http.get(`/api/order/history`)

      setOrderHistory(response.data.data.orderHistory)
    }

    getOrderHistory()
  }, [])

  return (
    <div className="w-full">
      <Head>
        <title>Order History - Ecommerce</title>
      </Head>
      <div className="w-full min-h-screen relative bg-gray-400 bg-opacity-50 ">
        <div className="max-w-5xl mx-auto pb-20 bg-white">

          <div className="pt-12 px-4 sm:px-6 lg:px-8 text-gray-700">
            <div className="relative mb-8">
              <h1 className="text-4xl font-bold inline text-gray-900">Order History</h1>
            </div>

            <div className="relative w-full mt-8">

              {orderHistory && orderHistory.map(order => (
                <div key={order._id} className="my-16 mx-4 border-b border-gray-300">
                  <div className="w-full grid grid-cols-2">
                    <div className="my-4">
                      <p className="font-semibold text-gray-300">User</p>
                      <p className="text-base font-bold">{order.user}</p>
                    </div>
                    <div className="my-4">
                      <p className="font-semibold text-gray-300">Delivered On</p>
                      <p className="text-base font-bold">{order.deliveredAt}</p>
                    </div>
                  </div>
                  <div className="w-full grid grid-cols-4">
                    <div className="my-4">
                      <p className="font-semibold text-gray-300">Package</p>
                      <p className="text-base font-bold">{order.cartItems}</p>
                    </div>
                    <div className="my-4">
                      <p className="font-semibold text-gray-300">Types Of Package</p>
                      <p className="text-base font-bold">{order.orderItems.length}</p>
                    </div>
                    <div className="my-4">
                      <p className="font-semibold text-gray-300">Total Price</p>
                      <p className="text-base font-bold">$ {order.cartPrice}</p>
                    </div>
                  </div>
                  <div className="w-full grid grid-cols-3 mb-8">
                    <div></div>
                    <div className="col-span-2">
                      <h3>Items: </h3>
                      <div className="grid grid-cols-3 bg-gray-300 mb-4">
                        <p className="m-0 px-4 py-2 text-center">Products</p>
                        <p className="m-0 px-4 py-2 text-center">Quantity</p>
                        <p className="m-0 px-4 py-2 text-center">Status</p>
                      </div>
                      {order.orderItems.map(item => (
                        <div key={item._id} className="grid grid-cols-3">
                          <div className="flex items-center">
                            <div className="relative overflow-hidden w-10 h-10">
                              <Image layout="fill" alt="Image Data" className="w-full h-full" src={item.productId.imagesUrls} />
                            </div>
                            <div className="pl-4">
                              <p className="font-medium m-0">{item.productId.name}</p>
                              <p className="text-xs leading-3 text-gray-600 pt-2">shopId: {item.productId.shopId}</p>
                            </div>
                          </div>
                          <p className="text-center">{item.quantity}</p>
                          {item.status === 1 ? 
                            <p className="text-center font-bold text-red-600">Delivered</p> 
                            : <p className="text-center font-bold text-yellow-600">Approved</p>
                          }
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderHistory
