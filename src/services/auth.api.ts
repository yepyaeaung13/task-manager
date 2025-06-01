import axios from 'axios'
import { logout } from '../utils/utils'

export const authApi = axios.create({
    baseURL: 'https://www.googleapis.com/oauth2/v3',
})


authApi.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem('google_access_token')
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
})

authApi.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config
  
      if (error.response?.status === 401 && !originalRequest._retry) {
        logout();
      }
  
      return Promise.reject(error)
    }
  )