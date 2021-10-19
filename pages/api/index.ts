import { PermissionFlag } from './../../../../apiFeatures/auth/middleware/common.permissionflag.enum';
import PermissionFlagMiddleware from '../../../../apiFeatures/auth/middleware/permission-flag.middleware';
import ProductService from '../../../../apiFeatures/product/product.service'
import db from '../../../../apiFeatures/commons/mongoose/connect-database'
import JwtMiddleware from '../../../../apiFeatures/auth/middleware/jwt.middleware'
import { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect';

const handler = nc()
const productService = new ProductService()

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  
  try {
    await db.connect()

    const products = await productService.getAllProductsShop()

    await db.disconnect()

    res.status(200).json({ products: products })
  } catch (error) {
    res.status(400).json({ error_msg: error.message})
  }
})

export default handler
