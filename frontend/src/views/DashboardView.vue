<template>
  <div>
    <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Tableau de bord</h1>
    
    <!-- Statistiques -->
    <div class="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <div v-for="stat in stats" :key="stat.name" class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <component 
                :is="stat.icon" 
                class="h-6 w-6 text-gray-400" 
                aria-hidden="true" 
              />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  {{ stat.name }}
                </dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-semibold text-gray-900 dark:text-white">
                    {{ stat.value }}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Départements et leurs équipements -->
    <div class="mt-8">
      <h2 class="text-xl font-medium text-gray-900 dark:text-white mb-4">Départements et équipements gérés</h2>
      <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <!-- Liste des départements -->
          <div class="p-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Départements</h3>
            <div class="flow-root">
              <ul class="-my-5 divide-y divide-gray-200 dark:divide-gray-700">
                <li v-for="(department, index) in departmentsByType" :key="index" class="py-4">
                  <div class="flex items-center">
                    <div class="flex-shrink-0">
                      <span class="inline-flex items-center justify-center h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-200">
                        {{ department.type.substring(0, 1) }}
                      </span>
                    </div>
                    <div class="ml-4 flex-1">
                      <h4 class="text-sm font-medium text-gray-900 dark:text-white">
                        {{ getTypeLabel(department.type) }}
                      </h4>
                      <p class="text-sm text-gray-500 dark:text-gray-400">
                        {{ department.count }} départements
                      </p>
                    </div>
                    <div class="ml-2">
                      <button 
                        type="button" 
                        class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        @click="navigateToDepartmentsList(department.type)"
                      >
                        Voir
                      </button>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          
          <!-- Équipements par département -->
          <div class="p-6 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Équipements gérés par département</h3>
            <div class="space-y-4">
              <div v-for="(department, index) in equipmentsByDepartment" :key="index" class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div class="flex justify-between items-center mb-2">
                  <h4 class="text-sm font-medium text-gray-900 dark:text-white">{{ department.departmentName }}</h4>
                  <span class="px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-800 dark:text-indigo-100">
                    {{ department.equipmentCount }} équipements
                  </span>
                </div>
                <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                  <div 
                    class="bg-indigo-600 h-2.5 rounded-full" 
                    :style="{ width: `${calculatePercentage(department.equipmentCount)}%` }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Graphiques -->
    <div class="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
      <!-- Équipements par type -->
      <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Équipements par type
        </h3>
        <div class="h-80">
          <canvas ref="equipmentChart"></canvas>
        </div>
      </div>

      <!-- Sites par département -->
      <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Sites par département
        </h3>
        <div class="h-80">
          <canvas ref="sitesChart"></canvas>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Chart } from 'chart.js/auto';
import {
  BuildingOfficeIcon,
  WrenchScrewdriverIcon,
  BuildingLibraryIcon,
  UsersIcon,
} from '@heroicons/vue/24/outline';
import equipmentApi from '@/services/api/equipmentApi';
import sitesApi from '@/services/api/sitesApi';
import departmentsApi from '@/services/api/departmentsApi';

export default {
  name: 'DashboardView',
  components: {
    BuildingOfficeIcon,
    WrenchScrewdriverIcon,
    BuildingLibraryIcon,
    UsersIcon,
  },
  setup() {
    const router = useRouter();
    const equipmentChart = ref(null);
    const sitesChart = ref(null);
    const stats = ref([
      { name: 'Sites totaux', value: 0, icon: 'BuildingOfficeIcon' },
      { name: 'Équipements', value: 0, icon: 'WrenchScrewdriverIcon' },
      { name: 'Départements', value: 0, icon: 'BuildingLibraryIcon' },
      { name: 'Équipes', value: 0, icon: 'UsersIcon' },
    ]);
    const departmentsByType = ref([]);
    const equipmentsByDepartment = ref([]);
    const maxEquipmentCount = ref(0);

    const loadStats = async () => {
      try {
        const [sitesStats, equipmentStats, departmentsStats] = await Promise.all([
          sitesApi.getStatistics().catch(e => { console.error('Erreur lors du chargement des statistiques des sites:', e); return { totalSites: 0 }; }),
          equipmentApi.getStatistics().catch(e => { console.error('Erreur lors du chargement des statistiques des équipements:', e); return { totalEquipment: 0 }; }),
          departmentsApi.getStatistics().catch(e => { console.error('Erreur lors du chargement des statistiques des départements:', e); return { total: 0, totalTeams: 0 }; }),
        ]);

        // Mettre à jour les statistiques générales avec des valeurs par défaut en cas de données manquantes
        stats.value[0].value = sitesStats?.totalSites || 0;
        stats.value[1].value = equipmentStats?.totalEquipment || 0;
        stats.value[2].value = departmentsStats?.total || 0;
        stats.value[3].value = departmentsStats?.totalTeams || 0;
        
        // Départements par type (avec vérification)
        departmentsByType.value = departmentsStats?.departmentsByType || [];
        
        // Équipements par département (avec vérification)
        equipmentsByDepartment.value = departmentsStats?.equipmentCountByDepartment || [];
        
        // Calculer le nombre maximum d'équipements pour la barre de progression
        if (equipmentsByDepartment.value && equipmentsByDepartment.value.length > 0) {
          maxEquipmentCount.value = Math.max(
            ...equipmentsByDepartment.value.map(dept => parseInt(dept.equipmentCount) || 0)
          );
        }
      } catch (error) {
        console.error('Erreur lors du chargement des statistiques:', error);
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
      return labels[type] || type;
    };

    const calculatePercentage = (count) => {
      if (maxEquipmentCount.value === 0) return 0;
      return (parseInt(count) / maxEquipmentCount.value) * 100;
    };

    const navigateToDepartmentsList = (type) => {
      router.push({
        path: '/dashboard/departments',
        query: { type }
      });
    };

    const createCharts = async () => {
      try {
        const equipmentStats = await equipmentApi.getStatistics();
        const sitesStats = await sitesApi.getStatistics();

        // Vérifier que les éléments canvas existent avant de créer les graphiques
        if (!equipmentChart.value || !sitesChart.value) {
          console.warn('Les éléments canvas ne sont pas disponibles');
          return;
        }

        // Vérifier que les données sont disponibles
        if (!equipmentStats?.byType || Object.keys(equipmentStats.byType).length === 0) {
          console.warn('Aucune donnée disponible pour le graphique des équipements');
          return;
        }

        // Graphique des équipements par type
        new Chart(equipmentChart.value, {
          type: 'doughnut',
          data: {
            labels: Object.keys(equipmentStats.byType),
            datasets: [{
              data: Object.values(equipmentStats.byType),
              backgroundColor: [
                '#3B82F6',
                '#10B981',
                '#F59E0B',
                '#EF4444',
                '#8B5CF6',
              ],
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom',
                labels: {
                  color: document.documentElement.classList.contains('dark') ? '#fff' : '#000',
                },
              },
            },
          },
        });

        // Vérifier que les données pour les sites sont disponibles
        if (!sitesStats?.byDepartment || Object.keys(sitesStats.byDepartment).length === 0) {
          console.warn('Aucune donnée disponible pour le graphique des sites');
          return;
        }

        // Graphique des sites par département
        new Chart(sitesChart.value, {
          type: 'bar',
          data: {
            labels: Object.keys(sitesStats.byDepartment),
            datasets: [{
              label: 'Nombre de sites',
              data: Object.values(sitesStats.byDepartment),
              backgroundColor: '#3B82F6',
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  color: document.documentElement.classList.contains('dark') ? '#fff' : '#000',
                },
                grid: {
                  color: document.documentElement.classList.contains('dark') ? '#374151' : '#E5E7EB',
                },
              },
              x: {
                ticks: {
                  color: document.documentElement.classList.contains('dark') ? '#fff' : '#000',
                },
                grid: {
                  display: false,
                },
              },
            },
          },
        });
      } catch (error) {
        console.error('Erreur lors de la création des graphiques:', error);
      }
    };

    onMounted(async () => {
      await loadStats();
      await createCharts();
    });

    return {
      stats,
      equipmentChart,
      sitesChart,
      departmentsByType,
      equipmentsByDepartment,
      getTypeLabel,
      calculatePercentage,
      navigateToDepartmentsList
    };
  },
};
</script> 