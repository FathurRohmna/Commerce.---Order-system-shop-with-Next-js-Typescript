import { PermissionFlag } from './../../../../apiFeatures/auth/middleware/common.permissionflag.enum';
import PermissionFlagMiddleware from '../../../../apiFeatures/auth/middleware/permission-flag.middleware';
import ProductService from '../../../../apiFeatures/product/product.service'
import ShopService from '../../../../apiFeatures/shop/shop.service'
import db from '../../../../apiFeatures/commons/mongoose/connect-database'
import JwtMiddleware from '../../../../apiFeatures/auth/middleware/jwt.middleware'
import { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect';

const handler = nc()
const productService = new ProductService()

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const shopId: string = req.query.id

  try {
    await db.connect()

    const shops = await ShopService.getShopById(shopId)

    await db.disconnect()

    res.status(200).json({ shops: shops })
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error_msg: error.message})
  }
})

export default handler
