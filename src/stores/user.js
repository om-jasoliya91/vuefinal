import { defineStore } from 'pinia'
import axios from 'axios'
import { ref } from 'vue'
import Swal from 'sweetalert2'

// ------------------ GLOBAL AXIOS SETTINGS ------------------
axios.defaults.baseURL = import.meta.env.VITE_API_URL

// This adds Authorization Bearer token automatically on every request
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const useUserStore = defineStore('userStore', () => {
  const user = ref()
  const token = ref()
  // REGISTER
  const register = async (formData) => {
    try {
      const res = await axios.post('api/register', formData)
      return { success: true, data: res.data }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || 'Something went wrong',
      }
    }
  }
  const loginUser = async (credentials) => {
    try {
      const res = await axios.post('api/login', credentials)
      Swal.fire({
        title: 'Login Successgully ',
        text: 'Welcome Back',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
      })
      token.value = res.data.token
      user.value = res.data.user

      localStorage.setItem('token', res.data.token)

      return { success: true, data: res.data }
    } catch (error) {
      Swal.fire({
        title: 'Login Faild',
        text: error.response?.data?.message || 'Please Check Your Credentials',
        icon: 'error',
      })
    }
  }

  const logout = async () => {
    try {
      await axios.post('api/logout') // token automatically added by interceptor
    } catch (e) {
      console.log('Logout Error:', e.response?.data)
    }

    user.value = null
    token.value = null
    localStorage.removeItem('token')
  }

  return {
    user,
    token,
    register,
    logout,
    loginUser,
  }
})
