<!-- src/views/HomeView.vue -->
<template>
  <div class="home">
    <div class="container">
      <!-- Заголовок и кнопка создания объявления -->
      <div class="home-header">
        <h1>Каталог автомобилей</h1>
        <button v-if="isOwner" class="btn btn-primary" @click="createAd">
          <i class="fas fa-plus"></i> Создать объявление
        </button>
      </div>
      
      <!-- Фильтры -->
      <div class="filters">
        <div class="filter-group">
          <input 
            type="text" 
            v-model="filters.search" 
            placeholder="Поиск по названию..."
            @input="applyFilters"
          >
        </div>
        <div class="filter-group">
          <select v-model="filters.sort" @change="applyFilters">
            <option value="">Сортировка</option>
            <option value="price_asc">Цена (по возрастанию)</option>
            <option value="price_desc">Цена (по убыванию)</option>
            <option value="rating_desc">По рейтингу</option>
          </select>
        </div>
      </div>
      
      <!-- Сетка автомобилей -->
      <div class="cars-grid">
        <CarCard 
          v-for="car in filteredCars" 
          :key="car.id"
          :car="car"
          @click="goToCarDetail(car.id)"
        />
      </div>
      
      <!-- Сообщение, если нет автомобилей -->
      <div v-if="filteredCars.length === 0" class="no-results">
        <i class="fas fa-car"></i>
        <p>Автомобили не найдены</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import CarCard from '@/components/CarCard.vue'

export default {
  name: 'HomeView',
  components: {
    CarCard
  },
  setup() {
    const router = useRouter()
    const store = useStore()
    
    const cars = ref([])
    const filters = ref({
      search: '',
      sort: ''
    })
    
    const isOwner = computed(() => {
      const user = store.getters['auth/user']
      return user && (user.role === 'owner' || user.role === 'admin')
    })
    
    const filteredCars = computed(() => {
      let result = [...cars.value]
      
      // Поиск
      if (filters.value.search) {
        const searchLower = filters.value.search.toLowerCase()
        result = result.filter(car => 
          car.title.toLowerCase().includes(searchLower) ||
          car.description.toLowerCase().includes(searchLower)
        )
      }
      
      // Сортировка
      if (filters.value.sort) {
        switch (filters.value.sort) {
          case 'price_asc':
            result.sort((a, b) => a.price - b.price)
            break
          case 'price_desc':
            result.sort((a, b) => b.price - a.price)
            break
          case 'rating_desc':
            result.sort((a, b) => b.rating - a.rating)
            break
        }
      }
      
      return result
    })
    
    const applyFilters = () => {
      // Фильтрация происходит через computed
    }
    
    const createAd = () => {
      router.push('/create-ad')
    }
    
    const goToCarDetail = (id) => {
      router.push(`/car/${id}`)
    }
    
    // Загрузка автомобилей
    onMounted(async () => {
      try {
        // Здесь будет запрос к API
        cars.value = [
          {
            id: 1,
            title: 'Toyota Camry',
            description: 'Комфортный седан бизнес-класса',
            conditions: 'Без ограничений, полис ОСАГО включен',
            price: 3000,
            rating: 4.8,
            image: 'https://via.placeholder.com/300x200'
          },
          {
            id: 2,
            title: 'BMW X5',
            description: 'Премиальный внедорожник',
            conditions: 'Стаж от 3 лет, депозит 5000',
            price: 5500,
            rating: 4.9,
            image: 'https://via.placeholder.com/300x200'
          },
          {
            id: 3,
            title: 'Kia Rio',
            description: 'Экономичный и надежный',
            conditions: 'Без ограничений',
            price: 2000,
            rating: 4.5,
            image: 'https://via.placeholder.com/300x200'
          }
        ]
      } catch (error) {
        console.error('Ошибка загрузки автомобилей:', error)
      }
    })
    
    return {
      cars,
      filters,
      isOwner,
      filteredCars,
      applyFilters,
      createAd,
      goToCarDetail
    }
  }
}
</script>

<style scoped lang="scss">
.home {
  padding: 30px 0;
  
  .home-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    
    h1 {
      color: #333;
      font-size: 32px;
    }
    
    .btn {
      i {
        margin-right: 5px;
      }
    }
  }
  
  .filters {
    display: flex;
    gap: 15px;
    margin-bottom: 30px;
    
    .filter-group {
      flex: 1;
      
      input, select {
        width: 100%;
        padding: 12px;
        border: 1px solid #ddd;
        border-radius: 8px;
        font-size: 16px;
        
        &:focus {
          outline: none;
          border-color: #007bff;
        }
      }
    }
  }
  
  .cars-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 30px;
  }
  
  .no-results {
    text-align: center;
    padding: 60px 20px;
    color: #999;
    
    i {
      font-size: 64px;
      margin-bottom: 20px;
    }
    
    p {
      font-size: 18px;
    }
  }
}
</style>