<script setup>
import HeaderVue from '@/components/layouts/HeaderVue.vue';
import { useUserStore } from '@/stores/user';
import { onMounted } from 'vue';

const auth = useUserStore();

// Fetch students when the component is mounted
onMounted(() => {
  auth.getStudents();
});
</script>

<template>
  <HeaderVue></HeaderVue>

  <!-- Add some basic styling for visibility -->
  <table border="2" style="width: 100%; border-collapse: collapse;">
    <thead>
      <tr>
        <th>firstname</th>
        <th>lastname</th>
        <th>dob</th>
        <th>gender</th>
        <th>phone</th>
        <th>profile</th>
        <th>email</th>
      </tr>
    </thead>
    <tbody>

      <tr v-for="users in auth.getStudents()" :key="users.id">
        <td>{{ users.firstname }}</td>
        <td>{{ users.lastname }}</td>
        <td>{{ users.dob }}</td>
        <td>{{ users.gender }}</td>
        <td>{{ users.phone }}</td>
        <!-- You might want to display an image or a link here -->
        <td>
          <img v-if="users.profile" :src="users.profile" alt="Profile" style="width: 50px; height: auto;">
          <span v-else>No image</span>
        </td>
        <td>{{ users.email }}</td>
      </tr>
      <tr v-if="!auth.students || auth.students.length === 0">
        <td colspan="7" style="text-align: center;">Loading students or no data found...</td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
/* Optional: Add some minor styling to make the table look cleaner */
th,
td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

thead th {
  background-color: #f2f2f2;
}
</style>
