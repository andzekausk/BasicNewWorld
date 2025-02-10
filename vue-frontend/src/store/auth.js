import { defineStore } from "pinia";
import { loginWithGoogle, logout } from "../firebase";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    isAllowed: false,
    roles: [],
    currentRole: "",
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
          this.roles = data.roles;
          this.isAllowed = data.isAllowed;
          this.currentRole = data.roles.includes("admin") ? "admin" : "user";

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
        this.roles = data.roles;
        this.currentRole = data.roles.includes("admin") ? "admin" : "user";

      } catch (error) {
        console.error("Login error:", error);
      }
    },
    
    async logout() {
      await logout();
      this.user = null;
      this.roles = [];
      this.currentRole = "";
    },
    
    async switchRole(newRole) {
      if (this.roles.includes(newRole)) {
        this.currentRole = newRole;
      }
    },
  }
});