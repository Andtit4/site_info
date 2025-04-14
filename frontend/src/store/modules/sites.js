import { sitesApi } from '@/services/api/sitesApi'

export default {
  namespaced: true,
  
  state: {
    sites: [],
    currentSite: null,
    loading: false,
    error: null
  },

  getters: {
    allSites: state => state.sites,
    currentSite: state => state.currentSite,
    loading: state => state.loading,
    error: state => state.error
  },

  mutations: {
    SET_SITES(state, sites) {
      state.sites = sites
    },
    SET_CURRENT_SITE(state, site) {
      state.currentSite = site
    },
    SET_LOADING(state, loading) {
      state.loading = loading
    },
    SET_ERROR(state, error) {
      state.error = error
    }
  },

  actions: {
    async fetchSites({ commit }) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      try {
        const sites = await sitesApi.getAll()
        commit('SET_SITES', sites)
      } catch (error) {
        commit('SET_ERROR', error.message || 'Erreur lors de la récupération des sites')
        console.error('Erreur lors de la récupération des sites:', error)
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async fetchSiteById({ commit }, id) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      try {
        const site = await sitesApi.getById(id)
        commit('SET_CURRENT_SITE', site)
        return site
      } catch (error) {
        commit('SET_ERROR', error.message || 'Erreur lors de la récupération du site')
        console.error('Erreur lors de la récupération du site:', error)
        return null
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async createSite({ commit, dispatch }, siteData) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      try {
        await sitesApi.create(siteData)
        await dispatch('fetchSites')
      } catch (error) {
        commit('SET_ERROR', error.message || 'Erreur lors de la création du site')
        console.error('Erreur lors de la création du site:', error)
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async updateSite({ commit, dispatch, state }, { id, data }) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      try {
        await sitesApi.update(id, data)
        await dispatch('fetchSites')
        if (state.currentSite && state.currentSite.id === id) {
          await dispatch('fetchSiteById', id)
        }
      } catch (error) {
        commit('SET_ERROR', error.message || 'Erreur lors de la mise à jour du site')
        console.error('Erreur lors de la mise à jour du site:', error)
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async deleteSite({ commit, dispatch, state }, id) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      try {
        await sitesApi.delete(id)
        await dispatch('fetchSites')
        if (state.currentSite && state.currentSite.id === id) {
          commit('SET_CURRENT_SITE', null)
        }
      } catch (error) {
        commit('SET_ERROR', error.message || 'Erreur lors de la suppression du site')
        console.error('Erreur lors de la suppression du site:', error)
      } finally {
        commit('SET_LOADING', false)
      }
    }
  }
} 