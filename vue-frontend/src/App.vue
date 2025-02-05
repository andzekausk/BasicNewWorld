<template>
  <div>
    <nav>
      <router-link to="/">Home</router-link> |
      <router-link v-if="!authStore.user" to="/login">Login</router-link> |
      <router-link v-if="authStore.isAdmin" to="/admin">Admin</router-link> |
      <button v-if="authStore.user" @click="authStore.logout">Logout</button>
    </nav>

    <router-view />
  </div>
</template>

<script>
import { useAuthStore } from "./store/auth";

export default {
  setup() {
    const authStore = useAuthStore();
    return { authStore };
  }
};
</script>

<style>
nav {
  padding: 10px;
  background: #eee;
}
nav a {
  margin: 0 10px;
  text-decoration: none;
  font-weight: bold;
}
</style>
<!-- <template>
  <div>
    <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/login">Login</router-link> |
      <router-link v-if="authStore.role === 'admin'" to="/admin">Admin</router-link> |
      <button v-if="authStore.token" @click="logout">Logout</button>
    </nav>
    
    <router-view />
  </div>
</template>

<script>
import { useAuthStore } from "./store/auth";

export default {
  setup() {
    const authStore = useAuthStore();
    
    const logout = () => {
      authStore.logout();
    };

    return { authStore, logout };
  }
};
</script>

<style>
nav {
  padding: 10px;
  background: #eee;
}
nav a {
  margin: 0 10px;
  text-decoration: none;
  font-weight: bold;
}
</style> -->
