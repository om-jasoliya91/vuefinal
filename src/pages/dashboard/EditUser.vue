<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { useRoute, useRouter } from 'vue-router'

const store = useUserStore()
const route = useRoute()
const router = useRouter()
//if url like this http://localhost:5173/edituser/10 so route.params.id="10" vue router store like this.
const id = route.params.id

const form = ref({
  id: '',
  firstname: '',
  lastname: '',
  dob: '',
  gender: '',
  phone: '',
  email: '',
  profile: null,
})

const profilePreview = ref(null)

async function fetchUser() {
  await store.getStudents()
  const user = store.users.find((s) => s.id == id)
  if (user) {
    form.value = { ...user, profile: null }
    profilePreview.value = user.profile
  }
}

function handleFileChange(event) {
  const file = event.target.files[0]
  if (file) {
    form.value.profile = file
    profilePreview.value = URL.createObjectURL(file)
  }
}

async function updateStudent() {
  const formData = new FormData()
  for (let key in form.value) {
    if (form.value[key] !== null) {
      formData.append(key, form.value[key])
    }
  }
  const result = await store.updateStudent(id, formData)
  if (result.success) {
    const updateUser = result.data
    updateUser.profile = `${updateUser.profile}?t=${Date.now()}`
    form.value = { ...updateUser, profile: null }
    profilePreview.value = updateUser.profile
    router.push('/home')
  }
}

onMounted(fetchUser)
</script>

<template>
  <div class="container mt-4">
    <h2>Edit Profile</h2>

    <form @submit.prevent="updateStudent">
      <input type="hidden" v-model="form.id">
      <input v-model="form.firstname" type="text" placeholder="First Name" class="form-control mb-2" />
      <input v-model="form.lastname" type="text" placeholder="Last Name" class="form-control mb-2" />
      <input v-model="form.dob" type="date" class="form-control mb-2" />
      <div class="mb-2">
        <label class="form-label">Gender</label><br>
        <label class="me-3">
          <input type="radio" value="male" v-model="form.gender" /> Male
        </label>
        <label class="me-3">
          <input type="radio" value="female" v-model="form.gender" /> Female
        </label>
      </div>

      <input v-model="form.phone" type="text" placeholder="Phone" class="form-control mb-2" />
      <input v-model="form.email" type="email" placeholder="Email" class="form-control mb-2" />

      <div class="mb-2">
        <label>Profile Picture</label>
        <input type="file" class="form-control" @change="handleFileChange" />
      </div>

      <img v-if="profilePreview" :src="profilePreview" class="mt-2" width="80" />

      <button type="submit" class="btn btn-success mt-3">Update</button>
    </form>
  </div>
</template>
