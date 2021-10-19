import nc from 'next-connect'
import { NextApiRequest, NextApiResponse } from 'next'

import UserService from '../../../apiFeatures/user/user.service'
import db from '../../../apiFeatures/commons/mongoose/connect-database'

const handler = nc<NextApiRequest, NextApiResponse>()

const userService = new UserService()

handler.get(async (req, res) => {
  const userId: string = req.query.id

  try {
    await db.connect()

    const user = await userService.getUserById(userId)

    await db.disconnect()
    res.status(200).json({ user: user })
  } catch (error) {
    res.status(400).json({ error_msg: error.message})
  }
})

export default handler
