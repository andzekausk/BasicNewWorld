import { defineStore } from "pinia";
import { loginWithGoogle, logout } from "../firebase";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    isAdmin: false,
    isAllowed: false,
    // token: null,
  }),
  actions: {
    async googleLogin() {
        const loggedUser = await loginWithGoogle();
        if (!loggedUser) return;
        
        try {
          const response = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idToken: loggedUser.idToken }),
          });
  
          const data = await response.json();
          
          if(!data.isAllowed){
            alert("Neatļauts domēns!");
            return;
          }
          
          if (!response.ok) throw new Error("Failed to verify login");

          this.user = { email: data.email };
          this.isAdmin = data.isAdmin;
          this.isAllowed = data.isAllowed;
          // this.token = data.token;
          // localStorage.setItem("token", data.token);

        } catch (error) {
          console.error("Login error:", error);
        }
    },

    async loginWithUsername(username, password) {
      try {
        const response = await fetch("http://localhost:3000/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });

        if (!response.ok) throw new Error("Invalid username or password");

        const data = await response.json();
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
      // this.token = null;
      // localStorage.removeItem("token");
    }
  }
});