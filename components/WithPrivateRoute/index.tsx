/* eslint-disable import/no-anonymous-default-export */
import React from 'react'
import Router from 'next/router'

import { checkUserAuth } from '../../helper/isAuthenticatedUser'

const home = '/'

export default WrappedComponent => {
  const hocComponent = ({ ...props }) => <WrappedComponent {...props} />
  
  hocComponent.getInitialProps = async (context) => {
    const userInfoCookie = await context.req?.cookies.userInfo
    const userInfo = userInfoCookie ? JSON.parse(userInfoCookie) : null

    if (userInfo === null || userInfo?.permissionFlags !== 5) {
      if (context.res) {
        context.res?.writeHead(302, {
          Location: home
        })
        context.res?.end()
      } else {
        Router.replace(home)
      }
    } else if (WrappedComponent.getInitialProps) {
      const wrappedProps = await WrappedComponent.getInitialProps({...context})

      return { ...wrappedProps, userInfo }
    }
    
    return { userInfo }
  }

  return hocComponent
}
