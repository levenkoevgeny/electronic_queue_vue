import { createRouter, createWebHistory } from "vue-router"
import QueueList from "@/components/queues/QueueList";

import store from "@/store"

const routes = [
    {
        path: "/",
        name: "main",
        redirect: "/queues",
    },
    {
        path: "/queues",
        name: "queues",
        component: QueueList,
        meta: { requiresAuth: false },
    },

    // { path: "/:pathMatch(.*)*", name: "NotFound", component: NotFound },
    // { path: "/error", name: "error", component: InternalServerError },
]

const router = createRouter({
    routes,
    history: createWebHistory(process.env.BASE_URL),
})

router.beforeEach(async (to, from) => {
    // await store.dispatch("auth/actionCheckLoggedIn")
    // const isLoggedIn = store.getters["auth/getIsLoggedIn"]

    const isLoggedIn = true

    if (to.meta.requiresAuth && !isLoggedIn) {
        return {
            path: "/login",
            query: { redirect: to.fullPath },
        }
    }
})

export default router