<template>
  <div class="flex flex-col lg:flex-row gap-6">
    <!-- Liste des sites -->
    <div class="lg:w-1/2">
      <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
          <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Sites</h1>
          <p class="mt-2 text-sm text-gray-700 dark:text-gray-300">
            Liste de tous les sites et leurs équipements associés.
          </p>
        </div>
        <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            @click="openAddModal"
            class="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            Ajouter un site
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
              placeholder="Rechercher un site..."
            />
            <div class="absolute inset-y-0 right-0 flex items-center pr-3">
              <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
          </div>
        </div>
        <div class="flex gap-4">
          <select
            v-model="filters.region"
            class="block w-full rounded-md border-gray-300 dark:border-gray-600 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
          >
            <option value="">Toutes les régions</option>
            <option v-for="region in regions" :key="region" :value="region">
              {{ region }}
            </option>
          </select>
          <select
            v-model="filters.status"
            class="block w-full rounded-md border-gray-300 dark:border-gray-600 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
          >
            <option value="">Tous les statuts</option>
            <option v-for="status in siteStatuses" :key="status" :value="status">
              {{ getStatusLabel(status) }}
            </option>
          </select>
        </div>
      </div>

      <!-- Liste des sites -->
      <div class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
        <div
          v-for="site in filteredSites"
          :key="site.id"
          class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-200 cursor-pointer"
          @click="selectSite(site)"
        >
          <div class="p-6">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                {{ site.name }} - {{ site.id }}
              </h3>
              <span
                :class="[
                  'px-2 py-1 text-xs font-medium rounded-full',
                  getStatusClass(site.status)
                ]"
              >
                {{ getStatusLabel(site.status) }}
              </span>
            </div>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {{ site.region }}
            </p>
            <dl class="mt-4 grid grid-cols-2 gap-4">
              <div>
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Coordonnées</dt>
                <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ site.latitude }}, {{ site.longitude }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Équipements</dt>
                <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                  <div class="flex items-center">
                    <span class="font-semibold">{{ site.equipment?.length || 0 }}</span>
                    <span class="ml-2 text-gray-500">équipements</span>
                  </div>
                  <div v-if="site.equipment?.length > 0" class="mt-2 space-y-1">
                    <div v-for="eq in site.equipment" :key="eq.id" class="text-xs">
                      <span class="font-medium">{{ eq.id }}</span> - 
                      <span class="text-gray-500">{{ eq.type }}</span>
                      <span :class="[
                        'ml-2 px-1 py-0.5 text-xs rounded-full',
                        getEquipmentStatusClass(eq.status)
                      ]">
                        {{ getEquipmentStatusLabel(eq.status) }}
                      </span>
                    </div>
                  </div>
                  <div v-else class="mt-2 text-xs text-gray-500">
                    Aucun équipement
                  </div>
                </dd>
              </div>
            </dl>
            <div class="mt-6 flex justify-end space-x-3">
              <button
                @click="viewSite(site)"
                class="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Voir
              </button>
              <button
                @click="editSite(site)"
                class="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Modifier
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Détails du site -->
    <div class="lg:w-1/2">
      <div v-if="selectedSite" class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
            {{ selectedSite.name }}
          </h2>
          <span
            :class="[
              'px-2 py-1 text-xs font-medium rounded-full',
              getStatusClass(selectedSite.status)
            ]"
          >
            {{ getStatusLabel(selectedSite.status) }}
          </span>
        </div>

        <!-- Informations générales -->
        <div class="mb-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Informations générales</h3>
          <dl class="grid grid-cols-2 gap-4">
            <div>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">ID</dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ selectedSite.id }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Région</dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ selectedSite.region }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Coordonnées</dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                {{ selectedSite.latitude }}, {{ selectedSite.longitude }}
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Base</dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                {{ selectedSite.oldBase ? `Ancienne: ${selectedSite.oldBase}` : '' }}
                {{ selectedSite.newBase ? `Nouvelle: ${selectedSite.newBase}` : '' }}
              </dd>
            </div>
          </dl>
        </div>

        <!-- Équipements -->
        <div class="mb-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Équipements</h3>
          <div v-if="selectedSite.equipment?.length > 0" class="space-y-4">
            <div v-for="eq in selectedSite.equipment" :key="eq.id" 
              class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div class="flex items-center justify-between mb-2">
                <h4 class="font-medium text-gray-900 dark:text-white">{{ eq.id }}</h4>
                <span
                  :class="[
                    'px-2 py-1 text-xs font-medium rounded-full',
                    getEquipmentStatusClass(eq.status)
                  ]"
                >
                  {{ getEquipmentStatusLabel(eq.status) }}
                </span>
              </div>
              <dl class="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <dt class="text-gray-500 dark:text-gray-400">Type</dt>
                  <dd class="text-gray-900 dark:text-white">{{ eq.type }}</dd>
                </div>
                <div>
                  <dt class="text-gray-500 dark:text-gray-400">Modèle</dt>
                  <dd class="text-gray-900 dark:text-white">{{ eq.model }}</dd>
                </div>
                <div>
                  <dt class="text-gray-500 dark:text-gray-400">Date d'installation</dt>
                  <dd class="text-gray-900 dark:text-white">{{ eq.installDate }}</dd>
                </div>
                <div>
                  <dt class="text-gray-500 dark:text-gray-400">Dernière maintenance</dt>
                  <dd class="text-gray-900 dark:text-white">{{ eq.lastMaintenanceDate || 'Non spécifiée' }}</dd>
                </div>
              </dl>
            </div>
          </div>
          <div v-else class="text-sm text-gray-500 dark:text-gray-400">
            Aucun équipement sur ce site
          </div>
        </div>

        <!-- Équipes -->
        <div class="mb-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Équipes assignées</h3>
          <div v-if="siteTeams.length > 0" class="space-y-4">
            <div v-for="team in siteTeams" :key="team.id" 
              class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="font-medium text-gray-900 dark:text-white">{{ team.name }}</h4>
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ team.equipmentType }}</p>
                </div>
                <button 
                  @click="removeTeam(team.id)"
                  class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                >
                  Retirer
                </button>
              </div>
            </div>
          </div>
          <div v-else class="text-sm text-gray-500 dark:text-gray-400">
            Aucune équipe assignée à ce site
          </div>

          <div class="mt-4">
            <h4 class="text-md font-medium text-gray-900 dark:text-white mb-2">Assigner des équipes</h4>
            <select 
              v-model="selectedTeams" 
              multiple
              class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
            >
              <option 
                v-for="team in availableTeams.data" 
                :key="team.id" 
                :value="team.id"
                :disabled="isTeamAssigned(team.id)"
              >
                {{ team.name }} - Direction: {{ team.department?.name || 'Non assignée' }}
              </option>
            </select>
            <button 
              @click="assignTeams"
              class="mt-2 inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Assigner les équipes sélectionnées
            </button>
          </div>
        </div>
      </div>
      <div v-else class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <p class="text-gray-500 dark:text-gray-400 text-center">
          Sélectionnez un site pour voir ses détails
        </p>
      </div>
    </div>

    <!-- Modal d'ajout/modification -->
    <Modal
      v-if="showModal"
      :title="modalTitle"
      @close="closeModal"
    >
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label for="id" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            ID du site
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
          <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Nom
          </label>
          <input
            type="text"
            id="name"
            v-model="form.name"
            class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
            required
          />
        </div>
        <div>
          <label for="region" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Région
          </label>
          <input
            type="text"
            id="region"
            v-model="form.region"
            class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
            required
          />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="latitude" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Latitude
            </label>
            <input
              type="number"
              id="latitude"
              v-model="form.latitude"
              step="0.000001"
              class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          <div>
            <label for="longitude" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Longitude
            </label>
            <input
              type="number"
              id="longitude"
              v-model="form.longitude"
              step="0.000001"
              class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
        </div>
        <div>
          <label for="status" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Statut
          </label>
          <select
            id="status"
            v-model="form.status"
            class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
          >
            <option v-for="status in siteStatuses" :key="status" :value="status">
              {{ getStatusLabel(status) }}
            </option>
          </select>
        </div>
        <div>
          <label for="oldBase" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Ancienne base
          </label>
          <input
            type="text"
            id="oldBase"
            v-model="form.oldBase"
            class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div>
          <label for="newBase" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Nouvelle base
          </label>
          <input
            type="text"
            id="newBase"
            v-model="form.newBase"
            class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3">
          <button
            type="submit"
            class="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
          >
            {{ isEditing ? 'Modifier' : 'Ajouter' }}
          </button>
          <button
            type="button"
            @click="closeModal"
            class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-base font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:text-sm"
          >
            Annuler
          </button>
        </div>
      </form>
    </Modal>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline';
import Modal from '@/components/Modal.vue';
import sitesApi from '@/services/api/sitesApi';
import teamsApi from '@/services/api/teamsApi';

export default {
  name: 'SitesView',
  components: {
    MagnifyingGlassIcon,
    Modal
  },
  setup() {
    const router = useRouter();
    const sites = ref([]);
    const showModal = ref(false);
    const isEditing = ref(false);
    const currentSite = ref(null);
    const selectedSite = ref(null);
    const siteTeams = ref([]);
    const availableTeams = ref([]);
    const selectedTeams = ref([]);

    const filters = ref({
      search: '',
      region: '',
      status: ''
    });

    const siteStatuses = [
      'ACTIVE',
      'INACTIVE',
      'MAINTENANCE',
      'UNDER_CONSTRUCTION'
    ];

    const form = ref({
      id: '',
      name: '',
      region: '',
      longitude: 0,
      latitude: 0,
      status: 'ACTIVE',
      oldBase: '',
      newBase: '',
      equipment: []
    });

    const modalTitle = computed(() => 
      isEditing.value ? 'Modifier le site' : 'Ajouter un site'
    );

    const regions = computed(() => {
      const uniqueRegions = new Set();
      sites.value.forEach(site => {
        if (site.region) uniqueRegions.add(site.region);
      });
      return Array.from(uniqueRegions);
    });

    const filteredSites = computed(() => {
      return sites.value.filter(site => {
        const matchesSearch = !filters.value.search || 
          site.name.toLowerCase().includes(filters.value.search.toLowerCase()) ||
          (site.region && site.region.toLowerCase().includes(filters.value.search.toLowerCase()));
        const matchesRegion = !filters.value.region || site.region === filters.value.region;
        const matchesStatus = !filters.value.status || site.status === filters.value.status;
        return matchesSearch && matchesRegion && matchesStatus;
      });
    });

    const loadData = async () => {
      try {
        const sitesData = await sitesApi.getAll();
        console.log('Données des sites chargées:', sitesData);
        sites.value = sitesData;
        
        // Vérification des équipements pour le site Baguida
        const baguidaSite = sitesData.find(site => site.name.toLowerCase().includes('baguida'));
        if (baguidaSite) {
          console.log('Site Baguida trouvé:', baguidaSite);
          console.log('Équipements de Baguida:', baguidaSite.equipment);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      }
    };

    const getStatusClass = (status) => {
      const classes = {
        ACTIVE: 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100',
        INACTIVE: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100',
        MAINTENANCE: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100',
        UNDER_CONSTRUCTION: 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100',
      };
      return classes[status] || classes.INACTIVE;
    };

    const getStatusLabel = (status) => {
      const labels = {
        ACTIVE: 'Actif',
        INACTIVE: 'Inactif',
        MAINTENANCE: 'En maintenance',
        UNDER_CONSTRUCTION: 'En construction',
      };
      return labels[status] || 'Inconnu';
    };

    const openAddModal = () => {
      isEditing.value = false;
      form.value = {
        id: '',
        name: '',
        region: '',
        longitude: 0,
        latitude: 0,
        status: 'ACTIVE',
        oldBase: '',
        newBase: '',
        equipment: []
      };
      showModal.value = true;
    };

    const editSite = (site) => {
      isEditing.value = true;
      currentSite.value = site;
      form.value = { ...site };
      showModal.value = true;
    };

    const viewSite = (site) => {
      router.push(`/dashboard/sites/${site.id}`);
    };

    const closeModal = () => {
      showModal.value = false;
      currentSite.value = null;
    };

    const handleSubmit = async () => {
      try {
        if (isEditing.value) {
          await sitesApi.update(currentSite.value.id, form.value);
        } else {
          await sitesApi.create(form.value);
        }
        await loadData();
        closeModal();
      } catch (error) {
        console.error('Erreur lors de la sauvegarde:', error);
      }
    };

    const getEquipmentStatusClass = (status) => {
      const classes = {
        'OPERATIONAL': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        'MAINTENANCE': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        'OUT_OF_SERVICE': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
        'DECOMMISSIONED': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
      };
      return classes[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    };

    const getEquipmentStatusLabel = (status) => {
      const labels = {
        'OPERATIONAL': 'Opérationnel',
        'MAINTENANCE': 'En maintenance',
        'OUT_OF_SERVICE': 'Hors service',
        'DECOMMISSIONED': 'Désaffecté'
      };
      return labels[status] || 'Inconnu';
    };

    const selectSite = (site) => {
      selectedSite.value = site;
    };

    const loadTeams = async () => {
      try {
        const response = await teamsApi.getAll();
        availableTeams.value = response;
        console.log('Équipes chargées:', availableTeams.value);
      } catch (error) {
        console.error('Erreur lors du chargement des équipes:', error);
      }
    };

    const loadSiteTeams = async (siteId) => {
      try {
        const response = await sitesApi.getSiteTeams(siteId);
        siteTeams.value = response;
      } catch (error) {
        console.error('Erreur lors du chargement des équipes du site:', error);
      }
    };

    const isTeamAssigned = (teamId) => {
      return siteTeams.value.some(team => team.id === teamId);
    };

    const assignTeams = async () => {
      if (!selectedTeams.value.length) {
        console.warning('Veuillez sélectionner au moins une équipe');
        return;
      }

      try {
        await sitesApi.assignTeams(selectedSite.value.id, selectedTeams.value);
        await loadSiteTeams(selectedSite.value.id);
        selectedTeams.value = [];
        console.success('Équipes assignées avec succès');
      } catch (error) {
        console.error('Erreur lors de l\'assignation des équipes:', error);
      }
    };

    const removeTeam = async (teamId) => {
      try {
        await sitesApi.removeTeams(selectedSite.value.id, [teamId]);
        await loadSiteTeams(selectedSite.value.id);
        console.success('Équipe retirée avec succès');
      } catch (error) {
        console.error('Erreur lors du retrait de l\'équipe:', error);
      }
    };

    onMounted(() => {
      loadData();
      loadTeams();
    });

    return {
      sites,
      filters,
      showModal,
      isEditing,
      form,
      modalTitle,
      regions,
      siteStatuses,
      filteredSites,
      getStatusClass,
      getStatusLabel,
      openAddModal,
      editSite,
      viewSite,
      closeModal,
      handleSubmit,
      getEquipmentStatusClass,
      getEquipmentStatusLabel,
      selectedSite,
      selectSite,
      siteTeams,
      availableTeams,
      selectedTeams,
      assignTeams,
      removeTeam,
      isTeamAssigned
    };
  },
};
</script>

<style>
/* Suppression des styles de la carte */
</style> 