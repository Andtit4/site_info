import { ref, watch } from 'vue'

export function useTheme() {
  const isDarkMode = ref(localStorage.getItem('theme') === 'dark')

  const toggleTheme = () => {
    isDarkMode.value = !isDarkMode.value
    localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light')
    updateTheme()
  }

  const updateTheme = () => {
    document.documentElement.classList.toggle('dark', isDarkMode.value)
  }

  watch(isDarkMode, () => {
    updateTheme()
  })

  // Initialisation du thème
  updateTheme()

  return {
    isDarkMode,
    toggleTheme
  }
} 