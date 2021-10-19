import axios, { AxiosInstance } from 'axios'
import Cookies from 'js-cookie'

const instance: AxiosInstance = axios.create({baseURL: 'http://locahost:3000/api', withCredentials: true})

instance.interceptors.request.use(config => {
  const token = Cookies.get('Authorization')

  if (token) {
    config.headers.common.Authorization = `Bearer ${token}`
  }

  return config
})
