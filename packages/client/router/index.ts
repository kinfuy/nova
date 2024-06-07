import type { RouteRecordRaw } from 'vue-router';
import { createRouter, createWebHashHistory } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/flow'
  },
  {
    path: '/flow',
    name: 'gitFlow',
    component: () => import('../view/flow.vue')
  }
];
export default createRouter({
  history: createWebHashHistory(),
  routes
});
