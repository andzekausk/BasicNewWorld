import { createRouter, createWebHistory } from "vue-router";
import Login from "./views/Login.vue";
import Home from "./views/Home.vue";
import Admin from "./views/Admin.vue";
import { useAuthStore } from "./store/auth";

const routes = [
    { path: "/", component: Home },
    { path: "/login", component: Login },
    { 
        path: "/admin", 
        component: Admin, 
        // meta: { requiresAdmin: true } 
        beforeEnter: (to, from, next) => {
            const authStore = useAuthStore();
            if (!authStore.isAdmin) {
                next("/"); // Redirect non-admins
            } else {
                next();
            }
        }
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

// router.beforeEach((to, from, next) => {
//     const isAuthenticated = localStorage.getItem("token");
//     const userRole = localStorage.getItem("role");

//     if (to.meta.requiresAdmin && (!isAuthenticated || userRole !== "admin")) {
//         next("/login");
//     } else {
//         next();
//     }
// });

export default router;
