<!-- src/views/AdminView.vue -->
<template>
  <div class="admin-view">
    <div class="container">
      <div class="admin-header">
        <h1>Панель администратора</h1>
        <div class="admin-stats-brief">
          <div class="stat-card">
            <i class="fas fa-users"></i>
            <div class="stat-info">
              <span class="stat-value">{{ stats.totalUsers }}</span>
              <span class="stat-label">Пользователей</span>
            </div>
          </div>
          <div class="stat-card">
            <i class="fas fa-car"></i>
            <div class="stat-info">
              <span class="stat-value">{{ stats.totalCars }}</span>
              <span class="stat-label">Автомобилей</span>
            </div>
          </div>
          <div class="stat-card">
            <i class="fas fa-calendar-check"></i>
            <div class="stat-info">
              <span class="stat-value">{{ stats.activeBookings }}</span>
              <span class="stat-label">Активных аренд</span>
            </div>
          </div>
          <div class="stat-card">
            <i class="fas fa-star"></i>
            <div class="stat-info">
              <span class="stat-value">{{ stats.avgRating }}</span>
              <span class="stat-label">Ср. рейтинг</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Навигация по вкладкам -->
      <div class="admin-tabs">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="['tab-btn', { active: activeTab === tab.id }]"
        >
          <i :class="tab.icon"></i>
          {{ tab.name }}
        </button>
      </div>
      
      <!-- Контент вкладок -->
      <div class="tab-content">
        <!-- Вкладка: Статистика и дашборд -->
        <div v-if="activeTab === 'dashboard'" class="dashboard-tab">
          <div class="stats-grid">
            <div class="stats-chart">
              <h3>Динамика аренды</h3>
              <div class="chart-placeholder">
                <!-- Здесь будет график -->
                <div class="bar-chart">
                  <div v-for="(value, index) in rentalStats" :key="index" class="bar-container">
                    <div class="bar" :style="{ height: value * 3 + 'px' }"></div>
                    <span class="bar-label">{{ index }}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="stats-cards">
              <div class="stat-detailed-card">
                <h4>Рейтинг автомобилей</h4>
                <div v-for="car in topRatedCars" :key="car.id" class="rating-item">
                  <span>{{ car.title }}</span>
                  <div class="stars">
                    <i v-for="n in 5" :key="n" 
                       :class="['fas fa-star', { filled: n <= car.rating }]"></i>
                    <span>({{ car.rating }})</span>
                  </div>
                </div>
              </div>
              
              <div class="stat-detailed-card">
                <h4>Последние отзывы</h4>
                <div v-for="review in recentReviews" :key="review.id" class="review-item">
                  <div class="review-header">
                    <strong>{{ review.user }}</strong>
                    <div class="stars">
                      <i v-for="n in 5" :key="n" 
                         :class="['fas fa-star', { filled: n <= review.rating }]"></i>
                    </div>
                  </div>
                  <p>{{ review.comment }}</p>
                  <small>{{ review.date }}</small>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Вкладка: Управление пользователями -->
        <div v-if="activeTab === 'users'" class="users-tab">
          <div class="tab-header">
            <h2>Управление пользователями</h2>
            <button class="btn btn-primary" @click="showAddUserModal = true">
              <i class="fas fa-plus"></i> Добавить пользователя
            </button>
          </div>
          
          <div class="filters">
            <input 
              type="text" 
              v-model="userFilters.search" 
              placeholder="Поиск по имени или email..."
              class="search-input"
            >
            <select v-model="userFilters.role" class="filter-select">
              <option value="">Все роли</option>
              <option value="user">Пользователь</option>
              <option value="owner">Владелец</option>
              <option value="admin">Администратор</option>
            </select>
            <select v-model="userFilters.status" class="filter-select">
              <option value="">Все статусы</option>
              <option value="active">Активные</option>
              <option value="blocked">Заблокированные</option>
            </select>
          </div>
          
          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Логин</th>
                <th>Почта</th>
                <th>Роль</th>
                <th>Дата регистрации</th>
                <th>Статус</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in filteredUsers" :key="user.id">
                <td>{{ user.id }}</td>
                <td>{{ user.login }}</td>
                <td>{{ user.email }}</td>
                <td>
                  <select v-model="user.role" @change="updateUserRole(user)" class="role-select">
                    <option value="user">Пользователь</option>
                    <option value="owner">Владелец</option>
                    <option value="admin">Админ</option>
                  </select>
                </td>
                <td>{{ user.regDate }}</td>
                <td>
                  <span :class="['status-badge', user.status]">
                    {{ user.status === 'active' ? 'Активен' : 'Заблокирован' }}
                  </span>
                </td>
                <td>
                  <button class="btn-icon edit" @click="editUser(user)" title="Редактировать">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button class="btn-icon delete" @click="deleteUser(user)" title="Удалить">
                    <i class="fas fa-trash"></i>
                  </button>
                  <button class="btn-icon toggle" @click="toggleUserStatus(user)" 
                          :title="user.status === 'active' ? 'Заблокировать' : 'Разблокировать'">
                    <i :class="user.status === 'active' ? 'fas fa-ban' : 'fas fa-check'"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Вкладка: Управление автомобилями -->
        <div v-if="activeTab === 'cars'" class="cars-tab">
          <div class="tab-header">
            <h2>Управление автомобилями</h2>
            <button class="btn btn-primary" @click="showAddCarModal = true">
              <i class="fas fa-plus"></i> Добавить автомобиль
            </button>
          </div>
          
          <div class="filters">
            <input 
              type="text" 
              v-model="carFilters.search" 
              placeholder="Поиск по марке или модели..."
              class="search-input"
            >
            <select v-model="carFilters.status" class="filter-select">
              <option value="">Все статусы</option>
              <option value="available">Доступен</option>
              <option value="rented">В аренде</option>
              <option value="maintenance">На обслуживании</option>
            </select>
            <input 
              type="number" 
              v-model="carFilters.minPrice" 
              placeholder="Мин. цена"
              class="price-input"
            >
            <input 
              type="number" 
              v-model="carFilters.maxPrice" 
              placeholder="Макс. цена"
              class="price-input"
            >
          </div>
          
          <div class="cars-grid">
            <div v-for="car in filteredCars" :key="car.id" class="car-admin-card">
              <div class="car-image">
                <img :src="car.image" :alt="car.title">
                <span :class="['car-status', car.status]">
                  {{ getCarStatusText(car.status) }}
                </span>
              </div>
              <div class="car-info">
                <h3>{{ car.title }}</h3>
                <p class="car-owner">Владелец: {{ car.owner }}</p>
                <p class="car-price">{{ car.price }} ₽/сутки</p>
                <div class="car-rating">
                  <i class="fas fa-star"></i> {{ car.rating }} ({{ car.reviews }} отзывов)
                </div>
                <div class="car-actions">
                  <button class="btn-icon edit" @click="editCar(car)">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button class="btn-icon delete" @click="deleteCar(car)">
                    <i class="fas fa-trash"></i>
                  </button>
                  <button class="btn-icon stats" @click="showCarStats(car)">
                    <i class="fas fa-chart-line"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Вкладка: Управление заказами -->
        <div v-if="activeTab === 'bookings'" class="bookings-tab">
          <div class="tab-header">
            <h2>Управление заказами</h2>
          </div>
          
          <div class="filters">
            <input 
              type="text" 
              v-model="bookingFilters.search" 
              placeholder="Поиск по ID или пользователю..."
              class="search-input"
            >
            <select v-model="bookingFilters.status" class="filter-select">
              <option value="">Все статусы</option>
              <option value="pending">Ожидание</option>
              <option value="confirmed">Подтвержден</option>
              <option value="active">Активен</option>
              <option value="completed">Завершен</option>
              <option value="cancelled">Отменен</option>
            </select>
            <input type="date" v-model="bookingFilters.dateFrom" class="date-input">
            <input type="date" v-model="bookingFilters.dateTo" class="date-input">
          </div>
          
          <table class="data-table">
            <thead>
              <tr>
                <th>ID заказа</th>
                <th>Пользователь</th>
                <th>Автомобиль</th>
                <th>Даты</th>
                <th>Сумма</th>
                <th>Статус</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="booking in filteredBookings" :key="booking.id">
                <td>#{{ booking.id }}</td>
                <td>{{ booking.user }}</td>
                <td>{{ booking.car }}</td>
                <td>{{ booking.startDate }} - {{ booking.endDate }}</td>
                <td>{{ booking.total }} ₽</td>
                <td>
                  <select v-model="booking.status" @change="updateBookingStatus(booking)" 
                          :class="['status-select', booking.status]">
                    <option value="pending">Ожидание</option>
                    <option value="confirmed">Подтвержден</option>
                    <option value="active">Активен</option>
                    <option value="completed">Завершен</option>
                    <option value="cancelled">Отменен</option>
                  </select>
                </td>
                <td>
                  <button class="btn-icon view" @click="viewBookingDetails(booking)">
                    <i class="fas fa-eye"></i>
                  </button>
                  <button class="btn-icon edit" @click="editBooking(booking)">
                    <i class="fas fa-edit"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    
    <!-- Модальные окна (упрощенно) -->
    <div v-if="showAddUserModal" class="modal">
      <div class="modal-content">
        <h3>Добавить пользователя</h3>
        <!-- Форма добавления пользователя -->
        <button @click="showAddUserModal = false">Закрыть</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'AdminView',
  setup() {
    const activeTab = ref('dashboard')
    
    const tabs = [
      { id: 'dashboard', name: 'Дашборд', icon: 'fas fa-chart-pie' },
      { id: 'users', name: 'Пользователи', icon: 'fas fa-users' },
      { id: 'cars', name: 'Автомобили', icon: 'fas fa-car' },
      { id: 'bookings', name: 'Заказы', icon: 'fas fa-calendar-check' }
    ]
    
    // Статистика
    const stats = ref({
      totalUsers: 156,
      totalCars: 48,
      activeBookings: 23,
      avgRating: 4.7
    })
    
    const rentalStats = ref({
      'Пн': 12,
      'Вт': 15,
      'Ср': 18,
      'Чт': 14,
      'Пт': 22,
      'Сб': 28,
      'Вс': 25
    })
    
    const topRatedCars = ref([
      { id: 1, title: 'BMW X5', rating: 4.9 },
      { id: 2, title: 'Mercedes E-Class', rating: 4.8 },
      { id: 3, title: 'Toyota Camry', rating: 4.7 },
      { id: 4, title: 'Audi Q7', rating: 4.6 }
    ])
    
    const recentReviews = ref([
      { id: 1, user: 'Иван Петров', rating: 5, comment: 'Отличный автомобиль, все понравилось!', date: '18.02.2026' },
      { id: 2, user: 'Мария Иванова', rating: 4, comment: 'Хорошая машина, но есть мелкие недочеты', date: '17.02.2026' },
      { id: 3, user: 'Алексей Сидоров', rating: 5, comment: 'Лучший сервис аренды!', date: '16.02.2026' }
    ])
    
    // Пользователи
    const users = ref([
      { 
        id: 1, 
        login: 'Полик', 
        email: 'mukal57@gmail.com', 
        role: 'admin',
        regDate: '14.04.2026', 
        status: 'active'
      },
      { 
        id: 2, 
        login: 'Иван Петров', 
        email: 'ivan@mail.com', 
        role: 'owner',
        regDate: '10.02.2026', 
        status: 'active'
      },
      { 
        id: 3, 
        login: 'Мария Сидорова', 
        email: 'maria@mail.com', 
        role: 'user',
        regDate: '05.01.2026', 
        status: 'blocked'
      },
      { 
        id: 4, 
        login: 'Алексей Иванов', 
        email: 'alex@mail.com', 
        role: 'user',
        regDate: '20.12.2025', 
        status: 'active'
      }
    ])
    
    // Автомобили
    const cars = ref([
      {
        id: 1,
        title: 'BMW X5',
        owner: 'Иван Петров',
        price: 5500,
        rating: 4.9,
        reviews: 24,
        status: 'available',
        image: 'https://via.placeholder.com/300x200'
      },
      {
        id: 2,
        title: 'Toyota Camry',
        owner: 'Мария Сидорова',
        price: 3000,
        rating: 4.7,
        reviews: 18,
        status: 'rented',
        image: 'https://via.placeholder.com/300x200'
      },
      {
        id: 3,
        title: 'Mercedes E-Class',
        owner: 'Алексей Иванов',
        price: 6000,
        rating: 4.8,
        reviews: 32,
        status: 'maintenance',
        image: 'https://via.placeholder.com/300x200'
      }
    ])
    
    // Заказы
    const bookings = ref([
      {
        id: 1001,
        user: 'Иван Петров',
        car: 'BMW X5',
        startDate: '20.02.2026',
        endDate: '25.02.2026',
        total: 27500,
        status: 'active'
      },
      {
        id: 1002,
        user: 'Мария Иванова',
        car: 'Toyota Camry',
        startDate: '18.02.2026',
        endDate: '20.02.2026',
        total: 6000,
        status: 'completed'
      },
      {
        id: 1003,
        user: 'Алексей Сидоров',
        car: 'Mercedes E-Class',
        startDate: '22.02.2026',
        endDate: '24.02.2026',
        total: 12000,
        status: 'pending'
      }
    ])
    
    // Фильтры
    const userFilters = ref({
      search: '',
      role: '',
      status: ''
    })
    
    const carFilters = ref({
      search: '',
      status: '',
      minPrice: '',
      maxPrice: ''
    })
    
    const bookingFilters = ref({
      search: '',
      status: '',
      dateFrom: '',
      dateTo: ''
    })
    
    // Модальные окна
    const showAddUserModal = ref(false)
    const showAddCarModal = ref(false)
    
    // Вычисляемые свойства для фильтрации
    const filteredUsers = computed(() => {
      return users.value.filter(user => {
        const matchesSearch = user.login.toLowerCase().includes(userFilters.value.search.toLowerCase()) ||
                             user.email.toLowerCase().includes(userFilters.value.search.toLowerCase())
        const matchesRole = !userFilters.value.role || user.role === userFilters.value.role
        const matchesStatus = !userFilters.value.status || user.status === userFilters.value.status
        return matchesSearch && matchesRole && matchesStatus
      })
    })
    
    const filteredCars = computed(() => {
      return cars.value.filter(car => {
        const matchesSearch = car.title.toLowerCase().includes(carFilters.value.search.toLowerCase())
        const matchesStatus = !carFilters.value.status || car.status === carFilters.value.status
        const matchesMinPrice = !carFilters.value.minPrice || car.price >= carFilters.value.minPrice
        const matchesMaxPrice = !carFilters.value.maxPrice || car.price <= carFilters.value.maxPrice
        return matchesSearch && matchesStatus && matchesMinPrice && matchesMaxPrice
      })
    })
    
    const filteredBookings = computed(() => {
      return bookings.value.filter(booking => {
        const matchesSearch = booking.id.toString().includes(bookingFilters.value.search) ||
                             booking.user.toLowerCase().includes(bookingFilters.value.search.toLowerCase())
        const matchesStatus = !bookingFilters.value.status || booking.status === bookingFilters.value.status
        return matchesSearch && matchesStatus
      })
    })
    
    // Методы
    const getCarStatusText = (status) => {
      const statusMap = {
        'available': 'Доступен',
        'rented': 'В аренде',
        'maintenance': 'На обслуживании'
      }
      return statusMap[status] || status
    }
    
    const updateUserRole = (user) => {
      console.log('Обновление роли пользователя:', user)
      // API call
    }
    
    const toggleUserStatus = (user) => {
      user.status = user.status === 'active' ? 'blocked' : 'active'
      console.log('Статус пользователя изменен:', user)
    }
    
    const deleteUser = (user) => {
      if (confirm(`Удалить пользователя ${user.login}?`)) {
        users.value = users.value.filter(u => u.id !== user.id)
      }
    }
    
    const editUser = (user) => {
      console.log('Редактирование пользователя:', user)
      // Открыть модальное окно редактирования
    }
    
    const deleteCar = (car) => {
      if (confirm(`Удалить автомобиль ${car.title}?`)) {
        cars.value = cars.value.filter(c => c.id !== car.id)
      }
    }
    
    const editCar = (car) => {
      console.log('Редактирование автомобиля:', car)
      // Открыть модальное окно редактирования
    }
    
    const showCarStats = (car) => {
      console.log('Статистика автомобиля:', car)
      // Показать детальную статистику
    }
    
    const updateBookingStatus = (booking) => {
      console.log('Обновление статуса заказа:', booking)
      // API call
    }
    
    const viewBookingDetails = (booking) => {
      console.log('Детали заказа:', booking)
      // Показать детали
    }
    
    const editBooking = (booking) => {
      console.log('Редактирование заказа:', booking)
      // Открыть модальное окно
    }
    
    return {
      activeTab,
      tabs,
      stats,
      rentalStats,
      topRatedCars,
      recentReviews,
      users,
      cars,
      bookings,
      userFilters,
      carFilters,
      bookingFilters,
      filteredUsers,
      filteredCars,
      filteredBookings,
      showAddUserModal,
      showAddCarModal,
      getCarStatusText,
      updateUserRole,
      toggleUserStatus,
      deleteUser,
      editUser,
      deleteCar,
      editCar,
      showCarStats,
      updateBookingStatus,
      viewBookingDetails,
      editBooking
    }
  }
}
</script>

<style scoped lang="scss">
.admin-view {
  padding: 30px 0;
  background: #f5f7fa;
  min-height: 100vh;
  
  .admin-header {
    margin-bottom: 30px;
    
    h1 {
      color: #333;
      margin-bottom: 20px;
    }
    
    .admin-stats-brief {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      
      .stat-card {
        background: white;
        padding: 20px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        gap: 15px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        
        i {
          font-size: 32px;
          color: #007bff;
        }
        
        .stat-info {
          display: flex;
          flex-direction: column;
          
          .stat-value {
            font-size: 24px;
            font-weight: bold;
            color: #333;
          }
          
          .stat-label {
            color: #666;
            font-size: 14px;
          }
        }
      }
    }
  }
  
  .admin-tabs {
    display: flex;
    gap: 10px;
    margin-bottom: 30px;
    border-bottom: 2px solid #ddd;
    padding-bottom: 10px;
    
    .tab-btn {
      padding: 10px 20px;
      background: none;
      border: none;
      cursor: pointer;
      font-size: 16px;
      color: #666;
      transition: all 0.3s;
      
      i {
        margin-right: 8px;
      }
      
      &:hover {
        color: #007bff;
      }
      
      &.active {
        color: #007bff;
        border-bottom: 2px solid #007bff;
        margin-bottom: -12px;
      }
    }
  }
  
  .tab-content {
    background: white;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  }
  
  .tab-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    
    h2 {
      color: #333;
    }
  }
  
  .filters {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
    flex-wrap: wrap;
    
    .search-input {
      flex: 1;
      min-width: 200px;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 5px;
    }
    
    .filter-select, .date-input, .price-input {
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 5px;
      min-width: 150px;
    }
  }
  
  .data-table {
    width: 100%;
    border-collapse: collapse;
    
    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #eee;
    }
    
    th {
      background: #f8f9fa;
      font-weight: 600;
      color: #555;
    }
    
    .role-select {
      padding: 5px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    
    .status-badge {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      
      &.active {
        background: #d4edda;
        color: #155724;
      }
      
      &.blocked {
        background: #f8d7da;
        color: #721c24;
      }
    }
    
    .status-select {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      
      &.pending { background: #fff3cd; color: #856404; }
      &.confirmed { background: #cce5ff; color: #004085; }
      &.active { background: #d4edda; color: #155724; }
      &.completed { background: #d1ecf1; color: #0c5460; }
      &.cancelled { background: #f8d7da; color: #721c24; }
    }
    
    .btn-icon {
      padding: 5px 10px;
      margin: 0 2px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      
      &.edit { background: #007bff; color: white; }
      &.delete { background: #dc3545; color: white; }
      &.toggle { background: #ffc107; color: #333; }
      &.view { background: #17a2b8; color: white; }
      &.stats { background: #28a745; color: white; }
      
      &:hover {
        opacity: 0.8;
      }
    }
  }
  
  .cars-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    
    .car-admin-card {
      background: white;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      
      .car-image {
        position: relative;
        height: 150px;
        
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .car-status {
          position: absolute;
          top: 10px;
          right: 10px;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          
          &.available { background: #d4edda; color: #155724; }
          &.rented { background: #cce5ff; color: #004085; }
          &.maintenance { background: #fff3cd; color: #856404; }
        }
      }
      
      .car-info {
        padding: 15px;
        
        h3 {
          margin-bottom: 10px;
          color: #333;
        }
        
        .car-owner {
          color: #666;
          font-size: 14px;
          margin-bottom: 5px;
        }
        
        .car-price {
          font-weight: bold;
          color: #007bff;
          margin-bottom: 5px;
        }
        
        .car-rating {
          color: #ffc107;
          font-size: 14px;
          margin-bottom: 10px;
        }
        
        .car-actions {
          display: flex;
          gap: 5px;
          justify-content: flex-end;
        }
      }
    }
  }
  
  .dashboard-tab {
    .stats-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 20px;
      
      @media (max-width: 768px) {
        grid-template-columns: 1fr;
      }
      
      .stats-chart {
        background: #f8f9fa;
        padding: 20px;
        border-radius: 10px;
        
        h3 {
          margin-bottom: 20px;
          color: #333;
        }
        
        .chart-placeholder {
          height: 300px;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          
          .bar-chart {
            display: flex;
            align-items: flex-end;
            gap: 15px;
            height: 250px;
            
            .bar-container {
              display: flex;
              flex-direction: column;
              align-items: center;
              
              .bar {
                width: 40px;
                background: #007bff;
                border-radius: 5px 5px 0 0;
                transition: height 0.3s;
              }
              
              .bar-label {
                margin-top: 10px;
                color: #666;
              }
            }
          }
        }
      }
      
      .stats-cards {
        display: flex;
        flex-direction: column;
        gap: 20px;
        
        .stat-detailed-card {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 10px;
          
          h4 {
            margin-bottom: 15px;
            color: #333;
          }
          
          .rating-item, .review-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0;
            border-bottom: 1px solid #ddd;
            
            &:last-child {
              border-bottom: none;
            }
            
            .stars {
              color: #ddd;
              
              .filled {
                color: #ffc107;
              }
              
              span {
                margin-left: 5px;
                color: #666;
              }
            }
          }
          
          .review-item {
            flex-direction: column;
            align-items: flex-start;
            
            .review-header {
              display: flex;
              justify-content: space-between;
              width: 100%;
              margin-bottom: 5px;
            }
            
            p {
              color: #666;
              margin-bottom: 5px;
            }
            
            small {
              color: #999;
            }
          }
        }
      }
    }
  }
  
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    
    .modal-content {
      background: white;
      padding: 30px;
      border-radius: 10px;
      min-width: 400px;
    }
  }
}
</style>