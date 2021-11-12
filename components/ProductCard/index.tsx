import Link from 'next/link'
import Image from 'next/image'

import StarRating from 'react-star-ratings'

interface Props {
  product: any
  onClick: () => void
}

const ProductCard = (props: Props) => {
  const product = props.product
  const onClick = props.onClick

  return (
    <div className="relative w-56 border rounded-lg shadow pb-2 bg-white">
      <Link href={`/product/${product._id}`}>
        <a>
          <div className="relative h-56 flex items-center bg-gray-400 rounded-lg">
            <Image src={product.imagesUrls || '/vercel.svg'} layout="fill" alt="Here we goo" />
          </div>
        </a>
      </Link>
      <div className="p-2">
        <h4>{product.name}</h4>
        <h4 className="m-0">Rp. {product.price}</h4>
        <div className="mt-1">
          <StarRating
            className="w-12"
            name="small-rating"
            totalStars={5}
            starDimension="8px"
            starRatedColor="yellow"
            starSpacing="1px"
            rating={product.rating | 0}
          />
        </div>
        <p className="mt-1">Count: <b>{product.count}</b> Peaces</p>
      </div>
      <Link href={`/shop/${product.shopId?._id}`}>
        <a>
          <div className="flex p-2 items-center">
            <Image src={product.shopId?.avatar || '/vercel.svg'} width="20" height="20" alt="Shop Avatar" />
            <p className="text-xs ml-1 m-0">{product.shopId?.name || 'Hello'}</p>
          </div>
        </a>
      </Link>
      <div className="w-full flex justify-end px-4">
        <button 
          onClick={onClick}
          disabled={product.addedToCart ? true : false}
          className={`font-semibold px-3 py-2 text-white rounded-md shadow ${product.addedToCart ? 'bg-gray-500 border border-gray-400' : 'bg-primary'}`}
        >
          {product.addedToCart ? 'Added' : 'Add to Cart'}
        </button>
      </div>
    </div>
  )
}

export default ProductCard
