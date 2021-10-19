import { Fragment, useState, useContext } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import Head from 'next/head'

import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'

import { Store } from '../store'
import * as actions from '../store/cart/ActionCreators'

const methods = [
  {
    id: 1,
    name: 'PayPal',
  },
  {
    id: 2,
    name: 'Stripe',
  },
  {
    id: 3,
    name: 'Cash',
  }
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Payment() {
  const { state, dispatch } = useContext(Store)
  const [selected, setSelected] = useState(methods[2])

  const router = useRouter()

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(actions.savePaymentMethod(selected.name))
    router.push('/placeorder')
  }

  return (
    <div className="form-container relative flex flex-col box-border">
      <Head>
        <title>Payment - Ecommerce</title>
      </Head>
      <div className="relative block flex-col flex-shrink-0 z-10 max-w-full w-96 mx-auto my-0 border border-solid border-border rounded-lg">
        <div className="text-center mb-8 pt-12">
          <h1 className="text-3xl font-normal">Payment Methods</h1>
        </div>
        <form onSubmit={submitHandler}>
          <div className="min-h-xl overflow-y-hidden flex-grow overflow-hidden px-10 pb-9 h-full">
            <Listbox value={selected} onChange={setSelected} className="my-2">
              {({ open }) => (
                <>
                  <div className="mt-1 relative">
                    <Listbox.Button className="relative w-full bg-white border border-border rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo sm:text-sm">
                      <span className="flex items-center">
                        <span className="ml-3 block truncate">{selected.name}</span>
                      </span>
                      <span className="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </span>
                    </Listbox.Button>

                    <Transition
                      show={open}
                      as={Fragment}
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-56 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                        {methods.map((method) => (
                          <Listbox.Option
                            key={method.id}
                            className={({ active }) => 
                              classNames(
                                active ? 'text-white bg-indigo-600' : 'text-gray-900', 'cursor-default select-none relative py-2 pl-3 pr-9'
                              )
                            }
                            value={method}
                          >
                            {({ selected, active }) => (
                              <>
                                <div className="flex items-center">
                                  <span
                                    className={classNames(selected ? 'font-semibold' : 'font-normal', 'ml-3 block truncate')}
                                  >
                                    {method.name}
                                  </span>
                                </div>

                                {selected ? (
                                  <span
                                    className={classNames(
                                      active ? 'text-white' : 'text-indigo-600', 'absolute inset-y-0 right-0 flex items-center pr-4'
                                    )}
                                  >
                                    <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                  </span>
                                ) : null }
                              </>
                            )}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </Transition>
                  </div>
                </>
              )}
            </Listbox>
            <div className="flex justify-end align-bottom items-end mt-12 h-full">
              <button type="submit" className="bg-primary font-semibold px-5 py-2 text-white rounded-md">Place Order</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}