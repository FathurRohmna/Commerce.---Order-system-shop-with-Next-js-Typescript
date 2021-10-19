import { CreateShopDto } from './../../../apiFeatures/shop/dto/create-shop.dto';
import nc from 'next-connect'

import AuthService from './../../../apiFeatures/auth/auth.service'
import ShopService from './../../../apiFeatures/shop/shop.service'
import db from '../../../apiFeatures/commons/mongoose/connect-database'

const handler = nc<NextApiRequest, NextApiResponse>()
const authService = new AuthService()

handler.post(async (req, res) => {
  const shopData: CreateShopDto = req.body

  try {
    await db.connect()

    const shopAuthor = await ShopService.createShop(shopData)
    const tokenData = authService.login(shopAuthor)

    await db.disconnect()
    res.status(200).json({ user: shopAuthor, tokenData: tokenData })
  } catch (error) {
    res.status(400).json({ error_msg: error.message })
    console.log(error.message);
  }
})

export default handler 
