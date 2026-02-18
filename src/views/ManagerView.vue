<!-- src/views/ManagerView.vue -->
<template>
  <div class="manager-view">
    <div class="container">
      <div class="manager-header">
        <h1>Панель менеджера по аренде</h1>
        <div class="manager-info">
          <i class="fas fa-user-tie"></i>
          <span>{{ username }}</span>
        </div>
      </div>
      
      <!-- Краткая статистика -->
      <div class="stats-cards">
        <div class="stat-card">
          <i class="fas fa-car"></i>
          <div class="stat-info">
            <span class="stat-value">{{ stats.availableCars }}</span>
            <span class="stat-label">Доступно авто</span>
          </div>
        </div>
        <div class="stat-card">
          <i class="fas fa-calendar-check"></i>
          <div class="stat-info">
            <span class="stat-value">{{ stats.activeRentals }}</span>
            <span class="stat-label">Активных аренд</span>
          </div>
        </div>
        <div class="stat-card">
          <i class="fas fa-clock"></i>
          <div class="stat-info">
            <span class="stat-value">{{ stats.pendingBookings }}</span>
            <span class="stat-label">Ожидают подтверждения</span>
          </div>
        </div>
        <div class="stat-card">
          <i class="fas fa-ruble-sign"></i>
          <div class="stat-info">
            <span class="stat-value">{{ formatMoney(stats.todayRevenue) }}</span>
            <span class="stat-label">Выручка за сегодня</span>
          </div>
        </div>
      </div>
      
      <!-- Навигация по вкладкам -->
      <div class="manager-tabs">
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
        <!-- Вкладка: Управление автомобилями -->
        <div v-if="activeTab === 'cars'" class="cars-tab">
          <div class="tab-header">
            <h2>Управление автомобилями</h2>
            <button class="btn btn-primary" @click="showAddCarModal = true">
              <i class="fas fa-plus"></i> Выставить автомобиль
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
          </div>
          
          <div class="cars-grid">
            <div v-for="car in filteredCars" :key="car.id" class="car-manager-card">
              <div class="car-image">
                <img :src="car.image" :alt="car.title">
                <span :class="['car-status', car.status]">
                  {{ getCarStatusText(car.status) }}
                </span>
              </div>
              <div class="car-info">
                <h3>{{ car.title }}</h3>
                <p class="car-details">{{ car.year }}, {{ car.color }}</p>
                <p class="car-price">{{ car.price }} ₽/сутки</p>
                <div class="car-stats">
                  <span><i class="fas fa-star"></i> {{ car.rating }}</span>
                  <span><i class="fas fa-calendar"></i> {{ car.rentalCount }} аренд</span>
                </div>
                <div class="car-actions">
                  <button class="btn-icon edit" @click="editCar(car)" title="Редактировать">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button class="btn-icon toggle" @click="toggleCarStatus(car)" 
                          :title="car.status === 'available' ? 'Снять с аренды' : 'Выставить в аренду'">
                    <i :class="car.status === 'available' ? 'fas fa-ban' : 'fas fa-check'"></i>
                  </button>
                  <button class="btn-icon stats" @click="showCarRentalHistory(car)" title="История аренд">
                    <i class="fas fa-history"></i>
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
              placeholder="Поиск по ID или клиенту..."
              class="search-input"
            >
            <select v-model="bookingFilters.status" class="filter-select">
              <option value="">Все статусы</option>
              <option value="pending">Ожидает подтверждения</option>
              <option value="confirmed">Подтвержден</option>
              <option value="active">Активен</option>
              <option value="completed">Завершен</option>
              <option value="cancelled">Отменен</option>
            </select>
            <input type="date" v-model="bookingFilters.dateFrom" class="date-input">
            <input type="date" v-model="bookingFilters.dateTo" class="date-input">
          </div>
          
          <div class="bookings-list">
            <div v-for="booking in filteredBookings" :key="booking.id" class="booking-card">
              <div class="booking-header">
                <span class="booking-id">Заказ #{{ booking.id }}</span>
                <span :class="['booking-status', booking.status]">
                  {{ getBookingStatusText(booking.status) }}
                </span>
              </div>
              
              <div class="booking-body">
                <div class="booking-car">
                  <img :src="booking.carImage" :alt="booking.carName" class="car-thumb">
                  <div>
                    <strong>{{ booking.carName }}</strong>
                    <p>Владелец: {{ booking.ownerName }}</p>
                  </div>
                </div>
                
                <div class="booking-client">
                  <i class="fas fa-user"></i>
                  <div>
                    <strong>{{ booking.clientName }}</strong>
                    <p>{{ booking.clientPhone }}</p>
                    <p>{{ booking.clientEmail }}</p>
                  </div>
                </div>
                
                <div class="booking-dates">
                  <div>
                    <i class="fas fa-calendar-alt"></i>
                    <span>{{ booking.startDate }} - {{ booking.endDate }}</span>
                  </div>
                  <div>
                    <i class="fas fa-clock"></i>
                    <span>{{ booking.days }} дней</span>
                  </div>
                </div>
                
                <div class="booking-payment">
                  <div class="payment-info">
                    <span>Сумма: <strong>{{ formatMoney(booking.total) }}</strong></span>
                    <span :class="['payment-status', booking.paymentStatus]">
                      {{ getPaymentStatusText(booking.paymentStatus) }}
                    </span>
                  </div>
                </div>
              </div>
              
              <div class="booking-actions">
                <template v-if="booking.status === 'pending'">
                  <button class="btn btn-success" @click="confirmBooking(booking)">
                    <i class="fas fa-check"></i> Подтвердить
                  </button>
                  <button class="btn btn-danger" @click="rejectBooking(booking)">
                    <i class="fas fa-times"></i> Отклонить
                  </button>
                </template>
                
                <template v-if="booking.status === 'confirmed'">
                  <button class="btn btn-primary" @click="startRental(booking)">
                    <i class="fas fa-play"></i> Начать аренду
                  </button>
                </template>
                
                <template v-if="booking.status === 'active'">
                  <button class="btn btn-warning" @click="completeRental(booking)">
                    <i class="fas fa-flag-checkered"></i> Завершить
                  </button>
                </template>
                
                <button class="btn-icon view" @click="viewBookingDetails(booking)" title="Детали">
                  <i class="fas fa-eye"></i>
                </button>
                <button class="btn-icon print" @click="printContract(booking)" title="Договор">
                  <i class="fas fa-print"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Вкладка: Финансы и выручка -->
        <div v-if="activeTab === 'finance'" class="finance-tab">
          <div class="tab-header">
            <h2>Финансовая статистика</h2>
          </div>
          
          <div class="finance-period">
            <div class="period-selector">
              <button 
                v-for="period in periods" 
                :key="period.value"
                @click="selectedPeriod = period.value"
                :class="['period-btn', { active: selectedPeriod === period.value }]"
              >
                {{ period.name }}
              </button>
            </div>
            
            <div class="custom-period" v-if="selectedPeriod === 'custom'">
              <input type="date" v-model="customDateFrom">
              <span>—</span>
              <input type="date" v-model="customDateTo">
              <button class="btn btn-primary" @click="applyCustomPeriod">Применить</button>
            </div>
          </div>
          
          <div class="finance-summary">
            <div class="summary-card total">
              <div class="summary-icon">
                <i class="fas fa-chart-line"></i>
              </div>
              <div class="summary-info">
                <span class="summary-label">Общая выручка</span>
                <span class="summary-value">{{ formatMoney(financeData.totalRevenue) }}</span>
              </div>
            </div>
            
            <div class="summary-card">
              <div class="summary-icon">
                <i class="fas fa-calendar-check"></i>
              </div>
              <div class="summary-info">
                <span class="summary-label">Заказов</span>
                <span class="summary-value">{{ financeData.totalBookings }}</span>
              </div>
            </div>
            
            <div class="summary-card">
              <div class="summary-icon">
                <i class="fas fa-car"></i>
              </div>
              <div class="summary-info">
                <span class="summary-label">Средний чек</span>
                <span class="summary-value">{{ formatMoney(financeData.averageCheck) }}</span>
              </div>
            </div>
            
            <div class="summary-card">
              <div class="summary-icon">
                <i class="fas fa-percent"></i>
              </div>
              <div class="summary-info">
                <span class="summary-label">Загрузка автопарка</span>
                <span class="summary-value">{{ financeData.utilization }}%</span>
              </div>
            </div>
          </div>
          
          <div class="finance-charts">
            <div class="chart-card">
              <h3>Выручка по дням</h3>
              <div class="chart-placeholder">
                <div class="bar-chart">
                  <div v-for="(value, index) in dailyRevenue" :key="index" class="bar-container">
                    <div class="bar" :style="{ height: (value / maxRevenue) * 200 + 'px' }"></div>
                    <span class="bar-label">{{ index }}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="chart-card">
              <h3>Топ автомобилей по выручке</h3>
              <div class="top-cars-list">
                <div v-for="(car, index) in topRevenueCars" :key="car.id" class="top-car-item">
                  <span class="car-rank">{{ index + 1 }}</span>
                  <span class="car-name">{{ car.name }}</span>
                  <span class="car-revenue">{{ formatMoney(car.revenue) }}</span>
                  <div class="car-progress">
                    <div class="progress-bar" :style="{ width: (car.revenue / maxCarRevenue) * 100 + '%' }"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="finance-table">
            <h3>Детализация операций</h3>
            <table class="data-table">
              <thead>
                <tr>
                  <th>Дата</th>
                  <th>Заказ #</th>
                  <th>Автомобиль</th>
                  <th>Клиент</th>
                  <th>Период</th>
                  <th>Сумма</th>
                  <th>Статус</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="transaction in filteredTransactions" :key="transaction.id">
                  <td>{{ transaction.date }}</td>
                  <td>#{{ transaction.bookingId }}</td>
                  <td>{{ transaction.carName }}</td>
                  <td>{{ transaction.clientName }}</td>
                  <td>{{ transaction.period }}</td>
                  <td class="amount">{{ formatMoney(transaction.amount) }}</td>
                  <td>
                    <span :class="['payment-status', transaction.paymentStatus]">
                      {{ getPaymentStatusText(transaction.paymentStatus) }}
                    </span>
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="5" class="total-label">Итого:</td>
                  <td class="total-amount">{{ formatMoney(financeData.periodRevenue) }}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Модальное окно добавления автомобиля -->
    <div v-if="showAddCarModal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Выставить автомобиль</h3>
          <button class="close-btn" @click="showAddCarModal = false">&times;</button>
        </div>
        
        <form @submit.prevent="addCar" class="car-form">
          <div class="form-group">
            <label>Марка</label>
            <input type="text" v-model="newCar.brand" required>
          </div>
          
          <div class="form-group">
            <label>Модель</label>
            <input type="text" v-model="newCar.model" required>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>Год выпуска</label>
              <input type="number" v-model="newCar.year" required>
            </div>
            
            <div class="form-group">
              <label>Цвет</label>
              <input type="text" v-model="newCar.color" required>
            </div>
          </div>
          
          <div class="form-group">
            <label>Цена за сутки (₽)</label>
            <input type="number" v-model="newCar.price" required>
          </div>
          
          <div class="form-group">
            <label>Описание</label>
            <textarea v-model="newCar.description" rows="4"></textarea>
          </div>
          
          <div class="form-group">
            <label>Условия аренды</label>
            <textarea v-model="newCar.conditions" rows="3"></textarea>
          </div>
          
          <div class="form-group">
            <label>Фотографии</label>
            <input type="file" multiple @change="handleFileUpload" accept="image/*">
          </div>
          
          <div class="form-actions">
            <button type="button" class="btn btn-secondary" @click="showAddCarModal = false">
              Отмена
            </button>
            <button type="submit" class="btn btn-primary">
              <i class="fas fa-plus"></i> Добавить автомобиль
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'ManagerView',
  setup() {
    const store = useStore()
    const username = computed(() => store.getters.username)
    
    const activeTab = ref('bookings') // По умолчанию открываем заказы
    
    const tabs = [
      { id: 'bookings', name: 'Заказы', icon: 'fas fa-calendar-check' },
      { id: 'cars', name: 'Автомобили', icon: 'fas fa-car' },
      { id: 'finance', name: 'Финансы', icon: 'fas fa-ruble-sign' }
    ]
    
    // Статистика
    const stats = ref({
      availableCars: 12,
      activeRentals: 8,
      pendingBookings: 5,
      todayRevenue: 87500
    })
    
    // Автомобили
    const cars = ref([
      {
        id: 1,
        title: 'BMW X5',
        year: 2022,
        color: 'Черный',
        price: 5500,
        rating: 4.9,
        rentalCount: 24,
        status: 'available',
        image: 'https://via.placeholder.com/300x200'
      },
      {
        id: 2,
        title: 'Toyota Camry',
        year: 2023,
        color: 'Серебристый',
        price: 3000,
        rating: 4.7,
        rentalCount: 18,
        status: 'rented',
        image: 'https://via.placeholder.com/300x200'
      },
      {
        id: 3,
        title: 'Mercedes E-Class',
        year: 2022,
        color: 'Белый',
        price: 6000,
        rating: 4.8,
        rentalCount: 32,
        status: 'available',
        image: 'https://via.placeholder.com/300x200'
      },
      {
        id: 4,
        title: 'Kia Rio',
        year: 2023,
        color: 'Синий',
        price: 2000,
        rating: 4.5,
        rentalCount: 45,
        status: 'maintenance',
        image: 'https://via.placeholder.com/300x200'
      }
    ])
    
    // Заказы
    const bookings = ref([
      {
        id: 1001,
        carName: 'BMW X5',
        carImage: 'https://via.placeholder.com/100x60',
        ownerName: 'Иван Петров',
        clientName: 'Алексей Смирнов',
        clientPhone: '+7 (999) 123-45-67',
        clientEmail: 'alexey@mail.com',
        startDate: '20.02.2026',
        endDate: '25.02.2026',
        days: 5,
        total: 27500,
        status: 'pending',
        paymentStatus: 'pending'
      },
      {
        id: 1002,
        carName: 'Toyota Camry',
        carImage: 'https://via.placeholder.com/100x60',
        ownerName: 'Мария Сидорова',
        clientName: 'Елена Петрова',
        clientPhone: '+7 (999) 234-56-78',
        clientEmail: 'elena@mail.com',
        startDate: '18.02.2026',
        endDate: '20.02.2026',
        days: 2,
        total: 6000,
        status: 'confirmed',
        paymentStatus: 'paid'
      },
      {
        id: 1003,
        carName: 'Mercedes E-Class',
        carImage: 'https://via.placeholder.com/100x60',
        ownerName: 'Алексей Иванов',
        clientName: 'Дмитрий Козлов',
        clientPhone: '+7 (999) 345-67-89',
        clientEmail: 'dmitry@mail.com',
        startDate: '22.02.2026',
        endDate: '24.02.2026',
        days: 2,
        total: 12000,
        status: 'active',
        paymentStatus: 'paid'
      },
      {
        id: 1004,
        carName: 'Kia Rio',
        carImage: 'https://via.placeholder.com/100x60',
        ownerName: 'Ольга Николаева',
        clientName: 'Сергей Иванов',
        clientPhone: '+7 (999) 456-78-90',
        clientEmail: 'sergey@mail.com',
        startDate: '15.02.2026',
        endDate: '17.02.2026',
        days: 2,
        total: 4000,
        status: 'completed',
        paymentStatus: 'paid'
      }
    ])
    
    // Финансовые данные
    const periods = [
      { name: 'Сегодня', value: 'today' },
      { name: 'Неделя', value: 'week' },
      { name: 'Месяц', value: 'month' },
      { name: 'Квартал', value: 'quarter' },
      { name: 'Год', value: 'year' },
      { name: 'Все время', value: 'all' },
      { name: 'Произвольный', value: 'custom' }
    ]
    
    const selectedPeriod = ref('month')
    const customDateFrom = ref('')
    const customDateTo = ref('')
    
    const financeData = ref({
      totalRevenue: 1845000,
      periodRevenue: 487000,
      totalBookings: 156,
      averageCheck: 11827,
      utilization: 68
    })
    
    const dailyRevenue = ref({
      'Пн': 45000,
      'Вт': 52000,
      'Ср': 48000,
      'Чт': 61000,
      'Пт': 78000,
      'Сб': 92000,
      'Вс': 88000
    })
    
    const topRevenueCars = ref([
      { id: 1, name: 'BMW X5', revenue: 385000 },
      { id: 2, name: 'Mercedes E-Class', revenue: 312000 },
      { id: 3, name: 'Toyota Camry', revenue: 198000 },
      { id: 4, name: 'Kia Rio', revenue: 156000 },
      { id: 5, name: 'Audi Q7', revenue: 142000 }
    ])
    
    const transactions = ref([
      { id: 1, date: '18.02.2026', bookingId: 1002, carName: 'Toyota Camry', clientName: 'Елена Петрова', period: '18.02 - 20.02', amount: 6000, paymentStatus: 'paid' },
      { id: 2, date: '17.02.2026', bookingId: 1004, carName: 'Kia Rio', clientName: 'Сергей Иванов', period: '15.02 - 17.02', amount: 4000, paymentStatus: 'paid' },
      { id: 3, date: '16.02.2026', bookingId: 1005, carName: 'BMW X5', clientName: 'Игорь Соколов', period: '10.02 - 15.02', amount: 27500, paymentStatus: 'paid' },
      { id: 4, date: '15.02.2026', bookingId: 1006, carName: 'Mercedes E-Class', clientName: 'Татьяна Мороз', period: '12.02 - 14.02', amount: 12000, paymentStatus: 'paid' }
    ])
    
    // Фильтры
    const carFilters = ref({
      search: '',
      status: ''
    })
    
    const bookingFilters = ref({
      search: '',
      status: '',
      dateFrom: '',
      dateTo: ''
    })
    
    // Модальные окна
    const showAddCarModal = ref(false)
    const newCar = ref({
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      color: '',
      price: '',
      description: '',
      conditions: '',
      photos: []
    })
    
    // Вычисляемые свойства
    const filteredCars = computed(() => {
      return cars.value.filter(car => {
        const matchesSearch = car.title.toLowerCase().includes(carFilters.value.search.toLowerCase())
        const matchesStatus = !carFilters.value.status || car.status === carFilters.value.status
        return matchesSearch && matchesStatus
      })
    })
    
    const filteredBookings = computed(() => {
      return bookings.value.filter(booking => {
        const matchesSearch = booking.id.toString().includes(bookingFilters.value.search) ||
                             booking.clientName.toLowerCase().includes(bookingFilters.value.search.toLowerCase())
        const matchesStatus = !bookingFilters.value.status || booking.status === bookingFilters.value.status
        return matchesSearch && matchesStatus
      })
    })
    
    const maxRevenue = computed(() => {
      return Math.max(...Object.values(dailyRevenue.value))
    })
    
    const maxCarRevenue = computed(() => {
      return Math.max(...topRevenueCars.value.map(c => c.revenue))
    })
    
    const filteredTransactions = computed(() => {
      return transactions.value
    })
    
    // Методы
    const formatMoney = (amount) => {
      return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        minimumFractionDigits: 0
      }).format(amount)
    }
    
    const getCarStatusText = (status) => {
      const statusMap = {
        'available': 'Доступен',
        'rented': 'В аренде',
        'maintenance': 'На обслуживании'
      }
      return statusMap[status] || status
    }
    
    const getBookingStatusText = (status) => {
      const statusMap = {
        'pending': 'Ожидает подтверждения',
        'confirmed': 'Подтвержден',
        'active': 'Активен',
        'completed': 'Завершен',
        'cancelled': 'Отменен'
      }
      return statusMap[status] || status
    }
    
    const getPaymentStatusText = (status) => {
      const statusMap = {
        'pending': 'Ожидает оплаты',
        'paid': 'Оплачен',
        'refunded': 'Возврат'
      }
      return statusMap[status] || status
    }
    
    const toggleCarStatus = (car) => {
      if (car.status === 'available') {
        car.status = 'maintenance'
      } else if (car.status === 'maintenance') {
        car.status = 'available'
      }
      // Если в аренде - нельзя изменить
    }
    
    const editCar = (car) => {
      console.log('Редактирование автомобиля:', car)
      // Открыть модальное окно редактирования
    }
    
    const showCarRentalHistory = (car) => {
      console.log('История аренд автомобиля:', car)
      // Показать историю
    }
    
    const confirmBooking = (booking) => {
      booking.status = 'confirmed'
      console.log('Бронирование подтверждено:', booking)
    }
    
    const rejectBooking = (booking) => {
      if (confirm('Отклонить заказ?')) {
        booking.status = 'cancelled'
        console.log('Бронирование отклонено:', booking)
      }
    }
    
    const startRental = (booking) => {
      booking.status = 'active'
      console.log('Аренда начата:', booking)
    }
    
    const completeRental = (booking) => {
      booking.status = 'completed'
      console.log('Аренда завершена:', booking)
    }
    
    const viewBookingDetails = (booking) => {
      console.log('Детали заказа:', booking)
      // Показать детали
    }
    
    const printContract = (booking) => {
      console.log('Печать договора для заказа:', booking)
      window.print()
    }
    
    const applyCustomPeriod = () => {
      console.log('Применен произвольный период:', customDateFrom.value, customDateTo.value)
      // Загрузить данные за период
    }
    
    const addCar = () => {
      // Создание нового автомобиля
      const car = {
        id: cars.value.length + 1,
        title: `${newCar.value.brand} ${newCar.value.model}`,
        year: newCar.value.year,
        color: newCar.value.color,
        price: newCar.value.price,
        rating: 0,
        rentalCount: 0,
        status: 'available',
        image: 'https://via.placeholder.com/300x200',
        description: newCar.value.description,
        conditions: newCar.value.conditions
      }
      
      cars.value.push(car)
      showAddCarModal.value = false
      
      // Сброс формы
      newCar.value = {
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        color: '',
        price: '',
        description: '',
        conditions: '',
        photos: []
      }
      
      alert('Автомобиль успешно добавлен!')
    }
    
    const handleFileUpload = (event) => {
      newCar.value.photos = Array.from(event.target.files)
      console.log('Загружено файлов:', newCar.value.photos.length)
    }
    
    return {
      username,
      activeTab,
      tabs,
      stats,
      cars,
      bookings,
      periods,
      selectedPeriod,
      customDateFrom,
      customDateTo,
      financeData,
      dailyRevenue,
      topRevenueCars,
      transactions,
      carFilters,
      bookingFilters,
      filteredCars,
      filteredBookings,
      maxRevenue,
      maxCarRevenue,
      filteredTransactions,
      showAddCarModal,
      newCar,
      formatMoney,
      getCarStatusText,
      getBookingStatusText,
      getPaymentStatusText,
      toggleCarStatus,
      editCar,
      showCarRentalHistory,
      confirmBooking,
      rejectBooking,
      startRental,
      completeRental,
      viewBookingDetails,
      printContract,
      applyCustomPeriod,
      addCar,
      handleFileUpload
    }
  }
}
</script>

<style scoped lang="scss">
.manager-view {
  padding: 30px 0;
  background: #f0f2f5;
  min-height: 100vh;
  
  .manager-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    
    h1 {
      color: #333;
    }
    
    .manager-info {
      display: flex;
      align-items: center;
      gap: 10px;
      background: white;
      padding: 10px 20px;
      border-radius: 30px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      
      i {
        color: #007bff;
        font-size: 20px;
      }
      
      span {
        font-weight: 500;
      }
    }
  }
  
  .stats-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
    
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
        color: #28a745;
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
  
  .manager-tabs {
    display: flex;
    gap: 10px;
    margin-bottom: 30px;
    background: white;
    padding: 10px;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    
    .tab-btn {
      flex: 1;
      padding: 12px;
      background: none;
      border: none;
      cursor: pointer;
      font-size: 16px;
      color: #666;
      border-radius: 8px;
      transition: all 0.3s;
      
      i {
        margin-right: 8px;
      }
      
      &:hover {
        background: #f8f9fa;
        color: #007bff;
      }
      
      &.active {
        background: #007bff;
        color: white;
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
      min-width: 250px;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 5px;
    }
    
    .filter-select, .date-input {
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 5px;
      min-width: 150px;
    }
  }
  
  .cars-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 20px;
    
    .car-manager-card {
      background: white;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      border: 1px solid #eee;
      
      .car-image {
        position: relative;
        height: 180px;
        
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .car-status {
          position: absolute;
          top: 10px;
          right: 10px;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
          
          &.available {
            background: #d4edda;
            color: #155724;
          }
          
          &.rented {
            background: #cce5ff;
            color: #004085;
          }
          
          &.maintenance {
            background: #fff3cd;
            color: #856404;
          }
        }
      }
      
      .car-info {
        padding: 15px;
        
        h3 {
          margin-bottom: 8px;
          color: #333;
        }
        
        .car-details {
          color: #666;
          font-size: 14px;
          margin-bottom: 5px;
        }
        
        .car-price {
          font-weight: bold;
          color: #28a745;
          font-size: 18px;
          margin-bottom: 10px;
        }
        
        .car-stats {
          display: flex;
          gap: 15px;
          margin-bottom: 15px;
          color: #666;
          font-size: 14px;
          
          i {
            margin-right: 5px;
            color: #ffc107;
          }
        }
        
        .car-actions {
          display: flex;
          gap: 5px;
          justify-content: flex-end;
          
          .btn-icon {
            padding: 8px 12px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            
            &.edit { background: #007bff; color: white; }
            &.toggle { background: #ffc107; color: #333; }
            &.stats { background: #17a2b8; color: white; }
            
            &:hover {
              opacity: 0.8;
            }
          }
        }
      }
    }
  }
  
  .bookings-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
    
    .booking-card {
      background: #f8f9fa;
      border-radius: 10px;
      padding: 20px;
      border-left: 4px solid transparent;
      
      &.pending { border-left-color: #ffc107; }
      &.confirmed { border-left-color: #007bff; }
      &.active { border-left-color: #28a745; }
      &.completed { border-left-color: #6c757d; }
      &.cancelled { border-left-color: #dc3545; }
      
      .booking-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
        
        .booking-id {
          font-weight: bold;
          color: #333;
        }
        
        .booking-status {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          
          &.pending { background: #fff3cd; color: #856404; }
          &.confirmed { background: #cce5ff; color: #004085; }
          &.active { background: #d4edda; color: #155724; }
          &.completed { background: #e2e3e5; color: #383d41; }
          &.cancelled { background: #f8d7da; color: #721c24; }
        }
      }
      
      .booking-body {
        display: grid;
        grid-template-columns: 2fr 2fr 1fr 1fr;
        gap: 20px;
        margin-bottom: 15px;
        
        @media (max-width: 1200px) {
          grid-template-columns: 1fr 1fr;
        }
        
        @media (max-width: 768px) {
          grid-template-columns: 1fr;
        }
        
        .booking-car {
          display: flex;
          gap: 10px;
          
          .car-thumb {
            width: 60px;
            height: 40px;
            object-fit: cover;
            border-radius: 5px;
          }
          
          strong {
            display: block;
            margin-bottom: 5px;
          }
          
          p {
            color: #666;
            font-size: 13px;
          }
        }
        
        .booking-client {
          display: flex;
          gap: 10px;
          
          i {
            color: #007bff;
            font-size: 20px;
          }
          
          p {
            color: #666;
            font-size: 13px;
          }
        }
        
        .booking-dates {
          div {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 5px;
            color: #666;
            
            i {
              width: 16px;
              color: #28a745;
            }
          }
        }
        
        .booking-payment {
          .payment-info {
            display: flex;
            flex-direction: column;
            gap: 5px;
            
            .payment-status {
              font-size: 12px;
              padding: 2px 8px;
              border-radius: 12px;
              display: inline-block;
              width: fit-content;
              
              &.pending { background: #fff3cd; color: #856404; }
              &.paid { background: #d4edda; color: #155724; }
              &.refunded { background: #e2e3e5; color: #383d41; }
            }
          }
        }
      }
      
      .booking-actions {
        display: flex;
        gap: 10px;
        justify-content: flex-end;
        border-top: 1px solid #dee2e6;
        padding-top: 15px;
        
        .btn {
          padding: 8px 16px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          
          i {
            margin-right: 5px;
          }
          
          &-success { background: #28a745; color: white; }
          &-danger { background: #dc3545; color: white; }
          &-primary { background: #007bff; color: white; }
          &-warning { background: #ffc107; color: #333; }
        }
        
        .btn-icon {
          padding: 8px 12px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          background: #6c757d;
          color: white;
          
          &.view { background: #17a2b8; }
          &.print { background: #6c757d; }
          
          &:hover {
            opacity: 0.8;
          }
        }
      }
    }
  }
  
  .finance-tab {
    .finance-period {
      margin-bottom: 30px;
      
      .period-selector {
        display: flex;
        gap: 5px;
        margin-bottom: 15px;
        
        .period-btn {
          padding: 8px 16px;
          background: none;
          border: 1px solid #ddd;
          border-radius: 5px;
          cursor: pointer;
          
          &.active {
            background: #007bff;
            color: white;
            border-color: #007bff;
          }
        }
      }
      
      .custom-period {
        display: flex;
        gap: 10px;
        align-items: center;
        
        input {
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 5px;
        }
      }
    }
    
    .finance-summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
      
      .summary-card {
        background: #f8f9fa;
        padding: 20px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        gap: 15px;
        
        &.total {
          background: #007bff;
          color: white;
          
          .summary-icon i {
            color: white;
          }
        }
        
        .summary-icon i {
          font-size: 32px;
          color: #28a745;
        }
        
        .summary-info {
          display: flex;
          flex-direction: column;
          
          .summary-label {
            font-size: 14px;
            opacity: 0.8;
          }
          
          .summary-value {
            font-size: 24px;
            font-weight: bold;
          }
        }
      }
    }
    
    .finance-charts {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 30px;
      
      .chart-card {
        background: #f8f9fa;
        padding: 20px;
        border-radius: 10px;
        
        h3 {
          margin-bottom: 20px;
          color: #333;
        }
        
        .chart-placeholder {
          height: 250px;
          
          .bar-chart {
            display: flex;
            align-items: flex-end;
            justify-content: center;
            gap: 15px;
            height: 200px;
            
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
        
        .top-cars-list {
          .top-car-item {
            display: grid;
            grid-template-columns: auto 1fr auto;
            gap: 10px;
            align-items: center;
            margin-bottom: 10px;
            
            .car-rank {
              width: 25px;
              height: 25px;
              background: #007bff;
              color: white;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 12px;
            }
            
            .car-name {
              font-weight: 500;
            }
            
            .car-revenue {
              font-weight: bold;
              color: #28a745;
            }
            
            .car-progress {
              grid-column: span 3;
              height: 8px;
              background: #e9ecef;
              border-radius: 4px;
              
              .progress-bar {
                height: 100%;
                background: #28a745;
                border-radius: 4px;
              }
            }
          }
        }
      }
    }
    
    .finance-table {
      h3 {
        margin-bottom: 20px;
      }
      
      .data-table {
        width: 100%;
        border-collapse: collapse;
        
        th, td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #dee2e6;
        }
        
        th {
          background: #f8f9fa;
          font-weight: 600;
        }
        
        .amount {
          font-weight: bold;
        }
        
        .payment-status {
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 12px;
          
          &.pending { background: #fff3cd; color: #856404; }
          &.paid { background: #d4edda; color: #155724; }
          &.refunded { background: #e2e3e5; color: #383d41; }
        }
        
        tfoot {
          background: #f8f9fa;
          font-weight: bold;
          
          .total-label {
            text-align: right;
          }
          
          .total-amount {
            color: #28a745;
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
    z-index: 1000;
    
    .modal-content {
      background: white;
      border-radius: 10px;
      width: 90%;
      max-width: 600px;
      max-height: 90vh;
      overflow-y: auto;
      
      .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
        border-bottom: 1px solid #dee2e6;
        
        h3 {
          margin: 0;
        }
        
        .close-btn {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
        }
      }
      
      .car-form {
        padding: 20px;
        
        .form-group {
          margin-bottom: 15px;
          
          label {
            display: block;
            margin-bottom: 5px;
            font-weight: 500;
          }
          
          input, textarea, select {
            width: 100%;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 5px;
          }
        }
        
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }
        
        .form-actions {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
          margin-top: 20px;
        }
      }
    }
  }
}
</style>