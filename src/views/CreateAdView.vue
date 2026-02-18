<template>
  <div class="create-ad">
    <div class="container">
      <h1>Создать объявление</h1>
      
      <form @submit.prevent="submitAd" class="ad-form">
        <div class="form-section">
          <h2>Основная информация</h2>
          
          <div class="form-row">
            <div class="form-group">
              <label>Марка <span class="required">*</span></label>
              <input type="text" v-model="form.brand" required>
            </div>
            
            <div class="form-group">
              <label>Модель <span class="required">*</span></label>
              <input type="text" v-model="form.model" required>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>Год выпуска <span class="required">*</span></label>
              <input type="number" v-model="form.year" min="1900" :max="currentYear" required>
            </div>
            
            <div class="form-group">
              <label>Цвет</label>
              <input type="text" v-model="form.color">
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>Пробег (км)</label>
              <input type="number" v-model="form.mileage" min="0">
            </div>
            
            <div class="form-group">
              <label>Тип топлива</label>
              <select v-model="form.fuelType">
                <option value="">Выберите тип</option>
                <option value="gasoline">Бензин</option>
                <option value="diesel">Дизель</option>
                <option value="electric">Электро</option>
                <option value="hybrid">Гибрид</option>
              </select>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>Коробка передач</label>
              <select v-model="form.transmission">
                <option value="">Выберите тип</option>
                <option value="manual">Механика</option>
                <option value="automatic">Автомат</option>
                <option value="robot">Робот</option>
              </select>
            </div>
            
            <div class="form-group">
              <label>Привод</label>
              <select v-model="form.drive">
                <option value="">Выберите тип</option>
                <option value="front">Передний</option>
                <option value="rear">Задний</option>
                <option value="4wd">Полный</option>
              </select>
            </div>
          </div>
        </div>
        
        <div class="form-section">
          <h2>Условия аренды</h2>
          
          <div class="form-group">
            <label>Цена за сутки (₽) <span class="required">*</span></label>
            <input type="number" v-model="form.price" min="0" required>
          </div>
          
          <div class="form-group">
            <label>Залог (₽)</label>
            <input type="number" v-model="form.deposit" min="0">
          </div>
          
          <div class="form-group">
            <label>Минимальный срок аренды (дней)</label>
            <input type="number" v-model="form.minRent" min="1" value="1">
          </div>
          
          <div class="form-group">
            <label>Максимальный срок аренды (дней)</label>
            <input type="number" v-model="form.maxRent" min="1">
          </div>
          
          <div class="form-group">
            <label>Описание</label>
            <textarea v-model="form.description" rows="5" placeholder="Опишите особенности автомобиля, состояние, дополнительные услуги..."></textarea>
          </div>
          
          <div class="form-group">
            <label>Условия и ограничения</label>
            <textarea v-model="form.conditions" rows="3" placeholder="Например: стаж от 3 лет, без животных, без курения..."></textarea>
          </div>
        </div>
        
        <div class="form-section">
          <h2>Фотографии</h2>
          
          <div class="photo-upload">
            <div class="photo-grid">
              <div v-for="(photo, index) in form.photos" :key="index" class="photo-item">
                <img :src="photo.url" :alt="'Фото ' + (index + 1)">
                <button type="button" class="remove-photo" @click="removePhoto(index)">
                  <i class="fas fa-times"></i>
                </button>
              </div>
              
              <label v-if="form.photos.length < 10" class="photo-upload-btn">
                <input type="file" multiple accept="image/*" @change="handlePhotoUpload" style="display: none">
                <i class="fas fa-plus"></i>
                <span>Добавить фото</span>
              </label>
            </div>
            <p class="help-text">Максимум 10 фото. Первое фото будет главным.</p>
          </div>
        </div>
        
        <div class="form-section">
          <h2>Дополнительные услуги</h2>
          
          <div class="checkbox-group">
            <label class="checkbox">
              <input type="checkbox" v-model="form.services.delivery">
              <span>Доставка автомобиля (+500 ₽)</span>
            </label>
            
            <label class="checkbox">
              <input type="checkbox" v-model="form.services.childSeat">
              <span>Детское кресло (+300 ₽/сутки)</span>
            </label>
            
            <label class="checkbox">
              <input type="checkbox" v-model="form.services.navigator">
              <span>Навигатор (+200 ₽/сутки)</span>
            </label>
            
            <label class="checkbox">
              <input type="checkbox" v-model="form.services.videoRecorder">
              <span>Видеорегистратор (+250 ₽/сутки)</span>
            </label>
          </div>
        </div>
        
        <div class="form-actions">
          <button type="button" class="btn btn-secondary" @click="cancel">
            Отмена
          </button>
          <button type="submit" class="btn btn-primary" :disabled="!isFormValid">
            <i class="fas fa-check"></i> Опубликовать объявление
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'CreateAdView',
  setup() {
    const router = useRouter()
    const currentYear = new Date().getFullYear()
    
    const form = ref({
      brand: '',
      model: '',
      year: currentYear,
      color: '',
      mileage: '',
      fuelType: '',
      transmission: '',
      drive: '',
      price: '',
      deposit: '',
      minRent: 1,
      maxRent: '',
      description: '',
      conditions: '',
      photos: [],
      services: {
        delivery: false,
        childSeat: false,
        navigator: false,
        videoRecorder: false
      }
    })
    
    const isFormValid = computed(() => {
      return form.value.brand && 
             form.value.model && 
             form.value.year && 
             form.value.price
    })
    
    const handlePhotoUpload = (event) => {
      const files = Array.from(event.target.files)
      const remainingSlots = 10 - form.value.photos.length
      
      files.slice(0, remainingSlots).forEach(file => {
        const reader = new FileReader()
        reader.onload = (e) => {
          form.value.photos.push({
            file: file,
            url: e.target.result
          })
        }
        reader.readAsDataURL(file)
      })
    }
    
    const removePhoto = (index) => {
      form.value.photos.splice(index, 1)
    }
    
    const submitAd = () => {
      // Здесь будет отправка на сервер
      console.log('Отправка объявления:', form.value)
      alert('Объявление успешно создано!')
      router.push('/')
    }
    
    const cancel = () => {
      if (confirm('Отменить создание объявления?')) {
        router.back()
      }
    }
    
    return {
      form,
      currentYear,
      isFormValid,
      handlePhotoUpload,
      removePhoto,
      submitAd,
      cancel
    }
  }
}
</script>

<style scoped lang="scss">
.create-ad {
  padding: 30px 0;
  background: #f8f9fa;
  
  h1 {
    margin-bottom: 30px;
    color: #333;
  }
  
  .ad-form {
    background: white;
    border-radius: 10px;
    padding: 30px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    
    .form-section {
      margin-bottom: 40px;
      padding-bottom: 30px;
      border-bottom: 1px solid #dee2e6;
      
      &:last-child {
        border-bottom: none;
        margin-bottom: 0;
        padding-bottom: 0;
      }
      
      h2 {
        margin-bottom: 20px;
        color: #555;
        font-size: 20px;
      }
    }
    
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 20px;
      
      @media (max-width: 768px) {
        grid-template-columns: 1fr;
      }
    }
    
    .form-group {
      margin-bottom: 20px;
      
      label {
        display: block;
        margin-bottom: 5px;
        font-weight: 500;
        color: #555;
        
        .required {
          color: #dc3545;
        }
      }
      
      input, select, textarea {
        width: 100%;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 5px;
        font-size: 16px;
        
        &:focus {
          outline: none;
          border-color: #007bff;
        }
      }
    }
    
    .photo-upload {
      .photo-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 15px;
        
        .photo-item {
          position: relative;
          aspect-ratio: 4/3;
          border-radius: 5px;
          overflow: hidden;
          
          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          
          .remove-photo {
            position: absolute;
            top: 5px;
            right: 5px;
            width: 30px;
            height: 30px;
            background: rgba(220, 53, 69, 0.9);
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            
            &:hover {
              background: #dc3545;
            }
          }
        }
        
        .photo-upload-btn {
          aspect-ratio: 4/3;
          border: 2px dashed #ddd;
          border-radius: 5px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #999;
          transition: all 0.3s;
          
          i {
            font-size: 32px;
            margin-bottom: 10px;
          }
          
          &:hover {
            border-color: #007bff;
            color: #007bff;
          }
        }
      }
      
      .help-text {
        margin-top: 10px;
        color: #999;
        font-size: 14px;
      }
    }
    
    .checkbox-group {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 15px;
      
      .checkbox {
        display: flex;
        align-items: center;
        gap: 10px;
        cursor: pointer;
        
        input[type="checkbox"] {
          width: auto;
        }
      }
    }
    
    .form-actions {
      display: flex;
      gap: 15px;
      justify-content: flex-end;
      margin-top: 30px;
      
      .btn {
        padding: 12px 30px;
        font-size: 16px;
      }
    }
  }
}
</style>