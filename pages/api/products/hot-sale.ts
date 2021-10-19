import { getProducts } from './../../../utils/dummy-data';
import { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'
import faker from 'faker'

const handler = nc<NextApiRequest, NextApiResponse>()

handler.get((req, res) => {
  const allData = getProducts()

  const hotSale = allData.filter((item) => item.rating === 5 && item.onSale >= 60).sort((a, b) => b.onSale - a.onSale ).slice(0, 11)

  res.status(200).json({ data: hotSale })
})

export default handler 