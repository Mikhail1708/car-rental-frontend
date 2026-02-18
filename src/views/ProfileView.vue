<!-- src/views/ProfileView.vue -->
<template>
  <div class="profile-view">
    <div class="container">
      <h1>Личный кабинет</h1>
      
      <div v-if="user" class="profile-content">
        <div class="profile-header">
          <div class="avatar">
            <i class="fas fa-user-circle"></i>
          </div>
          <div class="user-info">
            <h2>{{ user.name || 'Пользователь' }}</h2>
            <p class="user-email">{{ user.email }}</p>
            <span class="user-role">{{ getRoleName(user.role) }}</span>
          </div>
        </div>
        
        <div class="profile-tabs">
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
        
        <div class="tab-content">
          <!-- Личные данные -->
          <div v-if="activeTab === 'info'" class="info-tab">
            <h3>Личные данные</h3>
            <form @submit.prevent="updateProfile" class="profile-form">
              <div class="form-group">
                <label>Имя</label>
                <input type="text" v-model="editForm.name">
              </div>
              
              <div class="form-group">
                <label>Телефон</label>
                <input type="tel" v-model="editForm.phone" placeholder="+7 (999) 123-45-67">
              </div>
              
              <div class="form-group">
                <label>Дата рождения</label>
                <input type="date" v-model="editForm.birthDate">
              </div>
              
              <div class="form-group">
                <label>Номер водительского удостоверения</label>
                <input type="text" v-model="editForm.licenseNumber">
              </div>
              
              <button type="submit" class="btn btn-primary">
                <i class="fas fa-save"></i> Сохранить изменения
              </button>
            </form>
          </div>
          
          <!-- Мои бронирования -->
          <div v-if="activeTab === 'bookings'" class="bookings-tab">
            <h3>Мои бронирования</h3>
            
            <div v-if="userBookings.length === 0" class="empty-state">
              <i class="fas fa-calendar-times"></i>
              <p>У вас пока нет бронирований</p>
              <router-link to="/" class="btn btn-primary">
                Найти автомобиль
              </router-link>
            </div>
            
            <div v-else class="bookings-list">
              <div v-for="booking in userBookings" :key="booking.id" class="booking-item">
                <div class="booking-car">
                  <img :src="booking.carImage" :alt="booking.carName">
                  <div>
                    <h4>{{ booking.carName }}</h4>
                    <p>{{ booking.carDetails }}</p>
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
                
                <div class="booking-price">
                  {{ formatMoney(booking.total) }}
                </div>
                
                <div class="booking-status">
                  <span :class="['status-badge', booking.status]">
                    {{ getBookingStatus(booking.status) }}
                  </span>
                </div>
                
                <div class="booking-actions">
                  <button v-if="booking.status === 'pending'" class="btn-icon cancel" @click="cancelBooking(booking)">
                    <i class="fas fa-times"></i>
                  </button>
                  <button class="btn-icon view" @click="viewBooking(booking)">
                    <i class="fas fa-eye"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Мои автомобили (для владельцев) -->
          <div v-if="activeTab === 'my-cars' && (isOwner || isAdmin)" class="my-cars-tab">
            <div class="tab-header">
              <h3>Мои автомобили</h3>
              <router-link to="/create-ad" class="btn btn-primary">
                <i class="fas fa-plus"></i> Добавить автомобиль
              </router-link>
            </div>
            
            <div v-if="myCars.length === 0" class="empty-state">
              <i class="fas fa-car"></i>
              <p>У вас пока нет автомобилей</p>
              <router-link to="/create-ad" class="btn btn-primary">
                Выставить автомобиль
              </router-link>
            </div>
            
            <div v-else class="cars-grid">
              <div v-for="car in myCars" :key="car.id" class="car-card">
                <img :src="car.image" :alt="car.name">
                <div class="car-info">
                  <h4>{{ car.name }}</h4>
                  <p class="car-price">{{ car.price }} ₽/сутки</p>
                  <p class="car-status" :class="car.status">
                    {{ getCarStatus(car.status) }}
                  </p>
                  <div class="car-actions">
                    <button class="btn-icon edit" @click="editCar(car)">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon stats" @click="viewCarStats(car)">
                      <i class="fas fa-chart-line"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Настройки -->
          <div v-if="activeTab === 'settings'" class="settings-tab">
            <h3>Настройки</h3>
            
            <div class="settings-section">
              <h4>Смена пароля</h4>
              <form @submit.prevent="changePassword">
                <div class="form-group">
                  <label>Текущий пароль</label>
                  <input type="password" v-model="passwordForm.current">
                </div>
                
                <div class="form-group">
                  <label>Новый пароль</label>
                  <input type="password" v-model="passwordForm.new">
                </div>
                
                <div class="form-group">
                  <label>Подтверждение пароля</label>
                  <input type="password" v-model="passwordForm.confirm">
                </div>
                
                <button type="submit" class="btn btn-primary">
                  Изменить пароль
                </button>
              </form>
            </div>
            
            <div class="settings-section">
              <h4>Уведомления</h4>
              <div class="checkbox-group">
                <label class="checkbox">
                  <input type="checkbox" v-model="notifications.email">
                  <span>Получать уведомления по email</span>
                </label>
                
                <label class="checkbox">
                  <input type="checkbox" v-model="notifications.sms">
                  <span>Получать SMS-уведомления</span>
                </label>
                
                <label class="checkbox">
                  <input type="checkbox" v-model="notifications.push">
                  <span>Получать push-уведомления</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div v-else class="loading">
        Загрузка...
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'ProfileView',
  setup() {
    const store = useStore()
    const router = useRouter()
    
    const user = computed(() => store.state.user)
    const isOwner = computed(() => store.getters.isOwner)
    const isAdmin = computed(() => store.getters.isAdmin)
    
    const activeTab = ref('info')
    
    const tabs = [
      { id: 'info', name: 'Личные данные', icon: 'fas fa-user' },
      { id: 'bookings', name: 'Мои бронирования', icon: 'fas fa-calendar-check' }
    ]
    
    // Добавляем вкладку с автомобилями только для владельцев
    if (isOwner.value || isAdmin.value) {
      tabs.push({ id: 'my-cars', name: 'Мои автомобили', icon: 'fas fa-car' })
    }
    
    tabs.push({ id: 'settings', name: 'Настройки', icon: 'fas fa-cog' })
    
    // Форма редактирования
    const editForm = ref({
      name: '',
      phone: '',
      birthDate: '',
      licenseNumber: ''
    })
    
    // Форма смены пароля
    const passwordForm = ref({
      current: '',
      new: '',
      confirm: ''
    })
    
    // Настройки уведомлений
    const notifications = ref({
      email: true,
      sms: false,
      push: true
    })
    
    // Мои бронирования (тестовые данные)
    const userBookings = ref([
      {
        id: 1,
        carName: 'Toyota Camry',
        carDetails: '2023, серебристый',
        carImage: 'https://via.placeholder.com/100x60',
        startDate: '20.02.2026',
        endDate: '25.02.2026',
        days: 5,
        total: 15000,
        status: 'active'
      },
      {
        id: 2,
        carName: 'BMW X5',
        carDetails: '2022, черный',
        carImage: 'https://via.placeholder.com/100x60',
        startDate: '10.02.2026',
        endDate: '12.02.2026',
        days: 2,
        total: 11000,
        status: 'completed'
      },
      {
        id: 3,
        carName: 'Kia Rio',
        carDetails: '2023, синий',
        carImage: 'https://via.placeholder.com/100x60',
        startDate: '01.03.2026',
        endDate: '05.03.2026',
        days: 4,
        total: 8000,
        status: 'pending'
      }
    ])
    
    // Мои автомобили (для владельцев)
    const myCars = ref([
      {
        id: 1,
        name: 'Toyota Camry',
        price: 3000,
        status: 'available',
        image: 'https://via.placeholder.com/200x150'
      },
      {
        id: 2,
        name: 'BMW X5',
        price: 5500,
        status: 'rented',
        image: 'https://via.placeholder.com/200x150'
      }
    ])
    
    // Загрузка данных пользователя
    onMounted(() => {
      if (user.value) {
        editForm.value = {
          name: user.value.name || '',
          phone: user.value.phone || '',
          birthDate: user.value.birthDate || '',
          licenseNumber: user.value.licenseNumber || ''
        }
      }
    })
    
    // Методы
    const getRoleName = (role) => {
      const roles = {
        'admin': 'Администратор',
        'manager': 'Менеджер',
        'owner': 'Владелец автомобиля',
        'user': 'Пользователь'
      }
      return roles[role] || role
    }
    
    const getBookingStatus = (status) => {
      const statuses = {
        'pending': 'Ожидает подтверждения',
        'confirmed': 'Подтвержден',
        'active': 'Активен',
        'completed': 'Завершен',
        'cancelled': 'Отменен'
      }
      return statuses[status] || status
    }
    
    const getCarStatus = (status) => {
      const statuses = {
        'available': 'Доступен',
        'rented': 'В аренде',
        'maintenance': 'На обслуживании'
      }
      return statuses[status] || status
    }
    
    const formatMoney = (amount) => {
      return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        minimumFractionDigits: 0
      }).format(amount)
    }
    
    const updateProfile = () => {
      console.log('Обновление профиля:', editForm.value)
      alert('Профиль обновлен!')
    }
    
    const changePassword = () => {
      if (passwordForm.value.new !== passwordForm.value.confirm) {
        alert('Пароли не совпадают')
        return
      }
      console.log('Смена пароля')
      alert('Пароль изменен!')
      passwordForm.value = { current: '', new: '', confirm: '' }
    }
    
    const cancelBooking = (booking) => {
      if (confirm('Отменить бронирование?')) {
        booking.status = 'cancelled'
        console.log('Бронирование отменено:', booking)
      }
    }
    
    const viewBooking = (booking) => {
      router.push(`/car/${booking.id}`)
    }
    
    const editCar = (car) => {
      console.log('Редактирование автомобиля:', car)
    }
    
    const viewCarStats = (car) => {
      console.log('Статистика автомобиля:', car)
    }
    
    return {
      user,
      activeTab,
      tabs,
      editForm,
      passwordForm,
      notifications,
      userBookings,
      myCars,
      isOwner,
      isAdmin,
      getRoleName,
      getBookingStatus,
      getCarStatus,
      formatMoney,
      updateProfile,
      changePassword,
      cancelBooking,
      viewBooking,
      editCar,
      viewCarStats
    }
  }
}
</script>

<style scoped lang="scss">
.profile-view {
  padding: 30px 0;
  background: #f8f9fa;
  min-height: calc(100vh - 70px);
  
  h1 {
    margin-bottom: 30px;
    color: #333;
  }
  
  .profile-content {
    background: white;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  }
  
  .profile-header {
    display: flex;
    align-items: center;
    gap: 30px;
    padding: 30px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    
    .avatar {
      font-size: 80px;
      
      i {
        color: white;
      }
    }
    
    .user-info {
      h2 {
        margin-bottom: 5px;
        font-size: 28px;
      }
      
      .user-email {
        margin-bottom: 10px;
        opacity: 0.9;
      }
      
      .user-role {
        display: inline-block;
        padding: 4px 12px;
        background: rgba(255,255,255,0.2);
        border-radius: 20px;
        font-size: 14px;
      }
    }
  }
  
  .profile-tabs {
    display: flex;
    gap: 2px;
    background: #f1f3f5;
    padding: 10px 10px 0;
    
    .tab-btn {
      padding: 12px 24px;
      background: none;
      border: none;
      cursor: pointer;
      font-size: 16px;
      color: #666;
      border-radius: 8px 8px 0 0;
      transition: all 0.3s;
      
      i {
        margin-right: 8px;
      }
      
      &:hover {
        background: rgba(0,0,0,0.05);
        color: #333;
      }
      
      &.active {
        background: white;
        color: #007bff;
      }
    }
  }
  
  .tab-content {
    padding: 30px;
    
    h3 {
      margin-bottom: 20px;
      color: #333;
    }
  }
  
  .profile-form {
    max-width: 600px;
    
    .form-group {
      margin-bottom: 20px;
      
      label {
        display: block;
        margin-bottom: 5px;
        font-weight: 500;
        color: #555;
      }
      
      input {
        width: 100%;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 5px;
        
        &:focus {
          outline: none;
          border-color: #007bff;
        }
      }
    }
  }
  
  .empty-state {
    text-align: center;
    padding: 60px 20px;
    
    i {
      font-size: 64px;
      color: #ccc;
      margin-bottom: 20px;
    }
    
    p {
      color: #999;
      margin-bottom: 20px;
      font-size: 18px;
    }
  }
  
  .bookings-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
    
    .booking-item {
      display: flex;
      align-items: center;
      gap: 20px;
      padding: 20px;
      background: #f8f9fa;
      border-radius: 8px;
      
      .booking-car {
        display: flex;
        gap: 15px;
        min-width: 200px;
        
        img {
          width: 100px;
          height: 60px;
          object-fit: cover;
          border-radius: 5px;
        }
        
        h4 {
          margin-bottom: 5px;
        }
        
        p {
          color: #666;
          font-size: 13px;
        }
      }
      
      .booking-dates {
        flex: 1;
        
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
      
      .booking-price {
        font-weight: bold;
        color: #007bff;
        min-width: 100px;
      }
      
      .booking-status {
        min-width: 150px;
        
        .status-badge {
          display: inline-block;
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
      
      .booking-actions {
        display: flex;
        gap: 5px;
        
        .btn-icon {
          padding: 8px 12px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          
          &.view { background: #17a2b8; color: white; }
          &.cancel { background: #dc3545; color: white; }
          
          &:hover {
            opacity: 0.8;
          }
        }
      }
    }
  }
  
  .cars-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
    
    .car-card {
      background: #f8f9fa;
      border-radius: 8px;
      overflow: hidden;
      
      img {
        width: 100%;
        height: 150px;
        object-fit: cover;
      }
      
      .car-info {
        padding: 15px;
        
        h4 {
          margin-bottom: 5px;
        }
        
        .car-price {
          font-weight: bold;
          color: #28a745;
          margin-bottom: 5px;
        }
        
        .car-status {
          font-size: 12px;
          padding: 2px 8px;
          border-radius: 12px;
          display: inline-block;
          margin-bottom: 10px;
          
          &.available { background: #d4edda; color: #155724; }
          &.rented { background: #cce5ff; color: #004085; }
          &.maintenance { background: #fff3cd; color: #856404; }
        }
        
        .car-actions {
          display: flex;
          gap: 5px;
          justify-content: flex-end;
          
          .btn-icon {
            padding: 5px 10px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            
            &.edit { background: #007bff; color: white; }
            &.stats { background: #17a2b8; color: white; }
            
            &:hover {
              opacity: 0.8;
            }
          }
        }
      }
    }
  }
  
  .settings-section {
    margin-bottom: 30px;
    padding-bottom: 30px;
    border-bottom: 1px solid #dee2e6;
    
    &:last-child {
      border-bottom: none;
      margin-bottom: 0;
      padding-bottom: 0;
    }
    
    h4 {
      margin-bottom: 15px;
      color: #555;
    }
    
    .checkbox-group {
      .checkbox {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 10px;
        cursor: pointer;
        
        input {
          width: auto;
        }
      }
    }
  }
}
</style>