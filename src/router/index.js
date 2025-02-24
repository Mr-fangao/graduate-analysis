/*
 * @Author: liqifeng
 * @Date: 2025-01-21 10:10:22
 * @LastEditors: Mr-fangao Mr.undefine@protonmail.com
 * @LastEditTime: 2025-02-24 22:12:42
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
      {
        path: "query",
        component: () => import("@/views/Home/components/Query/index.vue"),
      },
      {
        path: "analysis",
        component: () => import("@/views/Home/components/Analysis/index.vue"),
      },
      {
        path: "mapping",
        component: () => import("@/views/Home/components/Mapping/index.vue"),
      },
      {
        path: "manage",
        // component: () => import("@/views/Home/components/Manage.vue"),
      },
    ],
  },
];

const router = createRouter({
  // history: createWebHistory(process.env.BASE_URL),
  history: createWebHashHistory(),
  routes,
});

export default router;
