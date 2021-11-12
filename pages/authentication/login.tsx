import { useContext, useEffect, useState } from 'react'
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
  email: string
  password: string
}

const loginSchema = yup.object().shape({
  email: yup.string().required().email(),
  password: yup.string().required()
})

export default function Login() {
  const { state, dispatch } = useContext(Store)
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<FormValues>({
    resolver: yupResolver(loginSchema)
  })
  const router = useRouter()

  const [notify, setNotify] = useState({isOpen: false, message: '', type: ''})

  useEffect(() => {
    register('email')
    register('password')
  }, [])

  const onChangeEvent = (e:  React.ChangeEvent<{ value: unknown }>) => setValue(e.target.name, e.target.value)

  const onSubmit: SubmitHandler<FormValues> = data => submitHandler(data)

  const submitHandler = async (data) => {
    dispatch(actions.authLogged())
    try {
      const { email, password } = data
      const response = await axios.post('/api/authentication/login', {
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
        dispatch(actions.userLogin(response.data.user))

        const cookie = response.data.tokenData
        const { permissionFlags, userId, email, shop } = jwt_decode(cookie.token)
        const userInfo = { permissionFlags, userId, email, shop }

        Cookies.set('Authorization', cookie.token, { expires: cookie.expiresIn})
        Cookies.set('RefreshToken', cookie.refreshToken, { expires: cookie.expiresIn})
        Cookies.set('userInfo', JSON.stringify(userInfo), { expires: cookie.expiresIn})
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
        <title>Create Shop - Ecommerce</title>
      </Head>
      <Notification
        notify={notify}
        setNotify={setNotify}
      />
      <div className="form-container relative flex flex-col box-border">
        <div className="relative block flex-col flex-shrink-0 z-10 max-w-full w-xl mx-auto my-0 border border-solid border-border rounded-lg">
          <div className="h-auto min-h-xl overflow-y-hidden flex-grow overflow-hidden px-10 pt-12 pb-9">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-normal">Login</h1>
              <p className="text-base">Gunakan Akun Email Anda</p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Controllers.InputText
                name="email"
                id="Email"
                label="Email"
                placeholder="fr081938@gmail.example.com"
                onChange={onChangeEvent}
                error={errors.email && errors.email.message}
              />
              <Controllers.InputText
                name="password"
                id="Password"
                label="Password"
                type="password"
                placeholder="*********"
                onChange={onChangeEvent}
                error={errors.password && errors.password.message}
              />
              <p className="my-4 py-6 text-justify">Pastikan akun email yang anda gunakan sudah terdaftar pada sistem kami.</p>
              <div className="flex justify-between h-full">
                <Link href="/authentication/register">
                  <a className="mb-0 py-2 font-semibold text-primary cursor-pointer">Buat akun</a>
                </Link>
                <button type="submit" className="bg-primary font-semibold px-5 py-2 text-white rounded-md">Login</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
