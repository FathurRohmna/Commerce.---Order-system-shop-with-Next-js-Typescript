import { useState, useContext } from 'react'
import axios from 'axios'
import Head from 'next/head'
import jwt_decode from 'jwt-decode'
import Cookies from 'js-cookie'

import { Controllers } from '../../components/Controllers'
import { Store } from '../../store'

export default function CreateShop() {
  const { state, dispatch } = useContext(Store)
  const [address, setAddress] = useState(null)
  const [name, setName] = useState(null)

  const user = state.auth

  const submitHandler = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('/api/authentication/create-shop', {
        authorId: user.userId,
        address: {
          street: address.district,
          zipCode: address.postalCode,
          city: address.city,
          state: address.county,
          country: address.country,
          locationId: address.locationId,
        },
        name: name
      }).catch(function (error) {
        if (error) {
          console.log(error.message);
        }
      })

      if (response.response) {
        console.log(response.response.data)
      } else {
        const cookie = response.data.tokenData
        const { permissionFlags, userId, email, shop } = jwt_decode(cookie.token)
        const userInfo = { permissionFlags, userId, email, shop }

        Cookies.set('Authorization', cookie.token, { expires: cookie.expiresIn})
        Cookies.set('RefreshToken', cookie.refreshToken, { expires: cookie.expiresIn})
        Cookies.set('userInfo', JSON.stringify(userInfo))
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  const onChangeEvent = (e:  React.ChangeEvent<{ value: unknown }>) => setName(e.target.value)

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

        setAddress({...address, locationId: id})
      })
    }
  }

  console.log(address);

  return (
    <div className="form-container relative flex flex-col box-border">
      <Head>
        <title>Create Shop - Ecommerce</title>
      </Head>
      <div className="relative block flex-col flex-shrink-0 max-w-full w-register mx-auto my-0 border border-solid border-border rounded-lg">
        <div className="h-auto flex min-h-xl overflow-y-hidden flex-grow overflow-hidden px-10 pt-12 pb-9">
          <div>
            <div className="text-left mb-8 w-xl mr-5">
              <h1 className="text-3xl font-semibold">Create your Shop here</h1>
              <p className="text-base"></p>
            </div>
            <form onSubmit={submitHandler}>
              <div className="my-4 relative pr-4">
                <div className="grid w-full grid-cols-2 gap-4">
                  <Controllers.InputText
                    name="authorId"
                    id="AuthorId"
                    label="Author Id"
                    placeholder="Author Id"
                    readOnly
                    small
                    value={user?.userId}
                  />
                  <Controllers.InputText
                      name="namaToko"
                      id="NamaToko"
                      label="Nama Toko"
                      small
                      placeholder="Name Toko"
                      onChange={onChangeEvent}
                      value={name}
                    />
                </div>
                <div className="grid w-full gap-1">
                  <Controllers.InputText
                      name="address"
                      id="Address"
                      label="Address"
                      small
                      placeholder="exp. Kawunganten Cilacap Jawa Tengah Indonesia"
                      onChange={onChangeEventAddress}
                      required
                    />
                </div>
                <div className="grid w-full grid-cols-2 gap-4 text-gray-400">
                  <Controllers.InputText
                    name="street"
                    id="Street"
                    label="Street"
                    placeholder="Street"
                    readOnly
                    small
                    value={address?.district || ''}
                    required
                  />
                  <Controllers.InputText
                      name="zipCode"
                      id="Zip Code"
                      label="Zip Code"
                      readOnly
                      small
                      placeholder="Zip Code"
                      value={address?.postalCode || ''}
                      required
                    />
                </div>
                <div className="grid w-full grid-cols-2 gap-4 text-gray-400">
                  <Controllers.InputText
                    name="city"
                    id="City"
                    label="City"
                    placeholder="City"
                    readOnly
                    small
                    value={address?.city || ''}
                    required
                  />
                  <Controllers.InputText
                      name="state"
                      id="State"
                      label="State"
                      readOnly
                      small
                      placeholder="State"
                      value={address?.county || ''}
                      required
                    />
                </div>
                <div className="grid w-full grid-cols-2 gap-4 text-gray-400">
                  <Controllers.InputText
                    name="country"
                    id="Country"
                    label="Country"
                    placeholder="Country"
                    readOnly
                    small
                    value={address?.country || ''}
                    required
                  />
                  <Controllers.InputText
                    name="locationId"
                    id="LocationId"
                    label="LocationId"
                    placeholder="LocationId"
                    readOnly
                    small
                    value={address?.locationId || ''}
                    required
                  />
                </div>
                <div className="flex justify-between h-full">
                  <p className="mb-0 py-2 font-semibold text-error cursor-pointer">Cancel</p>
                  <button type="submit" className="bg-primary font-semibold px-5 py-2 text-white rounded-md">Buat Toko</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
} 