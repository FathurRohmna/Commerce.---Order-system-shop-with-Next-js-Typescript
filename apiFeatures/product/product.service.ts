import { ShopDocument, Shop } from './../shop/shop.model';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductDocument, Product, ReviewDocument, Review } from './product.model';
import { Model } from 'mongoose';

class ProductService {
  constructor(
    private product: Model<ProductDocument> = Product,
    private shop: Model<ShopDocument> = Shop,
    private review: Model<ReviewDocument> = Review
  ) {}

  public async getAllProducts() {
    const allOnSaleProductsAggregate = await this.product.aggregate([
      {
        $match: { onSale: { $gte: 70 }}
      }
    ])

    const topRatedProductAggregate = await this.product.aggregate([
      {
        $match: { rating: { $gte: 3 } }
      }
    ])

    const allProducts = await this.product.find().populate({ path: 'shopId', select: 'name avatar _id' }).exec()

    return {
      onSaleProducts: await this.product.populate(allOnSaleProductsAggregate, { path: 'shopId', select: 'name avatar _id'}),
      topRatedProducts: await this.product.populate(topRatedProductAggregate, { path: 'shopId', select: 'name avatar _id'}),
      allProducts
    }
  }

  public async getProductById(id: string) {
    return await this.product.findOne({ _id: id }).exec()
  }

  public async createProduct(productData: CreateProductDto, shopId: string) {

    const newProduct = new this.product({
      ...productData,
      shopId: shopId
    })

    await newProduct.save()

    const shop = await this.shop.findByIdAndUpdate(
      shopId, 
      { $push: { 'products': newProduct._id }}, 
      { new: true, useFindAndModify: false },
    )
  }

  public async getAllProductsShop(shopId: string) {
    const shop = await this.shop.find({ _id: shopId }).populate('products')

    return shop
  }

  public async createProductReview(productId: string, reviewData: any) {
    const product = await this.product.findById(productId)
    console.log(reviewData.rating);
    console.log(product);
    if (product) {
      const existReview = product.reviews.find((x) => x.user === reviewData.user)
      console.log(existReview);
      if (existReview) {
        await this.product.updateOne(
          { _id: productId, 'reviews.user': existReview.user },
          {
            $set: {
              'reviews.$.comment': reviewData.comment,
              'reviews.$.rating': reviewData.rating
            }
          }
        )

        console.log('Helloo');

        const updatedProduct = await this.product.findById(productId)
        updatedProduct.numReviews = updateProduct.reviews.length
        updatedProduct.rating =
          updatedProduct.reviews.reduce((a, c) > c.rating + a, 0) / updatedProduct.reviews.length

        console.log(updatedProduct.rating);
        await updatedProduct.save()

        return updatedProduct
      } else {
        const review = {
          user: reviewData.user,
          rating: reviewData.rating,
          comment: reviewData.comment
        }
        console.log(review);
        product.reviews.push(review)
        product.numReviews = product.reviews.length
        product.rating =
          product.reviews.reduce((a, c) => c.rating + a, 0) / product.reviews.length 
        console.log(product);
        
        return await product.save()
      }
    } else {
      console.log('Errororr Herrerrerere');
    }
  }

  public async editProductShop(productId: string, productField) {
    const product = await this.product.findOneAndUpdate(
      { _id: productId },
      { $set: productField },
      { new: false }
    ).exec()

    return product
  }

  public async deleteProductById(productId: string) {
    const product = await this.product.findByIdAndRemove(id)

    return product
  }
}

export default ProductService
