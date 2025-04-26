<template>
  <nav class="bg-white dark:bg-gray-800 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex">
          <div class="flex-shrink-0 flex items-center">
            <img class="h-8 w-auto" src="@/assets/logo.png" alt="Logo" />
          </div>
          <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
            <router-link
              v-for="item in filteredNavigationItems"
              :key="item.path"
              :to="item.path"
              class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              :class="[
                $route.path === item.path
                  ? 'border-indigo-500 text-gray-900 dark:text-white'
                  : 'border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-200'
              ]"
            >
              <component :is="item.icon" class="h-5 w-5 mr-2" />
              {{ item.name }}
            </router-link>
          </div>
        </div>
        <div class="hidden sm:ml-6 sm:flex sm:items-center">
          <button
            @click="toggleTheme"
            class="p-2 rounded-md text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none"
          >
            <SunIcon v-if="isDarkMode" class="h-6 w-6" />
            <MoonIcon v-else class="h-6 w-6" />
          </button>
          <div class="ml-3 relative">
            <div>
              <button
                @click="isProfileMenuOpen = !isProfileMenuOpen"
                class="flex text-sm rounded-full focus:outline-none"
              >
                <img
                  class="h-8 w-8 rounded-full"
                  :src="userAvatar"
                  alt="Avatar"
                />
              </button>
            </div>
            <div
              v-if="isProfileMenuOpen"
              class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5"
            >
              <router-link
                to="/dashboard/profile"
                class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                @click="isProfileMenuOpen = false"
              >
                Mon profil
              </router-link>
              <router-link
                v-if="isAdmin"
                to="/dashboard/admin/create"
                class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                @click="isProfileMenuOpen = false"
              >
                Créer un administrateur
              </router-link>
              <a
                href="#"
                class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                @click="logout"
              >
                Déconnexion
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { ref, computed } from 'vue';
import { useRouter, /* useRoute */ } from 'vue-router';
import { useTheme } from '@/composables/useTheme';
import { 
  SunIcon, 
  MoonIcon, 
  HomeIcon, 
  BuildingOfficeIcon, 
  WrenchScrewdriverIcon, 
  BuildingLibraryIcon,
  UserGroupIcon,
  DocumentTextIcon
} from '@heroicons/vue/24/outline';
import authService from '@/services/auth.service';

export default {
  name: 'DashboardNav',
  components: {
    SunIcon,
    MoonIcon,
    HomeIcon,
    BuildingOfficeIcon,
    WrenchScrewdriverIcon,
    BuildingLibraryIcon,
    UserGroupIcon,
    DocumentTextIcon
  },
  setup() {
    const router = useRouter();
    // const route = useRoute();
    const { isDarkMode, toggleTheme } = useTheme();
    const isProfileMenuOpen = ref(false);

    const navigationItems = [
      {
        name: 'Tableau de bord',
        path: '/dashboard',
        icon: 'HomeIcon',
        requiredRole: 'any'
      },
      {
        name: 'Sites',
        path: '/dashboard/sites',
        icon: 'BuildingOfficeIcon',
        requiredRole: 'any'
      },
      {
        name: 'Équipements',
        path: '/dashboard/equipment',
        icon: 'WrenchScrewdriverIcon',
        requiredRole: 'any'
      },
      {
        name: 'Départements',
        path: '/dashboard/departments',
        icon: 'BuildingLibraryIcon',
        requiredRole: 'admin'
      },
      {
        name: 'Équipes',
        path: '/dashboard/teams',
        icon: 'UserGroupIcon',
        requiredRole: 'any'
      },
      {
        name: 'Spécifications',
        path: '/dashboard/specifications',
        icon: 'DocumentTextIcon',
        requiredRole: 'admin'
      }
    ];

    const userAvatar = computed(() => {
      const user = authService.getCurrentUser();
      return user?.avatar || 'https://ui-avatars.com/api/?name=' + (user?.username || 'User');
    });

    const isAdmin = computed(() => {
      return authService.isAdmin();
    });

    const filteredNavigationItems = computed(() => {
      const isAdminUser = isAdmin.value;
      
      return navigationItems.filter(item => {
        // Si l'élément est accessible à tous ou si l'utilisateur est admin
        return item.requiredRole === 'any' || (item.requiredRole === 'admin' && isAdminUser);
      });
    });

    const logout = async () => {
      await authService.logout();
      router.push('/login');
    };

    return {
      navigationItems,
      filteredNavigationItems,
      isDarkMode,
      toggleTheme,
      isProfileMenuOpen,
      userAvatar,
      isAdmin,
      logout
    };
  }
};
</script> 