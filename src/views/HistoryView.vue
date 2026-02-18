<template>
  <div class="history">
    <div class="container">
      <h1>История аренды</h1>
      
      <div v-if="bookings.length > 0" class="bookings-list">
        <div v-for="booking in bookings" :key="booking.id" class="booking-card">
          <div class="booking-image">
            <img :src="booking.car.image" :alt="booking.car.title">
          </div>
          
          <div class="booking-info">
            <h3>{{ booking.car.title }}</h3>
            <p class="booking-dates">
              {{ booking.startDate }} - {{ booking.endDate }}
            </p>
            <p class="booking-price">Сумма: {{ booking.total }} ₽</p>
            <span :class="['booking-status', booking.status]">
              {{ getStatusText(booking.status) }}
            </span>
          </div>
        </div>
      </div>
      
      <div v-else class="empty-state">
        <i class="fas fa-history"></i>
        <p>У вас пока нет истории аренды</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HistoryView',
  data() {
    return {
      bookings: [
        {
          id: 1,
          car: {
            title: 'Toyota Camry',
            image: 'https://via.placeholder.com/150x100'
          },
          startDate: '01.02.2026',
          endDate: '05.02.2026',
          total: 12000,
          status: 'completed'
        },
        {
          id: 2,
          car: {
            title: 'BMW X5',
            image: 'https://via.placeholder.com/150x100'
          },
          startDate: '10.02.2026',
          endDate: '12.02.2026',
          total: 11000,
          status: 'active'
        }
      ]
    }
  },
  methods: {
    getStatusText(status) {
      const statusMap = {
        'active': 'Активна',
        'completed': 'Завершена',
        'cancelled': 'Отменена'
      }
      return statusMap[status] || status
    }
  }
}
</script>

<style scoped lang="scss">
.history {
  padding: 30px 0;
  
  h1 {
    margin-bottom: 30px;
    color: #333;
  }
  
  .bookings-list {
    display: grid;
    gap: 20px;
  }
  
  .booking-card {
    display: flex;
    background: white;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    
    .booking-image {
      width: 150px;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    
    .booking-info {
      flex: 1;
      padding: 20px;
      
      h3 {
        margin-bottom: 10px;
        color: #333;
      }
      
      .booking-dates {
        color: #666;
        margin-bottom: 10px;
      }
      
      .booking-price {
        font-weight: 600;
        color: #007bff;
        margin-bottom: 10px;
      }
      
      .booking-status {
        display: inline-block;
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 12px;
        
        &.active {
          background: #d4edda;
          color: #155724;
        }
        
        &.completed {
          background: #cce5ff;
          color: #004085;
        }
        
        &.cancelled {
          background: #f8d7da;
          color: #721c24;
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
      font-size: 18px;
    }
  }
}
</style>