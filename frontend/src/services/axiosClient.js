import axios from 'axios'

const axiosClient = axios.create({
    baseURL: 'http://localhost:8000/api',
    timeout: 10000
})

// Request interceptor: attach JWT token to every request
axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token')

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`
        }

        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Response interceptor: handle 401 Unauthorized (expired / invalid token)
axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token')
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

export default axiosClient