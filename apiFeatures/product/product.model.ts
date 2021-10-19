import mongoose, { Document, Schema } from 'mongoose'
import shortid from 'shortid'

export interface ProductDocument extends Document {
  name: string
  description: string
  price: number
  size: string
  color: string
  rating: number
  imagesUrls: string
  count: number
  onSale: number
  shopId: string
}

export interface ReviewDocument extends Document {
  user: string
  comment: string
  createdAt: Date
}

const ReviewSchema = new mongoose.Schema(
  {
    user: { type: String, required: true },
    comment: { type: String },
    rating: { type: Number },
    createdAt: { type: Date, default: Date.now() }
  },
  {
    timestamps: true
  }
)

const ProductSchema = new Schema(
  {
    _id: { type: String, default: shortid.generate },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    size: { type: String },
    color: { type: String },
    rating: { type: Number },
    numReviews: { type: Number, required: true, default: 0 },
    imagesUrls: { type: String, required: true },
    count: { type: Number, required: true },
    onSale: { type: Number, required: false },
    reviews: [ReviewSchema],
    shopId: {
      ref: 'Shop',
      type: String
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      getters: true,
    },
    id: false
  }
)

export const Product = mongoose.models.Product || mongoose.model<ProductDocument>('Product', ProductSchema)

export const Review = mongoose.models.Review || mongoose.model<ReviewDocument>('Review', ReviewSchema)        