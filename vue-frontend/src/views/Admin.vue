<template>
    <div>
      <h2>Admin Page</h2>
      <p>{{ message }}</p>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return { message: "Loading..." };
    },
    async mounted() {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3000/admin", {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.message = response.data.message;
      } catch (error) {
        this.message = "Access denied!";
      }
    }
  };
  </script>
  