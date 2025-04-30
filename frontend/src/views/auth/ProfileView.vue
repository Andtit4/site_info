<template>
  <div>
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">
          Mon profil
        </h1>
        <p class="mt-2 text-sm text-gray-700 dark:text-gray-300">
          Consultez et modifiez vos informations personnelles.
        </p>
      </div>
    </div>

    <div class="mt-8 max-w-3xl mx-auto">
      <div class="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
        <!-- Photo de profil et nom d'utilisateur -->
        <div class="px-4 py-5 sm:px-6 flex items-center space-x-4">
          <div class="flex-shrink-0">
            <img 
              class="h-20 w-20 rounded-full" 
              :src="userAvatar" 
              alt="Avatar de profil"
            >
          </div>
          <div>
            <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
              {{ user?.username || 'Utilisateur' }}
            </h3>
            <p class="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
              {{ user?.isAdmin ? 'Administrateur' : (user?.departmentId ? 'Utilisateur département' : 'Utilisateur') }}
            </p>
          </div>
        </div>

        <!-- Formulaire d'informations -->
        <div class="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-6">
          <form @submit.prevent="saveProfile">
            <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div>
                <label
                  for="username"
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Nom d'utilisateur
                </label>
                <div class="mt-1">
                  <input 
                    id="username" 
                    v-model="form.username" 
                    type="text" 
                    class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white" 
                    :class="{ 'border-red-500 dark:border-red-500': usernameError }"
                    required
                  >
                  <div v-if="isCheckingUsername" class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Vérification de la disponibilité...
                  </div>
                  <div v-else-if="usernameError" class="mt-1 text-xs text-red-500">
                    {{ usernameError }}
                  </div>
                  <div v-else-if="form.username && form.username !== initialUsername && usernameAvailable" class="mt-1 text-xs text-green-500">
                    Nom d'utilisateur disponible
                  </div>
                </div>
              </div>

              <div>
                <label
                  for="email"
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Adresse email
                </label>
                <div class="mt-1">
                  <input 
                    id="email" 
                    v-model="form.email" 
                    type="email" 
                    class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white" 
                    required
                  >
                </div>
              </div>

              <div v-if="user && user.departmentId">
                <label
                  for="department"
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Département
                </label>
                <div class="mt-1">
                  <input 
                    id="department" 
                    v-model="departmentName" 
                    type="text" 
                    class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white bg-gray-100 dark:bg-gray-600" 
                    disabled
                  >
                </div>
              </div>
            </div>

            <!-- Section de mot de passe -->
            <div class="mt-6">
              <h3 class="text-md font-medium text-gray-900 dark:text-white mb-4">Changer de mot de passe</h3>
              <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div>
                  <label
                    for="password"
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Nouveau mot de passe
                  </label>
                  <div class="mt-1">
                    <input 
                      id="password" 
                      v-model="form.password" 
                      type="password" 
                      class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white" 
                    >
                    <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Un email de confirmation vous sera envoyé si vous modifiez votre mot de passe.
                    </p>
                  </div>
                </div>

                <div v-if="form.password">
                  <label
                    for="confirmPassword"
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Confirmer le mot de passe
                  </label>
                  <div class="mt-1">
                    <input 
                      id="confirmPassword" 
                      v-model="form.confirmPassword" 
                      type="password" 
                      class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white" 
                      :class="{ 'border-red-500 dark:border-red-500': form.password && form.confirmPassword && form.password !== form.confirmPassword }"
                    >
                    <div v-if="form.password && form.confirmPassword && form.password !== form.confirmPassword" class="mt-1 text-xs text-red-500">
                      Les mots de passe ne correspondent pas
                    </div>
                    <div v-else-if="form.password && form.confirmPassword && form.password === form.confirmPassword" class="mt-1 text-xs text-green-500">
                      Les mots de passe correspondent
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Section de permissions et rôles -->
            <div class="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-6">
              <h3 class="text-md font-medium text-gray-900 dark:text-white mb-4">Permissions et rôles</h3>
              
              <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <!-- Statut Administrateur -->
                <div v-if="user?.isAdmin" class="flex items-center">
                  <span class="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    <svg class="mr-1.5 h-2 w-2 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 8 8">
                      <circle cx="4" cy="4" r="3" />
                    </svg>
                    Administrateur
                  </span>
                </div>

                <!-- Statut Administrateur Département -->
                <div v-if="user?.isDepartmentAdmin" class="flex items-center">
                  <span class="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    <svg class="mr-1.5 h-2 w-2 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 8 8">
                      <circle cx="4" cy="4" r="3" />
                    </svg>
                    Administrateur de département
                  </span>
                </div>

                <!-- Statut Membre d'équipe -->
                <div v-if="user?.isTeamMember" class="flex items-center">
                  <span class="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                    <svg class="mr-1.5 h-2 w-2 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 8 8">
                      <circle cx="4" cy="4" r="3" />
                    </svg>
                    Membre d'équipe
                  </span>
                </div>

                <!-- Hérite des droits département -->
                <div v-if="user?.hasDepartmentRights" class="flex items-center">
                  <span class="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                    <svg class="mr-1.5 h-2 w-2 text-yellow-600 dark:text-yellow-400" fill="currentColor" viewBox="0 0 8 8">
                      <circle cx="4" cy="4" r="3" />
                    </svg>
                    Droits hérités du département
                  </span>
                </div>
              </div>

              <!-- Types d'équipement gérés -->
              <div class="mt-6" v-if="user?.managedEquipmentTypes && user.managedEquipmentTypes.length > 0">
                <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Types d'équipement gérés:</h4>
                <div class="flex flex-wrap gap-2">
                  <span 
                    v-for="(type, index) in user.managedEquipmentTypes" 
                    :key="index" 
                    class="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
                  >
                    {{ type }}
                  </span>
                </div>
              </div>
            </div>

            <div class="pt-5 flex justify-end">
              <button
                type="button"
                class="bg-white dark:bg-gray-700 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                @click="resetForm"
              >
                Annuler
              </button>
              <button
                type="submit"
                class="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                :disabled="isSaving || (form.password && form.password !== form.confirmPassword) || !usernameAvailable"
              >
                {{ isSaving ? 'Enregistrement...' : 'Enregistrer' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import { useToast } from 'vue-toastification';
import authService from '@/services/auth.service';
import userApi from '@/services/api/userApi';

export default {
  setup() {
    const toast = useToast();
    const user = ref(null);
    const userAvatar = computed(() => (user.value?.avatar ? user.value.avatar : '/images/default-avatar.png'));
    const departmentName = ref('');
    
    // Formulaire avec des données séparées pour le profil et le mot de passe
    const form = ref({
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    
    const initialUsername = ref('');
    const usernameAvailable = ref(true);
    const isCheckingUsername = ref(false);
    const usernameError = ref('');
    const isSaving = ref(false);

    // Initialiser le formulaire avec les données actuelles de l'utilisateur
    const initForm = () => {
      if (user.value) {
        form.value.username = user.value.username || '';
        form.value.email = user.value.email || '';
        initialUsername.value = user.value.username || '';
        form.value.password = '';
        form.value.confirmPassword = '';
      }
    };

    // Réinitialiser le formulaire
    const resetForm = () => {
      initForm();
      usernameError.value = '';
      usernameAvailable.value = true;
    };

    // Vérifier la disponibilité du nom d'utilisateur
    const checkUsername = async () => {
      // Ne vérifier que si le nom d'utilisateur a changé
      if (form.value.username && form.value.username !== initialUsername.value) {
        isCheckingUsername.value = true;
        usernameError.value = '';
        
        try {
          const isAvailable = await userApi.checkUsernameAvailability(form.value.username);
          usernameAvailable.value = isAvailable;
          
          if (!isAvailable) {
            usernameError.value = 'Ce nom d\'utilisateur est déjà pris';
          }
        } catch (error) {
          console.error('Erreur lors de la vérification du nom d\'utilisateur:', error);
          usernameError.value = 'Erreur lors de la vérification de la disponibilité';
          usernameAvailable.value = false;
        } finally {
          isCheckingUsername.value = false;
        }
      } else if (form.value.username === initialUsername.value) {
        // Si l'utilisateur revient à son nom d'utilisateur d'origine
        usernameAvailable.value = true;
        usernameError.value = '';
      }
    };

    // Observer les changements du nom d'utilisateur pour vérifier sa disponibilité
    watch(() => form.value.username, (newVal) => {
      if (newVal && newVal !== initialUsername.value) {
        // Attendre que l'utilisateur ait fini de taper
        const timeoutId = setTimeout(() => {
          checkUsername();
        }, 500);
        
        return () => clearTimeout(timeoutId);
      } else if (newVal === initialUsername.value) {
        usernameAvailable.value = true;
        usernameError.value = '';
      }
    });

    // Mettre à jour le profil
    const updateProfile = async () => {
      if (!usernameAvailable.value) {
        toast.error('Veuillez choisir un autre nom d\'utilisateur');
        return false;
      }

      try {
        // Vérifier si les informations ont réellement changé
        const currentUser = authService.getCurrentUser();
        if (!currentUser) {
          toast.error('Impossible de récupérer les informations utilisateur');
          return false;
        }

        // Vérifier si quelque chose a changé
        if (currentUser.username === form.value.username && 
            currentUser.email === form.value.email) {
          // Rien n'a changé, pas besoin de mettre à jour
          toast.info('Aucune modification n\'a été détectée');
          return true;
        }

        // Mise à jour des informations du profil (sans mot de passe)
        const profileData = {
          username: form.value.username,
          email: form.value.email
        };
        
        // Appeler l'API pour mettre à jour le profil
        const updatedUser = await userApi.updateProfile(profileData);
        
        // Mettre à jour les informations utilisateur dans le localStorage
        if (updatedUser) {
          // Mettre à jour les informations de l'utilisateur local
          currentUser.username = updatedUser.username;
          currentUser.email = updatedUser.email;
          // Mettre à jour dans le localStorage
          authService.setUser(currentUser);
          // Mettre à jour l'état local
          user.value = currentUser;
        }
        
        toast.success('Profil mis à jour avec succès');
        return true;
      } catch (error) {
        console.error('Erreur lors de la mise à jour du profil:', error);
        
        if (error.response?.status === 409) {
          toast.error('Ce nom d\'utilisateur est déjà utilisé');
          usernameError.value = 'Ce nom d\'utilisateur est déjà pris';
          usernameAvailable.value = false;
        } else {
          toast.error('Erreur lors de la mise à jour du profil');
        }
        return false;
      }
    };

    // Changer le mot de passe
    const changePassword = async () => {
      if (!form.value.password) {
        return true; // Pas de changement de mot de passe
      }
      
      if (form.value.password !== form.value.confirmPassword) {
        toast.error('Les mots de passe ne correspondent pas');
        return false;
      }
      
      try {
        await userApi.changePassword({
          password: form.value.password
        });
        toast.success('Mot de passe changé avec succès. Un email de confirmation a été envoyé.');
        form.value.password = '';
        form.value.confirmPassword = '';
        return true;
      } catch (error) {
        console.error('Erreur lors du changement de mot de passe:', error);
        toast.error('Erreur lors du changement de mot de passe');
        return false;
      }
    };

    // Sauvegarder les modifications
    const saveProfile = async () => {
      isSaving.value = true;
      
      try {
        // Traiter les deux opérations séparément
        const profileUpdated = await updateProfile();
        
        // Si la mise à jour du profil a réussi, procéder au changement de mot de passe
        if (profileUpdated) {
          await changePassword();
        }
      } finally {
        isSaving.value = false;
      }
    };

    onMounted(() => {
      // Charger les données utilisateur depuis le localStorage
      const userData = authService.getCurrentUser();
      user.value = userData;
      initForm();
      
      // Récupérer le nom du département si nécessaire
      if (userData?.departmentId) {
        userApi.getDepartmentInfo(userData.departmentId)
          .then(departmentData => {
            departmentName.value = departmentData.name || 'Département sans nom';
          })
          .catch(error => {
            console.error('Erreur lors de la récupération du département:', error);
            departmentName.value = 'Département inconnu';
          });
      }
    });

    return {
      user,
      userAvatar,
      form,
      initialUsername,
      usernameAvailable,
      isCheckingUsername,
      usernameError,
      isSaving,
      departmentName,
      saveProfile,
      resetForm,
      checkUsername
    };
  }
};
</script> 