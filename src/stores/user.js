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
  const users = ref([])
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
      user.value = res.data.data

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
  async function addStudent(formData) {
    const data = await axios.post('api/createUser', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    console.log('Request data:', data)
  }

  const getStudents = async () => {
    const res = await axios.get('api/getUsers')
    users.value = res.data.users
  }
  const deleteStudent = async (id) => {
    Swal.fire({
      title: 'Are You Sure You Want To Delete This Student?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axios.post(`/api/delete/${id}`)
          console.log(res)
          getStudents()

          Swal.fire({
            title: 'User Deleted successfully',
            icon: 'success',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
          })
        } catch {
          Swal.fire({
            title: 'Error!',
            text: 'There was a problem deleting the student.',
            icon: 'error',
            position: 'top-end',
            toast: true,
          })
        }
      }
    })
  }

  const updateStudent = async (id, formData) => {
    try {
      const res = await axios.post(`api/update/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      if (res.data.message === 'Profile updated successfully') {
        Swal.fire({
          title: 'Profile Updated Successfully',
          icon: 'success',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
        })
        getStudents() // Refresh the list of students if needed
      }
    } catch (error) {
      Swal.fire({
        title: 'Update Failed',
        text: error.response?.data?.message || 'There was an error updating the profile.',
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
    users,
    register,
    logout,
    loginUser,
    addStudent,
    getStudents,
    deleteStudent,
    updateStudent,
  }
})
