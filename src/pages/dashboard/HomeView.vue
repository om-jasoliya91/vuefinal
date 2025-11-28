<script setup>
import HeaderVue from '@/components/layouts/HeaderVue.vue';
import UserDatatable from '@/components/UserDatatable.vue';
import { useUserStore } from '@/stores/user';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
const auth = useUserStore()
const router = useRouter()
onMounted(() => {
  auth.getStudents()
})
async function handleDelete(id) {
  await auth.deleteStudent(id)
}
function handleEdit(id) {
  router.push(`/edituser/${id}`)
}
</script>

<template>
  <HeaderVue></HeaderVue>
  <UserDatatable :users="auth.users" @delete="handleDelete" @edit="handleEdit" />

</template>
<style scoped></style>
