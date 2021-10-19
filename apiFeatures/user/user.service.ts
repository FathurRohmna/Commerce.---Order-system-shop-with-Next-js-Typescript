import { UserWithThatEmailAlreadyExistsException } from './../commons/exceptions/UserWithThatEmailAlreadyExistsException'
import { UserWithThatEmailDoesntExistsException } from './../commons/exceptions/UserWithThatEmailDoesntExistsException.exceptions'
import { WrongPassword } from './../commons/exceptions/WrongPassword.exceptions';
import { CreateUserDto } from './dto/create-user.dto';
import { Model } from 'mongoose'

import { User, UserDocument } from './user.model'

class UserService {
  constructor(private user: Model<UserDocument> = User) {}

  public async getUserByEmail(email: string) {
    const user = await this.user.findOne({ email: email }).select('_id email avatar myBags1 orderHistory +password').exec()

    return user
  }

  public async getUserById(id: string) {
    const user = await this.user.findOne({ _id: id }).select('_id email avatar myBags1 +password').exec()

    return user
  }

  public async getOrdersUserByEmail(email: string) {
    const orders = await this.user.findOne({ email: email }).select('_id orderHistory +password').populate({
      path: 'orderHistory',
      model: 'Order',
      populate: {
        path: 'orderItems',
        model: 'ProductOrder',
        populate: {
          path: 'productId',
          model: 'Product'
        }
      }
    })

    return orders
  }

  public async getUserByEmailAndComparePassword(data) {
    const user = await this.user.findOne({ email: data.email })

    if (user) {
      if (await user.comparePassword(data.password)) {
        return await this.user.findOne({ email: data.email }).select('_id email permissionFlags shop avatar myBags1 +password').exec()
      } else {
        throw new WrongPassword(data.email)
      }
    } else {
      throw new UserWithThatEmailDoesntExistsException(data.email)
    }
  }

  public async getAllUsers() {
    const users = await this.user.find()

    return users
  }

  public async createUser(userData: CreateUserDto) {
    const emailExist = await this.getUserByEmail(userData.email)

    if (emailExist) {
      throw new UserWithThatEmailAlreadyExistsException(userData.email)
    }

    const newUser = new this.user({
      ...userData,
      permissionFlags: 1
    })
    await newUser.save()

    return newUser
  }
}

export default UserService
