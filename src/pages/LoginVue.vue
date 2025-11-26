<script setup>
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'

const router = useRouter()
const userStore = useUserStore()

// Validation Schema (YUP)
const schema = yup.object({
  email: yup.string().email('Invalid Email').required('Email is required'),
  password: yup.string().required('Password is required'),
})

//  useForm (connect schema)
const { handleSubmit, resetForm } = useForm({
  validationSchema: schema,
})

// Fields
const { value: email, errorMessage: emailError } = useField('email')
const { value: password, errorMessage: passwordError } = useField('password')

//Submit Handler
const submitLogin = handleSubmit(async () => {
  const credentials = {
    email: email.value,
    password: password.value,
  }

  const result = await userStore.loginUser(credentials)
  console.log(result)

  if (result.success) {
    resetForm()
    router.push('/home')
  } else {
    alert(result.error?.message ?? 'Invalid credentials!')
  }
})
</script>

<template>
  <div class="d-flex justify-content-center align-items-center my-5">
    <div class="card shadow-lg p-4" style="width: 450px; border-radius: 15px">
      <h2 class="text-center text-primary mb-4">Login</h2>

      <form @submit.prevent="submitLogin">
        <!-- Email -->
        <div class="mb-3">
          <label class="form-label">Email:</label>
          <input v-model="email" class="form-control" type="email" placeholder="Enter email" />
          <small class="text-danger">{{ emailError }}</small>
        </div>

        <!-- Password -->
        <div class="mb-3">
          <label class="form-label">Password:</label>
          <input
            v-model="password"
            class="form-control"
            type="password"
            placeholder="Enter password"
          />
          <small class="text-danger">{{ passwordError }}</small>
        </div>

        <button type="submit" class="btn btn-primary w-100 mb-3">Login</button>

        <div class="text-center">
          <router-link to="/">Create New Account? Register here</router-link>
          <br />
          <!-- <router-link to="/forgot">Forgot Password?</router-link> -->
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped></style>
