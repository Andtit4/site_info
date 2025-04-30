import axios from 'axios'

const API_URL = process.env.VUE_APP_API_URL || 'http://localhost:5001/api'

export default {
    /**
     * Récupérer tous les utilisateurs
     */
    async getAll() {
        try {
            const response = await axios.get(`${API_URL}/users`);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des utilisateurs:', error);
            throw error;
        }
    },

    /**
     * Récupérer un utilisateur par son ID
     */
    async getById(id) {
        try {
            const response = await axios.get(`${API_URL}/users/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Erreur lors de la récupération de l'utilisateur ${id}:`, error);
            throw error;
        }
    },

    /**
     * Créer un nouvel utilisateur
     */
    async create(userData) {
        try {
            const response = await axios.post(`${API_URL}/users`, userData);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la création de l\'utilisateur:', error);
            throw error;
        }
    },

    /**
     * Mettre à jour un utilisateur
     */
    async update(id, userData) {
        try {
            const response = await axios.put(`${API_URL}/users/${id}`, userData);
            return response.data;
        } catch (error) {
            console.error(`Erreur lors de la mise à jour de l'utilisateur ${id}:`, error);
            throw error;
        }
    },

    /**
     * Supprimer un utilisateur
     */
    async delete(id) {
        try {
            const response = await axios.delete(`${API_URL}/users/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Erreur lors de la suppression de l'utilisateur ${id}:`, error);
            throw error;
        }
    },

    /**
     * Vérifier la disponibilité d'un nom d'utilisateur
     */
    async checkUsernameAvailability(username) {
        try {
            const response = await axios.get(`${API_URL}/users/check-username?username=${encodeURIComponent(username)}`);
            return response.data.available;
        } catch (error) {
            console.error('Erreur lors de la vérification du nom d\'utilisateur:', error);
            throw error;
        }
    },

    /**
     * Mettre à jour le profil de l'utilisateur connecté
     */
    async updateProfile(profileData) {
        try {
            const response = await axios.put(`${API_URL}/users/profile`, profileData);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la mise à jour du profil:', error);
            throw error;
        }
    },

    /**
     * Changer le mot de passe de l'utilisateur connecté
     */
    async changePassword(passwordData) {
        try {
            const response = await axios.post(`${API_URL}/users/change-password`, passwordData);
            return response.data;
        } catch (error) {
            console.error('Erreur lors du changement de mot de passe:', error);
            throw error;
        }
    },

    /**
     * Récupérer les informations d'un département
     */
    async getDepartmentInfo(departmentId) {
        try {
            const response = await axios.get(`${API_URL}/departments/${departmentId}`);
            return response.data;
        } catch (error) {
            console.error(`Erreur lors de la récupération du département ${departmentId}:`, error);
            throw error;
        }
    }
}