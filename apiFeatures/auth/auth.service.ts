import { WrongPassword } from './../commons/exceptions/WrongPassword.exceptions';
import { UserWithThatEmailDoesntExistsException } from './../commons/exceptions/UserWithThatEmailDoesntExistsException.exceptions';
import { LoginDto } from './dto/login.dto';
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import argon2 from 'argon2'

import { TokenPayload } from './interface/TokenPayload.interface';
import { UserDocument } from './../user/user.model';
import UserService from '../user/user.service'

class AuthService {
  constructor(private readonly userService: UserService = new UserService) {}

  public async validate(data) {
    const user = await this.userService.getUserByEmailAndComparePassword(data)

    if (!user) {
      throw new UserWithThatEmailDoesntExistsException(data.email)
    }
    
    return user
  }

  public login(user: UserDocument) {
    const expiresIn = process.env.JWT_EXPIRES
    const secret = process.env.JWT_SECRET

    const payload: TokenPayload = { userId: user._id, email: user.email, shop: user.shop || null, permissionFlags: user.permissionFlags }
    const refreshId = user._id + secret
    const salt = crypto.createSecretKey(crypto.randomBytes(16))
    const hash = crypto.createHmac('sha512', salt).update(refreshId).digest('base64')

    payload.refreshKey = salt.export()

    const token = jwt.sign(payload, secret, { expiresIn })

    return {
      token: token,
      refreshToken: hash,
      expiresIn: expiresIn
    }
  }
}

export default AuthService
