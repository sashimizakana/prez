import { createRouter,createWebHistory  } from "vue-router";
import Top from "./components/Top.vue";
import Presentation from "./components/Presentation.vue";
const routes = [
  { 
    path: "/",
    component: Top,
    children: [
      {
        component: Presentation,
        path:"presentations/:id",
        name:"presentation",
      }
    ],
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes, // short for `routes: routes`
});

export default router;
