import axios from 'axios'

const API_URL = process.env.VUE_APP_API_URL || 'http://localhost:3000/api'

// Configuration d'axios pour inclure le token dans les requêtes
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// Intercepteur pour gérer les erreurs d'authentification
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Token expiré ou invalide
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('rememberMe')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default {
  async login(credentials) {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, credentials)
      const { user, token } = response.data
      
      // Stocker le token et les informations utilisateur
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      
      return { user, token }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error)
      throw new Error(error.response?.data?.message || 'Erreur lors de la connexion')
    }
  },

  logout() {
    // Supprimer le token et les informations utilisateur
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('rememberMe')
  },

  getCurrentUser() {
    try {
      const userStr = localStorage.getItem('user')
      if (!userStr) {
        return null
      }
      return JSON.parse(userStr)
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error)
      return null
    }
  },

  isAuthenticated() {
    return !!localStorage.getItem('token')
  },

  getToken() {
    return localStorage.getItem('token')
  },

  setToken(token) {
    if (token) {
      localStorage.setItem('token', token)
    } else {
      localStorage.removeItem('token')
    }
  },

  setUser(user) {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user))
    } else {
      localStorage.removeItem('user')
    }
  }
} 