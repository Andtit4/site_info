<template>
  <div class="min-h-screen flex flex-col dark:bg-gray-900">
    <!-- <nav v-if="currentRoute !== '/login'" class="bg-indigo-700 text-white p-4">
      <div class="container mx-auto flex justify-between items-center">
        <router-link to="/dashboard" class="text-xl font-bold">SiteInfo</router-link>
        <div class="flex space-x-4">
          <router-link to="/dashboard" class="hover:text-indigo-200">Tableau de bord</router-link>
          <router-link to="/dashboard/sites" class="hover:text-indigo-200">Sites</router-link>
          <router-link to="/dashboard/equipment" class="hover:text-indigo-200">Équipements</router-link>
          <router-link to="/dashboard/teams" class="hover:text-indigo-200">Équipes</router-link>
          <router-link to="/dashboard/departments" class="hover:text-indigo-200">Départements</router-link>
          <router-link to="/dashboard/specifications" class="hover:text-indigo-200">Spécifications</router-link>
          <a href="/swagger.html" target="_blank" class="hover:text-indigo-200">API Docs</a>
          <button @click="logout" class="hover:text-indigo-200">Déconnexion</button>
        </div>
      </div>
    </nav> -->

    <main class="flex-grow">
      <router-view />
    </main>

    <footer class="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 py-4">
      <div class="container mx-auto text-center">
        <p>&copy; 2023 SiteInfo. Tous droits réservés.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useTheme } from '@/composables/useTheme'

const { isDarkMode } = useTheme()

onMounted(() => {
  // Vérifier la préférence système pour le thème sombre
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  if (!localStorage.getItem('theme')) {
    isDarkMode.value = prefersDark
  }
})
</script>

<style>
@import '@/assets/styles/main.css';

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Styles de base pour le thème sombre */
.dark {
  color-scheme: dark;
}

/* Styles de base pour le thème clair */
:root {
  color-scheme: light;
}
</style>
