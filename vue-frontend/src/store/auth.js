import { defineStore } from "pinia";
import { loginWithGoogle, logout } from "../firebase";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    isAdmin: false,
  }),
  actions: {
    async googleLogin() {
        const loggedUser = await loginWithGoogle();
        // if(loggedUser){
        //     this.user = loggedUser;
        //     this.isAdmin = loggedUser.isAdmin;
        // }
        if (!loggedUser) return;
        console.log("ID Token:", loggedUser.idToken);
        try {
          // Send ID token to backend for verification
          const response = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idToken: loggedUser.idToken }),
          });
  
          if (!response.ok) throw new Error("Failed to verify login");
  
          const data = await response.json();
  
          // Update state with verified user and admin status
          this.user = { email: data.email };
          this.isAdmin = data.isAdmin;
        } catch (error) {
          console.error("Login error:", error);
        }
    },
    async logout() {
      await logout();
      this.user = null;
      this.isAdmin = false;
    }
  }
});