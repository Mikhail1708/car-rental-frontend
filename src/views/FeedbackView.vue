<template>
  <div class="feedback">
    <div class="container">
      <h1>Обратная связь</h1>
      
      <div class="feedback-form">
        <div class="form-group">
          <label for="name">Ваше имя</label>
          <input type="text" id="name" v-model="form.name" placeholder="Введите ваше имя">
        </div>
        
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="form.email" placeholder="Введите ваш email">
        </div>
        
        <div class="form-group">
          <label for="message">Сообщение</label>
          <textarea 
            id="message" 
            v-model="form.message" 
            placeholder="Напишите детали вашего вопроса"
            rows="6"
          ></textarea>
        </div>
        
        <button class="btn btn-primary" @click="submitFeedback">
          Отправить
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FeedbackView',
  data() {
    return {
      form: {
        name: '',
        email: '',
        message: ''
      }
    }
  },
  methods: {
    submitFeedback() {
      alert('Спасибо за обратную связь!')
      this.form = {
        name: '',
        email: '',
        message: ''
      }
    }
  }
}
</script>

<style scoped lang="scss">
.feedback {
  padding: 30px 0;
  
  h1 {
    margin-bottom: 30px;
    color: #333;
  }
  
  .feedback-form {
    max-width: 600px;
    margin: 0 auto;
    background: white;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    
    .btn {
      width: 100%;
      padding: 12px;
      font-size: 16px;
    }
  }
}
</style>