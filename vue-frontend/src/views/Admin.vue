<template>
  <div>
    <h2>Admin Page</h2>
    <p v-if="currentRole=='admin'">Welcome, Admin!</p>
    <p v-else>Access denied!</p>
  </div>
</template>

<script>
import { computed } from "vue";
import { useAuthStore } from "./../store/auth";

export default {
  setup() {
    const authStore = useAuthStore();
    const currentRole = computed(() => authStore.currentRole);
    return{currentRole};
  }
};
</script>
