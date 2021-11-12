import React, { useContext, useEffect, useState } from 'react'
import Image from 'next/image'
import Head from 'next/head'
import StarRating from 'react-star-ratings'

import http from '../../utils/http-instance'
import { Store } from '../../store'

const Shop = ({ shopData }) => {
  console.log(shopData)
  return (
    <div className="w-full">
      <Head>
        <meta
          key="twitter:title"
          name="twitter:title"
          content={`${shopData.shops.name} - Ecommerce`}
        />
        <meta
          key="og:title"
          property="og:title"
          content={`${shopData.shops.name} - Ecommerce`}
        />
        <meta key="twitter:card" name="twitter:card" content="summary_large_image" />
        <meta key="twitter:site" name="twitter:site" content="fathur rohman" />
        <meta key="twitter:description" name="twitter:description" content="Create your own site here" />
        <meta
          key="twitter:image"
          name="twitter:image"
          content={`${shopData.shops.avatar}`}
        />
        <meta key="twitter:creator" name="twitter:creator" content="fathur rohman" />
        <meta key="og:type" property="og:type" content="article" />
        <meta key="og:description" property="og:description" content="Create your own site here" />
        <meta
          key="og:image"
          property="og:image"
          content={`${shopData.shops.avatar}`}
        />
        <title>Ecommerce - Banguan karir anda semakin bagus.</title>
      </Head>
      <div className="w-full min-h-screen relative bg-gray-400 bg-opacity-30">
        <div className="max-w-5xl mx-auto">
          <div className="relative z-50 lg:pb-8 pb-0">
            <div className="relative h-40 w-full overflow-hidden">
              <Image src={shopData.shops.avatar} layout="fill" objectFit="cover" alt={`${shopData.shops.name}'s avatar`} className="rounded-lg" />
            </div>
            <div className="relative py-6 px-4 sm:px-6 lg:px-8">
              <div className="pt-6 px-4 sm:px-6 lg:px-8 bg-white pb-10">
                <div className="mb-4">
                  <h2>{shopData.shops.name}</h2>
                  <div className="text-base text-gray-600 mb-6">
                    <span className="block">{shopData.shops.address.street}</span>
                    <span className="block">{shopData.shops.address.city}, {shopData.shops.address.state}</span>
                    <span className="block">{shopData.shops.address.country}, {shopData.shops.address.zipCode}</span>
                  </div>
                </div>

                <div className="my-8">
                  <h2 className="mb-6">Products</h2>

                  <div className="w-full grid grid-cols-3 gap-4">
                    {shopData.shops.products.map((product) => {
                      return (
                      <div key={product._id} className="w-56 rounded-lg">
                        <div className="relative h-56 flex items-center bg-white rounded-lg">
                          <Image src={product.imagesUrls} layout="fill" alt="Here we goo" className="rounded-lg" />
                        </div>
                        <div className="p-2 bg-white">
                          <h4 className="m-0 p-0 leading-4">{product.name}</h4>
                          <h4 className="m-0 p-0 leading-7">$ {product.price}</h4>
                          <div className="mt-1 mb-1">
                                <StarRating
                                  className="w-12"
                                  name="small-rating"
                                  totalStars={5}
                                  starDimension="8px"
                                  starRatedColor="orange"
                                  starSpacing="1px"
                                  rating={product.rating}
                                />
                              </div>
                            <p className="mt-1">Count: <b>{product.count}</b> Peaces</p>
                            <div className="w-full flex">
                              <button className="mt-2 font-semibold px-2 py-1 text-white rounded-md bg-primary">Add to Cart</button>
                              <button className="mt-2 font-semibold px-4 ml-2 py-1 text-primary rounded-md">Beli</button>
                            </div>
                        </div>
                      </div>
                      )
                    })}
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

export default Shop

export async function getServerSideProps(context) {
  const shop = await http.get(
    `http://localhost:8080/api/shop/${context.params.id}`
  )

  return {
    props: {
      shopData: shop.data
    }
  }
}
