import { defineStore } from "pinia";
import { loginWithGoogle, logout } from "../firebase";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    isAdmin: false,
    token: null,
  }),
  actions: {
    async googleLogin() {
        const loggedUser = await loginWithGoogle();
        if (!loggedUser) return;

        // console.log("ID Token:", loggedUser.idToken);
        
        try {
          const response = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idToken: loggedUser.idToken }),
          });
  
          if (!response.ok) throw new Error("Failed to verify login");
  
          const data = await response.json();
  
          this.user = { email: data.email };
          this.isAdmin = data.isAdmin;
          this.token = data.token;
          localStorage.setItem("token", data.token);

        } catch (error) {
          console.error("Login error:", error);
        }
    },
    async logout() {
      await logout();
      this.user = null;
      this.isAdmin = false;
      this.token = null;
      localStorage.removeItem("token");
    }
  }
});