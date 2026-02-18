<!-- src/components/Navbar.vue -->
<template>
  <nav class="navbar">
    <div class="container">
      <div class="navbar-brand">
        <router-link to="/" class="logo">
          <i class="fas fa-car"></i> Аренда авто
        </router-link>
      </div>
      
      <div class="navbar-menu" :class="{ 'is-active': isMenuOpen }">
        <div class="navbar-start">
          <router-link to="/" class="nav-link" exact>
            Главная
          </router-link>
          <router-link to="/history" class="nav-link">
            История
          </router-link>
          <router-link to="/favorites" class="nav-link">
            Избранное
          </router-link>
        </div>
        
        <div class="navbar-end">
          <template v-if="!isAuthenticated">
            <router-link to="/login" class="btn btn-secondary">
              Войти
            </router-link>
            <router-link to="/register" class="btn btn-primary">
              Зарегистрироваться
            </router-link>
          </template>
          <template v-else>
            <span class="user-info">
              <i class="fas fa-user"></i> {{ username }}
            </span>
            <button @click="logout" class="btn btn-danger">
              <i class="fas fa-sign-out-alt"></i> Выйти
            </button>
          </template>
        </div>
      </div>
      
      <button class="burger" @click="toggleMenu">
        <i class="fas" :class="isMenuOpen ? 'fa-times' : 'fa-bars'"></i>
      </button>
    </div>
  </nav>
</template>

<script>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'Navbar',
  setup() {
    const store = useStore()
    const router = useRouter()
    const isMenuOpen = ref(false)
    
    // Исправляем доступ к getters
    const isAuthenticated = computed(() => {
      return store.getters.isAuthenticated
    })
    
    const username = computed(() => {
      return store.getters.username
    })
    
    const toggleMenu = () => {
      isMenuOpen.value = !isMenuOpen.value
    }
    
    const logout = () => {
      store.dispatch('logout')
      router.push('/login')
    }
    
    return {
      isAuthenticated,
      username,
      isMenuOpen,
      toggleMenu,
      logout
    }
  }
}
</script>

<style scoped lang="scss">
.navbar {
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
  
  .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 70px;
  }
  
  &-brand {
    .logo {
      font-size: 24px;
      font-weight: bold;
      color: #007bff;
      text-decoration: none;
      
      i {
        margin-right: 5px;
      }
    }
  }
  
  &-menu {
    display: flex;
    align-items: center;
    gap: 30px;
    
    @media (max-width: 768px) {
      display: none;
      position: absolute;
      top: 70px;
      left: 0;
      right: 0;
      background-color: white;
      padding: 20px;
      flex-direction: column;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      
      &.is-active {
        display: flex;
      }
    }
  }
  
  &-start, &-end {
    display: flex;
    gap: 20px;
    align-items: center;
    
    @media (max-width: 768px) {
      flex-direction: column;
      width: 100%;
      
      .btn, .nav-link {
        width: 100%;
        text-align: center;
      }
    }
  }
  
  .nav-link {
    color: #333;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.3s;
    
    &:hover, &.router-link-exact-active {
      color: #007bff;
    }
  }
  
  .user-info {
    display: flex;
    align-items: center;
    gap: 5px;
    color: #666;
    
    i {
      color: #007bff;
    }
  }
  
  .burger {
    display: none;
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #333;
    
    @media (max-width: 768px) {
      display: block;
    }
  }
}
</style>