<template>
  <div
    class="login-container"
    :class="{ 'dark': isDarkMode }"
  >
    <div class="login-card">
      <h1 class="login-title">
        Connexion
      </h1>
      
      <form
        class="login-form"
        @submit.prevent="handleLogin"
      >
        <div class="form-group">
          <label for="username">Nom d'utilisateur</label>
          <input
            id="username"
            v-model="username"
            type="text"
            required
            class="form-control"
            :class="{ 'is-invalid': errors.username }"
          >
          <div
            v-if="errors.username"
            class="invalid-feedback"
          >
            {{ errors.username }}
          </div>
        </div>

        <div class="form-group">
          <label for="password">Mot de passe</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            class="form-control"
            :class="{ 'is-invalid': errors.password }"
          >
          <div
            v-if="errors.password"
            class="invalid-feedback"
          >
            {{ errors.password }}
          </div>
        </div>

        <div
          v-if="error"
          class="alert alert-danger"
        >
          {{ error }}
        </div>

        <button
          type="submit"
          class="btn btn-primary btn-block"
          :disabled="loading"
        >
          <span
            v-if="loading"
            class="spinner-border spinner-border-sm mr-2"
          />
          {{ loading ? 'Connexion en cours...' : 'Se connecter' }}
        </button>
        
        <div class="admin-setup-link">
          <router-link to="/admin/setup">
            Configurer un administrateur initial
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useTheme } from '@/composables/useTheme'

export default {
  name: 'LoginView',

  setup() {
    const store = useStore()
    const router = useRouter()
    const { isDarkMode } = useTheme()

    const username = ref('')
    const password = ref('')
    const errors = reactive({
      username: '',
      password: ''
    })

    const loading = computed(() => store.getters['auth/loading'])
    const error = computed(() => store.getters['auth/error'])

    const validateForm = () => {
      let isValid = true
      errors.username = ''
      errors.password = ''

      if (!username.value) {
        errors.username = 'Le nom d\'utilisateur est requis'
        isValid = false
      }

      if (!password.value) {
        errors.password = 'Le mot de passe est requis'
        isValid = false
      }

      return isValid
    }

    const handleLogin = async () => {
      if (!validateForm()) return

      try {
        await store.dispatch('auth/login', {
          username: username.value,
          password: password.value
        })
        router.push('/dashboard')
      } catch (error) {
        console.error('Erreur de connexion:', error)
      }
    }

    return {
      username,
      password,
      errors,
      loading,
      error,
      handleLogin,
      isDarkMode
    }
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  transition: background-color 0.3s ease;
}

.login-container.dark {
  background-color: #1a1a1a;
}

.login-card {
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.dark .login-card {
  background: #2d2d2d;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.login-title {
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
  transition: color 0.3s ease;
}

.dark .login-title {
  color: #fff;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  color: #333;
  transition: color 0.3s ease;
}

.dark .form-group label {
  color: #fff;
}

.form-control {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  background-color: white;
  color: #333;
  transition: all 0.3s ease;
}

.dark .form-control {
  background-color: #3d3d3d;
  border-color: #4d4d4d;
  color: #fff;
}

.form-control:focus {
  outline: none;
  border-color: #4a90e2;
  box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
}

.dark .form-control:focus {
  border-color: #60a5fa;
  box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.2);
}

.is-invalid {
  border-color: #dc3545;
}

.invalid-feedback {
  color: #dc3545;
  font-size: 0.875rem;
}

.btn {
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-primary {
  background-color: #4a90e2;
  color: white;
}

.btn-primary:hover {
  background-color: #357abd;
}

.dark .btn-primary {
  background-color: #60a5fa;
}

.dark .btn-primary:hover {
  background-color: #3b82f6;
}

.btn-primary:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.admin-setup-link {
  text-align: center;
  margin-top: 1rem;
  font-size: 0.875rem;
}

.admin-setup-link a {
  color: #4a90e2;
  text-decoration: none;
  transition: color 0.3s ease;
}

.admin-setup-link a:hover {
  text-decoration: underline;
  color: #357abd;
}

.dark .admin-setup-link a {
  color: #60a5fa;
}

.dark .admin-setup-link a:hover {
  color: #3b82f6;
}
</style> 