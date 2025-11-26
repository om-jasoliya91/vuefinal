<script setup>
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import Swal from 'sweetalert2'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const auth = useUserStore()

// Validation Schema
const schema = yup.object({
  name: yup.string().required('First Name is required'),
  email: yup.string().email('Invalid Email').required('Email is required'),
  password: yup.string().min(6, 'Min 6 characters').required('Password is required'),
})

// Vee Validate helper
const { handleSubmit, resetForm } = useForm({
  validationSchema: schema,
})

// Fields
const { value: name, errorMessage: nameError } = useField('name')
const { value: email, errorMessage: emailError } = useField('email')
const { value: password, errorMessage: passwordError } = useField('password')

// Submit form
const submitForm = handleSubmit(async () => {
  const formData = new FormData()

  formData.append('name', name.value)
  formData.append('email', email.value)
  formData.append('password', password.value)

  await auth.register(formData)

  Swal.fire({
    icon: 'success',
    title: 'Registered Successfully!',
    timer: 2000,
    position: 'top-end',
    toast: true,
    showConfirmButton: false,
  })

  resetForm()
  router.push('/login')
})
</script>

<template>
  <div class="container my-5" style="max-width: 600px">
    <h2 class="text-center text-primary">Register</h2>

    <form @submit.prevent="submitForm">
      <div class="mb-2">
        <label>First Name</label>
        <input v-model="name" class="form-control" type="text" />
        <small class="text-danger">{{ nameError }}</small>
      </div>

      <div class="mb-2">
        <label>Email</label>
        <input v-model="email" class="form-control" type="email" />
        <small class="text-danger">{{ emailError }}</small>
      </div>

      <div class="mb-2">
        <label>Password</label>
        <input v-model="password" class="form-control" type="password" />
        <small class="text-danger">{{ passwordError }}</small>
      </div>

      <button class="btn btn-primary w-100">Register</button>
      <div class="text-center mt-2">
        <router-link to="/login">Already have an account?</router-link>
      </div>
    </form>
  </div>
</template>

<style scoped></style>
