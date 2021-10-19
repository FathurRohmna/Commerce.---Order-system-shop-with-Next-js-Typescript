import { Fragment } from 'react'
import Head from 'next/head'
import Router from 'next/router'
import ProgressBar from '@badrap/bar-of-progress'
import { ResizeObserver } from '@juggle/resize-observer'

import { Title } from '../components/Title' 

import 'tailwindcss/tailwind.css'
import 'react-responsive-carousel/lib/styles/carousel.min.css'

import '../styles/globals.css'
import '../styles/input-number.css'
import { StoreProvider } from '../store/index'

if (typeof window !== 'undefined' && !('ResizeObserver' in window)) {
  window.ResizeObserver = ResizeObserver
}

const progress = new ProgressBar({
  size: 2,
  color: '#f472b6',
  className: 'bar-of-progress',
  delay: 100
})

if (typeof window !== 'undefined') {
  progress.start()
  progress.finish()
}

Router.events.on('routeChangeStart', progress.start)
Router.events.on('routeChangeComplete', () => {
  progress.finish()
  window.scrollTo(0, 0)
})

Router.events.on('routeChangeError', progress.finish)

function MyApp({ Component, pageProps, router }) {
  const meta = Component.layoutProps?.meta || {}
  const description = meta.metaDescription || meta.description || 'Commerce ecommerce Order system'

  return (
    <Fragment>
      <Title suffix="Commerce.">{meta.metaTitle || meta.title}</Title>
      <Head>
        <meta key="twitter:card" name="twitter:card" content="summary_large_image" />
        <meta key="twitter:site" name="twitter:site" content="fathur rohman" />
        <meta key="twitter:description" name="twitter:description" content={description} />
        <meta
          key="twitter:image"
          name="twitter:image"
          content="/card-media.jpg"
        />
        <meta key="twitter:creator" name="twitter:creator" content="fathur rohman" />
        <meta key="og:type" property="og:type" content="article" />
        <meta key="og:description" property="og:description" content={description} />
        <meta
          key="og:image"
          property="og:image"
          content="/card-media.jpg"
        />
      </Head>
      <StoreProvider>
        <Component {...pageProps} />
      </StoreProvider>
    </Fragment>
  )
}

export default MyApp
