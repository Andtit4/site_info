import { equipmentApi } from '@/services/api/equipmentApi'

export default {
  namespaced: true,
  
  state: {
    equipment: [],
    loading: false,
    error: null
  },

  getters: {
    allEquipment: state => state.equipment,
    loading: state => state.loading,
    error: state => state.error
  },

  mutations: {
    SET_EQUIPMENT(state, equipment) {
      state.equipment = equipment
    },
    SET_LOADING(state, loading) {
      state.loading = loading
    },
    SET_ERROR(state, error) {
      state.error = error
    }
  },

  actions: {
    async fetchEquipment({ commit }) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      try {
        const equipment = await equipmentApi.getAll()
        commit('SET_EQUIPMENT', equipment)
      } catch (error) {
        commit('SET_ERROR', error.message || 'Erreur lors de la récupération des équipements')
        console.error('Erreur lors de la récupération des équipements:', error)
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async createEquipment({ commit, dispatch }, equipmentData) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      try {
        await equipmentApi.create(equipmentData)
        await dispatch('fetchEquipment')
      } catch (error) {
        commit('SET_ERROR', error.message || 'Erreur lors de la création de l\'équipement')
        console.error('Erreur lors de la création de l\'équipement:', error)
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async updateEquipment({ commit, dispatch }, { id, data }) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      try {
        await equipmentApi.update(id, data)
        await dispatch('fetchEquipment')
      } catch (error) {
        commit('SET_ERROR', error.message || 'Erreur lors de la mise à jour de l\'équipement')
        console.error('Erreur lors de la mise à jour de l\'équipement:', error)
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async deleteEquipment({ commit, dispatch }, id) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      try {
        await equipmentApi.delete(id)
        await dispatch('fetchEquipment')
      } catch (error) {
        commit('SET_ERROR', error.message || 'Erreur lors de la suppression de l\'équipement')
        console.error('Erreur lors de la suppression de l\'équipement:', error)
      } finally {
        commit('SET_LOADING', false)
      }
    }
  }
} 