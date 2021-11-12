import { useEffect, useContext, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Head from 'next/head'
import Router, { useRouter } from 'next/router'
import Cookies from 'js-cookie'
import jwt from 'jsonwebtoken'

import { AiOutlineSearch, AiOutlineHistory, AiOutlineShoppingCart } from 'react-icons/ai'
import StarRating from 'react-star-ratings'
import { Carousel } from 'react-responsive-carousel'
import { useKeenSlider } from 'keen-slider/react'

import { Store } from '../store'
import * as actions from '../store/cart/ActionCreators'
import * as productActions from '../store/product/ActionCreators'
import * as authenticationActions from '../store/auth/ActionCreators'

import ProductCard from '../components/ProductCard'

import http from '../utils/http-instance'
import { checkUserAuth } from '../helper/isAuthenticatedUser'

const Home = ({ allProducts, user }) => {
  const { state, dispatch } = useContext(Store)
  const [userAuth, setUserAuth] = useState(true)
  const router = useRouter()

  const products = state.product?.products

  useEffect(() => {
    setUserAuth(user)

    dispatch(productActions.productInit(
      allProducts.onSaleProducts, 
      allProducts.topRatedProducts, 
      allProducts.allProducts
    ))
  }, [])

  const [sliderRef] = useKeenSlider({
    slidesPerView: 2,
    mode: 'free',
    spacing: 15
  })

  const addToCartHandler = (product) => {
    if (userAuth) {
      dispatch(actions.addCartItem(product))
      dispatch(productActions.productAddedToCart(product._id))
    } else {
      Router.replace('/authentication/login')
    }
  }

  return (
    <div className="w-full">
      <Head>
        <meta
          key="twitter:title"
          name="twitter:title"
          content="Ecommerce - Banguan karir anda semakin bagus."
        />
        <meta
          key="og:title"
          property="og:title"
          content="Ecommerce - Banguan karir anda semakin bagus."
        />
        <title>Ecommerce - Banguan karir anda semakin bagus.</title>
      </Head>
      <div className="w-full min-h-screen relative">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-50 lg:pb-8 pb-0 bg-white">
            <div className="relative pt-6 px-4 sm:px-6 lg:px-8">
              <div className="relative flex items-center justify-between sm:h-10">
                <div className="flex items-center flex-grow flex-shrink-0">
                  <div className="flex items-center justify-between w-full">
                    <Link href="/">
                      <a className="ml-2 h-full flex items-center">
                        <h3 className="m-0 p-0">Commerce.</h3>
                      </a>
                    </Link>
                    <div className="relative">
                      <div className="flex text-gray-800">
                        <div className="p-2">
                          <Link href="/order-history">
                            <a className="cursor-pointer flex items-center">
                              <p className="m-0 font-semibold text-base">Order History</p>
                              <AiOutlineHistory size={25} />
                            </a>
                          </Link>
                        </div>
                        <div className="p-2 flex max-w">
                          <Link href="/cart">
                            <a className="cursor-pointer flex items-center">
                              <p className="m-0 font-semibold text-base">Cart</p>
                              <AiOutlineShoppingCart size={25} />
                            </a>
                          </Link>
                        </div>
                        {state.auth?.permissionFlags !== 5 && <button className="border border-gray-500 text-gray-500 ml-2 font-semibold px-5 py-2 shadow rounded-md">Create Shop</button>}
                        {state.auth?.permissionFlags === 5 && <Link href="/shop-admin/products">
                          <a className="text-white bg-blue-600 ml-2 font-semibold px-5 py-2 shadow rounded-md">Admin Shop</a>
                        </Link>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Banner Session */}
          <div className="relative mb-4 px-4 sm:px-6 lg:px-8  w-full">
            <div className="bg-blue-900 bg-opacity-40 max-h-screen h-auto rounded-3xl">
              <div className="w-full flex justify-between py-8 px-12">
                <div className="relative w-3/5 text-gray-700">
                  <h1 className="text-4xl font-bold">Perluas jaringan anda, dan buat toko online mu di sini</h1>
                  <h4 className="font-light mb-12">ecommerce. make your network is like future.</h4>
                  <Link href={state.auth?.permissionFlags !== 5 ? `/authentication/create-shop` : `/shop-admin/products`}>
                    <a className="text-white bg-blue-600 ml-2 shadow font-semibold px-5 py-2  rounded-md">Admin Shop</a>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* SALE Container */}
          <div className="pt-6 px-4 sm:px-6 lg:px-8 text-gray-600">
            <div className="relative text-center mb-8">
              <h1 className="text-4xl font-semibold text-gray-900 inline">Hot Sale</h1>
            </div>

            <Carousel
              showArrows={false}  
              emulateTouch
              showThumbs={false}
              showStatus={false}
              showIndicators={false}
              centerSlidePercentage={70}
              centerMode
              className="py-10 bg-gray-500 bg-opacity-30"
            >
              {products && products[0].data.map((product) => {
                return (
                  <div key={product._id} className="bg-white mx-5 shadow-md">
                    <div className="flex p-8 h-full box-border">
                      <div className="w-1/2 pr-4">
                        <div className="relative max-h-96 h-72 flex items-center">
                          <Image src={product.imagesUrls} layout="fill" alt="Here we goo" className="rounded-lg" />
                        </div>
                      </div>
                      <div className="w-1/2 flex">
                        <div className="px-8 py-6 text-left w-full">
                          <div className="text-left mb-4">
                            <h1 className="text-2xl m-0 leading-10">{product.name}</h1>
                            <div className="flex items-center">
                            <h5 className="text-xl m-0">$ {product.price}</h5>
                            <div className="ml-2">
                              <p className="text-sm text-white font-semibold bg-red-700 rounded-full px-3 m-0">{product.onSale}%</p>
                            </div>
                          </div>
                        </div>
                        <p className="mb-4">{product.description}</p>
                        <div className="mt-6 mb-4 text-left">
                          <StarRating
                            className="w-12"
                            name="small-rating"
                            totalStars={5}
                            starDimension="15px"
                            starSpacing="4px"
                            rating={product.rating}
                          />
                        </div>
                        <p className="mt-4 font-normal">Count: <span className="font-extrabold">{product.count}</span> Peaces</p>
                        <Link href={`/shop/${product.shopId?._id}`}>
                          <a>
                            <div className="flex items-center">
                              <Image src={product.shopId?.avatar || '/vercel.svg'} width="20" height="20" alt="Shop Avatar" />
                              <p className="text-xs ml-1 m-0">{product.shopId?.name || 'Hello'}</p>
                            </div>
                          </a>
                        </Link>
                        <div className="mt-8 w-full flex justify-end">
                          <button 
                            className={`font-semibold px-5 py-2 text-white rounded-md shadow ${product.addedToCart ? 'bg-gray-500 border border-gray-400' : 'bg-primary'}`} 
                            onClick={() => addToCartHandler(product)}
                            disabled={product.addedToCart ? true : false}
                          >
                            {product.addedToCart ? 'Added' : 'Add to Cart'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
              })}
            </Carousel>

          </div>

          {/* Top Rated Product */}
          <div className="w-full pt-6 px-4 lg:px-8 text-gray-600">
            <div className="relative text-center mb-8">
              <h1 className="text-4xl font-semibold text-gray-900 inline">Top Rated</h1>
            </div>
            <Carousel
              showArrows={false}  
              emulateTouch
              showThumbs={false}
              showStatus={false}
              showIndicators={false}
              centerSlidePercentage={23}
              centerMode
              className="py-10 px-8 bg-gray-500 bg-opacity-30"
            >
              {products && products[1].data.map(product => <ProductCard key={product._id} product={product} onClick={() => addToCartHandler(product)} /> )}
            </Carousel>
          </div>

          {/* All Products */}
          <div className="pt-6 px-4 lg:px-8 text-gray-600">
            <div className="relative text-center mb-4">
              <h1 className="text-4xl font-extralight inline">All Products</h1>
            </div>

            <div className="relative w-full my-12 grid grid-cols-5 gap-4">
              {products && products[2].data.map((product) => <ProductCard key={product._id} product={product} onClick={() => addToCartHandler(product)} /> )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export async function getServerSideProps(context) {
  const authToken = context.req?.cookies.Authorization
  let user = null 

  try {
    if (authToken) {
      const verificationResponse = jwt.verify(authToken, process.env.JWT_SECRET)

      if (verificationResponse) {
        user = jwt.decode(authToken)
      } else {
        user = null
      }
    }
  } catch (error) {
    user = null
  }

  const allProducts = await http.get(
    `http://localhost:8080/api/products`
  )

  return {
    props: {
      user: user,
      allProducts: allProducts.data.data
    }
  }
}

export default Home
