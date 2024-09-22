import { createRouter, createWebHistory } from 'vue-router';
import ShipList from '../components/ShipList.vue';
import ContainerList from '../components/ContainerList.vue';

const routes = [
  {
    path: '/',
    name: 'Ships',
    component: ShipList,
  },
  {
    path: '/containers',
    name: 'Containers',
    component: ContainerList,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
