<template>
  <div class="car-card" @click="$emit('click')">
    <div class="car-image">
      <img :src="car.image" :alt="car.title">
      <div class="car-rating">
        <i class="fas fa-star"></i>
        {{ car.rating }}
      </div>
    </div>
    
    <div class="car-info">
      <h3 class="car-title">{{ car.title }}</h3>
      <p class="car-description">{{ car.description }}</p>
      <p class="car-conditions">{{ car.conditions }}</p>
      
      <div class="car-footer">
        <span class="car-price">{{ car.price }} ₽/сутки</span>
        <button class="btn btn-primary">Подробнее</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CarCard',
  props: {
    car: {
      type: Object,
      required: true
    }
  },
  emits: ['click']
}
</script>

<style scoped lang="scss">
.car-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
  }
  
  .car-image {
    position: relative;
    height: 200px;
    overflow: hidden;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .car-rating {
      position: absolute;
      top: 10px;
      right: 10px;
      background: rgba(0, 0, 0, 0.7);
      color: white;
      padding: 5px 10px;
      border-radius: 20px;
      font-size: 14px;
      
      i {
        color: #ffc107;
        margin-right: 3px;
      }
    }
  }
  
  .car-info {
    padding: 20px;
    
    .car-title {
      margin-bottom: 10px;
      color: #333;
      font-size: 18px;
    }
    
    .car-description {
      color: #666;
      margin-bottom: 10px;
      font-size: 14px;
    }
    
    .car-conditions {
      color: #28a745;
      margin-bottom: 15px;
      font-size: 13px;
      padding: 5px;
      background: #f8f9fa;
      border-radius: 5px;
    }
    
    .car-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .car-price {
        font-size: 18px;
        font-weight: bold;
        color: #007bff;
      }
      
      .btn {
        padding: 8px 16px;
        font-size: 14px;
      }
    }
  }
}
</style>