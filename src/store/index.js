// src/store/index.js
import { createStore } from 'vuex'

const store = createStore({
  state: {
    user: null,
    isAuthenticated: false
  },
  getters: {
    user: state => state.user,
    isAuthenticated: state => state.isAuthenticated,
    username: state => {
      if (state.user) {
        return state.user.name || state.user.email || 'Пользователь'
      }
      return 'Гость'
    },
    userEmail: state => {
      return state.user?.email || ''
    },
    userRole: state => {
      return state.user?.role || 'guest'
    },
    isAdmin: state => {
      return state.user && state.user.role === 'admin'
    },
    isManager: state => {
      return state.user && (state.user.role === 'manager' || state.user.role === 'admin')
    },
    isOwner: state => {
      return state.user && (state.user.role === 'owner' || state.user.role === 'admin')
    },
    canCreateAd: state => {
      return state.user && (state.user.role === 'owner' || state.user.role === 'admin')
    }
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user
      state.isAuthenticated = !!user
      
      // Сохраняем в localStorage для сохранения сессии
      if (user) {
        localStorage.setItem('user', JSON.stringify(user))
      } else {
        localStorage.removeItem('user')
      }
    },
    LOGOUT(state) {
      state.user = null
      state.isAuthenticated = false
      localStorage.removeItem('user')
    },
    INIT_FROM_STORAGE(state) {
      const savedUser = localStorage.getItem('user')
      if (savedUser) {
        try {
          state.user = JSON.parse(savedUser)
          state.isAuthenticated = true
        } catch (e) {
          console.error('Ошибка загрузки пользователя из localStorage', e)
          localStorage.removeItem('user')
        }
      }
    }
  },
  actions: {
    login({ commit }, credentials) {
      return new Promise((resolve) => {
        // Имитация проверки credentials
        setTimeout(() => {
          let user = null
          
          if (credentials.email === 'admin@example.com' && credentials.password === 'admin123') {
            user = { 
              email: credentials.email, 
              name: 'Администратор',
              role: 'admin'
            }
          } else if (credentials.email === 'manager@example.com' && credentials.password === 'manager123') {
            user = { 
              email: credentials.email, 
              name: 'Менеджер по аренде',
              role: 'manager'
            }
          } else if (credentials.email === 'owner@example.com' && credentials.password === 'owner123') {
            user = { 
              email: credentials.email, 
              name: 'Иван Петров',
              role: 'owner'
            }
          } else if (credentials.email && credentials.password) {
            // Обычный пользователь
            user = { 
              email: credentials.email, 
              name: credentials.email.split('@')[0],
              role: 'user'
            }
          }
          
          if (user) {
            commit('SET_USER', user)
            resolve(user)
          } else {
            throw new Error('Неверные учетные данные')
          }
        }, 500)
      })
    },
    
    register({ commit }, userData) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const user = { 
            email: userData.email, 
            name: userData.username,
            role: 'user'
          }
          commit('SET_USER', user)
          resolve(user)
        }, 500)
      })
    },
    
    logout({ commit }) {
      commit('LOGOUT')
    },
    
    initFromStorage({ commit }) {
      commit('INIT_FROM_STORAGE')
    }
  },
  modules: {
  }
})

export default store