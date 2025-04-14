import axios from 'axios'
import { API_URL } from '@/config'

const equipmentApi = {
  async getAll() {
    try {
      const response = await axios.get(`${API_URL}/equipment`)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la récupération des équipements:', error)
      throw error
    }
  },

  async getById(id) {
    try {
      const response = await axios.get(`${API_URL}/equipment/${id}`)
      return response.data
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'équipement ${id}:`, error)
      throw error
    }
  },

  async create(equipmentData) {
    try {
      const response = await axios.post(`${API_URL}/equipment`, equipmentData)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la création de l\'équipement:', error)
      throw error
    }
  },

  async update(id, equipmentData) {
    try {
      const response = await axios.put(`${API_URL}/equipment/${id}`, equipmentData)
      return response.data
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de l'équipement ${id}:`, error)
      throw error
    }
  },

  async delete(id) {
    try {
      await axios.delete(`${API_URL}/equipment/${id}`)
      return true
    } catch (error) {
      console.error(`Erreur lors de la suppression de l'équipement ${id}:`, error)
      throw error
    }
  },

  async getStatistics() {
    try {
      const response = await axios.get(`${API_URL}/equipment/statistics`)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques des équipements:', error)
      throw error
    }
  }
}

export default equipmentApi 