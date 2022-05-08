import { createRouter, createWebHistory } from "vue-router";
import Home from "/src/views/Home.vue";
import ViewTicket from "/src/views/ViewTicket.vue";

const routes = [
  { path: "/", name: "Home", component: Home },
	{ path: "/ticket/:id", name: "ViewTicket", component:ViewTicket, props: true },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
