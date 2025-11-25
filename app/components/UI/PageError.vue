<script setup lang="ts">
interface Props {
  error: string;
  showBackButton?: boolean;
}

withDefaults(defineProps<Props>(), {
  showBackButton: true,
});
</script>

<template>
  <div class="flex items-center justify-center h-screen">
    <div class="glass-card p-8 rounded-2xl">
      <p class="text-xl font-bold text-red-600">{{ error }}</p>
      <button
        v-if="showBackButton"
        @click="navigateTo('/')"
        class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Go Back
      </button>
    </div>
  </div>
</template>

