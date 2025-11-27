<script setup>
import { array } from 'yup';
import { defineProps } from 'vue';

const props = defineProps({
  users: { type: array, required: true }
})
function editStudent(id) {
  emit('student id', id);
}
function deleteStudent(id) {
  emit('student id', id)

}
const emit = defineEmits(['edit', 'delete'])
</script>
<template>
  <table border="1">
    <thead>
      <th>Id</th>
      <th>Profile</th>
      <th>FirstName</th>
      <th>LastName</th>
      <th>Dob</th>
      <th>Gender</th>
      <th>Phone</th>
      <th>Email</th>
      <th>Actions</th>
    </thead>
    <tbody>
      <tr v-for="student in props.users" :key="student.id">
        <td>{{ student.id }}</td>
        <td><img v-if="student.profile" :src="student.profile"></td>
        <td>{{ student.firstname }}</td>
        <td>{{ student.lastname }}</td>
        <td>{{ student.gender }}</td>
        <td>{{ student.phone }}</td>
        <td>{{ student.gender }}</td>
        <td>{{ student.email }}</td>
        <td>
          <button @click="editStudent(student.id)">Edit</button>
          <button @click="deleteStudent(student.id)">Delete</button>
        </td>
      </tr>
    </tbody>
  </table>
</template>
<style scoped></style>
