<template>
    <div>
        <h2>Login</h2>
        <button @click="signInWithGoogle">Sign in with Google</button>
        <p v-if="user">Welcome, {{ user.displayName }}</p>
        <p v-if="user">{{ user.email }}</p>
        <p v-if="user">{{ user.providerData }}</p>
    </div>
</template>

<script>
    import { ref } from "vue";
    import { loginWithGoogle } from "../firebase";

    export default {
    setup() {
        const user = ref(null);

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
