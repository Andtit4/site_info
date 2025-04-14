import { departmentsApi } from '@/services/api/departmentsApi'

export default {
  namespaced: true,
  
  state: {
    departments: [],
    currentDepartment: null,
    loading: false,
    error: null
  },

  getters: {
    allDepartments: state => state.departments,
    currentDepartment: state => state.currentDepartment,
    loading: state => state.loading,
    error: state => state.error
  },

  mutations: {
    SET_DEPARTMENTS(state, departments) {
      state.departments = departments
    },
    SET_CURRENT_DEPARTMENT(state, department) {
      state.currentDepartment = department
    },
    SET_LOADING(state, loading) {
      state.loading = loading
    },
    SET_ERROR(state, error) {
      state.error = error
    }
  },

  actions: {
    async fetchDepartments({ commit }) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      try {
        const departments = await departmentsApi.getAll()
        commit('SET_DEPARTMENTS', departments)
      } catch (error) {
        commit('SET_ERROR', error.message || 'Erreur lors de la récupération des départements')
        console.error('Erreur lors de la récupération des départements:', error)
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async fetchDepartmentById({ commit }, id) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      try {
        const department = await departmentsApi.getById(id)
        commit('SET_CURRENT_DEPARTMENT', department)
        return department
      } catch (error) {
        commit('SET_ERROR', error.message || 'Erreur lors de la récupération du département')
        console.error('Erreur lors de la récupération du département:', error)
        return null
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async createDepartment({ commit, dispatch }, departmentData) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      try {
        await departmentsApi.create(departmentData)
        await dispatch('fetchDepartments')
      } catch (error) {
        commit('SET_ERROR', error.message || 'Erreur lors de la création du département')
        console.error('Erreur lors de la création du département:', error)
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async updateDepartment({ commit, dispatch, state }, { id, data }) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      try {
        await departmentsApi.update(id, data)
        await dispatch('fetchDepartments')
        if (state.currentDepartment && state.currentDepartment.id === id) {
          await dispatch('fetchDepartmentById', id)
        }
      } catch (error) {
        commit('SET_ERROR', error.message || 'Erreur lors de la mise à jour du département')
        console.error('Erreur lors de la mise à jour du département:', error)
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async deleteDepartment({ commit, dispatch, state }, id) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      try {
        await departmentsApi.delete(id)
        await dispatch('fetchDepartments')
        if (state.currentDepartment && state.currentDepartment.id === id) {
          commit('SET_CURRENT_DEPARTMENT', null)
        }
      } catch (error) {
        commit('SET_ERROR', error.message || 'Erreur lors de la suppression du département')
        console.error('Erreur lors de la suppression du département:', error)
      } finally {
        commit('SET_LOADING', false)
      }
    }
  }
} 