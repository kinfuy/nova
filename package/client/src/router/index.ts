import type { RouteRecordRaw } from 'vue-router';
import { createRouter, createWebHashHistory } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('../view/index.vue')
  }
];
export default createRouter({
  history: createWebHashHistory(),
  routes
});
