<template>
  <div>
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Départements</h1>
        <p class="mt-2 text-sm text-gray-700 dark:text-gray-300">
          Liste de tous les départements et leurs informations.
        </p>
      </div>
      <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
        <button
          @click="openAddModal"
          class="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
        >
          Ajouter un département
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
            placeholder="Rechercher un département..."
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
          <option v-for="type in departmentTypes" :key="type" :value="type">
            {{ getTypeLabel(type) }}
          </option>
        </select>
        <select
          v-model="filters.isActive"
          class="block w-full rounded-md border-gray-300 dark:border-gray-600 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
        >
          <option value="">Tous les statuts</option>
          <option :value="true">Actif</option>
          <option :value="false">Inactif</option>
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
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Responsable</dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ department.responsibleName }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Contact</dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ department.contactEmail }}</dd>
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
                <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nom du département
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
                <label for="type" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Type
                </label>
                <select
                  id="type"
                  v-model="form.type"
                  class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option v-for="type in departmentTypes" :key="type" :value="type">
                    {{ getTypeLabel(type) }}
                  </option>
                </select>
              </div>
              <div class="sm:col-span-2">
                <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description
                </label>
                <textarea
                  id="description"
                  v-model="form.description"
                  rows="3"
                  class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Contact -->
          <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Contact</h3>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label for="responsibleName" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nom du responsable
                </label>
                <input
                  type="text"
                  id="responsibleName"
                  v-model="form.responsibleName"
                  class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              <div>
                <label for="contactEmail" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email de contact
                </label>
                <input
                  type="email"
                  id="contactEmail"
                  v-model="form.contactEmail"
                  class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              <div>
                <label for="contactPhone" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Téléphone de contact
                </label>
                <input
                  type="tel"
                  id="contactPhone"
                  v-model="form.contactPhone"
                  class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label for="isActive" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Statut
                </label>
                <select
                  id="isActive"
                  v-model="form.isActive"
                  class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                >
                  <option :value="true">Actif</option>
                  <option :value="false">Inactif</option>
                </select>
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
import { useRouter } from 'vue-router';
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
    const departments = ref([]);
    const showModal = ref(false);
    const isEditing = ref(false);
    const currentDepartment = ref(null);

    const filters = ref({
      search: '',
      type: '',
      isActive: ''
    });

    const departmentTypes = [
      'TRANSMISSION',
      'ENERGIE',
      'INFRASTRUCTURE',
      'INFORMATIQUE',
      'SECURITE'
    ];

    const form = ref({
      name: '',
      type: 'TRANSMISSION',
      description: '',
      responsibleName: '',
      contactEmail: '',
      contactPhone: '',
      isActive: true
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
        return matchesSearch && matchesType && matchesStatus;
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

    const openAddModal = () => {
      isEditing.value = false;
      form.value = {
        name: '',
        type: 'TRANSMISSION',
        description: '',
        responsibleName: '',
        contactEmail: '',
        contactPhone: '',
        isActive: true
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
          await departmentsApi.update(currentDepartment.value.id, form.value);
        } else {
          await departmentsApi.create(form.value);
        }
        await loadData();
        closeModal();
      } catch (error) {
        console.error('Erreur lors de la sauvegarde:', error);
      }
    };

    onMounted(loadData);

    return {
      departments,
      filters,
      showModal,
      isEditing,
      form,
      modalTitle,
      departmentTypes,
      filteredDepartments,
      getTypeLabel,
      openAddModal,
      editDepartment,
      viewDepartment,
      closeModal,
      handleSubmit,
    };
  },
};
</script> 