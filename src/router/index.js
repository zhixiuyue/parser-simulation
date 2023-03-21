import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      children: [
        // route level code-splitting
        // this generates a separate chunk (About.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        {
          path: '/',
          name: 'Input',
          component: () => import('@/views/InputGrammar.vue'),
        },
        {
          path: '/LL1Table',
          name: 'LL1Table',
          component: () => import('@/views/LL1Table.vue'),
        },
        {
          path: '/LR0Table',
          name: 'LR0Table',
          component: () => import('@/views/LR0Table.vue'),
          props: true
        },
        {
          path: '/Automaton',
          name: 'Automaton',
          component: () => import('@/views/Automaton.vue'),
        },
        {
          path: '/LL1Analysis',
          name: 'LL1Analysis',
          component: () => import('@/views/LL1Analysis.vue'),
        },
        {
          path: '/LR0Analysis',
          name: 'LR0Analysis',
          component: () => import('@/views/LR0Analysis.vue'),
          props: true
        },
      ]
    },
  ]
})

export default router
