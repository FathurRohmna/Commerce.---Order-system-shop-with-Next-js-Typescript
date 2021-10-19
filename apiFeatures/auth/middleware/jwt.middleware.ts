import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken'

import UserService from '../../user/user.service'

const jwtSecret: string = "hiuauisdty76&D*()A*(D)^uiasuydashdiuoasyduif78atasflaskja"

class JwtMiddleware {
  constructor(private readonly userService: UserService = new UserService) {}

  public validJWTNeeded(req: NextApiRequest, res: NextApiResponse, next: any) {
    const authCookie = req.cookies?.Authorization
    
    if (authCookie) {
      try {
        const verificationResponse = jwt.verify(authCookie, jwtSecret)

        if (verificationResponse) {
          req.user = jwt.decode(authCookie)
          next()
        } else {
          res.status(401).send('Failed Token Loaded')
        }
      } catch (error) {
        res.status(401).send('Unauthorized, Need to Loggin')
      }
    } else {
      res.status(400),send('System Error from Express')
    }
  }
}

export default new JwtMiddleware()