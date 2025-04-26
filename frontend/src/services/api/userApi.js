import axios from 'axios'
import { API_URL } from '@/config'

const userApi = {
    async updateProfile(userData) {
        try {
            const response = await axios.patch(`${API_URL}/users/profile`, userData)
            return response.data
        } catch (error) {
            console.error('Erreur lors de la mise à jour du profil:', error)
            throw error
        }
    },

    async changePassword(passwordData) {
        try {
            // S'assurer que le mot de passe est bien envoyé avec le bon format
            const payload = {
                password: passwordData.password
            }

            const response = await axios.post(`${API_URL}/users/change-password`, payload)
            return response.data
        } catch (error) {
            console.error('Erreur lors du changement de mot de passe:', error)
            throw error
        }
    },

    async getDepartmentInfo(departmentId) {
        try {
            const response = await axios.get(`${API_URL}/departments/${departmentId}`)
            return response.data
        } catch (error) {
            console.error(`Erreur lors de la récupération des informations du département ${departmentId}:`, error)
            throw error
        }
    },

    async checkUsernameAvailability(username) {
        try {
            const response = await axios.get(`${API_URL}/users/check-username?username=${encodeURIComponent(username)}`)
            return response.data.available
        } catch (error) {
            console.error('Erreur lors de la vérification de la disponibilité du nom d\'utilisateur:', error)
                // En cas d'erreur, on considère que le nom d'utilisateur n'est pas disponible par précaution
            return false
        }
    }
}

export default userApi