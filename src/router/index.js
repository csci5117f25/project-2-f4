import { useCurrentUser } from 'vuefire'
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import TrackerView from '../views/TrackerView.vue'
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
      component: TrackerView,
      meta: { requiresAuth: true },
    },
    {
      path: '/past-journals',
      name: 'past-journals',
      component: PastJournals,
      meta: { requiresAuth: true },
    },

    {
      path: '/analytics',
      name: 'analytics',
      component: () => import('../views/AnalyticsView.vue'),
      meta: { requiresAuth: true },
    },

    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/SettingsView.vue'),
      meta: { requiresAuth: true },
    },
  ],
})


router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (requiresAuth) {
    const user = useCurrentUser()
    if (user.value) {
      next()
    } else {
      next('/')
    }
  } else {
    next()
  }
})


export default router
