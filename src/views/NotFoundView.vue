<!-- src/views/NotFoundView.vue -->
<template>
  <div class="not-found">
    <div class="container">
      <div class="not-found-content">
        <div class="error-code">404</div>
        <h1>Страница не найдена</h1>
        <p>Извините, запрашиваемая страница не существует или была перемещена.</p>
        
        <div class="actions">
          <router-link to="/" class="btn btn-primary">
            <i class="fas fa-home"></i> На главную
          </router-link>
          <button @click="goBack" class="btn btn-secondary">
            <i class="fas fa-arrow-left"></i> Вернуться назад
          </button>
        </div>
        
        <div class="suggestions">
          <h3>Возможно, вас заинтересует:</h3>
          <div class="links">
            <router-link to="/" class="suggestion-link">
              <i class="fas fa-car"></i> Каталог автомобилей
            </router-link>
            <router-link to="/login" class="suggestion-link">
              <i class="fas fa-sign-in-alt"></i> Вход в систему
            </router-link>
            <router-link to="/register" class="suggestion-link">
              <i class="fas fa-user-plus"></i> Регистрация
            </router-link>
            <router-link to="/feedback" class="suggestion-link">
              <i class="fas fa-envelope"></i> Обратная связь
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'

export default {
  name: 'NotFoundView',
  setup() {
    const router = useRouter()
    
    const goBack = () => {
      router.go(-1)
    }
    
    return {
      goBack
    }
  }
}
</script>

<style scoped lang="scss">
.not-found {
  min-height: calc(100vh - 70px);
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 30px 0;
  
  .not-found-content {
    background: white;
    border-radius: 20px;
    padding: 60px 40px;
    text-align: center;
    max-width: 600px;
    margin: 0 auto;
    box-shadow: 0 20px 40px rgba(0,0,0,0.2);
    
    .error-code {
      font-size: 120px;
      font-weight: bold;
      color: #007bff;
      line-height: 1;
      margin-bottom: 20px;
      text-shadow: 5px 5px 0 rgba(0,123,255,0.1);
    }
    
    h1 {
      font-size: 36px;
      color: #333;
      margin-bottom: 20px;
    }
    
    p {
      color: #666;
      font-size: 18px;
      margin-bottom: 30px;
      line-height: 1.6;
    }
    
    .actions {
      display: flex;
      gap: 15px;
      justify-content: center;
      margin-bottom: 40px;
      
      .btn {
        padding: 12px 24px;
        font-size: 16px;
        
        i {
          margin-right: 8px;
        }
      }
    }
    
    .suggestions {
      border-top: 1px solid #dee2e6;
      padding-top: 30px;
      
      h3 {
        color: #555;
        margin-bottom: 20px;
        font-size: 20px;
      }
      
      .links {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 15px;
        
        .suggestion-link {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px;
          background: #f8f9fa;
          color: #333;
          text-decoration: none;
          border-radius: 8px;
          transition: all 0.3s;
          
          i {
            color: #007bff;
          }
          
          &:hover {
            background: #007bff;
            color: white;
            
            i {
              color: white;
            }
          }
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .not-found {
    .not-found-content {
      padding: 40px 20px;
      
      .error-code {
        font-size: 80px;
      }
      
      h1 {
        font-size: 24px;
      }
      
      .actions {
        flex-direction: column;
      }
      
      .suggestions {
        .links {
          grid-template-columns: 1fr;
        }
      }
    }
  }
}
</style>