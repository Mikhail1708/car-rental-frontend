<!-- src/views/LoginView.vue -->
<template>
  <div class="auth-page">
    <div class="container">
      <div class="auth-card">
        <h1>Вход в систему</h1>
        
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label for="email">
              <i class="fas fa-envelope"></i> Логин
            </label>
            <input 
              type="text" 
              id="email" 
              v-model="form.email"
              placeholder="Введите логин или email"
              required
            >
          </div>
          
          <div class="form-group">
            <label for="password">
              <i class="fas fa-lock"></i> Пароль
            </label>
            <input 
              type="password" 
              id="password" 
              v-model="form.password"
              placeholder="Введите пароль"
              required
            >
          </div>
          
          <div class="form-actions">
            <button type="submit" class="btn btn-primary" :disabled="loading">
              <i class="fas fa-sign-in-alt"></i> 
              {{ loading ? 'Вход...' : 'Войти' }}
            </button>
            
            <router-link to="/register" class="btn btn-secondary">
              Зарегистрироваться
            </router-link>
          </div>
        </form>
        
        <div v-if="error" class="alert alert-danger">
          {{ error }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'LoginView',
  setup() {
    const store = useStore()
    const router = useRouter()
    
    const form = ref({
      login: '',
      password: ''
    })
    
    const loading = ref(false)
    const error = ref('')
    
    const handleLogin = async () => {
      loading.value = true
      error.value = ''
      
      try {
        await store.dispatch('auth/login', form.value)
        router.push('/')
      } catch (err) {
        error.value = err.response?.data?.message || 'Ошибка при входе'
      } finally {
        loading.value = false
      }
    }
    
    return {
      form,
      loading,
      error,
      handleLogin
    }
  }
}
</script>

<style scoped lang="scss">
.auth-page {
  min-height: calc(100vh - 70px);
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  
  .auth-card {
    background: white;
    border-radius: 20px;
    padding: 40px;
    width: 100%;
    max-width: 400px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    
    h1 {
      text-align: center;
      margin-bottom: 30px;
      color: #333;
      font-size: 28px;
    }
    
    .form-group {
      label {
        display: flex;
        align-items: center;
        gap: 5px;
        color: #666;
        
        i {
          color: #007bff;
        }
      }
    }
    
    .form-actions {
      display: flex;
      gap: 10px;
      margin-top: 30px;
      
      .btn {
        flex: 1;
        
        i {
          margin-right: 5px;
        }
      }
    }
    
    .alert {
      margin-top: 20px;
      padding: 10px;
      border-radius: 5px;
      text-align: center;
      
      &-danger {
        background-color: #f8d7da;
        color: #721c24;
        border: 1px solid #f5c6cb;
      }
    }
  }
}
</style>