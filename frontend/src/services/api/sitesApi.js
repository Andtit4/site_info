import axios from 'axios'
import { API_URL } from '@/config'

const sitesApi = {
  async getAll() {
    try {
      const response = await axios.get(`${API_URL}/sites`)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la récupération des sites:', error)
      throw error
    }
  },

  async getById(id) {
    try {
      const response = await axios.get(`${API_URL}/sites/${id}`)
      return response.data
    } catch (error) {
      console.error(`Erreur lors de la récupération du site ${id}:`, error)
      throw error
    }
  },

  async create(site) {
    try {
      const response = await axios.post(`${API_URL}/sites`, site)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la création du site:', error)
      throw error
    }
  },

  async update(id, site) {
    try {
      const response = await axios.patch(`${API_URL}/sites/${id}`, site)
      return response.data
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du site ${id}:`, error)
      throw error
    }
  },

  async delete(id) {
    try {
      await axios.delete(`${API_URL}/sites/${id}`)
      return true
    } catch (error) {
      console.error(`Erreur lors de la suppression du site ${id}:`, error)
      throw error
    }
  },

  async getStatistics() {
    try {
      const response = await axios.get(`${API_URL}/sites/statistics`)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques des sites:', error)
      throw error
    }
  },

  async assignTeams(siteId, teamIds) {
    try {
      const response = await axios.put(`${API_URL}/sites/${siteId}/teams`, { teamIds })
      return response.data
    } catch (error) {
      console.error('Erreur lors de l\'assignation des équipes:', error)
      throw error
    }
  },

  async removeTeams(siteId, teamIds) {
    try {
      const response = await axios.delete(`${API_URL}/sites/${siteId}/teams`, { data: { teamIds } })
      return response.data
    } catch (error) {
      console.error('Erreur lors du retrait des équipes:', error)
      throw error
    }
  },

  async getSiteTeams(siteId) {
    try {
      const response = await axios.get(`${API_URL}/sites/${siteId}/teams`)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la récupération des équipes du site:', error)
      throw error
    }
  }
}

export default sitesApi 