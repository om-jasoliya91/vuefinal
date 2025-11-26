<script setup>
import * as yup from 'yup'
import { useRouter } from 'vue-router'
import { useForm, useField } from 'vee-validate'
import { useUserStore } from '@/stores/user'
import Swal from 'sweetalert2'
import HeaderVue from '@/components/layouts/HeaderVue.vue'

const router = useRouter()
const auth = useUserStore()

const schema = yup.object({
  firstname: yup.string().required('Required first name'),
  lastname: yup.string().required('Required last name'),
  dob: yup.string().required('date of birth required'),
  gender: yup.string().required('Gender is required'),
  phone: yup.string().max(10).required('Mobile no is required'),
  // profile: yup.mixed().required('Profile image is required'),
  profile_pic: yup
    .mixed()
    .test('required', 'File is required', (value) => value !== null)
    .test(
      'filesize',
      'File too large (max 2MB)',
      (value) => !value || value.size <= 2 * 1024 * 1024,
    ),
  email: yup.string().email('email is invalid').required('email is required'),
  password: yup.string().min(6).required('password is required'),
})

// vee-validate helper
const { handleSubmit, resetForm } = useForm({
  validationSchema: schema,
})

// defined fields
const { value: firstname, errorMessage: firstnameError } = useField('firstname')
const { value: lastname, errorMessage: lastnameError } = useField('lastname')
const { value: dob, errorMessage: dobError } = useField('dob')
const { value: gender, errorMessage: genderError } = useField('gender')
const { value: phone, errorMessage: phoneError } = useField('phone')
const { value: profile, errorMessage: profileError } = useField('profile')
const { value: email, errorMessage: emailError } = useField('email')
const { value: password, errorMessage: passwordError } = useField('password')

function handleFileChange(event) {
  profile.value = event.target.files[0]
}

const submitForm = handleSubmit(async () => {
  const formData = new FormData()
  formData.append('firstname', firstname.value)
  formData.append('lastname', lastname.value)
  formData.append('dob', dob.value)
  formData.append('gender', gender.value)
  formData.append('phone', phone.value)
  formData.append('profile', profile.value)
  formData.append('email', email.value)
  formData.append('password', password.value)

  await auth.addStudent(formData)

  resetForm()
  Swal.fire({
    title: 'Add User Successfully',
    icon: 'success',
    timer: 2000,
    toast: true,
    position: "top-end",
    showConfirmButton: false,
  })
  router.push('/home')
})
</script>

<template>
  <HeaderVue />
  <div class="container my-5" style="width: 600px">
    <h1 class="text-primary text-center">Add User</h1>

    <form @submit.prevent="submitForm">
      <div class="mb-3">
        <label>First Name:</label>
        <input class="form-control" type="text" name="firstname" placeholder="Enter Your first name:"
          v-model="firstname" />
        <span class="text-danger">{{ firstnameError }}</span>
      </div>
      <div class="mb-3">
        <label>Last Name:</label>
        <input class="form-control" type="text" name="lastname" placeholder="Enter Your Last name:"
          v-model="lastname" />
        <span class="text-danger">{{ lastnameError }}</span>
      </div>
      <div class="mb-3">
        <label>Date Of birth:</label>
        <input class="form-control" type="date" name="dob" placeholder="Select Your bithdate" v-model="dob" />
        <span class="text-danger">{{ dobError }}</span>
      </div>
      <div class="mb-5">
        <label>Gender:</label> <br />
        <!-- Use v-model for radio buttons -->
        Male:<input type="radio" name="gender" value="male" v-model="gender" /> Female:<input type="radio" name="gender"
          value="female" v-model="gender" />
        <span class="text-danger">{{ genderError }}</span>
      </div>
      <div class="mb-3">
        <label>Phone:</label>
        <input class="form-control" type="number" name="phone" placeholder="Enter yout Mobile no" v-model="phone" />
        <span class="text-danger">{{ phoneError }}</span>
      </div>
      <div class="mb-3">
        <label>Profile:</label>
        <!-- Use @change event listener for file inputs -->
        <input class="form-control" type="file" name="profile" @change="handleFileChange" />
        <span class="text-danger">{{ profileError }}</span>
      </div>
      <div class="mb-3">
        <label>Email:</label>
        <input class="form-control" type="email" name="email" placeholder="Enter Your email" v-model="email" />
        <span class="text-danger">{{ emailError }}</span>
      </div>
      <div class="mb-3">
        <label>Password:</label>
        <input class="form-control" type="password" name="password" placeholder="Select Your Password"
          v-model="password" />
        <span class="text-danger">{{ passwordError }}</span>
      </div>
      <div class="mb-3">
        <!-- The button type should be submit to trigger the form submission -->
        <input class="form-control btn btn-primary" type="submit" value="AddUser" />
      </div>
    </form>
  </div>
</template>

<style scoped></style>
