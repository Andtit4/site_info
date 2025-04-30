<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        Gestion des Utilisateurs
      </h1>
      <button
        class="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md flex items-center"
        @click="openModal()"
      >
        <PlusIcon class="h-5 w-5 mr-2" />
        Nouvel Utilisateur
      </button>
    </div>

    <!-- Filtres -->
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Recherche</label>
          <input
            v-model="filters.search"
            type="text"
            placeholder="Rechercher un utilisateur..."
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Département</label>
          <select
            v-model="filters.departmentId"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">
              Tous les départements
            </option>
            <option 
              v-for="dept in departments" 
              :key="dept.id" 
              :value="dept.id"
            >
              {{ dept.name }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type d'équipement</label>
          <select
            v-model="filters.equipmentType"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">
              Tous les types
            </option>
            <option
              v-for="(label, type) in equipmentTypes"
              :key="type"
              :value="type"
            >
              {{ label }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Tableau des utilisateurs -->
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
            >
              Utilisateur
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
            >
              Email
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
            >
              Département
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
            >
              Rôles
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
            >
              Équipements gérés
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          <tr
            v-for="user in filteredUsers"
            :key="user.id"
            class="hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10">
                  <img class="h-10 w-10 rounded-full" :src="user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}`" alt="">
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ user.username }}
                  </div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900 dark:text-white">{{ user.email }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900 dark:text-white">{{ getDepartmentName(user.departmentId) }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex flex-wrap gap-1">
                <span 
                  v-if="user.isAdmin" 
                  class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
                >
                  Admin
                </span>
                <span 
                  v-if="user.isDepartmentAdmin" 
                  class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100"
                >
                  Admin Département
                </span>
                <span 
                  v-if="user.isTeamMember" 
                  class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100"
                >
                  Équipe
                </span>
                <span 
                  v-if="user.hasDepartmentRights" 
                  class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
                >
                  Droits Département
                </span>
              </div>
            </td>
            <td class="px-6 py-4">
              <div class="flex flex-wrap gap-1">
                <span 
                  v-for="type in user.managedEquipmentTypes" 
                  :key="type" 
                  class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                >
                  {{ getEquipmentTypeLabel(type) }}
                </span>
                <span
                  v-if="!user.managedEquipmentTypes?.length"
                  class="text-sm text-gray-500 dark:text-gray-400"
                >
                  Aucun
                </span>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <button
                class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-3"
                @click="openModal(user)"
              >
                Modifier
              </button>
              <button
                class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                @click="deleteUser(user.id)"
              >
                Supprimer
              </button>
            </td>
          </tr>
          <tr v-if="filteredUsers.length === 0">
            <td
              colspan="6"
              class="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
            >
              Aucun utilisateur trouvé
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal pour ajouter/modifier un utilisateur -->
    <Modal
      v-if="isModalOpen"
      :title="modalTitle"
      class="max-w-6xl mx-auto"
      @close="closeModal"
    >
      <div class="max-w-5xl mx-auto">
        <form
          class="space-y-6"
          @submit.prevent="saveUser"
        >
          <!-- Informations de base -->
          <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Informations de base
            </h3>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nom d'utilisateur</label>
                <input
                  v-model="form.username"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <input
                  v-model="form.email"
                  type="email"
                  required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                >
              </div>
              <div v-if="!editingUser">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mot de passe</label>
                <input
                  v-model="form.password"
                  type="password"
                  :required="!editingUser"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  minlength="8"
                >
                <p class="mt-1 text-sm text-gray-500">
                  Le mot de passe doit contenir au moins 8 caractères.
                </p>
              </div>
            </div>
          </div>

          <!-- Département et rôles -->
          <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Département et rôles
            </h3>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Département</label>
                <select
                  v-model="form.departmentId"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">
                    Sélectionner un département
                  </option>
                  <option
                    v-for="dept in departments"
                    :key="dept.id"
                    :value="dept.id"
                  >
                    {{ dept.name }} ({{ dept.type }})
                  </option>
                </select>
              </div>

              <div class="sm:col-span-2">
                <div class="flex flex-col space-y-4">
                  <div class="flex items-start">
                    <div class="flex items-center h-5">
                      <input
                        id="hasDepartmentRights"
                        v-model="form.hasDepartmentRights"
                        type="checkbox"
                        class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700"
                        :disabled="!form.departmentId"
                        @change="handleDepartmentRightsChange"
                      >
                    </div>
                    <div class="ml-3 text-sm">
                      <label
                        for="hasDepartmentRights"
                        class="font-medium text-gray-700 dark:text-gray-300"
                        :class="{'text-gray-400 dark:text-gray-500': !form.departmentId}"
                      >
                        Hériter des droits du département
                      </label>
                      <p class="text-gray-500 dark:text-gray-400">
                        L'utilisateur héritera des droits et des types d'équipement gérés par le département.
                      </p>
                    </div>
                  </div>

                  <div class="flex items-start">
                    <div class="flex items-center h-5">
                      <input
                        id="isDepartmentAdmin"
                        v-model="form.isDepartmentAdmin"
                        type="checkbox"
                        class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700"
                        :disabled="!form.departmentId"
                      >
                    </div>
                    <div class="ml-3 text-sm">
                      <label
                        for="isDepartmentAdmin"
                        class="font-medium text-gray-700 dark:text-gray-300"
                        :class="{'text-gray-400 dark:text-gray-500': !form.departmentId}"
                      >
                        Administrateur du département
                      </label>
                      <p class="text-gray-500 dark:text-gray-400">
                        L'utilisateur pourra gérer toutes les ressources de son département.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Types d'équipement gérés -->
          <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                Types d'équipement gérés
              </h3>
              <div v-if="form.departmentId && form.hasDepartmentRights" class="text-sm text-indigo-600 dark:text-indigo-400">
                Hérités du département
              </div>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div 
                v-for="(label, type) in equipmentTypes" 
                :key="type"
                class="flex items-center"
              >
                <input 
                  :id="`equipment-${type}`" 
                  type="checkbox" 
                  :checked="form.managedEquipmentTypes.includes(type)"
                  @change="toggleEquipmentType(type)"
                  class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700"
                  :disabled="form.hasDepartmentRights && form.departmentId"
                >
                <label
                  :for="`equipment-${type}`"
                  class="ml-2 text-sm text-gray-700 dark:text-gray-300"
                  :class="{'text-gray-400 dark:text-gray-500': form.hasDepartmentRights && form.departmentId}"
                >
                  {{ label }}
                </label>
              </div>
            </div>
            <p 
              v-if="form.hasDepartmentRights && form.departmentId" 
              class="mt-4 text-sm text-gray-500"
            >
              Les types d'équipement seront automatiquement hérités du département sélectionné.
            </p>
          </div>

          <!-- Boutons d'action -->
          <div class="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              @click="closeModal"
            >
              Annuler
            </button>
            <button
              type="submit"
              class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </Modal>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { PlusIcon } from '@heroicons/vue/24/outline';
import Modal from '@/components/Modal.vue';
import userApi from '@/services/api/userApi';
import departmentsApi from '@/services/api/departmentsApi';
import { useToast } from 'vue-toastification'

export default {
  name: 'UsersView',
  components: {
    Modal,
    PlusIcon
  },
  setup() {
    const toast = useToast();
    const users = ref([]);
    const departments = ref([]);
    const isModalOpen = ref(false);
    const editingUser = ref(null);
    const isLoading = ref(false);
    const filters = ref({
      search: '',
      departmentId: '',
      equipmentType: ''
    });

    const form = ref({
      username: '',
      email: '',
      password: '',
      departmentId: '',
      isDepartmentAdmin: false,
      hasDepartmentRights: false,
      managedEquipmentTypes: []
    });

    const equipmentTypes = {
      'ANTENNE': 'Antenne',
      'ROUTEUR': 'Routeur',
      'BATTERIE': 'Batterie',
      'GÉNÉRATEUR': 'Générateur',
      'REFROIDISSEMENT': 'Refroidissement',
      'SHELTER': 'Shelter',
      'PYLÔNE': 'Pylône',
      'SÉCURITÉ': 'Sécurité'
    };

    const modalTitle = computed(() => {
      return editingUser.value ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur';
    });

    const filteredUsers = computed(() => {
      return users.value.filter(user => {
        const matchesSearch = !filters.value.search || 
          user.username.toLowerCase().includes(filters.value.search.toLowerCase()) ||
          user.email.toLowerCase().includes(filters.value.search.toLowerCase());
        
        const matchesDepartment = !filters.value.departmentId || 
          user.departmentId === filters.value.departmentId;
        
        // Vérifier si l'utilisateur gère le type d'équipement filtré
        const matchesEquipmentType = !filters.value.equipmentType || 
          (user.managedEquipmentTypes && user.managedEquipmentTypes.includes(filters.value.equipmentType));
        
        return matchesSearch && matchesDepartment && matchesEquipmentType;
      });
    });

    const getEquipmentTypeLabel = (type) => equipmentTypes[type] || type;
    
    const getDepartmentName = (departmentId) => {
      if (!departmentId) return 'Aucun';
      const department = departments.value.find(d => d.id === departmentId);
      return department ? department.name : 'Département inconnu';
    };

    const loadUsers = async () => {
      isLoading.value = true;
      try {
        const response = await userApi.getAll();
        users.value = Array.isArray(response) ? response : [];
      } catch (error) {
        console.error('Erreur lors du chargement des utilisateurs:', error);
        toast.error('Erreur lors du chargement des utilisateurs');
      } finally {
        isLoading.value = false;
      }
    };

    const loadDepartments = async () => {
      try {
        const response = await departmentsApi.getAll();
        departments.value = response;
      } catch (error) {
        console.error('Erreur lors du chargement des départements:', error);
        toast.error('Erreur lors du chargement des départements');
      }
    };

    const openModal = (user = null) => {
      editingUser.value = user;
      if (user) {
        form.value = {
          ...user,
          password: '' // Ne pas afficher le mot de passe existant
        };
      } else {
        resetForm();
      }
      isModalOpen.value = true;
    };

    const closeModal = () => {
      isModalOpen.value = false;
      editingUser.value = null;
      resetForm();
    };

    const resetForm = () => {
      form.value = {
        username: '',
        email: '',
        password: '',
        departmentId: '',
        isDepartmentAdmin: false,
        hasDepartmentRights: false,
        managedEquipmentTypes: []
      };
    };

    const validateForm = () => {
      if (!form.value.username?.trim()) {
        toast.error('Le nom d\'utilisateur est requis');
        return false;
      }
      
      if (!form.value.email?.trim()) {
        toast.error('L\'adresse email est requise');
        return false;
      }
      
      if (!editingUser.value && !form.value.password?.trim()) {
        toast.error('Le mot de passe est requis pour un nouvel utilisateur');
        return false;
      }
      
      if (form.value.password && form.value.password.length < 8) {
        toast.error('Le mot de passe doit contenir au moins 8 caractères');
        return false;
      }
      
      return true;
    };

    const saveUser = async () => {
      if (!validateForm()) return;
      
      try {
        // Créer une copie propre des données du formulaire
        const userData = { 
          username: form.value.username?.trim(),
          email: form.value.email?.trim(),
          firstName: form.value.firstName?.trim() || undefined,
          lastName: form.value.lastName?.trim() || undefined,
          departmentId: form.value.departmentId || null,
          isDepartmentAdmin: form.value.isDepartmentAdmin === true,
          hasDepartmentRights: form.value.hasDepartmentRights === true,
          managedEquipmentTypes: form.value.hasDepartmentRights ? [] : (form.value.managedEquipmentTypes || [])
        };
        
        // Ne pas envoyer le mot de passe s'il est vide (en cas de modification)
        if (form.value.password?.trim()) {
          userData.password = form.value.password.trim();
        }

        // Traiter les champs vides ou undefined correctement
        Object.keys(userData).forEach(key => {
          if (userData[key] === undefined || userData[key] === '') {
            if (key === 'departmentId') {
              userData[key] = null;
            } else if (['isDepartmentAdmin', 'hasDepartmentRights'].includes(key)) {
              userData[key] = false;
            }
          }
        });
        
        console.log('Données envoyées pour la mise à jour:', userData);
        
        if (editingUser.value) {
          await userApi.update(editingUser.value.id, userData);
          toast.success('Utilisateur mis à jour avec succès');
        } else {
          await userApi.create(userData);
          toast.success('Utilisateur créé avec succès');
        }
        
        closeModal();
        loadUsers();
      } catch (error) {
        console.error('Erreur lors de la sauvegarde:', error);
        console.log('Détail de l\'erreur:', error.response?.data);
        if (error.response?.data?.message) {
          toast.error(`Erreur: ${error.response.data.message}`);
        } else {
          toast.error('Erreur lors de la sauvegarde de l\'utilisateur');
        }
      }
    };

    const deleteUser = async (id) => {
      if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return;
      
      try {
        await userApi.delete(id);
        toast.success('Utilisateur supprimé avec succès');
        loadUsers();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        toast.error('Erreur lors de la suppression de l\'utilisateur');
      }
    };

    const handleDepartmentRightsChange = () => {
      // Si on décoche "Hériter des droits du département", réinitialiser les types d'équipement
      if (!form.value.hasDepartmentRights) {
        form.value.managedEquipmentTypes = [];
      }
    };

    const toggleEquipmentType = (type) => {
      if (form.value.managedEquipmentTypes.includes(type)) {
        // Supprimer le type s'il est déjà sélectionné
        form.value.managedEquipmentTypes = form.value.managedEquipmentTypes.filter(t => t !== type);
      } else {
        // Ajouter le type s'il n'est pas déjà sélectionné
        form.value.managedEquipmentTypes.push(type);
      }
    };

    onMounted(() => {
      loadUsers();
      loadDepartments();
    });

    return {
      users,
      departments,
      isModalOpen,
      modalTitle,
      form,
      filters,
      filteredUsers,
      isLoading,
      equipmentTypes,
      getEquipmentTypeLabel,
      getDepartmentName,
      openModal,
      closeModal,
      saveUser,
      deleteUser,
      editingUser,
      handleDepartmentRightsChange,
      toggleEquipmentType
    };
  }
};
</script> 