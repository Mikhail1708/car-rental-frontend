<template>
  <div class="car-detail">
    <div class="container">
      <div class="car-header">
        <h1>{{ car.title }}</h1>
        <div class="car-rating">
          <i class="fas fa-star"></i> {{ car.rating }}
        </div>
      </div>
      
      <div class="car-content">
        <div class="car-main">
          <div class="car-image">
            <img :src="car.image" :alt="car.title">
          </div>
          
          <div class="car-description">
            <h3>Описание</h3>
            <p>{{ car.description }}</p>
            
            <h3>Условия аренды</h3>
            <p>{{ car.conditions }}</p>
            
            <div class="car-price">
              <span class="price">{{ car.price }} ₽/сутки</span>
              <button class="btn btn-primary" @click="rentCar">Оформить аренду</button>
            </div>
          </div>
        </div>
        
        <div class="car-reviews">
          <h3>Отзывы</h3>
          <div v-for="review in reviews" :key="review.id" class="review">
            <div class="review-header">
              <span class="review-author">{{ review.author }}</span>
              <span class="review-rating">
                <i class="fas fa-star"></i> {{ review.rating }}
              </span>
            </div>
            <p class="review-text">{{ review.text }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { ref, onMounted, watch } from 'vue'

export default {
  name: 'CarDetailView',
  setup() {
    const carData = ref(null)
    const loading = ref(true)
    const error = ref(null)
    
    // Точка останова 1: Инициализация компонента
    console.debug('🔄 Компонент CarDetailView инициализирован', {
      timestamp: new Date().toISOString(),
      component: 'CarDetailView'
    })
    
    const loadCarData = async (carId) => {
      // Точка останова 2: Начало загрузки данных
      console.group('📥 Загрузка данных автомобиля')
      console.log('ID автомобиля:', carId)
      console.time('loadCarData')
      
      try {
        loading.value = true
        
        // Имитация загрузки данных
        setTimeout(() => {
          carData.value = {
            id: carId,
            title: 'Toyota Camry',
            price: 3000,
            rating: 4.8
          }
          loading.value = false
          
          // Точка останова 3: Данные загружены
          console.log('✅ Данные загружены:', carData.value)
          console.timeEnd('loadCarData')
          console.groupEnd()
          
          // Отладка через Vue DevTools
          // В консоли можно выполнить: $vm0.carData
        }, 1000)
        
      } catch (err) {
        error.value = err.message
        console.error('❌ Ошибка загрузки:', err)
        console.groupEnd()
      }
    }
    
    // Watch для отладки
    watch(carData, (newVal, oldVal) => {
      console.debug('👀 carData изменился:', { oldVal, newVal })
    }, { deep: true })
    
    onMounted(() => {
      console.debug('🔄 Компонент смонтирован')
      loadCarData(1)
    })
    
    // Для демонстрации во Vue DevTools
    return {
      carData,
      loading,
      error,
      // Методы для отладки
      debug: {
        reload: () => loadCarData(1),
        setData: (data) => { carData.value = data },
        clearError: () => { error.value = null }
      }
    }
  }
}

</script>

<style scoped lang="scss">
.car-detail {
  padding: 30px 0;
  
  .car-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    
    h1 {
      font-size: 32px;
      color: #333;
    }
    
    .car-rating {
      background: #007bff;
      color: white;
      padding: 8px 16px;
      border-radius: 20px;
      
      i {
        margin-right: 5px;
      }
    }
  }
  
  .car-content {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 30px;
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }
  
  .car-main {
    .car-image {
      margin-bottom: 20px;
      
      img {
        width: 100%;
        border-radius: 10px;
      }
    }
    
    .car-description {
      h3 {
        margin: 20px 0 10px;
        color: #555;
      }
      
      p {
        color: #666;
        line-height: 1.6;
      }
      
      .car-price {
        margin-top: 30px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        
        .price {
          font-size: 24px;
          font-weight: bold;
          color: #007bff;
        }
      }
    }
  }
  
  .car-reviews {
    h3 {
      margin-bottom: 20px;
    }
    
    .review {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 15px;
      
      &-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
      }
      
      &-author {
        font-weight: 600;
      }
      
      &-rating {
        color: #ffc107;
      }
      
      &-text {
        color: #666;
      }
    }
  }
}
</style>