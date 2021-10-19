import { HttpException } from './httpException';

export class UserWithThatEmailAlreadyExistsException extends HttpException {
  constructor(email: string) {
    super(400, `User with email ${email} already exists.`);
  }
}
