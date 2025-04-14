<template>
  <div class="fixed inset-0 z-10 overflow-y-auto">
    <div class="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 transition-opacity" aria-hidden="true">
        <div class="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
      </div>

      <span class="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>

      <div class="inline-block transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:align-middle">
        <div class="absolute top-0 right-0 pt-4 pr-4">
          <button
            type="button"
            class="rounded-md bg-white dark:bg-gray-800 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            @click="$emit('close')"
          >
            <span class="sr-only">Fermer</span>
            <XMarkIcon class="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <div class="sm:flex sm:items-start">
          <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
            <h3 class="text-lg font-medium leading-6 text-gray-900 dark:text-white">
              {{ title }}
            </h3>
            <div class="mt-4">
              <slot></slot>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { XMarkIcon } from '@heroicons/vue/24/outline';

export default {
  name: 'ModalView',
  components: {
    XMarkIcon,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
  },
  emits: ['close'],
};
</script> 