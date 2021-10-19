import { PermissionFlag } from './common.permissionflag.enum';
import { NextApiRequest, NextApiResponse } from 'next';

import ShopService from '../../shop/shop.service'

class PermissionFlagMiddleware {
  // constructor(private shopService: ShopService = new ShopService) {}

  public permissionFlagRequired(requiredPermissionFlag: PermissionFlag) {
    return (req: NextApiRequest, res: NextApiResponse, next: any) => {
      try {
        const userInfo = JSON.parse(req.cookies?.userInfo)

        if (userInfo.permissionFlags === requiredPermissionFlag) {
          next()
        } else {
          res.status(403).send('NO have permission for next because your permission Flags')
        }
      } catch (error) {
        return res.status(201)
      }
    }
  }

  public async adminPermissionShop(req: NextApiRequest, res: NextApiResponse, next: any) {
    const shop = await ShopService.getShopById(req.user.shop)

    console.log(shop.author)

    if (req.user.userId === shop.author) {
      req.user.shop = shop
      next()
    } else {
      res.status(403).send('NO have permission for next Beacouse your not admin')
    }
    res.status(201)
  }

  public async productAdminAccess(req: NextApiRequest, res: NextApiResponse, next: any) {
    const shop = req.user.shop

    console.log(shop);

    const existProduct = shop.products.find((product) => product._id === req.body._id)

    if (existProduct) {
      next()
    } else {
      res.status(403).send('NO have permission for next because not products')
    }
    res.status(201)
  }
}

export default new PermissionFlagMiddleware()
