import type { RouteRecordRaw } from 'vue-router';
import { createRouter, createWebHashHistory } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/graph'
  },
  {
    path: '/graph',
    name: 'graph',
    component: () => import('../view/index.vue')
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
