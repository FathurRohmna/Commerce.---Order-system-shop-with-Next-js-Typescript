import { ProductDocument, Product } from './../product/product.model';
import { User, UserDocument } from './../user/user.model';
import { CreateShopDto } from './dto/create-shop.dto';
import { Shop, ShopDocument } from './shop.model';
import { Model } from 'mongoose';

class ShopService {
  constructor(
    private shop: Model<ShopDocument> = Shop,
    private user: Model<UserDocument> = User,
    private product: Model<ProductDocument> = Product
  ) {}

  public async createShop(data: CreateShopDto) {
    const newShop = new this.shop({
      ...data,
      name: data.name,
      author: data.authorId
    })

    await newShop.save()

    await this.user.updateOne({ '_id': data.authorId }, { $set: { shop: newShop._id, permissionFlags: 5 }})

    return await this.user.findOne({ _id: data.authorId }).exec()
  }

  public async getShopById(id: string) {
    const shop = await this.shop.findOne({ _id: id }).populate({ path: 'products', model: 'Product' }).select('name author address products avatar')

    return shop
  }

  public async getProductsShop(id: string, limit, page) {
    const productsLength = await this.product.find({ shopId: id }).countDocuments()

    const products = await this.shop.findOne({ _id: id }).populate({ path: 'products', model: 'Product' }).select('products')

    return { products, productsLength }
  }

  public async getOrdersShop(id: string) {
    const orders = await this.shop.findOne({ _id: id }).select('orders').populate({
      path: 'orders',
      model: 'ProductOrder',
      populate: {
        path: 'productId',
        model: 'Product'
      } 
    })
    return { orders }
  }

}

export default new ShopService()
