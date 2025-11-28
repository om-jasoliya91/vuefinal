<script setup>
import { defineProps, defineEmits, ref } from 'vue';

// Define the base API URL reference
const path = ref(import.meta.env.VITE_API_URL);

const props = defineProps({
  users: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['edit', 'delete']);

function editStudent(id) {
  emit('edit', id);
}

function deleteStudent(id) {
  emit('delete', id);
}
</script>

<template>
  <div class="container mt-3 text-center">
    <div class="d-flex justify-content-between mb-3">
      <h1>User List</h1>
      <button class="btn btn-primary btn-lg">
        <RouterLink to="/adduser" class="text-center text-white">Add User</RouterLink>
      </button>
    </div>
    <table border="1" class="table table-bordered table-striped-columns">
      <thead>
        <tr>
          <th>Id</th>
          <th>Profile</th>
          <th>FirstName</th>
          <th>LastName</th>
          <th>Dob</th>
          <th>Gender</th>
          <th>Phone</th>
          <th>Email</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="student in props.users" :key="student.id">
          <td>{{ student.id }}</td>
          <td>
            <!-- <img v-if="student.profile" :src="`${path}/storage/${student.profile}`"  alt="Student profile" /> -->
            <!-- <img v-if="student.profile" :src="`${path}/storage/${student.profile}`" :key="student.profile" width="80"
              alt="profile" /> -->
            <img v-if="student.profile" :src="`${path}/storage/${student.profile}`"
              :key="`${path}/storage/${student.profile}`" width=" 80" alt="Profile" />

          </td>
          <td>{{ student.firstname }}</td>
          <td>{{ student.lastname }}</td>
          <td>{{ student.dob }}</td>
          <td>{{ student.gender }}</td>
          <td>{{ student.phone }}</td>
          <td>{{ student.email }}</td>
          <td>

            <button @click="editStudent(student.id)" class="btn btn-primary mx-3">Edit</button>
            <button @click="deleteStudent(student.id)" class="btn btn-outline-danger">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
img {
  max-width: 50px;
  height: auto;
}
</style>
