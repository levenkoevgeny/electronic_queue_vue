import { createRouter, createWebHistory } from "vue-router"
import NotFoundView from "@/components/common/NotFoundView"
import LoginView from "@/components/auth/LoginView"

import QueueList from "@/components/queues/QueueList"
import AppointmentsList from "@/components/appointments/AppointmentsList"
import AppointmentListHome from "@/components/appointments/AppointmentListHome"
import EmployeeList from "@/components/employees/EmployeeList"
import QueueRegistration from "@/components/queues/QueueRegistration"
import AppointmentSuccess from "@/components/appointments/AppointmentSuccess"

import store from "@/store"

const routes = [
  {
    path: "/",
    name: "main",
    redirect: "/queues",
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
    meta: { requiresAuth: false },
  },
  { path: "/:pathMatch(.*)*", name: "NotFound", component: NotFoundView },
  {
    path: "/queues",
    name: "queues",
    component: QueueList,
    children: [
      {
        path: "",
        name: "queue_appointments_home",
        component: AppointmentListHome,
      },
      {
        path: ":id",
        name: "queue_appointments",
        component: AppointmentsList,
      },
    ],

    meta: { requiresAuth: true },
  },
  {
    path: "/employees",
    name: "employees",
    component: EmployeeList,
    meta: { requiresAuth: true },
  },
  {
    path: "/queue-registration/:uuid",
    name: "queue-registration",
    component: QueueRegistration,
    meta: { requiresAuth: true },
  },
  {
    path: "/queue-registration/success/:id",
    name: "queue-registration-success",
    component: AppointmentSuccess,
  },
]

const router = createRouter({
  routes,
  history: createWebHistory(process.env.BASE_URL),
})

router.beforeEach(async (to, from) => {
  await store.dispatch("auth/actionCheckLoggedIn")
  const isLoggedIn = store.getters["auth/getIsLoggedIn"]

  if (to.meta.requiresAuth && !isLoggedIn) {
    return {
      path: "/login",
      query: { redirect: to.fullPath },
    }
  }
})

export default router
