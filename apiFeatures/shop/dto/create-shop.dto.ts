class Address {
  street: string
  zipCode: number
  city: string
  state: string 
  country: string
  locationId: string
}

export class CreateShopDto {
  name: string
  address: Address
  authorId: string
}