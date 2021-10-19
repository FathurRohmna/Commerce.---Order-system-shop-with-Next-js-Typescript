import { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'

import UserService from '../../../apiFeatures/user/user.service'
import db from '../../../apiFeatures/commons/mongoose/connect-database'
import JwtMiddleware from '../../../apiFeatures/auth/middleware/jwt.middleware'

const handler = nc()
const userSevice = new UserService()

handler
  .use(JwtMiddleware.validJWTNeeded)
  .get(async (req: NextApiRequest, res: NextApiResponse) => {

  try {
    await db.connect()

    const orderHistory = await userSevice.getOrdersUserByEmail(req.user.email)

    await db.disconnect()

    res.status(200).json({ data: orderHistory })
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error_msg: error.message})
  }
})

export default handler