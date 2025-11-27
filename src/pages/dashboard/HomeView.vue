<script setup>
import HeaderVue from '@/components/layouts/HeaderVue.vue';
import UserDatatable from '@/components/UserDatatable.vue';
import { useUserStore } from '@/stores/user';
import { onMounted } from 'vue';
const auth = useUserStore()

onMounted(() => {
  auth.getStudents()
})
async function handleDelete(id) {
  await auth.deleteStudent(id)
}
</script>

<template>
  <HeaderVue></HeaderVue>
  <!-- @edit="handleEdit" @delete="handleDelete" -->
  <UserDatatable :users="auth.users" @delete="handleDelete"></UserDatatable>
</template>
<style scoped></style>
