<template>
  <div>
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Spécifications Techniques</h1>
        <p class="mt-2 text-sm text-gray-700 dark:text-gray-300">
          Gestion des spécifications techniques par type d'équipement.
        </p>
      </div>
      <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
        <button
          @click="openAddModal"
          class="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
        >
          Ajouter des spécifications
        </button>
      </div>
    </div>

    <!-- Liste des spécifications -->
    <div class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="spec in specifications"
        :key="spec.id"
        class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-200"
      >
        <div class="p-6">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">
              {{ getTypeLabel(spec.equipmentType) }}
            </h3>
          </div>
          <div class="mt-4">
            <dl class="grid grid-cols-1 gap-4">
              <div v-for="(value, key) in spec.specifications" :key="key">
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ key }}</dt>
                <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ value }}</dd>
              </div>
            </dl>
          </div>
          <div class="mt-6 flex justify-end space-x-3">
            <button
              @click="editSpecification(spec)"
              class="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Modifier
            </button>
            <button
              @click="confirmDelete(spec)"
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
      @close="closeModal"
    >
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label for="equipmentType" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Type d'équipement
          </label>
          <select
            id="equipmentType"
            v-model="form.equipmentType"
            class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
            required
          >
            <option value="">Sélectionner un type</option>
            <option v-for="type in equipmentTypes" :key="type" :value="type">
              {{ getTypeLabel(type) }}
            </option>
          </select>
        </div>

        <!-- Spécifications dynamiques -->
        <div v-if="form.equipmentType" class="space-y-4">
          <div v-for="(column, index) in form.columns" :key="index" class="flex gap-2">
            <input
              type="text"
              v-model="column.name"
              class="block w-1/3 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
              placeholder="Nom de la colonne"
            />
            <select
              v-model="column.type"
              class="block w-1/4 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
            >
              <option value="varchar">VARCHAR</option>
              <option value="int">INT</option>
              <option value="float">FLOAT</option>
              <option value="boolean">BOOLEAN</option>
              <option value="date">DATE</option>
            </select>
            <input
              v-if="column.type === 'varchar'"
              type="number"
              v-model="column.length"
              class="block w-1/6 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
              placeholder="Longueur"
            />
            <input
              type="text"
              v-model="column.defaultValue"
              class="block w-1/4 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
              placeholder="Valeur par défaut"
            />
            <button
              type="button"
              @click="removeSpecification(index)"
              class="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <XMarkIcon class="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
          <button
            type="button"
            @click="addSpecification"
            class="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Ajouter une colonne
          </button>
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
    </Modal>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import Modal from '@/components/Modal.vue';
import { XMarkIcon } from '@heroicons/vue/24/outline';
import specificationsApi from '@/services/api/specificationsApi';

export default {
  name: 'SpecificationsView',
  components: {
    XMarkIcon,
    Modal,
  },
  setup() {
    const toast = useToast();
    const specifications = ref([]);
    const showModal = ref(false);
    const isEditing = ref(false);
    const selectedSpecification = ref(null);

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
      equipmentType: '',
      columns: []
    });

    const modalTitle = computed(() => 
      isEditing.value ? 'Modifier les spécifications' : 'Ajouter des spécifications'
    );

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

    const loadSpecifications = async () => {
      try {
        specifications.value = await specificationsApi.getAll();
      } catch (error) {
        console.error('Erreur lors du chargement des spécifications:', error);
        toast.error('Erreur lors du chargement des spécifications');
      }
    };

    const addSpecification = () => {
      const newColumn = {
        name: '',
        type: 'varchar',
        length: 255,
        nullable: true,
        defaultValue: ''
      };
      form.value.columns.push(newColumn);
    };

    const removeSpecification = (index) => {
      form.value.columns.splice(index, 1);
    };

    const openAddModal = () => {
      isEditing.value = false;
      form.value = {
        equipmentType: '',
        columns: []
      };
      showModal.value = true;
    };

    const editSpecification = (spec) => {
      isEditing.value = true;
      selectedSpecification.value = spec;
      form.value = {
        equipmentType: spec.equipmentType,
        columns: spec.columns || []
      };
      showModal.value = true;
    };

    const closeModal = () => {
      showModal.value = false;
      selectedSpecification.value = null;
      isEditing.value = false;
    };

    const handleSubmit = async () => {
      try {
        if (!validateForm()) {
          return;
        }

        const payload = {
          equipmentType: form.value.equipmentType,
          columns: form.value.columns
        };

        if (isEditing.value && selectedSpecification.value) {
          await specificationsApi.update(selectedSpecification.value.id, payload);
          toast.success('Spécifications mises à jour avec succès');
        } else {
          await specificationsApi.create(payload);
          toast.success('Spécifications créées avec succès');
        }

        showModal.value = false;
        loadSpecifications();
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
        if (!form.value.equipmentType) {
          toast.error('Le type d\'équipement est requis');
          return false;
        }
        if (form.value.columns.length === 0) {
          toast.error('Au moins une colonne est requise');
          return false;
        }
        return true;
      } catch (error) {
        console.error('Erreur lors de la validation:', error);
        toast.error('Une erreur est survenue lors de la validation');
        return false;
      }
    };

    const confirmDelete = async (spec) => {
      if (confirm(`Êtes-vous sûr de vouloir supprimer les spécifications pour ${getTypeLabel(spec.equipmentType)} ?`)) {
        try {
          await specificationsApi.delete(spec.id);
          toast.success('Spécifications supprimées avec succès');
          await loadSpecifications();
        } catch (error) {
          console.error('Erreur lors de la suppression des spécifications:', error);
          toast.error('Erreur lors de la suppression des spécifications');
        }
      }
    };

    onMounted(() => {
      loadSpecifications();
    });

    return {
      specifications,
      showModal,
      isEditing,
      form,
      equipmentTypes,
      modalTitle,
      getTypeLabel,
      loadSpecifications,
      addSpecification,
      removeSpecification,
      openAddModal,
      editSpecification,
      closeModal,
      handleSubmit,
      validateForm,
      confirmDelete
    };
  },
};
</script> 