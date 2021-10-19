import Link from 'next/link'

import { AiFillProject, AiFillTags, AiFillShopping, AiFillSafetyCertificate } from 'react-icons/ai'

export default function AdminSidebar() {
  return (
    <div className="fixed w-56 left-0 top-0 h-full bg-white py-8 flex content-center shadow-md">
      <div className="relative w-full h-full">
        <ul className="flex flex-col py-4">
          <li>
            <Link href="/shop-admin/orders">
              <a className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800">
                <AiFillTags size={30} />
                <p className="ml-2 leading-5 font-bold">Orders</p>
              </a>
            </Link>
          </li>
          <li>
            <Link href="/shop-admin/products">
              <a className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800">
                <AiFillShopping size={30} />
                <p className="ml-2 leading-5 font-bold">Products</p>
              </a>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  )
}