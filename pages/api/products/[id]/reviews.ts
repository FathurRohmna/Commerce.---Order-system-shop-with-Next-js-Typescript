import nc from 'next-connect'
import { NextApiRequest, NextApiResponse } from 'next'

import ProductService from '../../../../apiFeatures/product/product.service'
import db from '../../../../apiFeatures/commons/mongoose/connect-database'

const handler = nc<NextApiRequest, NextApiResponse>()
const productService = new ProductService()

handler.post(async (req, res) => {
  const productId = req.query.id
  const reviewData = req.body
  console.log(reviewData);

  try {
    await db.connect()

    await productService.createProductReview(productId, reviewData)

    await db.disconnect()
    res.status(201).send({ message: 'Review submitted' })
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error_msg: error.message})
  }
})

export default handler
