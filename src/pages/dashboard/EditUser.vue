<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { useRoute, useRouter } from 'vue-router'
import * as yup from 'yup'

const store = useUserStore()
const route = useRoute()
const router = useRouter()
const id = route.params.id

const form = ref({
  firstname: '',
  lastname: '',
  dob: '',
  gender: '',
  phone: '',
  email: '',
  profile: null,
})
const errors = ref({})

const schema = yup.object({
  firstname: yup.string().required('First name is required'),
  lastname: yup.string().required('Last name is required'),
  dob: yup.date().required('Date of birth is required').nullable(),
  gender: yup.string().required('Gender is required'),
  phone: yup.string().matches(/^[0-9]{10}$/, 'Phone must be 10 digits').required('Phone number is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  profile: yup
    .mixed()
    .nullable()
    .test('fileType', 'Only PNG, JPG, JPEG allowed', (value) => {
      if (!value) return true
      const allowed = ['image/png', 'image/jpeg', 'image/jpg']
      return allowed.includes(value.type)
    })
    .test('fileSize', 'Max size 2MB allowed', (value) => {
      if (!value) return true
      return value.size <= 2 * 1024 * 1024
    }),
})

async function fetchUser() {
  await store.getStudents()
  const user = store.users.find((s) => s.id == id)
  if (!user) {
    return
  }
  form.value = { ...user, profile: null }
}
async function handleFileChange(event) {
  const file = event.target.files[0]
  form.value.profile = file
  try {
    await schema.validateAt('profile', form.value)
    delete errors.value.profile
  } catch (err) {
    errors.value.profile = err.message
  }
}

async function updateStudent() {
  try {

    await schema.validate(form.value, { abortEarly: false })
    errors.value = {}

    const formData = new FormData()
    for (const key in form.value) {
      if (form.value[key] !== null) {
        formData.append(key, form.value[key])
      }
    }
    const result = await store.updateStudent(id, formData)
    if (result.success) {
      await store.getStudents()
      router.push('/home')
    }
  } catch (err) {
    if (err.inner) {
      errors.value = err.inner.reduce((acc, error) => {
        acc[error.path] = error.message
        return acc
      }, {})
    }
  }
}

onMounted(fetchUser)
</script>

<template>
  <div class="container mt-4" style="width: 800px;">
    <h2 class="text-center text-primary">Edit Profile</h2>
    <form @submit.prevent="updateStudent" class="w-50 mx-auto">
      <div class="mb-3">
        <label>Firstname:</label>
        <input v-model="form.firstname" type="text" placeholder="First Name" class="form-control mb-2" />
        <div v-if="errors.firstname" class="text-danger">{{ errors.firstname }}</div>

        <div class="mb-3">
          <label>Lastname:</label>
          <input v-model="form.lastname" type="text" placeholder="Last Name" class="form-control mb-2" />
          <div v-if="errors.lastname" class="text-danger">{{ errors.lastname }}</div>
        </div>
        <div class="mb-3">
          <label>Date Of Birth:</label>
          <input v-model="form.dob" type="date" class="form-control mb-2" />
          <div v-if="errors.dob" class="text-danger">{{ errors.dob }}</div>
        </div>
      </div>
      <div class="mb-3">
        <label class="form-label">Gender</label><br />
        <label class="me-3"><input type="radio" value="male" v-model="form.gender" /> Male</label>
        <label class="me-3"><input type="radio" value="female" v-model="form.gender" /> Female</label>
        <div v-if="errors.gender" class="text-danger">{{ errors.gender }}</div>
      </div>
      <div class="mb-3">
        <label class="form-label">Phone:</label><br />
        <input v-model="form.phone" type="text" placeholder="Phone" class="form-control mb-2" />
        <div v-if="errors.phone" class="text-danger">{{ errors.phone }}</div>
      </div>
      <div class="mb-3">
        <label class="form-label">Email</label><br />
        <input v-model="form.email" type="email" placeholder="Email" class="form-control mb-2" />
        <div v-if="errors.email" class="text-danger">{{ errors.email }}</div>
      </div>
      <div class="mb-3">
        <label>Profile Picture:</label>
        <input type="file" class="form-control" @change="handleFileChange" />
        <div v-if="errors.profile" class="text-danger mt-1">{{ errors.profile }}</div>
      </div>

      <button class="btn btn-success mt-3 w-100" type="submit">Update Profile</button>

    </form>
  </div>
</template>

<style scoped></style>
