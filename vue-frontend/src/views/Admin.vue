<template>
  <div>
    <h2>Admin Page</h2>
    <p v-if="isAdmin">Welcome, Admin!</p>
    <p v-else>Access denied!</p>
  </div>
</template>

<script>
import { computed } from "vue";
import { useAuthStore } from "./../store/auth";

export default {
  setup() {
    const authStore = useAuthStore();

    // Use computed to make isAdmin reactive
    const isAdmin = computed(() => authStore.isAdmin);

    return { isAdmin };
  }
};
</script>
