export class CreateProductDto {
  name: string 
  description: string
  price: number
  imageUrls: string
  count: number
  onSale?: number
}