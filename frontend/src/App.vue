<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
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
