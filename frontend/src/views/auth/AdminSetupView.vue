<template>
  <div class="admin-setup-container">
    <div class="card">
      <div class="card-header">
        <h2>Configuration de l'administrateur initial</h2>
      </div>
      <div class="card-body">
        <div v-if="successMessage" class="alert alert-success">
          {{ successMessage }}
        </div>
        <div v-if="errorMessage" class="alert alert-danger">
          {{ errorMessage }}
        </div>

        <form @submit.prevent="submitForm">
          <div class="form-group">
            <label for="username">Nom d'utilisateur</label>
            <input
              type="text"
              id="username"
              v-model="form.username"
              class="form-control"
              :class="{ 'is-invalid': validationErrors.username }"
              required
            />
            <div v-if="validationErrors.username" class="invalid-feedback">
              {{ validationErrors.username }}
            </div>
          </div>

          <div class="form-group">
            <label for="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              v-model="form.password"
              class="form-control"
              :class="{ 'is-invalid': validationErrors.password }"
              required
            />
            <div v-if="validationErrors.password" class="invalid-feedback">
              {{ validationErrors.password }}
            </div>
          </div>

          <div class="form-group">
            <label for="confirmPassword">Confirmer le mot de passe</label>
            <input
              type="password"
              id="confirmPassword"
              v-model="form.confirmPassword"
              class="form-control"
              :class="{ 'is-invalid': validationErrors.confirmPassword }"
              required
            />
            <div v-if="validationErrors.confirmPassword" class="invalid-feedback">
              {{ validationErrors.confirmPassword }}
            </div>
          </div>

          <div class="form-group">
            <label for="email">Adresse e-mail</label>
            <input
              type="email"
              id="email"
              v-model="form.email"
              class="form-control"
              :class="{ 'is-invalid': validationErrors.email }"
              required
            />
            <div v-if="validationErrors.email" class="invalid-feedback">
              {{ validationErrors.email }}
            </div>
          </div>

          <div class="form-group">
            <label for="firstName">Prénom</label>
            <input
              type="text"
              id="firstName"
              v-model="form.firstName"
              class="form-control"
              :class="{ 'is-invalid': validationErrors.firstName }"
              required
            />
            <div v-if="validationErrors.firstName" class="invalid-feedback">
              {{ validationErrors.firstName }}
            </div>
          </div>

          <div class="form-group">
            <label for="lastName">Nom</label>
            <input
              type="text"
              id="lastName"
              v-model="form.lastName"
              class="form-control"
              :class="{ 'is-invalid': validationErrors.lastName }"
              required
            />
            <div v-if="validationErrors.lastName" class="invalid-feedback">
              {{ validationErrors.lastName }}
            </div>
          </div>

          <div class="form-group">
            <label for="setupKey">Clé de configuration</label>
            <input
              type="text"
              id="setupKey"
              v-model="setupKey"
              class="form-control"
              :class="{ 'is-invalid': validationErrors.setupKey }"
              required
            />
            <div v-if="validationErrors.setupKey" class="invalid-feedback">
              {{ validationErrors.setupKey }}
            </div>
            <small class="form-text text-muted">
              Cette clé est définie dans le fichier .env du backend (ADMIN_SETUP_KEY).
            </small>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
              {{ isSubmitting ? 'Configuration en cours...' : 'Configurer l\'administrateur' }}
            </button>
            <button type="button" class="btn btn-secondary" @click="goToLogin">Retour à la connexion</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import authService from '@/services/auth.service.js'
import { useRouter } from 'vue-router'
import { ref } from 'vue'

export default {
  name: 'AdminSetupView',
  setup() {
    const router = useRouter()
    
    const form = ref({
      username: '',
      password: '',
      confirmPassword: '',
      email: '',
      firstName: '',
      lastName: ''
    })
    
    const setupKey = ref('')
    const isSubmitting = ref(false)
    const successMessage = ref('')
    const errorMessage = ref('')
    const validationErrors = ref({})
    
    const validateForm = () => {
      const errors = {}
      
      if (!form.value.username) {
        errors.username = 'Le nom d\'utilisateur est requis'
      }
      
      if (!form.value.password) {
        errors.password = 'Le mot de passe est requis'
      } else if (form.value.password.length < 8) {
        errors.password = 'Le mot de passe doit contenir au moins 8 caractères'
      }
      
      if (form.value.password !== form.value.confirmPassword) {
        errors.confirmPassword = 'Les mots de passe ne correspondent pas'
      }
      
      if (!form.value.email) {
        errors.email = 'L\'email est requis'
      } else if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(form.value.email)) {
        errors.email = 'Format d\'email invalide'
      }
      
      if (!form.value.firstName) {
        errors.firstName = 'Le prénom est requis'
      }
      
      if (!form.value.lastName) {
        errors.lastName = 'Le nom est requis'
      }
      
      if (!setupKey.value) {
        errors.setupKey = 'La clé de configuration est requise'
      }
      
      validationErrors.value = errors
      return Object.keys(errors).length === 0
    }
    
    const submitForm = async () => {
      if (!validateForm()) {
        return
      }
      
      isSubmitting.value = true
      errorMessage.value = ''
      successMessage.value = ''
      
      try {
        const adminData = {
          username: form.value.username,
          password: form.value.password,
          email: form.value.email,
          firstName: form.value.firstName,
          lastName: form.value.lastName
        }
        
        await authService.setupInitialAdmin(adminData, setupKey.value)
        
        successMessage.value = 'Administrateur initial créé avec succès. Vous pouvez maintenant vous connecter.'
        
        // Réinitialiser le formulaire
        form.value = {
          username: '',
          password: '',
          confirmPassword: '',
          email: '',
          firstName: '',
          lastName: ''
        }
        setupKey.value = ''
        
        // Rediriger vers la page de connexion après un délai
        setTimeout(() => {
          router.push('/login')
        }, 3000)
      } catch (error) {
        errorMessage.value = error.message || 'Une erreur est survenue lors de la configuration de l\'administrateur'
      } finally {
        isSubmitting.value = false
      }
    }
    
    const goToLogin = () => {
      router.push('/login')
    }
    
    return {
      form,
      setupKey,
      isSubmitting,
      successMessage,
      errorMessage,
      validationErrors,
      submitForm,
      goToLogin
    }
  }
}
</script>

<style scoped>
.admin-setup-container {
  max-width: 600px;
  margin: 40px auto;
  padding: 0 20px;
}

.card {
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #fff;
}

.card-header {
  background-color: #f8f9fa;
  padding: 20px;
  border-bottom: 1px solid #e9ecef;
  border-radius: 8px 8px 0 0;
}

.card-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #343a40;
}

.card-body {
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #495057;
}

.form-control {
  width: 100%;
  padding: 10px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 1rem;
}

.form-control:focus {
  border-color: #80bdff;
  outline: 0;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.form-text {
  margin-top: 8px;
  font-size: 0.875rem;
  color: #6c757d;
}

.is-invalid {
  border-color: #dc3545;
}

.invalid-feedback {
  display: block;
  width: 100%;
  margin-top: 0.25rem;
  font-size: 0.875rem;
  color: #dc3545;
}

.alert {
  padding: 12px 20px;
  margin-bottom: 20px;
  border-radius: 4px;
}

.alert-success {
  background-color: #d4edda;
  border-color: #c3e6cb;
  color: #155724;
}

.alert-danger {
  background-color: #f8d7da;
  border-color: #f5c6cb;
  color: #721c24;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
}

.btn {
  padding: 10px 20px;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  border: none;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover {
  background-color: #0069d9;
}

.btn-primary:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #5a6268;
}
</style> 