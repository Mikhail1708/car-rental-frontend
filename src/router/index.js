// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: {
      title: 'Главная - Аренда авто'
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: {
      title: 'Вход - Аренда авто',
      guestOnly: true
    }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/RegisterView.vue'),
    meta: {
      title: 'Регистрация - Аренда авто',
      guestOnly: true
    }
  },
  {
    path: '/history',
    name: 'history',
    component: () => import('@/views/HistoryView.vue'),
    meta: {
      title: 'История аренды - Аренда авто',
      requiresAuth: true
    }
  },
  {
    path: '/favorites',
    name: 'favorites',
    component: () => import('@/views/FavoritesView.vue'),
    meta: {
      title: 'Избранное - Аренда авто',
      requiresAuth: true
    }
  },
  {
    path: '/car/:id',
    name: 'car-detail',
    component: () => import('@/views/CarDetailView.vue'),
    meta: {
      title: 'Детали автомобиля - Аренда авто'
    },
    props: true
  },
  {
    path: '/feedback',
    name: 'feedback',
    component: () => import('@/views/FeedbackView.vue'),
    meta: {
      title: 'Обратная связь - Аренда авто'
    }
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('@/views/AdminView.vue'),
    meta: {
      title: 'Панель администратора - Аренда авто',
      requiresAuth: true,
      requiresAdmin: true
    }
  },
  {
    path: '/manager',
    name: 'manager',
    component: () => import('@/views/ManagerView.vue'),
    meta: {
      title: 'Панель менеджера - Аренда авто',
      requiresAuth: true,
      requiresManager: true
    }
  },
  {
    path: '/create-ad',
    name: 'create-ad',
    component: () => import('@/views/CreateAdView.vue'),
    meta: {
      title: 'Создать объявление - Аренда авто',
      requiresAuth: true,
      requiresOwner: true
    }
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/ProfileView.vue'),
    meta: {
      title: 'Профиль - Аренда авто',
      requiresAuth: true
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
    meta: {
      title: 'Страница не найдена - Аренда авто'
    }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Глобальная защита маршрутов
router.beforeEach((to, from, next) => {
  // Получаем состояние авторизации из store
  const isAuthenticated = store.getters.isAuthenticated
  const userRole = store.getters.userRole
  
  // Устанавливаем заголовок страницы
  document.title = to.meta.title || 'Аренда авто'
  
  // Проверка на гостевые страницы (доступны только неавторизованным)
  if (to.matched.some(record => record.meta.guestOnly)) {
    if (isAuthenticated) {
      // Если пользователь уже авторизован, перенаправляем на главную
      next('/')
      return
    }
  }
  
  // Проверка на требование авторизации
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      // Сохраняем путь, куда хотел перейти пользователь
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
      return
    }
  }
  
  // Проверка на требование прав администратора
  if (to.matched.some(record => record.meta.requiresAdmin)) {
    if (userRole !== 'admin') {
      // Если нет прав администратора, перенаправляем на главную
      next('/')
      return
    }
  }
  
  // Проверка на требование прав менеджера (менеджер или админ)
  if (to.matched.some(record => record.meta.requiresManager)) {
    if (userRole !== 'manager' && userRole !== 'admin') {
      next('/')
      return
    }
  }
  
  // Проверка на требование прав владельца
  if (to.matched.some(record => record.meta.requiresOwner)) {
    if (userRole !== 'owner' && userRole !== 'admin') {
      next('/')
      return
    }
  }
  
  // Если все проверки пройдены, продолжаем навигацию
  next()
})

// Обработка ошибок навигации
router.onError((error) => {
  console.error('Ошибка навигации:', error)
})

export default router