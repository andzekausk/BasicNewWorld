import { defineStore } from "pinia";
import { loginWithGoogle, logout } from "../firebase";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
  }),
  actions: {
    async googleLogin() {
      this.user = await loginWithGoogle();
    },
    async logout() {
      await logout();
      this.user = null;
    }
  }
});
// import { defineStore } from "pinia";
// import axios from "axios";

// export const useAuthStore = defineStore("auth", {
//     state: () => ({
//         user: null,
//         token: localStorage.getItem("token") || "",
//         role: localStorage.getItem("role") || "",
//     }),
//     actions: {
//         async login(username, password) {
//             try {
//                 const response = await axios.post("http://localhost:3000/login", { username, password });
//                 this.token = response.data.token;
//                 this.role = response.data.role;
//                 this.user = { username };
//                 localStorage.setItem("token", this.token);
//                 localStorage.setItem("role", this.role);
//             } catch (error) {
//                 throw new Error("Invalid credentials");
//             }
//         },
//         logout() {
//             this.token = "";
//             this.user = null;
//             this.role = "";
//             localStorage.removeItem("token");
//             localStorage.removeItem("role");
//         }
//     }
// });
