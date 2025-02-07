<!-- <script setup>

import { useAuthStore } from "./../store/auth"; // Ensure correct path
import { ref } from "vue";
import { loginWithGoogle } from "../firebase";
const authStore = useAuthStore(); // This initializes the store

</script> -->

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
    <!-- <p v-if="user">Welcome, {{ user.displayName }}</p>
    <p v-if="user">{{ user.email }}</p>
    <p v-if="user">{{ user.providerData }}</p> -->
  </div>
</template>

<script setup>
  import { useAuthStore } from "./../store/auth";
  import { ref } from "vue";
  // import { loginWithGoogle } from "../firebase";

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

<!-- <script>

  export default {
    setup() {
      const user = ref(null);
      // const authStore = useAuthStore();
      const signInWithGoogle = async () => {
        try {
          user.value = await loginWithGoogle();
        } catch (error) {
          console.error("Login Failed:", error);
        }
      };

      return { user, signInWithGoogle };
    }
  };
</script> -->