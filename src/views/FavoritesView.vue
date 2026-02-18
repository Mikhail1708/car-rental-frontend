<template>
  <div class="favorites">
    <div class="container">
      <h1>Избранное</h1>
      <div class="cars-grid">
        <CarCard 
          v-for="car in favoriteCars" 
          :key="car.id"
          :car="car"
          @click="goToCarDetail(car.id)"
        />
      </div>
      <div v-if="favoriteCars.length === 0" class="empty-state">
        <i class="fas fa-heart"></i>
        <p>У вас пока нет избранных автомобилей</p>
      </div>
    </div>
  </div>
</template>

<script>
import CarCard from '@/components/CarCard.vue'

export default {
  name: 'FavoritesView',
  components: {
    CarCard
  },
  data() {
    return {
      favoriteCars: [
        {
          id: 1,
          title: 'Toyota Camry',
          description: 'Комфортный седан бизнес-класса',
          conditions: 'Без ограничений',
          price: 3000,
          rating: 4.8,
          image: 'https://via.placeholder.com/300x200'
        }
      ]
    }
  },
  methods: {
    goToCarDetail(id) {
      this.$router.push(`/car/${id}`)
    }
  }
}
</script>

<style scoped lang="scss">
.favorites {
  padding: 30px 0;
  
  h1 {
    margin-bottom: 30px;
    color: #333;
  }
  
  .cars-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 30px;
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