import React, { useContext, useEffect, useState } from 'react'
import Image from 'next/image'
import Head from 'next/head'
import StarRating from 'react-star-ratings'

import http from '../../utils/http-instance'
import { Store } from '../../store'

const ProductItem = ({ productItem }) => {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')

  const { state, dispatch } = useContext(Store)

  console.log(productItem);

  const submitHandler = async (e) => {
    e.preventDefault()
    try {
      await http.post(
        `/api/products/${productItem.data._id}/reviews`,
        {
          user: state.auth.email,
          rating,
          comment
        }
      )
    } catch (error) {
      console.log(error.message);
    }
  }
  
  return (
    <div className="w-full">
      <Head>
        <meta
          key="twitter:title"
          name="twitter:title"
          content={`${productItem.data.name} - Ecommerce`}
        />
        <meta
          key="og:title"
          property="og:title"
          content={`${productItem.data.name} - Ecommerce`}
        />
        <meta key="twitter:card" name="twitter:card" content="summary_large_image" />
        <meta key="twitter:site" name="twitter:site" content="fathur rohman" />
        <meta key="twitter:description" name="twitter:description" content="Create your own site here" />
        <meta
          key="twitter:image"
          name="twitter:image"
          content={`${productItem.data.imagesUrls}`}
        />
        <meta key="twitter:creator" name="twitter:creator" content="fathur rohman" />
        <meta key="og:type" property="og:type" content="article" />
        <meta key="og:description" property="og:description" content="Create your own site here" />
        <meta
          key="og:image"
          property="og:image"
          content={`${productItem.data.imagesUrls}`}
        />
        <title>Ecommerce - Banguan karir anda semakin bagus.</title>
      </Head>
      <div className="w-full min-h-screen relative bg-gray-400 bg-opacity-30">
        <div className="max-w-5xl mx-auto">
          <div className="relative z-50 lg:pb-8 pb-0">
            <div className="relative py-6 px-4 sm:px-6 lg:px-8">
              <div className="pt-6 px-4 sm:px-6 lg:px-8 bg-white">
                
                <div className="flex p-8 h-full box-border">
                  <div className="w-1/2">
                    <div className="relative max-h-96 h-72 flex items-center">
                      <Image src={productItem.data.imagesUrls} layout="fill" alt="Here we goo" className="rounded-lg" />
                    </div>
                  </div>
                  <div className="w-1/2 flex items-start">
                    <div className="py-4 px-8">
                      <h2>{productItem.data.name}</h2>
                      <h3>$ {productItem.data.price}</h3>
                      <p>{productItem.data.description}</p>
                      <div className="mt-4 mb-4">
                        <StarRating
                          className="w-12"
                          name="small-rating"
                          totalStars={5}
                          starRatedColor="orange"
                          starDimension="15px"
                          starSpacing="4px"
                          rating={productItem.data.rating}
                        />
                      </div>
                      <p className="mt-4">Count: <b>{productItem.data.count}</b> Peaces</p>
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  <h3>Comment about product</h3>
                  {productItem.data.reviews.length === 0 && <p className="text-center">No COmment and Reviews for this product</p>}
                  {productItem.data.reviews?.map((review) => {
                    return (
                      <div key={review.user} className="">
                      <div className="flex">
                        <p className="text-gray-500 text-base font-bold mr-4">{review.user}</p>
                        <StarRating
                          className="w-12"
                          name="small-rating"
                          totalStars={5}
                          starRatedColor="orange"
                          starDimension="8px"
                          starSpacing="2px"
                          rating={review.rating}
                        />
                      </div>
                      <div className="ml-8">
                        <p className="bg-gray-200 p-4 bg-opacity-50 rounded-lg text-base text-gray-600 leading-tight">{review.comment}</p>
                      </div>
                    </div>
                    )
                  })}
                </div>

                <div className="p-8">
                  <form onSubmit={submitHandler}>
                    <div className="p-4">
                      <h4>Leave your Review Here</h4>
                      <div className="mb-4">
                        <textarea 
                          name="Comment" 
                          id="Comment"
                          placeholder="Enter your comment for this product."
                          className="w-full px-3 py-2 text-base text-gray-700 placeholder-gray-600 resize border rounded-md focus:outline-none"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        >
                        </textarea>
                      </div>
                      <h4>Rating this product</h4>
                      <div className="mb-4">
                        <StarRating
                          rating={rating}
                          starRatedColor="yellow"
                          changeRating={(newRating, name) => setRating(newRating)}
                          name="rating"
                          starDimension="30px"
                          numberOfStars={5}
                        />
                      </div>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white text-xl rounded-md"
                      >
                        Submit
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductItem

export async function getServerSideProps(context) {
  const productItem = await http.get(
    `http://localhost:8080/api/products/${context.params.id}`
  )

  console.log(context.params);

  return {
    props: {
      productItem: productItem.data
    }
  }
}
