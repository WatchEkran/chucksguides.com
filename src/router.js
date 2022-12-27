import { createRouter, createWebHistory } from "vue-router";
import Home from "./components/Home.vue";
import Guide from "./components/guide/Guide.vue";

const routes = [
  {
    path: "/",
    component: Home,
  },
  {
    path: "/aircraft/:game/:aircraft",
    component: Guide,
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
