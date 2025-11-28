import { defineStore } from 'pinia'
import axios from 'axios'
import { ref } from 'vue'
import Swal from 'sweetalert2'
axios.defaults.baseURL = import.meta.env.VITE_API_URL
export const useUserStore = defineStore('userStore', () => {
  const user = ref()
  const token = ref()
  const users = ref([])

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
    if (users.value && users.value.length > 0) {
      const storedUser = localStorage.getItem('users', JSON.stringify(users.value))
      if (storedUser) {
        users.value = JSON.parse(storedUser)
      }
      return
    }
    if (users.value.length > 0) {
      return
    }
    const res = await axios.get('api/getUsers')
    users.value = res.data.users
    localStorage.setItem('users', JSON.stringify(users.value))
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
          const res = await axios.delete(`/api/delete/${id}`)
          console.log(res)
          const index = users.value.findIndex((u) => u.id === u)
          if (index !== 1) {
            users.value.splice(index, 1)
            localStorage.setItem('users', JSON.stringify(users.value))
          }
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
      formData.append('_method', 'PUT')

      const { data } = await axios.post(`api/update/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      Swal.fire({
        title: 'Updated Successfully!',
        icon: 'success',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
      })
      await getStudents()
      const index = users.value.findIndex((u) => u.id == id)
      if (index !== -1) {
        data.user.profile = `${data.user.profile}?t=${Date.now()}`

        users.value[index] = {
          ...users.value[index],
          ...data.user,
        }

        localStorage.setItem('users', JSON.stringify(users.value))
      }

      return { success: true, data: data.user }
    } catch (error) {
      Swal.fire({
        title: 'Update Failed',
        text: error.response?.data?.message || 'Something went wrong!',
        icon: 'error',
      })
      return { success: false }
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
