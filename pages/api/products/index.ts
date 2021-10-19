import { getProducts } from './../../../utils/dummy-data';
import ProductService from '../../../apiFeatures/product/product.service'
import db from '../../../apiFeatures/commons/mongoose/connect-database'
import { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'
import faker from 'faker'
import { cloudinary } from 'cloudinary'

const handler = nc<NextApiRequest, NextApiResponse>()
const productService = new ProductService()

handler.get(async (req, res) => {
  try {
    await db.connect()
    const products = await productService.getAllProducts()
    await db.disconnect()

    res.status(200).json({ data: products })
  } catch (error) {
    res.status(400).json({ error_msg: error.message})
  }
})

export default handler 
