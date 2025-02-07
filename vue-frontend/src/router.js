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

export default router;
