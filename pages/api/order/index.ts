import { CreateOrderDTO } from './../../../apiFeatures/order/dto/create-order.dto';
import { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'

import OrderService from '../../../apiFeatures/order/order.service'
import db from '../../../apiFeatures/commons/mongoose/connect-database'

const handler = nc()
const orderService = new OrderService()

handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
  const orderData: CreateOrderDTO = req.body

  try {
    await db.connect()

    const newOrder = await orderService.createOrder(orderData)

    await db.disconnect()

    res.status(200).json({})
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error_msg: error.message})
  }
})

export default handler
