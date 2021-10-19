import { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'

import db from '../../../../apiFeatures/commons/mongoose/connect-database'
import ShopService from '../../../../apiFeatures/shop/shop.service'
import OrderService from '../../../../apiFeatures/order/order.service'

const handler = nc()
const orderService = new OrderService()

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const shopId: string = req.query.id

  try {
    await db.connect()

    const orders = await ShopService.getOrdersShop(shopId)

    await db.disconnect()

    res.status(200).json({ data: orders })
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error_msg: error.message})
  }
})

handler.put(async (req, res) => {
  const editData = req.body

  try {
    await db.connect()

    const order = await orderService.editOrderShop(editData._id, editData)

    await db.disconnect()

    res.status(200).json({ data: order })
  } catch (error) {
    res.status(400).json({ error_msg: error.message})
  }
})

export default handler