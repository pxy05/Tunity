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
        :class="[
          'px-3 py-1 rounded-full text-sm font-medium',
          item.status === 'Application'
            ? 'bg-blue-100 text-blue-800'
            : item.status === 'Interview'
              ? 'bg-orange-100 text-orange-800'
              : 'bg-green-100 text-green-800',
        ]"
      >
        {{ item.status }}
      </span>
    </div>
    <p class="text-lg text-black/70 mb-2">{{ item.company }}</p>
    <div class="flex justify-between text-sm text-black/60">
      <span>{{ item.location }}</span>
      <span>{{ item.salary }}</span>
    </div>
    <div class="flex justify-between text-sm text-black/50 mt-2">
      <span>{{ formatDate(item.date) }}</span>
      <span v-if="item.status === 'Interview' && item.time">{{
        item.time
      }}</span>
      <span v-if="item.status === 'Offer' && item.deadline"
        >Deadline: {{ formatDate(item.deadline) }}</span
      >
    </div>
  </div>
</template>
