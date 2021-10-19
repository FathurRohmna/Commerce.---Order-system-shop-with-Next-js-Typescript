import axios, { AxiosInstance } from 'axios'
import Cookies from 'js-cookie'

const instance: AxiosInstance = axios.create({baseURL: process.env.API_URL, withCredentials: true})

instance.interceptors.request.use(config => {
  const token = Cookies.get('Authorization')

  if (token) {
    config.headers.common.Authorization = `Bearer ${token}`
  }

  return config
})

export default instance