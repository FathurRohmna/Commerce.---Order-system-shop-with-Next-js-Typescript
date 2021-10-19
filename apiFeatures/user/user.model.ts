import { OrderDocument } from './../order/order.model';
import { ProductDocument } from './../product/product.model';
import mongoose, { Document, Schema ,HookNextFunction } from 'mongoose'
import argon2 from 'argon2'
import { v4 as uuidv4 } from 'uuid'

export interface UserDocument extends Document {
  firstName: string
  lastName: string
  email: string
  passwordHash: string
  createdAt: Date;
  avatar: string;
  permissionFlags: number;
  myBags: string[];
  orderHistory: string[];
  shop: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema(
  {
    _id: { type: String, default: uuidv4() },
    firstName: { type: String, required: true, min: 6, max: 255 },
    lastName: { type: String, required: false, min: 6, max: 255 },
    email: { type: String, required: true, unique: true, min: 6, max: 255 },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now() },
    avatar: { type: String },
    permissionFlags: { type: Number, required: true },
    myBags: [{
      ref: 'Product',
      type: String 
    }],
    shop: {
      ref: 'Shop',
      type: String
    },
    orderHistory: [{
      type: Schema.Types.ObjectId,
      ref: 'Order'
    }]
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      getters: true,
    },
    id: false
  },
)

UserSchema.pre('save', async function (next: HookNextFunction) {
  let user: UserDocument = this as any

  const hash = await argon2.hash(user.password)

  user.password = hash
  return next()
})

UserSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  const user: UserDocument = this as any;

  const userPassword = user.password;
  
  const match = await argon2.verify(userPassword, candidatePassword)

  return match
}


export const User = mongoose.models.User || mongoose.model<UserDocument>('User', UserSchema)
