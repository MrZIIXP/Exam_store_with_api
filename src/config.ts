import axios from 'axios'

export const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

API.interceptors.request.use(config => {
  const token = localStorage.getItem('account')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

API.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('account')    
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export const regApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

let adminToken = null

export const getAdminToken = async () => {
  try {
    const response = await regApi.post('Account/login', {
      userName: import.meta.env.VITE_ADMIN_USERNAME,
      password: import.meta.env.VITE_ADMIN_PASSWORD
    })
    adminToken = response.data.data
    return adminToken
  } catch (error) {
    console.error('Admin login failed:', error)
    throw error
  }
}

export const createAccountWithAdmin = async (userData: any) => {
  if (!adminToken) {
    await getAdminToken()
  }
  
  const response = await regApi.post('Account/register', userData, {
    headers: {
      Authorization: `Bearer ${adminToken}`
    }
  })
  
  adminToken = null
  
  return response.data
}