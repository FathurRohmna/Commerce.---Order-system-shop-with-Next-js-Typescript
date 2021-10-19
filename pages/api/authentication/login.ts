import { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'

import AuthService from './../../../apiFeatures/auth/auth.service'
import { LoginDto } from './../../../apiFeatures/auth/dto/login.dto'
import db from '../../../apiFeatures/commons/mongoose/connect-database'
import UserService from '../../../apiFeatures/user/user.service'

const handler = nc<NextApiRequest, NextApiResponse>()
const userService = new UserService()
const authService = new AuthService()

handler.post(async (req, res) => {
  const userData: LoginDto = req.body

  try {
    await db.connect()

    const user = await authService.validate(userData)
    const tokenData = authService.login(user)

    await db.disconnect()
    res.status(200).json({ user: user, tokenData: tokenData })
  } catch (error) {
    res.status(400).json({ error_msg: error.message })
  }
})

export default handler