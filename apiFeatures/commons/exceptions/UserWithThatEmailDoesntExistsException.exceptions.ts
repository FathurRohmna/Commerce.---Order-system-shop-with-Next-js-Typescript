import { HttpException } from './httpException'

export class UserWithThatEmailDoesntExistsException extends HttpException {
  constructor(email: string) {
    super(404, `User with email ${email} does not exists.`)
  }
}
