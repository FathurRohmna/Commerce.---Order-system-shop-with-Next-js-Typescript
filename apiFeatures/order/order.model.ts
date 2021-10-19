import { ProductDocument } from './../product/product.model';
import mongoose, { Document, Schema ,HookNextFunction } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

enum statusDelivered {
  SEND_DELIVERED = 1,
  GET_DELIVERED = 2,
  IS_DELIVERED = 3,
  DELIVERED_PANDDING = 4
}

export interface ProductOrderDocument extends Document {
  productId: string
  quantity: number
  status: number
  address: {
    name: string
    address: {
      country: string
      dity: string
      district: string
      postalCode: string
      locationId: string
    }
  }
}

export interface OrderDocument extends Document {
  user: string
  orderItems: any[]
  shippingAddress: {
    name: string
    address: {
      country: string
      county: string
      city: string
      district: string
      postalCode: string
      locationId: string
    }
  }
  paymentMethod: string
  cartItems: number
  cartPrice: number
  deliveredAt: Date
}

const ProductOrderSchema = new Schema(
  {
    productId: { type: String, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    status: { type: Number, required: true },
    address: {
      name: { type: String, required: true },
      address: { 
        country: { type: String, required: true },
        county: { type: String, required: true },
        city: { type: String, required: true },
        district: { type: String, required: true },
        postalCode: { type: String, required: true },
        locationId: { type: String, required: true }
      }
    },
    deliveredAt: { type: Date, default: Date.now() }
  }
)

const OrderSchema = new Schema(
  {
    user: { type: String, ref: 'User', required: true },
    orderItems: [{
      type: Schema.Types.ObjectId,
      ref: 'ProductOrder',
    }],
    paymentMethod: { type: String, required: true },
    cartItems: { type: Number, required: true },
    cartPrice: { type: String, required: true },
    deliveredAt: { type: Date, default: Date.now() }
  },
)

export const ProductOrder = mongoose.models.ProductOrder || mongoose.model<ProductOrderDocument>('ProductOrder', ProductOrderSchema)
export const Order = mongoose.models.Order || mongoose.model<UserDocument>('Order', OrderSchema)
