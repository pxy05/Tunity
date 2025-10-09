<script setup lang="ts">
interface Props {
  item: any;
}

defineProps<Props>();

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
</script>

<template>
  <div>
    <div class="flex justify-between items-start mb-2">
      <h3 class="text-xl font-bold text-black/80">{{ item.name }}</h3>
      <span
        class="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium"
      >
        {{ item.status }}
      </span>
    </div>
    <p class="text-lg text-black/70 mb-2">{{ item.company }}</p>
    <div class="flex justify-between text-sm text-black/60">
      <span>{{ item.type }}</span>
      <span>{{ item.time }}</span>
    </div>
    <p class="text-sm text-black/50 mt-2">Date: {{ formatDate(item.date) }}</p>
  </div>
</template>
