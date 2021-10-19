import nc from 'next-connect'
import { NextApiRequest, NextApiResponse } from 'next'

import db from '../../../../apiFeatures/commons/mongoose/connect-database'
import ProductService from '../../../../apiFeatures/product/product.service'

const handler = nc<NextApiRequest, NextApiResponse>()
const productService = new ProductService()

handler.get(async (req, res) => {
  const id = req.query.id
  console.log(id);

  try {
    await db.connect()
    const products = await productService.getProductById(id)
    await db.disconnect()

    res.status(200).json({ data: products })
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error_msg: error.message})
  }
})


export default handler
