import axios from 'axios'
import { API_URL } from '@/config'

const departmentsApi = {
    async getAll() {
        try {
            const response = await axios.get(`${API_URL}/departments`)
            console.log('Réponse brute des départements:', response);
            if (response.data && Array.isArray(response.data)) {
                return response.data;
            } else if (Array.isArray(response)) {
                return response;
            } else {
                console.error('Format de réponse invalide:', response);
                throw new Error('Format de réponse invalide pour les départements');
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des départements:', error)
            throw error
        }
    },

    async getById(id) {
        try {
            const response = await axios.get(`${API_URL}/departments/${id}`)
            return response.data
        } catch (error) {
            console.error(`Erreur lors de la récupération du département ${id}:`, error)
            throw error
        }
    },

    async getByEquipmentType(equipmentType) {
        try {
            const response = await axios.get(`${API_URL}/departments/equipment-type/${equipmentType}`)
            return response.data
        } catch (error) {
            console.error(`Erreur lors de la récupération des départements pour le type d'équipement ${equipmentType}:`, error)
            throw error
        }
    },

    async create(departmentData) {
        try {
            // Vérifier et formater les données pour la création de compte utilisateur
            const dataToSend = {...departmentData };

            // S'assurer que les champs sont correctement formatés
            if (dataToSend.contactPhone) {
                dataToSend.contactPhone = Number(dataToSend.contactPhone);
            }

            // Si createAccount est true, mais pas de mot de passe spécifié,
            // laisser le backend générer un mot de passe aléatoire
            if (dataToSend.createAccount === true && (!dataToSend.password || dataToSend.password.trim() === '')) {
                console.log('Aucun mot de passe fourni, le backend en générera un automatiquement');
                // Supprimer le champ password vide pour que le backend utilise son générateur
                delete dataToSend.password;
            }

            const response = await axios.post(`${API_URL}/departments`, dataToSend)
            return response.data
        } catch (error) {
            console.error('Erreur lors de la création du département:', error)
            throw error
        }
    },

    async update(id, departmentData) {
        try {
            const response = await axios.put(`${API_URL}/departments/${id}`, departmentData)
            return response.data
        } catch (error) {
            console.error(`Erreur lors de la mise à jour du département ${id}:`, error)
            throw error
        }
    },

    async delete(id) {
        try {
            await axios.delete(`${API_URL}/departments/${id}`)
            return true
        } catch (error) {
            console.error(`Erreur lors de la suppression du département ${id}:`, error)
            throw error
        }
    },

    async getStatistics() {
        try {
            const response = await axios.get(`${API_URL}/departments/statistics`)
            return response.data
        } catch (error) {
            console.error('Erreur lors de la récupération des statistiques des départements:', error)
            throw error
        }
    }
}

export default departmentsApi