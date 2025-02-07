<template>
  <div>
    <!-- username login -->
    <div>
      <input v-model="username" placeholder="Username" />
      <input v-model="password" type="password" placeholder="Password" />
      <button @click="usernameLogin">Login</button>
    </div>
    <!-- google login -->
    <button @click="signInWithGoogle" v-if="!authStore.user">Sign in with Google</button>
  </div>
</template>

<script setup>
  import { useAuthStore } from "./../store/auth";
  import { ref } from "vue";
  
  const authStore = useAuthStore(); 
  const username = ref('');
  const password = ref('');

  // Login with username
  const usernameLogin = async () => {
    try {
      await authStore.loginWithUsername(username.value, password.value);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  // Login with google
  const signInWithGoogle = async () => {
    try {
      await authStore.googleLogin();
    } catch (error) {
      console.error("Login error:", error);
    }
  };
</script>