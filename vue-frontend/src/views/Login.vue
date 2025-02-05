<script setup>
import { useAuthStore } from "./../store/auth"; // Ensure correct path
import { ref } from "vue";

const authStore = useAuthStore(); // This initializes the store

</script>

<template>
    <div>
        <!-- <h2>Login</h2> -->
        <button @click="authStore.googleLogin" v-if="!authStore.user">Sign in with Google</button>
        <!-- <button @click="authStore.logout" v-if="authStore.user">Signout</button> -->
        <p v-if="user">Welcome, {{ user.displayName }}</p>
        <p v-if="user">{{ user.email }}</p>
        <p v-if="user">{{ user.providerData }}</p>
    </div>
</template>

<script>

    // import { ref } from "vue";
    import { loginWithGoogle } from "../firebase";
    // import { useAuthStore } from "../store/auth";

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
</script>
<!-- ================================================ -->
<!-- <template>
  <div>
    <h2>Login</h2>
    <input v-model="username" placeholder="Username" />
    <input v-model="password" type="password" placeholder="Password" />
    <button @click="handleLogin">Login</button>
    <p v-if="errorMessage">{{ errorMessage }}</p>
  </div>
</template>

<script>
import { useAuthStore } from "../store/auth";

export default {
  data() {
    return { username: "", password: "", errorMessage: "" };
  },
  methods: {
    async handleLogin() {
      const authStore = useAuthStore();
      try {
        await authStore.login(this.username, this.password);
        this.$router.push(authStore.role === "admin" ? "/admin" : "/");
      } catch (error) {
        this.errorMessage = "Login failed. Try again.";
      }
    }
  }
};
</script> -->
