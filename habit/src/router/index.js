import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Home.vue'
import Tracker from '../views/Tracker.vue'
import PastJournals from '../views/PastJournals.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },

        {
      path: '/tracker',
      name: 'tracker',
      component: Tracker,
    },
    {
      path: '/past-journals',
      name: 'past-journals',
      component: PastJournals,
      }
  ],
})

export default router
