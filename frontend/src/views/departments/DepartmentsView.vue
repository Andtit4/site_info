<template>
  <div>
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">
          Départements
        </h1>
        <p class="mt-2 text-sm text-gray-700 dark:text-gray-300">
          Liste de tous les départements et leurs informations.
        </p>
      </div>
      <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
        <button
          class="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          @click="openAddModal"
        >
          Ajouter un département
        </button>
      </div>
    </div>

    <!-- Filtres -->
    <div class="sm:flex sm:justify-between">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div class="relative max-w-xs">
          <input
            v-model="filters.search"
            type="text"
            placeholder="Rechercher..."
            class="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white pr-10"
          >
          <div class="absolute inset-y-0 right-0 flex items-center pr-3">
            <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" />
          </div>
        </div>
        <select
          v-model="filters.type"
          class="mt-1 sm:mt-0 block w-full sm:w-auto rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
        >
          <option value="">
            Type - Tous
          </option>
          <option
            v-for="type in departmentTypes"
            :key="type"
            :value="type"
          >
            {{ getTypeLabel(type) }}
          </option>
        </select>
        <select
          v-model="filters.managesEquipmentType"
          class="mt-1 sm:mt-0 block w-full sm:w-auto rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
        >
          <option value="">
            Gère - Tous les équipements
          </option>
          <option
            v-for="type in equipmentTypes"
            :key="type"
            :value="type"
          >
            {{ getEquipmentTypeLabel(type) }}
          </option>
        </select>
        <select
          v-model="filters.isActive"
          class="mt-1 sm:mt-0 block w-full sm:w-auto rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
        >
          <option value="">
            Statut - Tous
          </option>
          <option :value="true">
            Actif
          </option>
          <option :value="false">
            Inactif
          </option>
        </select>
      </div>
    </div>

    <!-- Liste des départements -->
    <div class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="department in filteredDepartments"
        :key="department.id"
        class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-200"
      >
        <div class="p-6">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">
              {{ department.name }}
            </h3>
            <span
              :class="[
                'px-2 py-1 text-xs font-medium rounded-full',
                department.isActive ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
              ]"
            >
              {{ department.isActive ? 'Actif' : 'Inactif' }}
            </span>
          </div>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {{ getTypeLabel(department.type) }}
          </p>
          <dl class="mt-4 grid grid-cols-2 gap-4">
            <div>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                Responsable
              </dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                {{ department.responsibleName }}
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                Contact
              </dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                {{ department.contactEmail }}
              </dd>
            </div>
            <div
              v-if="department.managedEquipmentTypes && department.managedEquipmentTypes.length > 0"
              class="col-span-2"
            >
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                Types d'équipement gérés
              </dt>
              <dd class="mt-1 flex flex-wrap gap-1">
                <span
                  v-for="type in department.managedEquipmentTypes"
                  :key="type"
                  class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100"
                >
                  {{ getEquipmentTypeLabel(type) }}
                </span>
              </dd>
            </div>
          </dl>
          <div class="mt-6 flex justify-end space-x-3">
            <button
              @click="viewDepartment(department)"
              class="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Voir
            </button>
            <button
              @click="editDepartment(department)"
              class="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Modifier
            </button>
            <button
              @click="confirmDelete(department)"
              class="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal d'ajout/modification -->
    <Modal
      v-if="showModal"
      :title="modalTitle"
      class="max-w-6xl mx-auto"
      @close="closeModal"
    >
      <div class="max-w-5xl mx-auto">
        <form
          class="space-y-6"
          @submit.prevent="handleSubmit"
        >
          <!-- Informations de base -->
          <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Informations de base
            </h3>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  for="name"
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Nom du département
                </label>
                <input
                  id="name"
                  v-model="form.name"
                  type="text"
                  class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                  required
                >
              </div>
              <div>
                <label
                  for="type"
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Type
                </label>
                <select
                  id="type"
                  v-model="form.type"
                  class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option
                    v-for="type in departmentTypes"
                    :key="type"
                    :value="type"
                  >
                    {{ getTypeLabel(type) }}
                  </option>
                </select>
              </div>
              <div class="sm:col-span-2">
                <label
                  for="description"
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  v-model="form.description"
                  rows="3"
                  class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>

          <!-- Contact -->
          <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Contact
            </h3>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  for="responsibleName"
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Nom du responsable
                </label>
                <input
                  id="responsibleName"
                  v-model="form.responsibleName"
                  type="text"
                  class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                  required
                >
              </div>
              <div>
                <label
                  for="contactEmail"
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Email de contact
                </label>
                <input
                  id="contactEmail"
                  v-model="form.contactEmail"
                  type="email"
                  class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                  required
                >
              </div>
              <div>
                <label
                  for="contactPhone"
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Téléphone de contact
                </label>
                <input
                  id="contactPhone"
                  v-model="form.contactPhone"
                  type="number"
                  class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                >
              </div>
              <div>
                <label
                  for="isActive"
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Statut
                </label>
                <select
                  id="isActive"
                  v-model="form.isActive"
                  class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                >
                  <option :value="true">
                    Actif
                  </option>
                  <option :value="false">
                    Inactif
                  </option>
                </select>
              </div>
            </div>
          </div>

          <!-- Types d'équipement gérés -->
          <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Types d'équipement gérés
            </h3>
            <div class="space-y-4">
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Sélectionnez les types d'équipement dont ce département est responsable.
              </p>
              <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                <div
                  v-for="type in equipmentTypes"
                  :key="type"
                  class="flex items-center"
                >
                  <input
                    :id="`equipType-${type}`"
                    v-model="form.managedEquipmentTypes"
                    type="checkbox"
                    :value="type"
                    class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700"
                  >
                  <label
                    :for="`equipType-${type}`"
                    class="ml-2 text-sm text-gray-700 dark:text-gray-300"
                  >
                    {{ getEquipmentTypeLabel(type) }}
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Informations de connexion -->
          <div
            v-if="!isEditing"
            class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm"
          >
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Informations de connexion
              <span class="text-sm text-gray-500 ml-2">(optionnel)</span>
            </h3>
            <div class="space-y-4">
              <div class="flex items-center mb-4">
                <input
                  id="createAccount"
                  v-model="form.createAccount"
                  type="checkbox"
                  class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700"
                >
                <label
                  for="createAccount"
                  class="ml-2 text-sm text-gray-700 dark:text-gray-300"
                >
                  Créer un compte utilisateur pour ce département
                </label>
              </div>
              
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Si vous activez cette option, un compte utilisateur sera créé pour le département lui permettant de se connecter à l'application.
                <br>
                Le nom d'utilisateur sera généré automatiquement à partir du nom du département et les identifiants seront envoyés par email à l'adresse indiquée.
                <br>
                L'utilisateur aura les mêmes droits et rôles que le département.
              </p>
              
              <div v-if="form.createAccount">
                <div>
                  <label
                    for="password"
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Mot de passe <span class="text-sm text-gray-500">(optionnel - si non fourni, un mot de passe sera généré automatiquement)</span>
                  </label>
                  <input
                    id="password"
                    v-model="form.password"
                    type="password"
                    class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                    minlength="8"
                  >
                  <p class="mt-1 text-sm text-gray-500">
                    Si vous ne renseignez pas de mot de passe, un mot de passe aléatoire sécurisé sera généré automatiquement.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Boutons d'action -->
          <div class="flex justify-center space-x-3">
            <button
              type="button"
              class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              @click="closeModal"
            >
              Annuler
            </button>
            <button
              type="submit"
              class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {{ isEditing ? 'Modifier' : 'Ajouter' }}
            </button>
          </div>
        </form>
      </div>
    </Modal>

    <!-- Modal de confirmation de suppression -->
    <Modal
      v-if="showDeleteModal"
      title="Confirmer la suppression"
      @close="cancelDelete"
      class="max-w-md mx-auto"
    >
      <div class="p-6">
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Êtes-vous sûr de vouloir supprimer le département "<span class="font-medium">{{ departmentToDelete?.name }}</span>"?
        </p>
        <p class="mt-2 text-sm text-red-500 font-medium">
          Cette action est irréversible. Les équipements associés seront supprimés.
        </p>
        <div class="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            @click="cancelDelete"
            class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Annuler
          </button>
          <button
            type="button"
            @click="deleteDepartment"
            class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Supprimer
          </button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { useToast } from 'vue-toastification';
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline';
import Modal from '@/components/Modal.vue';
import departmentsApi from '@/services/api/departmentsApi';

export default {
  name: 'DepartmentsView',
  components: {
    MagnifyingGlassIcon,
    Modal,
  },
  setup() {
    const router = useRouter();
    const store = useStore();
    const toast = useToast();
    const departments = ref([]);
    const showModal = ref(false);
    const isEditing = ref(false);
    const currentDepartment = ref(null);
    const showDeleteModal = ref(false);
    const departmentToDelete = ref(null);

    const filters = ref({
      search: '',
      type: '',
      isActive: '',
      managesEquipmentType: ''
    });

    const departmentTypes = [
      'TRANSMISSION',
      'ENERGIE',
      'INFRASTRUCTURE',
      'INFORMATIQUE',
      'SECURITE'
    ];

    const equipmentTypes = [
      'ANTENNE',
      'ROUTEUR',
      'BATTERIE',
      'GÉNÉRATEUR',
      'REFROIDISSEMENT',
      'SHELTER',
      'PYLÔNE',
      'SÉCURITÉ'
    ];

    const form = ref({
      name: '',
      type: 'TRANSMISSION',
      description: '',
      responsibleName: '',
      contactEmail: '',
      contactPhone: '',
      isActive: true,
      managedEquipmentTypes: [],
      createAccount: false,
      password: ''
    });

    const modalTitle = computed(() => 
      isEditing.value ? 'Modifier le département' : 'Ajouter un département'
    );

    const filteredDepartments = computed(() => {
      return departments.value.filter(item => {
        const matchesSearch = !filters.value.search || 
          item.name.toLowerCase().includes(filters.value.search.toLowerCase()) ||
          (item.responsibleName && item.responsibleName.toLowerCase().includes(filters.value.search.toLowerCase()));
        const matchesType = !filters.value.type || item.type === filters.value.type;
        const matchesStatus = filters.value.isActive === '' || item.isActive === filters.value.isActive;
        
        // Filtre par type d'équipement géré
        const matchesEquipmentType = !filters.value.managesEquipmentType || 
          (item.managedEquipmentTypes && 
           item.managedEquipmentTypes.includes(filters.value.managesEquipmentType));
        
        return matchesSearch && matchesType && matchesStatus && matchesEquipmentType;
      });
    });

    const loadData = async () => {
      try {
        const departmentsData = await departmentsApi.getAll();
        departments.value = departmentsData;
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      }
    };

    const getTypeLabel = (type) => {
      const labels = {
        TRANSMISSION: 'Transmission',
        ENERGIE: 'Énergie',
        INFRASTRUCTURE: 'Infrastructure',
        INFORMATIQUE: 'Informatique',
        SECURITE: 'Sécurité'
      };
      return labels[type] || 'Inconnu';
    };

    const getEquipmentTypeLabel = (type) => {
      const labels = {
        ANTENNE: 'Antenne',
        ROUTEUR: 'Routeur',
        BATTERIE: 'Batterie',
        'GÉNÉRATEUR': 'Générateur',
        REFROIDISSEMENT: 'Refroidissement',
        SHELTER: 'Shelter',
        PYLÔNE: 'Pylône',
        'SÉCURITÉ': 'Sécurité'
      };
      return labels[type] || 'Inconnu';
    };

    const openAddModal = () => {
      isEditing.value = false;
      form.value = {
        name: '',
        type: 'TRANSMISSION',
        description: '',
        responsibleName: '',
        contactEmail: '',
        contactPhone: '',
        isActive: true,
        managedEquipmentTypes: [],
        createAccount: false,
        password: ''
      };
      showModal.value = true;
    };

    const editDepartment = (item) => {
      isEditing.value = true;
      currentDepartment.value = item;
      form.value = { 
        ...item
      };
      showModal.value = true;
    };

    const viewDepartment = (item) => {
      router.push(`/dashboard/departments/${item.id}`);
    };

    const closeModal = () => {
      showModal.value = false;
    };

    const handleSubmit = async () => {
      try {
        if (isEditing.value) {
          // Nettoyer l'objet en ne gardant que les propriétés acceptées par l'API
          const cleanedData = {
            name: form.value.name,
            type: form.value.type,
            description: form.value.description,
            responsibleName: form.value.responsibleName,
            contactEmail: form.value.contactEmail,
            contactPhone: form.value.contactPhone ? Number(form.value.contactPhone) : null,
            isActive: form.value.isActive,
            managedEquipmentTypes: form.value.managedEquipmentTypes,
            createAccount: form.value.createAccount,
            password: form.value.password
          };
          await departmentsApi.update(currentDepartment.value.id, cleanedData);
          toast.success(`Le département ${form.value.name} a été mis à jour avec succès`);
        } else {
          // S'assurer que contactPhone est bien un nombre pour la création
          const data = { ...form.value };
          if (data.contactPhone) {
            data.contactPhone = Number(data.contactPhone);
          }
          await departmentsApi.create(data);
          
          // Afficher un message de confirmation spécifique si un compte utilisateur a été créé
          if (form.value.createAccount) {
            toast.success(`Le département ${form.value.name} a été créé avec succès. Un email avec les identifiants de connexion a été envoyé à ${form.value.contactEmail}`);
          } else {
            toast.success(`Le département ${form.value.name} a été créé avec succès`);
          }
        }
        await loadData();
        closeModal();
      } catch (error) {
        console.error('Erreur lors de la sauvegarde:', error);
        toast.error(`Erreur: ${error.response?.data?.message || error.message || 'Problème lors de la sauvegarde'}`);
      }
    };

    const confirmDelete = (department) => {
      departmentToDelete.value = department;
      showDeleteModal.value = true;
    };

    const cancelDelete = () => {
      showDeleteModal.value = false;
    };

    const deleteDepartment = async () => {
      try {
        await departmentsApi.delete(departmentToDelete.value.id);
        await loadData();
        toast.success(`Le département ${departmentToDelete.value.name} a été supprimé avec succès`);
        cancelDelete();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        toast.error(`Erreur lors de la suppression: ${error.message || 'Problème serveur'}`);
      }
    };

    const isAdmin = computed(() => store.state.auth.user && store.state.auth.user.isAdmin === true);

    onMounted(loadData);

    return {
      departments,
      filters,
      showModal,
      isEditing,
      form,
      modalTitle,
      departmentTypes,
      equipmentTypes,
      filteredDepartments,
      getTypeLabel,
      getEquipmentTypeLabel,
      openAddModal,
      editDepartment,
      viewDepartment,
      closeModal,
      handleSubmit,
      confirmDelete,
      showDeleteModal,
      departmentToDelete,
      cancelDelete,
      deleteDepartment,
      isAdmin,
    };
  },
};
</script> 