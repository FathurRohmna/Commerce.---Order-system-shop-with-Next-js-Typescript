import { HttpException } from './httpException'

export class WrongPassword extends HttpException {
  constructor(email: string) {
    super(404, `${email} you enter wrong password, try again.`)
  }
}
