import { createRouter, createWebHistory } from 'vue-router'
import LoginViews from '@/views/Login/LoginViews.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginViews
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/Dashboard/DashboardViews.vue') 
    },
    {
      path: '/products',
      name: 'products',
      component: () => import('@/views/Products/ProductsView.vue')
    },
    {
      path: '/analytics',
      name: 'analytics',
      component: () => import('@/views/Analytics/AnalyticsView.vue')
    },
    {
      path: '/inventory',
      name: 'inventory',
      component: () => import('@/views/Inventory/InventoryView.vue')
    },
    {
      path: '/datamining',
      name: 'datamining',
      component: () => import('@/views/DataMining/DataMiningView.vue')
    },
    {
      path: '/reports',
      name: 'reports',
      component: () => import('@/views/Reports/ReportsView.vue')
    }
  ]
})

export default router
