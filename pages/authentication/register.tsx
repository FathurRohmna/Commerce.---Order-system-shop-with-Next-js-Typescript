/* eslint-disable @next/next/link-passhref */
import { useContext, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Head from 'next/head'
import { useRouter } from 'next/router'

import { useForm, SubmitHandler } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

import axios from 'axios'
import Cookies from 'js-cookie'
import jwt_decode from 'jwt-decode'

import { Store } from '../../store'
import * as actions from '../../store/auth/ActionCreators'
import { Controllers } from '../../components/Controllers'
import { Notification } from '../../components/Notification'

type FormValues = {
  firstName: string
  lastName: string 
  email: password
  password: string
}

const registerSchema = yup.object().shape({
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  email: yup.string().required().email(),
  password: yup.string().required(),
  confirmPassword: yup.string().required()
})

export default function Register() {
  const { state, dispatch } = useContext(Store)
  const { register, handleSubmit, formState: { errors }, setValue} = useForm<FormValues>({
    resolver: yupResolver(registerSchema)
  })
  const router = useRouter()

  const [notify, setNotify] = useState({isOpen: false, message: '', type: ''})

  useEffect(() => {
    register('firstName')
    register('lastName')
    register('email')
    register('password')
    register('confirmPassword')
  }, [])

  const onChangeEvent = (e:  React.ChangeEvent<{ value: unknown }>) => setValue(e.target.name, e.target.value)

  const onSubmit: SubmitHandler<FormValues> = data => submitHandler(data);

  const submitHandler = async (data) => {
    dispatch(actions.authLogged())
    try {
      const { firstName, lastName, email, password } = data
      const response = await axios.post('/api/authentication/register', {
        firstName,
        lastName,
        email,
        password 
      }).catch(function (error) {
        if (error) {
          return error
        }
      })

      if (response.response) {
        dispatch(actions.authFail(response.response.data))
        setNotify({
          isOpen: true,
          message: response.response.data.error_msg,
          type: 'error'
        })
      } else {
        dispatch(actions.userRegister(response.data.user))

        const cookie = response.data.tokenData
        const { permissionFlags, userId, email, shop } = jwt_decode(cookie.token)
        const userInfo = { permissionFlags, userId, email, shop }

        Cookies.set('Authorization', cookie.token, { expires: cookie.expiresIn})
        Cookies.set('RefreshToken', cookie.refreshToken, { expires: cookie.expiresIn})
        Cookies.set('userInfo', JSON.stringify(userInfo))
        setNotify({
          isOpen: true,
          message: `Register Success Waiting.....`,
          type: 'success'
        })
        router.push('/')
      }
    } catch (error) {
      dispatch(actions.authFail(error.message))
      setNotify({
        isOpen: true,
        message: error.message,
        type: 'error'
      })
    }
  }

  return (
    <>
      <Head>
        <title>Register - Ecommerce</title>
      </Head>
      <Notification
        notify={notify}
        setNotify={setNotify}
      />
      <div className="form-container relative flex flex-col box-border">
        <div className="relative block flex-col flex-shrink-0 max-w-full w-register mx-auto my-0 border border-solid border-border rounded-lg">
          <div className="h-auto flex min-h-xl overflow-y-hidden flex-grow overflow-hidden px-10 pt-12 pb-9">
            <div>
              <div className="text-left mb-8 w-xl mr-5">
                <h1 className="text-3xl font-semibold">Create your Account here</h1>
                <p className="text-base"></p>
              </div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="my-4 relative pr-4">
                  <div className="grid w-full grid-cols-2 gap-4">
                    <Controllers.InputText
                      name="firstName"
                      id="FirstName"
                      label="First Name"
                      small
                      placeholder="First Name"
                      onChange={onChangeEvent}
                      error={errors.firstName && errors.firstName.message}
                    />
                    <Controllers.InputText
                      name="lastName"
                      id="LastName"
                      label="Last Name"
                      small
                      placeholder="Last Name"
                      onChange={onChangeEvent}
                      error={errors.lastName && errors.lastName.message}
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <Controllers.InputText
                      name="email"
                      id="Email"
                      label="Email"
                      small
                      placeholder="Email"
                      onChange={onChangeEvent}
                      error={errors.email && errors.email.message}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Controllers.InputText
                      name="password"
                      id="Password"
                      label="Password"
                      small
                      placeholder="Password"
                      onChange={onChangeEvent}
                      error={errors.password && errors.password.message}
                    />
                    <Controllers.InputText
                      name="confirmPassword"
                      id="ConfirmPassword"
                      label="Confirm Password"
                      small
                      placeholder="Confirm Password"
                      onChange={onChangeEvent}
                      error={errors.confirmPassword && errors.confirmPassword.message}
                    />
                  </div>
                </div>
                <div className="flex justify-between">
                  <Link href="/authentication/login">
                    <p className="mb-0 py-2 font-semibold text-primary cursor-pointer">Login</p>
                  </Link>
                  <button disabled={state.isLoading ? true : false} type="submit" className="bg-primary font-semibold px-5 py-2 text-white rounded-md">Register</button>
                </div>
              </form>
            </div>
            <div className="relative h-full">
              <Image className="flex items-center" src='/vercel.svg' width="200" height="100" alt="Here we goo" />
            </div>
          </div>
        </div>
      </div>
      
    </>
  )
}
