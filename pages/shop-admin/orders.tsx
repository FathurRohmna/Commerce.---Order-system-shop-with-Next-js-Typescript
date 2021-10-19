import { useState, useContext, useEffect } from 'react'
import Router, { withRouter } from 'next/router'
import Image from 'next/image'
import Head from 'head'
import Cookies from 'js-cookie'

import AdminSidebar from '../../components/AdminSidebar'
import useTable from '../../components/Hooks/useTable'
import { Store } from '../../store'
import http from '../../utils/http-instance'
import * as shopOrderActions from '../../store/shop/orders/ActionCreators'

import axios from 'axios'
import { AiOutlineSearch, AiOutlinePlus } from 'react-icons/ai'

const headCells = [
  { id: 'product', label: 'Products' },
  { id: 'user', label: 'Users' },
  { id: 'date_ordered', label: 'Date Ordered' },
  { id: 'status', label: 'Status' }
]

export default function Orders() {
  const { state, dispatch } = useContext(Store)

  const orders = state.orderShop?.orders
  const shopId = state.auth?.shop

  useEffect(() => {
    async function getOrderShop() {
      const response = await http.get(`/api/shop/${shopId}/order`)

      dispatch(shopOrderActions.getOrderShop(response.data.data.orders))
    }

    getOrderShop()
  }, [])

  const approvedOrder = async (e, data) => {
    try {
      const response = await http.put(`/api/shop/${shopId}/order`, {
        status: e.target.value,
        _id: data._id
      }).catch(function (error) {
        if (error) {
          return error
        }
      })

      if (response.response) {
        console.log(response.response.data);
      } else {
        console.log(response.data);
      }
    } catch (error) {
      console.log(error)
    }
  }

  const {
    TblContainer,
    TblHead
  } = useTable(headCells)

  return (
    <div className="w-full h-full min-h-screen">
      <Head>
        <title>Orders Admin - Ecommerce</title>
      </Head>
      <AdminSidebar />
      <div className="w-full pr-12 pl-72 pt-12 bg-gray-400 bg-opacity-50 shadow-lg h-full">
        <div className="mx-auto max-w-7xl bg-white p-6">
          <div className="px-4 md:pt-7 pb-5 overflow-y-auto">
            <TblContainer>
              <TblHead />
              <tbody className="w-full min-h-xl">
                {orders && orders.map(order => (
                  <tr key={order._id} className="h-20 text-sm leading-none text-gray-800 bg-white hover:bg-gray-100 border-b border-t border-gray-100">
                    <td className="pl-4 cursor-pointer">
                      <div className="flex items-center">
                        <div className="relative overflow-hidden w-10 h-10">
                          <Image layout="fill" alt="Image Data" className="w-full h-full" src={order.productId.imagesUrls} />
                        </div>
                        <div className="pl-4">
                          <p className="font-medium">{order.productId.name}</p>
                          <p className="text-xs leading-3 text-gray-600 pt-2">rate: {order.productId.rating | 0}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <p>{order.address?.name}</p>
                      <p>{order.address?.address.district}, {order.address?.address.city}</p>
                      <p>{order.address?.address.county}, {order.address?.address.postalCode}</p>
                    </td>
                    <td>
                      {order.deliveredAt}
                    </td>
                    <td>
                      <select value={order.status} onChange={(e) => approvedOrder(e, order)}>
                        <option value={1}>Delivered</option>
                        <option value={2}>Approved</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </TblContainer>
          </div>
        </div>
      </div>
    </div>
  )
}