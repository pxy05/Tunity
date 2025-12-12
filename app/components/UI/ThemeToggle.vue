<script setup lang="ts">
import { useTheme } from "~/composables/useTheme";

const { theme, cycleTheme } = useTheme();

const themeText = computed(() => {
  return theme.value;
});

const buttonClasses = computed(() => {
  const baseClasses = 'fixed bottom-6 right-6 z-50 px-4 py-2 rounded-lg backdrop-blur-sm transition-all duration-300 cursor-pointer';
  
  switch (theme.value) {
    case "transparent":
      return `${baseClasses} text-white/60 border border-white/20 hover:border-white/30 bg-white/5`;
    case "dark":
      return `${baseClasses} text-white/60 border border-white/20 hover:border-white/30 bg-black/20`;
    case "light":
      return `${baseClasses} text-black/60 border border-black/20 hover:border-black/30 bg-white/40`;
    default:
      return `${baseClasses} text-white/60 border border-white/20 hover:border-white/30`;
  }
});
</script>

<template>
  <button
    @click="cycleTheme"
    :class="buttonClasses"
    style="font-family: Helvetica, Arial, sans-serif;"
  >
    {{ themeText }}
  </button>
</template>

