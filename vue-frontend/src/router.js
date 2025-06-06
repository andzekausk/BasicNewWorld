import { createRouter, createWebHistory } from "vue-router";
import Login from "./views/Login.vue";
import Home from "./views/Home.vue";
import Admin from "./views/Admin.vue";

const routes = [
    { path: "/", component: Home },
    { path: "/login", component: Login },
    { path: "/admin", component: Admin, meta: { requiresAdmin: true } }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach((to, from, next) => {
    const isAuthenticated = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");

    if (to.meta.requiresAdmin && (!isAuthenticated || userRole !== "admin")) {
        next("/login");
    } else {
        next();
    }
});

export default router;
