import authService from '@/services/auth.service'

export default {
  namespaced: true,
  
  state: {
    user: null,
    token: null,
    loading: false,
    error: null
  },

  getters: {
    isAuthenticated: state => !!state.token,
    currentUser: state => state.user,
    loading: state => state.loading,
    error: state => state.error
  },

  mutations: {
    SET_USER(state, user) {
      state.user = user
    },
    SET_TOKEN(state, token) {
      state.token = token
    },
    SET_LOADING(state, loading) {
      state.loading = loading
    },
    SET_ERROR(state, error) {
      state.error = error
    },
    CLEAR_AUTH(state) {
      state.user = null
      state.token = null
      state.error = null
    }
  },

  actions: {
    async login({ commit }, credentials) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      try {
        const { user, token } = await authService.login(credentials)
        commit('SET_USER', user)
        commit('SET_TOKEN', token)
        return { user, token }
      } catch (error) {
        commit('SET_ERROR', error.message)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    logout({ commit }) {
      authService.logout()
      commit('CLEAR_AUTH')
    },

    initializeAuth({ commit }) {
      const token = authService.getToken()
      const user = authService.getCurrentUser()
      
      if (token && user) {
        commit('SET_TOKEN', token)
        commit('SET_USER', user)
      }
    }
  }
} 