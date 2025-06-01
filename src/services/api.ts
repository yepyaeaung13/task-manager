import axios from 'axios'
import { logout } from '../utils/utils'

export const api = axios.create({
    baseURL: 'https://tasks.googleapis.com/tasks/v1',
})

api.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem('google_access_token')
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
})

api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config
  
      if (error.response?.status === 401 && !originalRequest._retry) {
        logout();
      }
  
      return Promise.reject(error)
    }
  )