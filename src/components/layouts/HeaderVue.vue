<template>
  <nav class="navbar navbar-expand-lg bg-dark">
    <div class="container-fluid">
      <a class="navbar-brand text-white" href="#">Navbar</a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link to="/home" class="nav-link active text-white">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/adduser" class="nav-link active text-white">Add User</router-link>
          </li>
          <li class="nav-item">
            <a class="nav-link text-white" href="#">Link</a>
          </li>
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle text-white"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Dropdown
            </a>
            <ul class="dropdown-menu">
              <li><a class="dropdown-item" @click="handleLogout">Logout</a></li>
              <li><hr class="dropdown-divider" /></li>
              <li><a class="dropdown-item t" href="#">Another action</a></li>
            </ul>
          </li>
        </ul>
        <form class="d-flex" role="search">
          <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
          <button class="btn btn-outline-success" type="submit">Search</button>
        </form>
      </div>
    </div>
  </nav>
</template>
<script setup>
import { useUserStore } from '@/stores/user'
import Swal from 'sweetalert2'
import { useRouter } from 'vue-router'
const auth = useUserStore()
const router = useRouter()

function handleLogout() {
  Swal.fire({
    title: 'Are You Sure You Want To Logout',
    text: 'You will need to login again to access your account',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes,Logout',
    cancelButtonText: 'Cancel',
  }).then(async (result) => {
    if (result.isConfirmed) {
      await auth.logout()
      Swal.fire({
        title: 'Logged Out Successfully',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
      })
      router.push('/login')
    }
  })
}
</script>
