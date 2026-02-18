<!-- src/views/RegisterView.vue -->
<template>
  <div class="auth-page">
    <div class="container">
      <div class="auth-card">
        <h1>Регистрация</h1>
        
        <form @submit.prevent="handleRegister">
          <div class="form-group">
            <label for="username">
              <i class="fas fa-user"></i> Логин
            </label>
            <input 
              type="text" 
              id="username" 
              v-model="form.username"
              placeholder="Придумайте логин"
              required
            >
          </div>
          
          <div class="form-group">
            <label for="email">
              <i class="fas fa-envelope"></i> Почта
            </label>
            <input 
              type="email" 
              id="email" 
              v-model="form.email"
              placeholder="Введите email"
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
              @input="validatePassword"
              placeholder="Придумайте пароль"
              required
            >
          </div>
          
          <div class="password-requirements">
            <p>Требования к паролю:</p>
            <ul>
              <li :class="{ valid: hasNumber }">
                <i :class="hasNumber ? 'fas fa-check-circle' : 'fas fa-circle'"></i>
                наличие хотя бы одной цифры
              </li>
              <li :class="{ valid: hasLowercase }">
                <i :class="hasLowercase ? 'fas fa-check-circle' : 'fas fa-circle'"></i>
                наличие строчной буквы
              </li>
              <li :class="{ valid: hasUppercase }">
                <i :class="hasUppercase ? 'fas fa-check-circle' : 'fas fa-circle'"></i>
                наличие заглавной буквы
              </li>
              <li :class="{ valid: hasSpecial }">
                <i :class="hasSpecial ? 'fas fa-check-circle' : 'fas fa-circle'"></i>
                наличие специального символа
              </li>
              <li :class="{ valid: hasMinLength }">
                <i :class="hasMinLength ? 'fas fa-check-circle' : 'fas fa-circle'"></i>
                минимальная длина 8 символов
              </li>
            </ul>
          </div>
          
          <div class="form-group">
            <label for="confirmPassword">
              <i class="fas fa-lock"></i> Подтверждение пароля
            </label>
            <input 
              type="password" 
              id="confirmPassword" 
              v-model="form.confirmPassword"
              @input="validateConfirmPassword"
              placeholder="Повторите пароль"
              required
            >
            <small v-if="passwordMismatch" class="error-text">
              Пароли не совпадают
            </small>
          </div>
          
          <div class="form-actions">
            <button 
              type="submit" 
              class="btn btn-primary" 
              :disabled="!isFormValid || loading"
            >
              <i class="fas fa-user-plus"></i>
              {{ loading ? 'Регистрация...' : 'Зарегистрироваться' }}
            </button>
            
            <router-link to="/login" class="btn btn-secondary">
              Уже есть аккаунт
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
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'RegisterView',
  setup() {
    const store = useStore()
    const router = useRouter()
    
    const form = ref({
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    })
    
    const loading = ref(false)
    const error = ref('')
    
    // Валидация пароля
    const hasNumber = computed(() => /\d/.test(form.value.password))
    const hasLowercase = computed(() => /[a-z]/.test(form.value.password))
    const hasUppercase = computed(() => /[A-Z]/.test(form.value.password))
    const hasSpecial = computed(() => /[!@#$%^&*]/.test(form.value.password))
    const hasMinLength = computed(() => form.value.password.length >= 8)
    
    const isPasswordValid = computed(() => {
      return hasNumber.value && hasLowercase.value && 
             hasUppercase.value && hasSpecial.value && hasMinLength.value
    })
    
    const passwordMismatch = computed(() => {
      return form.value.confirmPassword && 
             form.value.password !== form.value.confirmPassword
    })
    
    const isFormValid = computed(() => {
      return form.value.username && 
             form.value.email && 
             isPasswordValid.value && 
             !passwordMismatch.value
    })
    
    const validatePassword = () => {
      // Можно добавить дополнительную логику при вводе
    }
    
    const validateConfirmPassword = () => {
      // Можно добавить дополнительную логику
    }
    
    const handleRegister = async () => {
      if (!isFormValid.value) return
      
      loading.value = true
      error.value = ''
      
      try {
        await store.dispatch('auth/register', {
          username: form.value.username,
          email: form.value.email,
          password: form.value.password
        })
        router.push('/')
      } catch (err) {
        error.value = err.response?.data?.message || 'Ошибка при регистрации'
      } finally {
        loading.value = false
      }
    }
    
    return {
      form,
      loading,
      error,
      hasNumber,
      hasLowercase,
      hasUppercase,
      hasSpecial,
      hasMinLength,
      passwordMismatch,
      isFormValid,
      validatePassword,
      validateConfirmPassword,
      handleRegister
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
    max-width: 500px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    
    h1 {
      text-align: center;
      margin-bottom: 30px;
      color: #333;
      font-size: 28px;
    }
    
    .password-requirements {
      background-color: #f8f9fa;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 20px;
      
      p {
        font-weight: 500;
        margin-bottom: 10px;
        color: #666;
      }
      
      ul {
        list-style: none;
        padding: 0;
        
        li {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #999;
          margin-bottom: 5px;
          font-size: 14px;
          
          i {
            width: 16px;
            font-size: 12px;
          }
          
          &.valid {
            color: #28a745;
            
            i {
              color: #28a745;
            }
          }
        }
      }
    }
    
    .error-text {
      color: #dc3545;
      font-size: 12px;
      margin-top: 5px;
      display: block;
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