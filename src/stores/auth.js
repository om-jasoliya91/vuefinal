import { defineStore } from 'pinia'
import axios from 'axios'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || null)
  const user = ref(null)

  // set axios token if exists on refresh
  if (token.value) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
  }

  // Register
  async function register(formData) {
    await axios.post('http://localhost:8000/api/register', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  }

  // Login
  async function login(email, password) {
    const res = await axios.post('http://localhost:8000/api/login', { email, password })
    user.value = res.data.user
    token.value = res.data.token

    localStorage.setItem('token', token.value)
    axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
  }

  // Get current logged in user
  async function getUser() {
    if (!token.value) return
    const res = await axios.get('http://localhost:8000/api/user')
    user.value = res.data
  }

  // Logout
  async function logout() {
    try {
      await axios.post('http://localhost:8000/api/logout')
    } catch (error) {
      console.log('Logout error:', error)
    }

    // Clear authentication
    user.value = null
    token.value = null
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
  }

  return {
    token,
    user,
    register,
    login,
    getUser,
    logout,
  }
})
