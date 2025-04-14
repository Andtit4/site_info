<template>
  <div>
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Équipements</h1>
        <p class="mt-2 text-sm text-gray-700 dark:text-gray-300">
          Liste de tous les équipements et leurs sites associés.
        </p>
      </div>
      <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
        <button
          @click="openAddModal"
          class="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
        >
          Ajouter un équipement
        </button>
      </div>
    </div>

    <!-- Filtres -->
    <div class="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div class="flex-1 min-w-0">
        <div class="relative rounded-md shadow-sm">
          <input
            type="text"
            v-model="filters.search"
            class="block w-full rounded-md border-gray-300 dark:border-gray-600 pr-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
            placeholder="Rechercher un équipement..."
          />
          <div class="absolute inset-y-0 right-0 flex items-center pr-3">
            <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
        </div>
      </div>
      <div class="flex gap-4">
        <select
          v-model="filters.type"
          class="block w-full rounded-md border-gray-300 dark:border-gray-600 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
        >
          <option value="">Tous les types</option>
          <option v-for="type in equipmentTypes" :key="type" :value="type">
            {{ getTypeLabel(type) }}
          </option>
        </select>
        <select
          v-model="filters.status"
          class="block w-full rounded-md border-gray-300 dark:border-gray-600 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
        >
          <option value="">Tous les statuts</option>
          <option v-for="status in equipmentStatuses" :key="status" :value="status">
            {{ getStatusLabel(status) }}
          </option>
        </select>
      </div>
    </div>

    <!-- Liste des équipements -->
    <div class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="equipment in filteredEquipment"
        :key="equipment.id"
        class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-200"
      >
        <div class="p-6">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">
              {{ equipment.id }} - {{ equipment.model }}
            </h3>
            <span
              :class="[
                'px-2 py-1 text-xs font-medium rounded-full',
                getStatusClass(equipment.status)
              ]"
            >
              {{ getStatusLabel(equipment.status) }}
            </span>
          </div>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {{ getTypeLabel(equipment.type) }}
          </p>
          <dl class="mt-4 grid grid-cols-2 gap-4">
            <div>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Site</dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                {{ equipment.site?.name || 'Non assigné' }}
                <span class="text-xs text-gray-500">({{ equipment.site?.region || 'N/A' }})</span>
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Département</dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                {{ equipment.department?.name || 'Non assigné' }}
                <span class="text-xs text-gray-500">({{ equipment.department?.type || 'N/A' }})</span>
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Fabricant</dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ equipment.manufacturer || 'N/A' }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Série</dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ equipment.serialNumber || 'N/A' }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Installation</dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ formatDate(equipment.installDate) }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Dernière maintenance</dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ formatDate(equipment.lastMaintenanceDate) }}</dd>
            </div>
          </dl>
          <div class="mt-6 flex justify-end space-x-3">
            <button
              @click="viewEquipment(equipment)"
              class="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Voir
            </button>
            <button
              @click="editEquipment(equipment)"
              class="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Modifier
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal d'ajout/modification -->
    <Modal
      v-if="showModal"
      :title="modalTitle"
      @close="closeModal"
      class="max-w-6xl mx-auto"
    >
      <div class="max-w-5xl mx-auto">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Informations de base -->
          <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Informations de base</h3>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label for="id" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  ID de l'équipement
                </label>
                <input
                  type="text"
                  id="id"
                  v-model="form.id"
                  class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                  :disabled="isEditing"
                  required
                />
              </div>
              <div>
                <label for="type" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Type
                </label>
                <select
                  id="type"
                  v-model="form.type"
                  class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option v-for="type in equipmentTypes" :key="type" :value="type">
                    {{ getTypeLabel(type) }}
                  </option>
                </select>
              </div>
              <div>
                <label for="status" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Statut
                </label>
                <select
                  id="status"
                  v-model="form.status"
                  class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option v-for="status in equipmentStatuses" :key="status" :value="status">
                    {{ getStatusLabel(status) }}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <!-- Détails techniques -->
          <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Détails techniques</h3>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label for="model" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Modèle
                </label>
                <input
                  type="text"
                  id="model"
                  v-model="form.model"
                  class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              <div>
                <label for="manufacturer" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Fabricant
                </label>
                <input
                  type="text"
                  id="manufacturer"
                  v-model="form.manufacturer"
                  class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label for="serialNumber" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Numéro de série
                </label>
                <input
                  type="text"
                  id="serialNumber"
                  v-model="form.serialNumber"
                  class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label for="installDate" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Date d'installation
                </label>
                <input
                  type="date"
                  id="installDate"
                  v-model="form.installDate"
                  class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              <div>
                <label for="lastMaintenanceDate" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Dernière maintenance
                </label>
                <input
                  type="date"
                  id="lastMaintenanceDate"
                  v-model="form.lastMaintenanceDate"
                  class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>

          <!-- Spécifications techniques dynamiques -->
          <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Spécifications techniques</h3>
            <div v-if="form.type && specifications[form.type]" class="space-y-4">
              <div v-for="(column, index) in specifications[form.type].columns" :key="index" class="flex flex-col gap-2">
                <label :for="'spec-' + column.name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {{ column.name }}
                </label>
                <div class="flex gap-2">
                  <input
                    v-if="column.type === 'varchar'"
                    :id="'spec-' + column.name"
                    type="text"
                    v-model="form.specifications[column.name]"
                    class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                    :placeholder="column.defaultValue || ''"
                  />
                  <input
                    v-else-if="column.type === 'int' || column.type === 'float'"
                    :id="'spec-' + column.name"
                    type="number"
                    v-model="form.specifications[column.name]"
                    class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                    :placeholder="column.defaultValue || ''"
                  />
                  <select
                    v-else-if="column.type === 'boolean'"
                    :id="'spec-' + column.name"
                    v-model="form.specifications[column.name]"
                    class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                  >
                    <option :value="true">Oui</option>
                    <option :value="false">Non</option>
                  </select>
                  <input
                    v-else-if="column.type === 'date'"
                    :id="'spec-' + column.name"
                    type="date"
                    v-model="form.specifications[column.name]"
                    class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
            </div>
            <div v-else class="text-sm text-gray-500 dark:text-gray-400">
              Sélectionnez un type d'équipement pour voir les spécifications techniques disponibles
            </div>
          </div>

          <!-- Localisation -->
          <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Localisation</h3>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label for="siteId" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Site
                </label>
                <select
                  id="siteId"
                  v-model="form.siteId"
                  class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option value="">Sélectionner un site</option>
                  <option v-for="site in sites" :key="site.id" :value="site.id">
                    {{ site.name }} ({{ site.region }}) - {{ site.oldBase || 'N/A' }} → {{ site.newBase || 'N/A' }}
                  </option>
                </select>
                <p v-if="form.siteId" class="mt-1 text-sm text-gray-500">
                  <span v-if="selectedSite">
                    Région: {{ selectedSite.region }}<br>
                    Ancienne base: {{ selectedSite.oldBase || 'N/A' }}<br>
                    Nouvelle base: {{ selectedSite.newBase || 'N/A' }}
                  </span>
                </p>
              </div>
              <div>
                <label for="departmentId" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Département
                </label>
                <select
                  id="departmentId"
                  v-model="form.departmentId"
                  class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Sélectionner un département</option>
                  <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                    {{ dept.name }} ({{ dept.type }}) - {{ dept.responsibleName }}
                  </option>
                </select>
                <p v-if="form.departmentId" class="mt-1 text-sm text-gray-500">
                  <span v-if="selectedDepartment">
                    Type: {{ selectedDepartment.type }}<br>
                    Responsable: {{ selectedDepartment.responsibleName }}<br>
                    Contact: {{ selectedDepartment.contactEmail }}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <!-- Boutons d'action -->
          <div class="flex justify-center space-x-3">
            <button
              type="button"
              @click="closeModal"
              class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import equipmentApi from '@/services/api/equipmentApi';
import sitesApi from '@/services/api/sitesApi';
import departmentsApi from '@/services/api/departmentsApi';
import specificationsApi from '@/services/api/specificationsApi';
import Modal from '@/components/Modal.vue';
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline';

export default {
  name: 'EquipmentView',
  components: {
    MagnifyingGlassIcon,
    Modal,
  },
  setup() {
    const toast = useToast();
    const equipment = ref([]);
    const sites = ref([]);
    const departments = ref([]);
    const showModal = ref(false);
    const isEditing = ref(false);
    const selectedEquipment = ref(null);
    const specificationKeys = ref({});
    const specifications = ref({});

    const filters = ref({
      search: '',
      type: '',
      status: ''
    });

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

    const equipmentStatuses = [
      'ACTIF',
      'MAINTENANCE',
      'INACTIF',
      'PLANIFIÉ',
      'EN_INSTALLATION'
    ];

    const form = ref({
      id: '',
      type: '',
      status: '',
      model: '',
      manufacturer: '',
      serialNumber: '',
      installDate: '',
      lastMaintenanceDate: '',
      specifications: {}
    });

    const modalTitle = computed(() => 
      isEditing.value ? 'Modifier l\'équipement' : 'Ajouter un équipement'
    );

    const selectedSite = computed(() => {
      return sites.value.find(site => site.id === form.value.siteId);
    });

    const selectedDepartment = computed(() => {
      return departments.value.find(dept => dept.id === form.value.departmentId);
    });

    const filteredEquipment = computed(() => {
      return equipment.value.filter(item => {
        const matchesSearch = !filters.value.search || 
          item.name.toLowerCase().includes(filters.value.search.toLowerCase()) ||
          (item.serialNumber && item.serialNumber.toLowerCase().includes(filters.value.search.toLowerCase()));
        const matchesType = !filters.value.type || item.type === filters.value.type;
        const matchesStatus = !filters.value.status || item.status === filters.value.status;
        return matchesSearch && matchesType && matchesStatus;
      });
    });

    const loadSites = async () => {
      try {
        const response = await sitesApi.getAll();
        sites.value = response;
      } catch (error) {
        console.error('Erreur lors du chargement des sites:', error);
        toast.error('Erreur lors du chargement des sites');
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

    const loadEquipment = async () => {
      try {
        const response = await equipmentApi.getAll();
        equipment.value = response;
      } catch (error) {
        console.error('Erreur lors du chargement des équipements:', error);
        toast.error('Erreur lors du chargement des équipements');
      }
    };

    const loadSpecifications = async () => {
      try {
        const specs = await specificationsApi.getAll();
        specs.forEach(spec => {
          specifications.value[spec.equipmentType] = spec;
        });
      } catch (error) {
        console.error('Erreur lors du chargement des spécifications:', error);
        toast.error('Erreur lors du chargement des spécifications');
      }
    };

    const getTypeLabel = (type) => {
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

    const getStatusClass = (status) => {
      const classes = {
        ACTIF: 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100',
        MAINTENANCE: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100',
        INACTIF: 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100',
        PLANIFIÉ: 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100',
        EN_INSTALLATION: 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100'
      };
      return classes[status] || classes.INACTIF;
    };

    const getStatusLabel = (status) => {
      const labels = {
        ACTIF: 'Actif',
        MAINTENANCE: 'En maintenance',
        INACTIF: 'Inactif',
        PLANIFIÉ: 'Planifié',
        EN_INSTALLATION: 'En installation'
      };
      return labels[status] || 'Inconnu';
    };

    const formatDate = (dateString) => {
      if (!dateString) return 'N/A';
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      } catch (error) {
        console.error('Erreur de formatage de date:', error);
        return 'N/A';
      }
    };

    const addSpecification = () => {
      const newKey = `spec_${Date.now()}`;
      form.value.specifications = {
        ...form.value.specifications,
        [newKey]: ''
      };
      specificationKeys.value = {
        ...specificationKeys.value,
        [newKey]: ''
      };
    };

    const removeSpecification = (key) => {
      const newSpecifications = { ...form.value.specifications };
      const newSpecificationKeys = { ...specificationKeys.value };
      delete newSpecifications[key];
      delete newSpecificationKeys[key];
      form.value.specifications = newSpecifications;
      specificationKeys.value = newSpecificationKeys;
    };

    const openAddModal = () => {
      isEditing.value = false;
      form.value = {
        id: '',
        type: '',
        status: '',
        model: '',
        manufacturer: '',
        serialNumber: '',
        installDate: '',
        lastMaintenanceDate: '',
        specifications: {}
      };
      showModal.value = true;
    };

    const editEquipment = (equipment) => {
      isEditing.value = true;
      selectedEquipment.value = equipment;
      form.value = {
        ...equipment,
        specifications: equipment.specifications || {}
      };
      showModal.value = true;
    };

    const viewEquipment = (equip) => {
      selectedEquipment.value = equip;
      showModal.value = true;
    };

    const closeModal = () => {
      showModal.value = false;
      selectedEquipment.value = null;
      isEditing.value = false;
    };

    const handleSubmit = async () => {
      try {
        console.log('Début de la soumission du formulaire');
        if (!validateForm()) {
          console.log('Validation du formulaire échouée');
          return;
        }

        const formData = {
          ...form.value,
          siteId: form.value.siteId || null,
          departmentId: form.value.departmentId || null,
        };

        console.log('Données du formulaire:', formData);

        if (isEditing.value && selectedEquipment.value) {
          console.log('Mise à jour de l\'équipement:', selectedEquipment.value.id);
          await equipmentApi.updateEquipment(selectedEquipment.value.id, formData);
          toast.success('Équipement mis à jour avec succès');
        } else {
          console.log('Création d\'un nouvel équipement');
          await equipmentApi.createEquipment(formData);
          toast.success('Équipement créé avec succès');
        }

        showModal.value = false;
        loadEquipment();
      } catch (error) {
        console.error('Erreur lors de la soumission:', error);
        if (error.response) {
          toast.error(error.response.data.message || 'Une erreur est survenue');
        } else {
          toast.error('Une erreur est survenue lors de la soumission');
        }
      }
    };

    const validateForm = () => {
      try {
        if (!form.value.id) {
          toast.error('L\'ID de l\'équipement est requis');
          return false;
        }
        if (!form.value.type) {
          toast.error('Le type d\'équipement est requis');
          return false;
        }
        if (!form.value.model) {
          toast.error('Le modèle est requis');
          return false;
        }
        if (!form.value.installDate) {
          toast.error('La date d\'installation est requise');
          return false;
        }
        if (!form.value.siteId) {
          toast.error('Le site est requis');
          return false;
        }
        return true;
      } catch (error) {
        console.error('Erreur lors de la validation:', error);
        toast.error('Une erreur est survenue lors de la validation');
        return false;
      }
    };

    onMounted(() => {
      loadEquipment();
      loadDepartments();
      loadSites();
      loadSpecifications();
    });

    return {
      equipment,
      sites,
      departments,
      filters,
      showModal,
      isEditing,
      selectedEquipment,
      form,
      equipmentTypes,
      equipmentStatuses,
      filteredEquipment,
      getTypeLabel,
      getStatusClass,
      getStatusLabel,
      formatDate,
      openAddModal,
      editEquipment,
      viewEquipment,
      closeModal,
      handleSubmit,
      addSpecification,
      removeSpecification,
      loadDepartments,
      selectedSite,
      selectedDepartment,
      modalTitle,
      validateForm,
      specifications,
    };
  },
};
</script> 