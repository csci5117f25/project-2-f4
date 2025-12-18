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
      meta: {
        title: "Home",
        icon: "home.png"
      },
      component: HomeView,
    },

    {
      path: '/tracker',
      name: 'tracker',
      component: TrackerView,
      meta: { 
        title: "Tracker",
        requiresAuth: true,
        icon: "tracker.png",
       },
    },
    {
      path: '/past-journals',
      name: 'past-journals',
      component: PastJournals,
      meta: { 
        title: "Previous Journals",
        requiresAuth: true,
        icon: "previousjournals.png",
       },
    },

    {
      path: '/analytics',
      name: 'analytics',
      component: () => import('../views/AnalyticsView.vue'),
      meta: { 
        title: "Stats",
        requiresAuth: true,
        icon: "analytics.png",
       },
    },
    {
      path: '/stats',
      name: 'stats',
      component: () => import('../views/StatsView.vue'),
      meta: { 
        title: "Stats",
        requiresAuth: true,
        icon: "analytics.png",
       },
    },

    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/SettingsView.vue'),
      meta: { 
        title: "Settings",
        requiresAuth: true,
        icon: "settings.png",
       },
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
