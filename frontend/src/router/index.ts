import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import NovelsView from '@/views/NovelsView.vue'
import { useAuth } from '@/composables/useAuth'
import { watch } from 'vue'
import NovelPanelView from '@/views/NovelPanelView.vue'

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
      component: NovelPanelView,
      meta: {
        requiresAuth: true,
      },
    },
  ],
})

router.beforeEach((to, from, next) => {
  const { isLoggedIn, loading } = useAuth()

  if (loading.value) {
    const unwatch = watch(loading, (isLoading) => {
      if (!isLoading) {
        unwatch()
        proceed()
      }
    })
  } else {
    proceed()
  }

  function proceed() {
    if (to.meta.requiresAuth && !isLoggedIn.value) {
      next({ name: 'home' })
    } else {
      next()
    }
  }
})

export default router
