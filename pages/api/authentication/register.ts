import { CreateUserDto } from './../../../apiFeatures/user/dto/create-user.dto'
import db from '../../../apiFeatures/commons/mongoose/connect-database'
import UserService from '../../../apiFeatures/user/user.service'
import AuthService from './../../../apiFeatures/auth/auth.service'

import { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'

const handler = nc<NextApiRequest, NextApiResponse>()
const userService = new UserService()
const authService = new AuthService()

handler.post(async (req, res) => {
  const userData: CreateUserDto = req.body

  try {
    await db.connect()

    const newUser = await userService.createUser(userData)
    const tokenData = authService.login(newUser)

    await db.disconnect()
    res.status(200).json({ user: newUser, tokenData: tokenData })
  } catch (error) {
    res.status(400).json({ error_msg: error.message })
  }
})

export default handler
