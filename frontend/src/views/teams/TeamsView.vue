<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        Gestion des Équipes
      </h1>
      <button
        class="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md flex items-center"
        @click="openModal()"
      >
        <PlusIcon class="h-5 w-5 mr-2" />
        Nouvelle Équipe
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
            placeholder="Rechercher une équipe..."
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Statut</label>
          <select
            v-model="filters.status"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">
              Tous les statuts
            </option>
            <option value="ACTIVE">
              Active
            </option>
            <option value="STANDBY">
              En attente
            </option>
            <option value="INACTIVE">
              Inactive
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

    <!-- Tableau des équipes -->
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
            >
              Nom
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
            >
              Type d'équipement
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
            >
              Chef d'équipe
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
            >
              Membres
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
            >
              Statut
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
            v-for="team in filteredTeams"
            :key="team.id"
            class="hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900 dark:text-white">
                {{ team.name }}
              </div>
              <div class="text-sm text-gray-500 dark:text-gray-400">
                {{ team.description }}
              </div>
            </td>
            <td class="px-6 py-4">
              <div class="flex flex-wrap gap-1">
                <span 
                  v-for="type in team.equipmentTypes" 
                  :key="type" 
                  class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100"
                >
                  {{ getEquipmentTypeLabel(type) }}
                </span>
                <span
                  v-if="!team.equipmentTypes?.length"
                  class="text-sm text-gray-500 dark:text-gray-400"
                >
                  Non spécifié
                </span>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900 dark:text-white">
                {{ team.leadName }}
              </div>
              <div class="text-sm text-gray-500 dark:text-gray-400">
                {{ team.leadContact }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900 dark:text-white">
                {{ team.memberCount }} membres
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                :class="getStatusClass(team.status)"
              >
                {{ getStatusLabel(team.status) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <button
                class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-3"
                @click="openModal(team)"
              >
                Modifier
              </button>
              <button
                class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                @click="deleteTeam(team.id)"
              >
                Supprimer
              </button>
            </td>
          </tr>
          <tr v-if="filteredTeams.length === 0">
            <td
              colspan="6"
              class="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
            >
              Aucune équipe trouvée
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal pour ajouter/modifier une équipe -->
    <Modal
      v-if="isModalOpen"
      :title="modalTitle"
      class="max-w-6xl mx-auto"
      @close="closeModal"
    >
      <div class="max-w-5xl mx-auto">
        <form
          class="space-y-6"
          @submit.prevent="saveTeam"
        >
          <!-- Informations de base -->
          <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Informations de base
            </h3>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nom de l'équipe</label>
                <input
                  v-model="form.name"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Types d'équipement
                  <span v-if="form.departmentId" class="text-xs text-indigo-600 ml-2">
                    (Liés au département sélectionné)
                  </span>
                </label>
                <div class="mt-2 grid grid-cols-2 gap-x-4 gap-y-2">
                  <div 
                    v-for="(label, type) in equipmentTypes" 
                    :key="type"
                    class="flex items-center"
                  >
                    <input 
                      :id="`equipment-${type}`" 
                      v-model="form.equipmentTypes" 
                      type="checkbox" 
                      :value="type"
                      class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700"
                    >
                    <label
                      :for="`equipment-${type}`"
                      class="ml-2 text-sm text-gray-700 dark:text-gray-300"
                    >
                      {{ label }}
                    </label>
                  </div>
                </div>
                <p
                  v-if="form.equipmentTypes.length === 0"
                  class="mt-1 text-sm text-red-500"
                >
                  Veuillez sélectionner au moins un type d'équipement
                </p>
              </div>
              <div class="sm:col-span-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea
                  v-model="form.description"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>

          <!-- Informations de l'équipe -->
          <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Informations de l'équipe
            </h3>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Chef d'équipe</label>
                <input
                  v-model="form.leadName"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contact du chef d'équipe</label>
                <input
                  v-model="form.leadContact"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre de membres</label>
                <input
                  v-model="form.memberCount"
                  type="number"
                  min="0"
                  required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Statut</label>
                <select
                  v-model="form.status"
                  required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="ACTIVE">
                    Active
                  </option>
                  <option value="STANDBY">
                    En attente
                  </option>
                  <option value="INACTIVE">
                    Inactive
                  </option>
                </select>
              </div>
            </div>
          </div>

          <!-- Localisation et département -->
          <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Localisation et département
            </h3>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Localisation</label>
                <input
                  v-model="form.location"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Département</label>
                <select
                  v-model="form.departmentId"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  required
                  @change="updateEquipmentTypesByDepartment"
                >
                  <option value="" disabled>
                    Sélectionner un département
                  </option>
                  <option
                    v-for="dept in availableDepartments"
                    :key="dept.id"
                    :value="dept.id"
                  >
                    {{ dept.name }} ({{ dept.type }})
                  </option>
                </select>
              </div>
            </div>
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
import { ref, computed,  onMounted } from 'vue';
import { PlusIcon } from '@heroicons/vue/24/outline';
import Modal from '@/components/Modal.vue';
import teamsApi from '@/services/api/teamsApi';
import departmentsApi from '@/services/api/departmentsApi';
import { useToast } from 'vue-toastification'
import authService from '@/services/auth.service';

export default {
  name: 'TeamsView',
  components: {
    Modal,
    PlusIcon
  },
  setup() {
    const toast = useToast();
    const teams = ref([]);
    const departments = ref([]);
    const isModalOpen = ref(false);
    const editingTeam = ref(null);
    const isLoading = ref(false);
    const filters = ref({
      search: undefined,
      status: undefined,
      equipmentType: undefined
    });

    const form = ref({
      name: '',
      description: '',
      equipmentTypes: [],
      status: 'ACTIVE',
      leadName: '',
      leadContact: '',
      memberCount: 0,
      location: '',
      departmentId: ''
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

    const statusTypes = {
      'ACTIVE': 'Active',
      'STANDBY': 'En attente',
      'INACTIVE': 'Inactive'
    };

    const validateForm = () => {
      if (!form.value.name?.trim()) {
        toast.error('Le nom de l\'équipe est requis');
        return false;
      }
      if (!form.value.departmentId) {
        toast.error('Le département est requis');
        return false;
      }
      if (!form.value.equipmentTypes.length) {
        toast.error('Le type d\'équipement est requis');
        return false;
      }
      if (!form.value.status) {
        toast.error('Le statut est requis');
        return false;
      }
      if (form.value.memberCount < 0) {
        toast.error('Le nombre de membres ne peut pas être négatif');
        return false;
      }
      
      // Validation supplémentaire pour la création de compte
      if (form.value.createAccount) {
        // Vérifier que l'email est valide
        if (form.value.createAccount && !form.value.userEmail && !form.value.leadContact) {
          toast.error('Un email est requis pour créer un compte utilisateur');
          return false;
        }
        
        // Vérifier le mot de passe si fourni
        if (form.value.password && form.value.password.length < 8) {
          toast.error('Le mot de passe doit contenir au moins 8 caractères');
          return false;
        }
      }
      
      return true;
    };

    const modalTitle = computed(() => {
      return editingTeam.value ? 'Modifier l\'équipe' : 'Nouvelle équipe';
    });

    const filteredTeams = computed(() => {
      let result = teams.value;
      
      // Filtrer par recherche
      if (filters.value.search) {
        const search = filters.value.search.toLowerCase();
        result = result.filter(team => 
          team.name.toLowerCase().includes(search) ||
          team.description?.toLowerCase().includes(search)
        );
      }
      
      // Filtrer par statut
      if (filters.value.status) {
        result = result.filter(team => team.status === filters.value.status);
      }
      
      // Filtrer par type d'équipement
      if (filters.value.equipmentType) {
        result = result.filter(team => 
          team.equipmentTypes && team.equipmentTypes.includes(filters.value.equipmentType)
        );
      }
      
      // Filtrer par département pour les utilisateurs département
      const user = authService.getCurrentUser();
      if (!authService.isAdmin() && user && user.departmentId) {
        result = result.filter(team => team.departmentId === user.departmentId);
      }
      
      return result;
    });

    const getEquipmentTypeLabel = (type) => equipmentTypes[type] || type;
    const getStatusLabel = (status) => statusTypes[status] || status;

    const getStatusClass = (status) => {
      const classes = {
        'ACTIVE': 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100',
        'STANDBY': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100',
        'INACTIVE': 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
      };
      return classes[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
    };

    const loadTeams = async () => {
      isLoading.value = true;
      try {
        const response = await teamsApi.getAll(filters.value);
        teams.value = Array.isArray(response.data) ? response.data : [];
      } catch (error) {
        console.error('Erreur lors du chargement des équipes:', error);
        if (error.response?.data?.message) {
          toast.error(`Erreur: ${error.response.data.message}`);
        } else {
          toast.error('Erreur lors du chargement des équipes');
        }
      } finally {
        isLoading.value = false;
      }
    };

    const loadDepartments = async () => {
      try {
        const response = await departmentsApi.getAll();
        if (Array.isArray(response.data)) {
          departments.value = response.data;
        } else if (Array.isArray(response)) {
          departments.value = response;
        } else {
          console.error('Format de réponse invalide pour les départements:', response);
          toast.error('Format de réponse invalide pour les départements');
          return;
        }
        
        // Vérifier que chaque département a un tableau managedEquipmentTypes
        departments.value.forEach(dept => {
          // S'assurer que managedEquipmentTypes est un tableau
          if (!dept.managedEquipmentTypes) {
            dept.managedEquipmentTypes = [];
          } else if (typeof dept.managedEquipmentTypes === 'string') {
            // Si c'est une chaîne, la transformer en tableau
            try {
              dept.managedEquipmentTypes = JSON.parse(dept.managedEquipmentTypes);
            } catch (e) {
              // Si ce n'est pas du JSON valide, essayer de le diviser par des virgules
              dept.managedEquipmentTypes = dept.managedEquipmentTypes.split(',').map(t => t.trim());
            }
          }
          
          // Filtrer les valeurs non valides
          dept.managedEquipmentTypes = dept.managedEquipmentTypes.filter(type => 
            type && Object.keys(equipmentTypes).includes(type)
          );
        });
        
        console.log('Départements chargés avec leurs types d\'équipement:', departments.value);
      } catch (error) {
        console.error('Erreur lors du chargement des départements:', error);
        toast.error(`Erreur: ${error.response?.data?.message || error.message || 'Erreur inconnue'}`);
      }
    };

    const openModal = (team = null) => {
      editingTeam.value = team;
      if (team) {
        form.value = {
          ...team,
          equipmentTypes: team.equipmentTypes || (team.equipmentType ? [team.equipmentType] : []),
          departmentId: team.departmentId || ''
        };
      } else {
        resetForm();
      }
      isModalOpen.value = true;
    };

    const closeModal = () => {
      isModalOpen.value = false;
      editingTeam.value = null;
      resetForm();
    };

    const resetForm = () => {
      form.value = {
        name: '',
        description: '',
        leadName: '',
        leadContact: '',
        memberCount: 1,
        status: 'ACTIVE',
        location: '',
        departmentId: '',
        equipmentType: '',
        equipmentTypes: [],
        createAccount: false,
        userEmail: '',
        password: '',
        hasDepartmentRights: false
      };
    };

    const saveTeam = async () => {
      if (!validateForm()) return;
      
      try {
        // Préparer les données à envoyer
        const teamData = {
          ...form.value,
          // Assurer que memberCount est un nombre entier
          memberCount: parseInt(form.value.memberCount || 0),
          
          // S'assurer que equipmentTypes est bien un tableau non vide
          equipmentTypes: form.value.equipmentTypes?.length 
            ? [...form.value.equipmentTypes] 
            : [],
          
          // Définir equipmentType comme le premier élément du tableau equipmentTypes s'il existe
          equipmentType: form.value.equipmentTypes?.length > 0 
            ? form.value.equipmentTypes[0] 
            : null
        };
        
        // S'assurer que departmentId est une chaîne non vide
        if (!teamData.departmentId) {
          toast.error('Un département valide est requis');
          return;
        }
        
        // Si createAccount est désactivé, supprimer les champs relatifs
        if (!teamData.createAccount) {
          delete teamData.password;
          delete teamData.userEmail;
          delete teamData.hasDepartmentRights;
        }

        if (editingTeam.value) {
          await teamsApi.update(editingTeam.value.id, teamData);
          toast.success('Équipe mise à jour avec succès');
        } else {
          await teamsApi.create(teamData);
          
          // Afficher un message de confirmation spécifique si un compte utilisateur a été créé
          if (form.value.createAccount) {
            const emailToNotify = form.value.userEmail || form.value.leadContact;
            if (emailToNotify) {
              toast.success(`Équipe créée avec succès. Un email avec les identifiants de connexion a été envoyé à ${emailToNotify}`);
            } else {
              toast.success(`Équipe créée avec succès, mais aucun email n'était disponible pour envoyer les identifiants`);
            }
          } else {
            toast.success('Équipe créée avec succès');
          }
        }
        
        closeModal();
        loadTeams();
      } catch (error) {
        console.error('Erreur lors de la sauvegarde:', error);
        
        // Afficher un message d'erreur plus détaillé si disponible
        if (error.response?.data?.message) {
          if (Array.isArray(error.response.data.message)) {
            // Si c'est un tableau d'erreurs de validation
            error.response.data.message.forEach(msg => {
              toast.error(`Erreur: ${msg}`);
            });
          } else {
            toast.error(`Erreur: ${error.response.data.message}`);
          }
        } else {
          toast.error(`Erreur: ${error.message || 'Erreur inconnue lors de la sauvegarde'}`);
        }
      }
    };

    const deleteTeam = async (id) => {
      if (!confirm('Êtes-vous sûr de vouloir supprimer cette équipe ?')) return;
      
      try {
        await teamsApi.delete(id);
        toast.success('Équipe supprimée avec succès');
        loadTeams();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        toast.error(`Erreur: ${error.response?.data?.message || error.message || 'Erreur inconnue'}`);
      }
    };

    const updateEquipmentTypesByDepartment = () => {
      // Si aucun département n'est sélectionné, ne rien faire
      if (!form.value.departmentId) return;
      
      // Trouver le département sélectionné
      const selectedDepartment = departments.value.find(dept => dept.id === form.value.departmentId);
      
      // Si le département existe et a des types d'équipement gérés
      if (selectedDepartment && selectedDepartment.managedEquipmentTypes && selectedDepartment.managedEquipmentTypes.length > 0) {
        // Remplacer les types sélectionnés par ceux du département
        form.value.equipmentTypes = [...selectedDepartment.managedEquipmentTypes];
        toast.info(`Types d'équipement mis à jour selon le département sélectionné.`);
      }
    };

    // Ajouter une fonction pour limiter les départements disponibles dans le formulaire
    const availableDepartments = computed(() => {
      // Si l'utilisateur est admin, retourner tous les départements
      if (authService.isAdmin()) {
        return departments.value;
      }
      
      // Sinon, ne retourner que le département de l'utilisateur
      const user = authService.getCurrentUser();
      if (user && user.departmentId) {
        return departments.value.filter(dept => dept.id === user.departmentId);
      }
      
      return [];
    });

    onMounted(() => {
      // Définir le département par défaut pour les nouveaux formulaires si l'utilisateur est un utilisateur département
      const user = authService.getCurrentUser();
      if (!authService.isAdmin() && user && user.departmentId) {
        form.value.departmentId = user.departmentId;
      }
      
      loadTeams();
      loadDepartments();
    });

    return {
      teams,
      departments,
      availableDepartments,
      isModalOpen,
      modalTitle,
      form,
      filters,
      filteredTeams,
      isLoading,
      equipmentTypes,
      statusTypes,
      getEquipmentTypeLabel,
      getStatusClass,
      getStatusLabel,
      openModal,
      closeModal,
      saveTeam,
      deleteTeam,
      editingTeam,
      validateForm,
      updateEquipmentTypesByDepartment
    };
  }
};
</script> 