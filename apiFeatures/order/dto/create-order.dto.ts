
export class CreateOrderDTO {
  user: string
  orderItems: []
  shippingAddress: {
    name: string
    address: {
      country: string
      city: string
      district: string
      postalCode: string
      locationId: string
    }
  }
  paymentMethod: string
  cartItems: number
  cartPrice: number
}
