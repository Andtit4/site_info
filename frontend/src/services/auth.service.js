import axios from 'axios'

const API_URL = process.env.VUE_APP_API_URL || 'http://localhost:5001/api'

// Configuration d'axios 
axios.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    error => {
        return Promise.reject(error)
    }
)

axios.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            // Token expire
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            localStorage.removeItem('rememberMe')
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

export default {
    async login(credentials) {
        try {
            const response = await axios.post(`${API_URL}/auth/login`, credentials)
            const userData = response.data
            const token = userData.accessToken

            localStorage.setItem('token', token)
            localStorage.setItem('user', JSON.stringify(userData))

            return { user: userData, token }
        } catch (error) {
            console.error('Erreur lors de la connexion:', error)
            throw new Error( /* error.response ? .data ? .message || */ 'Erreur lors de la connexion')
        }
    },

    logout() {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('rememberMe')
    },

    getCurrentUser() {
        try {
            const userStr = localStorage.getItem('user')
            if (!userStr) {
                return null
            }
            return JSON.parse(userStr)
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'utilisateur:', error)
            return null
        }
    },

    isAuthenticated() {
        return !!localStorage.getItem('token')
    },

    isAdmin() {
        const user = this.getCurrentUser()
        return user && user.isAdmin
    },

    isDepartmentUser() {
        const user = this.getCurrentUser()
        return user && user.departmentId && !user.isAdmin
    },

    isDepartmentAdmin() {
        const user = this.getCurrentUser()
        return user && user.isDepartmentAdmin
    },

    isTeamMember() {
        const user = this.getCurrentUser()
        return user && user.isTeamMember
    },

    hasDepartmentRights() {
        const user = this.getCurrentUser()
        return user && user.hasDepartmentRights
    },

    canManageEquipmentType(equipmentType) {
        const user = this.getCurrentUser()

        // Les admins peuvent tout gérer
        if (user && user.isAdmin) {
            return true
        }

        // Vérifier si l'utilisateur a des types d'équipement spécifiques qu'il peut gérer
        if (user && user.managedEquipmentTypes && Array.isArray(user.managedEquipmentTypes)) {
            return user.managedEquipmentTypes.includes(equipmentType)
        }

        return false
    },

    getToken() {
        return localStorage.getItem('token')
    },

    setToken(token) {
        if (token) {
            localStorage.setItem('token', token)
        } else {
            localStorage.removeItem('token')
        }
    },

    setUser(user) {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user))
        } else {
            localStorage.removeItem('user')
        }
    },

    async createAdmin(adminData) {
        try {
            const response = await axios.post(`${API_URL}/auth/admin/create`, adminData)
            return response.data
        } catch (error) {
            console.error('Erreur lors de la création de l\'administrateur:', error)
            throw new Error( /* error.response?.data?.message || */ 'Erreur lors de la création de l\'administrateur')
        }
    },

    async setupInitialAdmin(adminData, setupKey) {
        try {
            const response = await axios.post(`${API_URL}/auth/setup/admin?setupKey=${setupKey}`, adminData)
            return response.data
        } catch (error) {
            console.error('Erreur lors de la configuration de l\'administrateur initial:', error)
            throw new Error( /* error.response?.data?.message || */ 'Erreur lors de la configuration de l\'administrateur initial')
        }
    }
}