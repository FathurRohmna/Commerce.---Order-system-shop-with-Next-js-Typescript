import faker from 'faker' 

export const getProducts = () => {
  var data = []
  var size = ["S", "M", "L", "XL", "XLL"]
  var tag = ["Javascript", "Vegetable", "Hello", " Programming"]
  var sale = [0, 10, 20, 30, 40, 50, 60, 80, 70, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  faker.seed(100)

  for (let i = 1; i <= 503; i++) {
    var size = faker.helpers.randomize(size)
    var tag = faker.helpers.randomize(tag)
    var onSale = faker.helpers.randomize(sale)
    data.push({
      _id: faker.datatype.uuid(),
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: faker.commerce.price(),
      size: size,
      color: faker.commerce.color(),
      rating: faker.datatype.number(5),
      imagesUrls: faker.image.imageUrl(),
      count: faker.datatype.number(100),
      onSale: onSale,
      brand: faker.commerce.department(),
      tag: tag
    }) 
  }

  return data
}
