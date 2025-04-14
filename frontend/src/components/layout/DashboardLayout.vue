<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
    <DashboardNav />
    <main class="py-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <router-view v-slot="{ Component }">
          <transition
            name="fade"
            mode="out-in"
            appear
          >
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </main>
  </div>
</template>

<script>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import DashboardNav from './DashboardNav.vue';
import authService from '@/services/auth.service';

export default {
  name: 'DashboardLayout',
  components: {
    DashboardNav,
  },
  setup() {
    const router = useRouter();

    onMounted(() => {
      if (!authService.isAuthenticated()) {
        router.push('/login');
      }
    });
  },
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style> 