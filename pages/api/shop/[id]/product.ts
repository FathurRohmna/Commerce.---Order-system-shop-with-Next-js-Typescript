import { CreateProductDto } from './../../../../apiFeatures/product/dto/create-product.dto';
import { PermissionFlag } from './../../../../apiFeatures/auth/middleware/common.permissionflag.enum';
import PermissionFlagMiddleware from '../../../../apiFeatures/auth/middleware/permission-flag.middleware';
import ShopService from '../../../../apiFeatures/shop/shop.service'
import ProductService from '../../../../apiFeatures/product/product.service'
import db from '../../../../apiFeatures/commons/mongoose/connect-database'
import JwtMiddleware from '../../../../apiFeatures/auth/middleware/jwt.middleware'
import { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'
import * as cloudinary from 'cloudinary'

const handler = nc()

const productService = new ProductService()
const cloudinaryv2 = cloudinary.v2

cloudinaryv2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const shopId: string = req.query.id

  try {
    await db.connect()

    const products = await ShopService.getProductsShop(shopId)

    await db.disconnect()

    res.status(200).json({ data: products })
  } catch (error) {
    res.status(400).json({ error_msg: error.message})
  }
})

handler
  .use(JwtMiddleware.validJWTNeeded)
  .use(PermissionFlagMiddleware.permissionFlagRequired(PermissionFlag.ADMIN))
  .use(PermissionFlagMiddleware.adminPermissionShop)
  .post(async (req: NextApiResponse, res: NextApiRequest) => {
    const productData: CreateProductDto = req.body 
    const shopId: string = req.query.id

    try {
      const uploadResponse = await cloudinaryv2.uploader.upload(productData.imageUrls)

      await db.connect()

      const newProduct = await productService.createProduct({...productData, imagesUrls: uploadResponse.url}, shopId)

      await db.disconnect()

      res.status(200).json({ newProduct: newProduct })
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ error_msg: error.message})
    }
})

handler
  .use(JwtMiddleware.validJWTNeeded)
  .use(PermissionFlagMiddleware.adminPermissionShop)
  .use(PermissionFlagMiddleware.productAdminAccess)
  .put(async (req, res) => {
  const editData = req.body

  try {
    await db.connect()

    const product = await productService.editProductShop(editData._id, editData)

    await db.disconnect()

    res.status(200).json({ data: product })
  } catch (error) {
    res.status(400).json({ error_msg: error.message})
  }
})

handler
  .use(JwtMiddleware.validJWTNeeded)
  .use(PermissionFlagMiddleware.adminPermissionShop)
  .use(PermissionFlagMiddleware.productAdminAccess)
  .delete(async (req, res) => {
  const productId = req.body.productId

  try {
    await db.connect()

    await productService.deleteProductById(productId)

    await db.disconnect()
  } catch (error) {
    res.status(400).json({ error_msg: error.message})
  }
})

export default handler
