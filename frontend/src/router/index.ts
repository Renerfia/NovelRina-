import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import NovelsView from '@/views/NovelsView.vue'
import { useAuth } from '@/composables/useAuth'
import { watch } from 'vue'
import NovelDetails from '@/views/NovelDetails.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/novels',
      name: 'novels',
      component: NovelsView,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/novels/:id',
      name: 'novel-details',
      component: NovelDetails,
      meta: {
        requiresAuth: true,
      },
    },
  ],
})

router.beforeEach((to, from, next) => {
  const { isLoggedIn, loading } = useAuth()

  if (loading.value) {
    // Wait for the loading state to finish before proceeding
    const unwatch = watch(loading, (newLoading) => {
      if (!newLoading) {
        unwatch() // Stop watching after loading is done
        proceed()
      }
    })
  } else {
    proceed()
  }
  //proceed to home
  function proceed() {
    if (to.meta.requiresAuth && !isLoggedIn.value) {
      next({ name: 'home' }) // Redirect to home if not logged in
    } else {
      next() // Proceed to the route
    }
  }
})

export default router
