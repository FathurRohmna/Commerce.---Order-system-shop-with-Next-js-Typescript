import Cookies from 'js-cookie'
import decode from 'jwt-decode'

export function checkUserAuth() {
  const token = Cookies.get('Authorization')

  if (!token) return false

  try {
    const { exp } = decode(token)

    if (exp < new Date().getTime() / 1000) {
      return false
    }
    
  } catch (error) {
    return false
  }

  return true
}
