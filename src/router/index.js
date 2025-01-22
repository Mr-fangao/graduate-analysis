/*
 * @Author: liqifeng
 * @Date: 2025-01-21 10:10:22
 * @LastEditors: liqifeng Mr.undefine@protonmail.com
 * @LastEditTime: 2025-01-22 10:21:25
 * @Description:
 */
import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";

const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    component: () => import("@/views/Login/index.vue"),
  },
  {
    path: "/menu",
    component: () => import("@/views/Menu/index.vue"),
  },
  {
    path: "/home",
    component: () => import("@/views/Home/index.vue"),
    children: [
      {
        path: "datapanel",
        component: () => import("@/views/Home/components/DataPanel/index.vue"),
      },
      // {
      //   path: "analysis",
      //   component: () => import("@/views/Home/components/Analysis.vue"),
      // },
      // {
      //   path: "display",
      //   component: () => import("@/views/Home/components/Display.vue"),
      // },
      // {
      //   path: "manage",
      //   component: () => import("@/views/Home/components/Manage.vue"),
      // },
    ],
  },
];

const router = createRouter({
  // history: createWebHistory(process.env.BASE_URL),
  history: createWebHashHistory(),
  routes,
});

export default router;
