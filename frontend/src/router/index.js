import { createRouter, createWebHistory } from 'vue-router'
import authService from '@/services/auth.service'
import DashboardLayout from '@/components/layout/DashboardLayout.vue'
import DashboardView from '@/views/DashboardView.vue'
import SitesView from '@/views/sites/SitesView.vue'
import EquipmentView from '@/views/equipment/EquipmentView.vue'
import TeamsView from '@/views/teams/TeamsView.vue'
import SpecificationsView from '@/views/specifications/SpecificationsView.vue'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/auth/LoginView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    redirect: () => {
      return authService.isAuthenticated() ? '/dashboard' : '/login'
    }
  },
  {
    path: '/dashboard',
    component: DashboardLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'dashboard',
        component: DashboardView
      },
      {
        path: 'sites',
        name: 'sites',
        component: SitesView
      },
      {
        path: 'equipment',
        name: 'equipment',
        component: EquipmentView
      },
      {
        path: 'teams',
        name: 'teams',
        component: TeamsView
      },
      {
        path: 'specifications',
        name: 'specifications',
        component: SpecificationsView
      },
      {
        path: 'departments',
        name: 'departments',
        component: () => import('@/views/departments/DepartmentsView.vue')
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login'
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const isAuthenticated = authService.isAuthenticated()

  if (requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.path === '/login' && isAuthenticated) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
