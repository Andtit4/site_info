import axios from 'axios';
import { API_URL } from '@/config';

const teamsApi = {
    async getAll(filters = {}) {
        try {
            // Nettoyer les filtres vides
            const cleanFilters = Object.entries(filters).reduce((acc, [key, value]) => {
                if (value !== null && value !== undefined && value !== '') {
                    acc[key] = value;
                }
                return acc;
            }, {});

            const response = await axios.get(`${API_URL}/teams`, {
                params: cleanFilters,
                paramsSerializer: {
                    indexes: null // Pour éviter les indices dans les tableaux
                }
            });
            return response;
        } catch (error) {
            console.error('Erreur lors de la récupération des équipes:', error);
            throw error;
        }
    },

    async getById(id) {
        try {
            const response = await axios.get(`${API_URL}/teams/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Erreur lors de la récupération de l'équipe ${id}:`, error);
            throw error;
        }
    },

    async create(teamData) {
        try {
            // S'assurer que les champs sont correctement formatés
            const dataToSend = {...teamData };

            // Convertir memberCount en nombre
            if (dataToSend.memberCount) {
                dataToSend.memberCount = Number(dataToSend.memberCount);
            }

            // Supprimer les champs vides ou undefined
            Object.keys(dataToSend).forEach(key => {
                if (dataToSend[key] === undefined || dataToSend[key] === '') {
                    delete dataToSend[key];
                }
            });

            // Convertir les tableaux vides en tableaux vides (pour éviter null)
            if (!dataToSend.equipmentTypes || !Array.isArray(dataToSend.equipmentTypes)) {
                dataToSend.equipmentTypes = [];
            }

            // S'assurer que equipmentType est une valeur unique (pas un tableau)
            if (dataToSend.equipmentType && Array.isArray(dataToSend.equipmentType)) {
                dataToSend.equipmentType = dataToSend.equipmentType[0] || null;
            }

            console.log('Données envoyées au backend:', dataToSend);

            const response = await axios.post(`${API_URL}/teams`, dataToSend);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la création de l\'équipe:', error);
            throw error;
        }
    },

    async update(id, teamData) {
        try {
            // Supprimer la propriété equipmentType pour éviter les erreurs
            const dataToSend = {...teamData };
            delete dataToSend.equipmentType;

            const response = await axios.put(`${API_URL}/teams/${id}`, dataToSend);
            return response.data;
        } catch (error) {
            console.error(`Erreur lors de la mise à jour de l'équipe ${id}:`, error);
            throw error;
        }
    },

    async delete(id) {
        try {
            await axios.delete(`${API_URL}/teams/${id}`);
            return true;
        } catch (error) {
            console.error(`Erreur lors de la suppression de l'équipe ${id}:`, error);
            throw error;
        }
    },

    async getStatistics() {
        try {
            const response = await axios.get(`${API_URL}/teams/statistics`);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des statistiques des équipes:', error);
            throw error;
        }
    }
};

export default teamsApi;