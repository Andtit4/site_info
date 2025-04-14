import axios from 'axios';
import { API_URL } from '@/config';

const specificationsApi = {
  async getAll() {
    try {
      const response = await axios.get(`${API_URL}/specifications`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des spécifications:', error);
      throw error;
    }
  },

  async getByType(equipmentType) {
    try {
      const response = await axios.get(`${API_URL}/specifications/type/${equipmentType}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des spécifications par type:', error);
      throw error;
    }
  },

  async create(specificationData) {
    try {
      const response = await axios.post(`${API_URL}/specifications`, specificationData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création des spécifications:', error);
      throw error;
    }
  },

  async update(id, specificationData) {
    try {
      const response = await axios.put(`${API_URL}/specifications/${id}`, specificationData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour des spécifications:', error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const response = await axios.delete(`${API_URL}/specifications/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la suppression des spécifications:', error);
      throw error;
    }
  }
};

export default specificationsApi; 