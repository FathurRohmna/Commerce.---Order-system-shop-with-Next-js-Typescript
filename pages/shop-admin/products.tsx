import { useState, useContext, useEffect } from 'react'
import Router, { withRouter } from 'next/router'
import Image from 'next/image'
import Head from 'next/head'
import Cookies from 'js-cookie'

import { useForm, SubmitHandler, Controller } from 'react-hook-form'

import AdminSidebar from '../../components/AdminSidebar'
import Popup from '../../components/Popup'
import { Controllers } from '../../components/Controllers'
import useTable from '../../components/Hooks/useTable'
import { Form, useForm as useFormHook } from '../../components/Hooks/useForm'

import { Store } from '../../store'
import * as shopProductActions from '../../store/shop/products/ActionCreators'
import withPrivateRoute from '../../components/WithPrivateRoute'
import http from '../../utils/http-instance'

import axios from 'axios'
import { AiOutlineSearch, AiOutlinePlus } from 'react-icons/ai'

const headCells = [
  { id: 'product', label: 'Product' },
  { id: 'price', label: 'Price' },
  { id: 'on-sale', label: 'On Sale' },
  { id: 'count', label: 'Count' },
  { id: 'action', label: 'Action' }
]

const initialOfValues = {
  name: '',
  description: '',
  price: 0,
  imageUrls: undefined,
  onSale: 0,
  count: 0
}

const Products = ({ userInfo }) => {
  const [ openForm, setOpenForm ] = useState(false)
  const [ recordForEdit, setRecordForEdit ] = useState(null)
  const { state, dispatch } = useContext(Store)

  const shopId = state.auth?.shop
  const products = state.productShop?.products?.products

  const {
    values,
    setValues,
    resetForm,
    handleInputChange
  } = useFormHook(initialOfValues)

  console.log(openForm, recordForEdit);

  useEffect(() => {
    async function getProductShop() {
      const response = await http.get(`/api/shop/${shopId}/product`)

      console.log(response.data);

      dispatch(shopProductActions.getProductsShop(response.data.data.products, response.data.data.productsLength))
    }

    getProductShop()

    if (recordForEdit != null) {
      setValues({
        ...recordForEdit
      })
    }

  }, [recordForEdit, setValues])

  const onSubmit = e => {
    e.preventDefault()
    addOrEdit(values, resetForm)
  }



  const onChangeEvent = (e:  React.ChangeEvent<{ value: unknown }>) => setValue(e.target.name, e.target.value)

  const handleFileInputChange= (e: React.ChangeEvent ) => {
    const reader = new FileReader()
    const file = e.target.files[0]

    console.log(file);

    reader.readAsDataURL(file)
    reader.onloadend = () => {
      setValues('imageUrls', reader.result)
    }
    reader.onerror = () => {
      console.error('AHHHHHHHH!!');
      setErrMsg('something went wrong!');
    };
  }

  const addOrEdit = (product, resetForm) => {
    if (product._id) 
      editProduct(product)
    else
      postProduct(product)
    resetForm()
  }

  const editProduct = async (data) => {
    try {
      const response = await http.put(`/api/shop/${data.shopId}/product`, data).catch(function (error) {
        if (error) {
          return error
        }
      })

      if (response.response) {
        console.log(response.response.data);
      } else {
        console.log(response.data)
        dispatch(shopProductActions.editProductShop(data))
      }
    } catch (error) {
      console.log(error);
    }
  }

  const postProduct = async (data) => {
    try {
      const { name, description, price, imageUrls, count, onSale } = data

      const response = await http.post(`/api/shop/${shopId}/product`, {
        name,
        description,
        price,
        imageUrls,
        onSale,
        count
      }).catch(function (error) {
        if (error) {
          return error
        }
      })

      if (response.response) {
        console.log(response.response.data);
      } else {
        dispatch(shopProductActions.postProductShop(response.data.newProduct))
        console.log(response.data.newProduct);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const openInPopup = (data) => {
    setRecordForEdit(data)
    setOpenForm(true)
  }

  const handleDeleteProduct = async (data) => {
    try {
      const response = await http.delete(`/api/shop/${shopId}/product`, {
        productId: data._id
      }).catch(function (error) {
        if (error) {
          return error
        }
      })

      if (response.response) {
        console.log(response.response.data);
      } else {
        dispatch(shopProductActions.deleteProductShop(data._id))
        console.log(response.data.newProduct);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const {
    TblContainer,
    TblHead
  } = useTable(headCells)

  return (
    <>
      <Head>
        <title>Product Admin - Ecommerce</title>
      </Head>
      <div className="w-full h-full min-h-screen">
      <AdminSidebar />
      <div className="w-full pr-12 pl-72 pt-12 bg-gray-400 bg-opacity-50 shadow-lg h-full">
        <div className="mx-auto max-w-7xl bg-white p-6">
          <div className="flex w-full justify-end">
            <button onClick={() => setOpenForm(true)} className="flex ml-2 items-center justify-between px-4 py-2 border-border border rounded-lg bg-primary text-white">
              <p className="w-max m-0 font-bold">Add New</p>
              <div className="ml-3">
                <AiOutlinePlus size={20} />
              </div>
            </button>
          </div>
          <div className="px-4 md:pt-7 pb-5 overflow-y-auto">
            <TblContainer>
              <TblHead />
              <tbody className="w-full min-h-xl">
                {products && products.map(product => (
                  <tr key={product._id} className="h-20 text-sm leading-none text-gray-800 bg-white hover:bg-gray-100 border-b border-t border-gray-100">
                    <td className="pl-4 cursor-pointer">
                      <div className="flex items-center">
                        <div className="relative overflow-hidden w-10 h-10">
                          <Image layout="fill" alt="Image Data" className="w-full h-full" src="https://cdn.tuk.dev/assets/templates/olympus/projects.png" />
                        </div>
                        <div className="pl-4">
                          <p className="font-medium">{product.name}</p>
                          <p className="text-xs leading-3 text-gray-600 pt-2">{product.rating || 0}</p>
                        </div>
                      </div>
                    </td>
                    <td className="pl-20">
                      <p className="text-xs leading-3 text-gray-600 mt-2">Rp. {product.price}</p>
                    </td>
                    <td className="pl-20">
                      <p className="text-xs leading-3 text-gray-600 mt-2">{product.onSale || 'None'}</p>
                    </td>
                    <td className="pl-20">
                      <p className="text-xs leading-3 text-gray-600 mt-2">{product.count} peaces</p>
                    </td>
                    <td className="pl-20">
                      <Controllers.ActionButton
                        type="normal"
                        onClick={() => openInPopup(product)}
                      >
                        Edit
                      </Controllers.ActionButton>
                      <Controllers.ActionButton
                        type="danger"
                        onClick={() => handleDeleteProduct(product)}
                      >
                        Delete
                      </Controllers.ActionButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </TblContainer>
          </div>
        </div>
        <Popup
          open={openForm}
          setOpen={setOpenForm}
        >
          <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-center">
              <div className="mt-3 text-center sm:mt-0 w-full">
                <h1 className="text-gray-700 font-light">Create Product</h1>
              </div>
            </div>
            <form onSubmit={onSubmit}>
              <div className="grid w-full grid-cols-2 gap-4">
                <Controllers.InputText
                  name="name"
                  id="Name"
                  small
                  placeholder="Product Name"
                  value={values.name}
                  onChange={handleInputChange}
                />
                <Controllers.InputText
                  name="price"
                  id="Price"
                  small
                  placeholder="Price Product"
                  type="number"
                  value={values.price}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid w-full grid-cols-1 gap-4">
                <textarea name="description" id="description" cols="30" rows="10" className="border border-gray-200 focus:outline-none rounded-lg p-4 mb-6 mt-2" placeholder="Description Product" onChange={handleInputChange} value={values.description}></textarea>
              </div>
              <div className="grid w-full grid-cols-3 gap-4">
                <label className="w-full flex flex-col items-center px-4 py-6 bg-white rounded-md shadow-md tracking-wide uppercase border border-blue cursor-pointer hover:bg-purple-600 hover:text-white text-purple-600 ease-linear transition-all duration-150">
                  <svg fill="#FFF" height="18" viewBox="0 0 24 24" width="18" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 0h24v24H0z" fill="none"/>
                    <path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/>
                  </svg>
                  <span className="mt-2 text-base leading-normal">Upload Image</span>
                  <input 
                    type="file" 
                    name="imageUrls"
                    className="hidden"
                    onClick={(event)=> { 
                          event.currentTarget.value = null
                    }}
                    onChange={handleFileInputChange} 
                  />
                </label>

                <Controllers.InputText
                  name="count"
                  id="Count"
                  small
                  placeholder="Products Count"
                  type="number"
                  value={values.count}
                  onChange={handleInputChange}
                />
                <Controllers.InputText
                  name="onSale"
                  id="On Sale"
                  small
                  placeholder="OnSale Product"
                  type="number"
                  defaultValue={0}
                  value={values.onSale}
                  onChange={handleInputChange}
                />
              </div>
              <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="submit"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setOpenForm(false)}
                  >
                  Post
                </button>
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-base font-medium text-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    setOpenForm(false)
                    resetForm()
                  }}
                  >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </Popup>
      </div>
    </div>
    </>
  )
}

export default withPrivateRoute(Products)
