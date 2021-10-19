import { useContext, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import axios from 'axios'
import Cookies from 'js-cookie'

import { Controllers } from '../components/Controllers'
import { Store } from '../store'

import * as actions from '../store/cart/ActionCreators'

const Shipping = ({ shippingAddress }) => {
  const { state, dispatch } = useContext(Store)

  console.log(shippingAddress);

  const [ address, setAddress ] = useState(shippingAddress?.address || null)
  const [ name, setName ] = useState(shippingAddress?.name || null)

  console.log(address);

  const router = useRouter()

  const onChangeEventAddress = (e:  React.ChangeEvent<{ value: unknown }>) => {
    const value = e.target.value

    if (value.length >= 1) {
      axios.get('https://autocomplete.geocoder.ls.hereapi.com/6.2/suggest.json', {
        'params': {
          'query': value,
          'maxresults': 1,
          'apikey': 'lcYb3A46F8CTF8USOSv-GH9d8CjEDfzJI3antMSTc2E',
        }
      }).then(function (response) {
        const address = response.data.suggestions[0].address;
        const id = response.data.suggestions[0].locationId;

        setAddress({ ...address, locationId: id })
      })
    }
  }

  const onChangeTextInput = (e:  React.ChangeEvent<{ value: unknown }>) => setName(e.target.value)

  const submitHandler = (e) => {
    e.preventDefault()
    const sendData = { name, address }

    dispatch(actions.saveShippingAddress(sendData))
    Cookies.set('shippingAddress', JSON.stringify(sendData))
    router.push('/payment')
  }

  return (
    <div className="form-container relative flex flex-col box-border">
      <Head>
        <title>Shipping Address - Ecommerce</title>
      </Head>
      <div className="relative block flex-col flex-shrink-0 z-10 max-w-full w-96 mx-auto my-0 border border-solid border-border rounded-lg">
        <div className="h-auto min-h-xl overflow-y-hidden flex-grow overflow-hidden px-10 pt-12 pb-9">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-normal">Shipping Address</h1>
          </div>

          <form onSubmit={submitHandler}>
            <Controllers.InputText
              name="firstName"
              id="Email"
              label="Full Name"
              placeholder="Fathur Rohman"
              value={name || ''}
              onChange={onChangeTextInput}
            />

            <Controllers.InputText
              name="address"
              id="Address"
              label="Address"
              placeholder="jl. Karangbawang kawunganten"
              value={address?.district || ''}
              onChange={onChangeEventAddress}
            />

            <Controllers.InputText
              name="city"
              id="City"
              label="City"
              placeholder="Cilacap"
              value={address?.city || ''}
              readOnly
            />

            <Controllers.InputText
              name="postalCode"
              id="PostalCode"
              label="Postal Code"
              placeholder="5432"
              value={address?.postalCode || ''}
              readOnly
            />

            <div className="flex justify-between h-full">
              <button onClick={() => router.push('/cart')} type="button" className="text-primary font-semibold px-5 py-2 rounded-md">Return to Cart</button>
              <button type="submit" className="bg-primary font-semibold px-5 py-2 text-white rounded-md">Payment</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Shipping

Shipping.getInitialProps = async (context) => {
  const shippingAddressInfo = await context.req?.cookies.shippingAddress
  const shippingAddress = shippingAddressInfo ? JSON.parse(shippingAddressInfo) : null

  return { shippingAddress }
}
