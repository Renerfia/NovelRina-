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

router.beforeEach(async (to) => {
  const { isLoggedIn, loading } = useAuth()

  if (loading.value) {
    await new Promise<void>((resolve) => {
      const unwatch = watch(loading, (isLoading) => {
        if (!isLoading) {
          unwatch()
          resolve()
        }
      })
    })
  }

  if (to.meta.requiresAuth && !isLoggedIn.value) {
    return { name: 'home' }
  }
  return true
})

export default router
