<script setup lang="ts">
interface Props {
  message?: string;
}

withDefaults(defineProps<Props>(), {
  message: "Loading...",
});
</script>

<template>
  <div class="flex items-center justify-center h-screen">
    <div class="glass-card p-8 rounded-2xl">
      <div class="flex flex-col items-center gap-4">
        <div
          class="animate-spin rounded-full h-16 w-16 border-b-4 border-black/80"
        ></div>
        <p class="text-xl font-bold text-black/80">{{ message }}</p>
      </div>
    </div>
  </div>
</template>

