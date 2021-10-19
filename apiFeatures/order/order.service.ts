import { ShopDocument, Shop } from './../shop/shop.model';
import { ProductDocument, Product } from './../product/product.model';
import { CreateOrderDTO } from './dto/create-order.dto';
import { OrderDocument, ProductOrderDocument, Order, ProductOrder } from './order.model';
import { User, UserDocument } from './../user/user.model'
import { Model } from 'mongoose';

class OrderService {
  constructor(
    private order: Model<OrderDocument> = Order,
    private product: Model<ProductDocument> = Product,
    private shop: Model<ShopDocument> = Shop,
    private user: Model<UserDocument> = User,
    private productOrder: Model<ProductOrderDocument> = ProductOrder
  ) {}

  private async getOrderById(id: string) {
    const order = await this.order.findOne({ _id: id }).exec()

    return order
  }

  public async getOrderByUserId(id: string) {
    const orders = await this.order.find({ user: id }).exec()

    console.log(orders);

    return orders
  }

  public async createOrder(orderData: CreateOrderDTO) {
    const orderItemsData = orderData.orderItems
    const orderItems = orderItemsData.map(orderItem => ({
      productId: orderItem.productId,
      quantity: orderItem.quantity,
      status: 1,
      address: orderData.shippingAddress
    }))
    console.log(orderItems);

    const newOrderProducts = await this.productOrder.insertMany(orderItems)
    const newOrderProductIds = newOrderProducts.map(newOrderProduct => newOrderProduct._id)
    console.log(newOrderProductIds);

    const newOrder = await this.order.create({
      orderItems: newOrderProductIds,
      user: orderData.user,
      shippingAddress: orderData.shippingAddress,
      paymentMethod: orderData.paymentMethod,
      cartItems: orderData.cartItems,
      cartPrice: orderData.cartPrice
    })
    console.log(newOrder);

    await this.user.findOneAndUpdate(
      { email: orderData.user },
      { $push: {
        'orderHistory': newOrder._id
      }}
    )

    for (let index = 0; index < orderItemsData.length; index++) {
      const shopId = orderItemsData[index].shopId
      const productId = orderItemsData[index].productId
      const quantity = orderItemsData[index].quantity

      await this.shop.findByIdAndUpdate(
        shopId, 
        { $push: { 
          'orders': newOrderProductIds[index]
        }
      })
      
      await this.product.findByIdAndUpdate(
        productId,
        { $inc: { 'count' : -quantity }}
      )
    }

    return newOrder
  }

  public async editOrderShop(orderId: string, orderField) {
    const order = await this.productOrder.findOneAndUpdate(
      { _id: orderId },
      { $set: orderField },
      { new: false }
    ).exec()

    return order
  }
}

export default OrderService
