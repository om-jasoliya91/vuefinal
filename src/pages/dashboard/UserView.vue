<script setup>
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import Swal from 'sweetalert2'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

// Validation Schema
const schema = yup.object({
  firstname: yup.string().required('First Name is required'),
  lastname: yup.string().required('Last Name is required'),
  email: yup.string().email('Invalid Email').required('Email is required'),
  password: yup.string().min(6, 'Min 6 characters').required('Password is required'),
  dob: yup.string().required('Date of birth is required'),
  gender: yup.string().required('Gender is required'),
  phone: yup
    .string()
    .matches(/^[0-9]{10}$/, 'Phone must be 10 digits')
    .required('Phone is required'),
  profile: yup.mixed().required('Profile image is required'),
})

// Vee Validate helper
const { handleSubmit, resetForm } = useForm({
  validationSchema: schema,
})

// Fields
const { value: firstname, errorMessage: firstnameError } = useField('firstname')
const { value: lastname, errorMessage: lastnameError } = useField('lastname')
const { value: email, errorMessage: emailError } = useField('email')
const { value: password, errorMessage: passwordError } = useField('password')
const { value: dob, errorMessage: dobError } = useField('dob')
const { value: gender, errorMessage: genderError } = useField('gender')
const { value: phone, errorMessage: phoneError } = useField('phone')
const { value: profile, errorMessage: profileError } = useField('profile')

// Handle file input
function handleFile(e) {
  profile.value = e.target.files[0]
}

// Submit form
const submitForm = handleSubmit(async () => {
  const formData = new FormData()

  formData.append('firstname', firstname.value)
  formData.append('lastname', lastname.value)
  formData.append('email', email.value)
  formData.append('password', password.value)
  formData.append('dob', dob.value)
  formData.append('gender', gender.value)
  formData.append('phone', phone.value)
  formData.append('profile', profile.value)

  const result = await auth.register(formData)

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
        <input v-model="firstname" class="form-control" type="text" />
        <small class="text-danger">{{ firstnameError }}</small>
      </div>

      <div class="mb-2">
        <label>Last Name</label>
        <input v-model="lastname" class="form-control" type="text" />
        <small class="text-danger">{{ lastnameError }}</small>
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

      <div class="mb-2">
        <label>Date of Birth</label>
        <input v-model="dob" class="form-control" type="date" />
        <small class="text-danger">{{ dobError }}</small>
      </div>

      <div class="mb-2">
        <label>Gender</label>
        <select v-model="gender" class="form-control">
          <option value="">Select Gender</option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>
        <small class="text-danger">{{ genderError }}</small>
      </div>

      <div class="mb-2">
        <label>Phone</label>
        <input v-model="phone" class="form-control" type="text" />
        <small class="text-danger">{{ phoneError }}</small>
      </div>

      <div class="mb-3">
        <label>Profile Image</label>
        <input type="file" class="form-control" @change="handleFile" />
        <small class="text-danger">{{ profileError }}</small>
      </div>

      <button class="btn btn-primary w-100">Register</button>
      <div class="text-center mt-2">
        <router-link to="/login">Already have an account?</router-link>
      </div>
    </form>
  </div>
</template>

<style scoped></style>
