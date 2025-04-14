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
    const equipmentChart = ref(null);
    const sitesChart = ref(null);
    const stats = ref([
      { name: 'Sites totaux', value: 0, icon: 'BuildingOfficeIcon' },
      { name: 'Équipements', value: 0, icon: 'WrenchScrewdriverIcon' },
      { name: 'Départements', value: 0, icon: 'BuildingLibraryIcon' },
      { name: 'Équipes', value: 0, icon: 'UsersIcon' },
    ]);

    const loadStats = async () => {
      try {
        const [sitesStats, equipmentStats, departmentsStats] = await Promise.all([
          sitesApi.getStatistics(),
          equipmentApi.getStatistics(),
          departmentsApi.getStatistics(),
        ]);

        stats.value[0].value = sitesStats.totalSites;
        stats.value[1].value = equipmentStats.totalEquipment;
        stats.value[2].value = departmentsStats.totalDepartments;
        stats.value[3].value = departmentsStats.totalTeams;
      } catch (error) {
        console.error('Erreur lors du chargement des statistiques:', error);
      }
    };

    const createCharts = async () => {
      try {
        const equipmentStats = await equipmentApi.getStatistics();
        const sitesStats = await sitesApi.getStatistics();

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
    };
  },
};
</script> 