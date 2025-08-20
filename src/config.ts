import axios from 'axios'

export const API = axios.create({
	baseURL: 'http://37.27.29.18:8002/',
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
