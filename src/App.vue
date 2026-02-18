<!-- src/App.vue -->
<template>
  <div id="app">
    <Navbar v-if="!isAdminRoute && !isManagerRoute" />
    <router-view />
    
    <!-- Панель разработчика (только в режиме разработки) -->
    <div v-if="isDev" class="dev-panel">
      <button class="dev-toggle" @click="showDevPanel = !showDevPanel">
        <i :class="showDevPanel ? 'fas fa-chevron-down' : 'fas fa-chevron-up'"></i>
        Dev Tools
      </button>
      
      <div v-if="showDevPanel" class="dev-content">
        <div class="dev-section">
          <h4>Быстрый вход</h4>
          <div class="dev-buttons">
            <button class="dev-btn admin" @click="quickLogin('admin')">
              <i class="fas fa-crown"></i> Админ
            </button>
            <button class="dev-btn manager" @click="quickLogin('manager')">
              <i class="fas fa-user-tie"></i> Менеджер
            </button>
            <button class="dev-btn owner" @click="quickLogin('owner')">
              <i class="fas fa-car"></i> Владелец
            </button>
            <button class="dev-btn user" @click="quickLogin('user')">
              <i class="fas fa-user"></i> Пользователь
            </button>
          </div>
        </div>
        
        <div class="dev-section">
          <h4>Быстрая навигация</h4>
          <div class="dev-buttons">
            <button class="dev-btn" @click="goToPage('/')">
              <i class="fas fa-home"></i> Главная
            </button>
            <button class="dev-btn" @click="goToPage('/admin')">
              <i class="fas fa-cog"></i> Админка
            </button>
            <button class="dev-btn" @click="goToPage('/manager')">
              <i class="fas fa-chart-line"></i> Менеджер
            </button>
            <button class="dev-btn" @click="goToPage('/profile')">
              <i class="fas fa-user"></i> Профиль
            </button>
          </div>
        </div>
        
        <div class="dev-section">
          <h4>Текущий пользователь</h4>
          <div class="dev-user-info">
            <p><strong>Роль:</strong> {{ currentRole }}</p>
            <p><strong>Имя:</strong> {{ userName }}</p>
            <p><strong>Email:</strong> {{ userEmail }}</p>
          </div>
          <button v-if="isAuthenticated" class="dev-btn logout" @click="quickLogout">
            <i class="fas fa-sign-out-alt"></i> Выйти
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import Navbar from './components/Navbar.vue'

export default {
  name: 'App',
  components: {
    Navbar
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    
    // Определяем, находимся ли мы в режиме разработки
    const isDev = process.env.NODE_ENV === 'development'
    const showDevPanel = ref(true)
    
    // Вычисляемые свойства
    const isAdminRoute = computed(() => {
      return router.currentRoute.value.path.startsWith('/admin')
    })
    
    const isManagerRoute = computed(() => {
      return router.currentRoute.value.path.startsWith('/manager')
    })
    
    const isAuthenticated = computed(() => store.getters.isAuthenticated)
    const currentRole = computed(() => store.getters.userRole || 'гость')
    const userName = computed(() => store.getters.username || 'Не авторизован')
    const userEmail = computed(() => {
      const user = store.state.user
      return user?.email || 'не указан'
    })
    
    // Данные для быстрого входа
    const credentials = {
      admin: {
        email: 'admin@example.com',
        password: 'admin123',
        name: 'Администратор',
        role: 'admin'
      },
      manager: {
        email: 'manager@example.com',
        password: 'manager123',
        name: 'Менеджер по аренде',
        role: 'manager'
      },
      owner: {
        email: 'owner@example.com',
        password: 'owner123',
        name: 'Иван Петров (Владелец)',
        role: 'owner'
      },
      user: {
        email: 'user@example.com',
        password: 'user123',
        name: 'Алексей Смирнов',
        role: 'user'
      }
    }
    
    // Методы
    const quickLogin = (role) => {
      const creds = credentials[role]
      
      // Сохраняем пользователя в store
      store.commit('SET_USER', {
        email: creds.email,
        name: creds.name,
        role: creds.role
      })
      
      // Перенаправляем в зависимости от роли
      switch(role) {
        case 'admin':
          router.push('/admin')
          break
        case 'manager':
          router.push('/manager')
          break
        case 'owner':
          router.push('/create-ad')
          break
        default:
          router.push('/')
      }
      
      console.log(`Вход выполнен как ${role}`)
    }
    
    const quickLogout = () => {
      store.commit('LOGOUT')
      router.push('/')
      console.log('Выход выполнен')
    }
    
    const goToPage = (path) => {
      router.push(path)
    }
    
    return {
      isDev,
      showDevPanel,
      isAdminRoute,
      isManagerRoute,
      isAuthenticated,
      currentRole,
      userName,
      userEmail,
      quickLogin,
      quickLogout,
      goToPage
    }
  }
}
</script>

<style>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Стили для панели разработчика */
.dev-panel {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
  font-family: 'Segoe UI', sans-serif;
}

.dev-toggle {
  background: #2c3e50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 30px;
  cursor: pointer;
  font-size: 14px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s;
  
  i {
    font-size: 12px;
  }
  
  &:hover {
    background: #34495e;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0,0,0,0.4);
  }
}

.dev-content {
  position: absolute;
  bottom: 60px;
  right: 0;
  width: 320px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  overflow: hidden;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dev-section {
  padding: 15px;
  border-bottom: 1px solid #ecf0f1;
  
  &:last-child {
    border-bottom: none;
  }
  
  h4 {
    margin: 0 0 10px 0;
    color: #2c3e50;
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
}

.dev-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.dev-btn {
  padding: 8px 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.2s;
  background: #ecf0f1;
  color: #2c3e50;
  
  i {
    font-size: 12px;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
  
  &.admin {
    background: #e74c3c;
    color: white;
    
    &:hover {
      background: #c0392b;
    }
  }
  
  &.manager {
    background: #f39c12;
    color: white;
    
    &:hover {
      background: #e67e22;
    }
  }
  
  &.owner {
    background: #27ae60;
    color: white;
    
    &:hover {
      background: #229954;
    }
  }
  
  &.user {
    background: #3498db;
    color: white;
    
    &:hover {
      background: #2980b9;
    }
  }
  
  &.logout {
    background: #95a5a6;
    color: white;
    width: 100%;
    justify-content: center;
    
    &:hover {
      background: #7f8c8d;
    }
  }
}

.dev-user-info {
  background: #f8f9fa;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
  font-size: 13px;
  
  p {
    margin: 5px 0;
    color: #2c3e50;
    
    strong {
      color: #7f8c8d;
      width: 60px;
      display: inline-block;
    }
  }
}
</style>