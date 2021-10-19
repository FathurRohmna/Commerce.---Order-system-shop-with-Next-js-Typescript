import mongoose, { Document, Schema ,HookNextFunction } from 'mongoose'
import shortid from 'shortid'

interface address {
  street: string
  zipCode: string
  city: string
  state: string
  country: string
  coordinate: {
    lat: string
    long: string
  }
}

export interface ShopDocument extends Document {
  name: string
  address: address
  products: any
  author: string
}

const ShopSchema = new Schema(
  {
    _id: { type: String, default: shortid.generate },
    name: { type: String, required: true },
    address: {
      street: { type: String, required: true },
      zipCode: { type: Number, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
      locationId: { type: String, required: true },
    },
    products: [{
      ref: 'Product',
      type: String,
    }],
    author: {
      ref: 'User',
      type: String
    },
    orders: [{
      type: Schema.Types.ObjectId,
      ref: 'ProductOrder'
    }],
    avatar: { type: String, default: 'https://res.cloudinary.com/dfobdvbqs/image/upload/v1629729794/article-app-express-js/avatar_mmnoga.png'}
  }, {
    toJSON: {
      virtuals: true
    }
  }
)

export const Shop = mongoose.models.Shop || mongoose.model<ShopDocument>('Shop', ShopSchema)
