<script setup lang="ts">
import type { PositionWithApplication } from "~/assets/types/database";

interface Props {
  item: PositionWithApplication;
}

defineProps<Props>();

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return "N/A";
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
      <h3 class="text-xl font-bold text-black/80">
        {{ item.position_name || "Untitled Position" }}
      </h3>
      <span
        class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
      >
        Applied
      </span>
    </div>
    <p class="text-lg text-black/70 mb-2">
      {{ item.company_name || "Unknown Company" }}
    </p>
    <div class="flex justify-between text-sm text-black/60">
      <span>{{ item.location || "Location not specified" }}</span>
      <span v-if="item.applied_date">
        Applied: {{ formatDate(item.applied_date) }}
      </span>
    </div>
    <p v-if="item.rejected" class="text-sm text-red-600 mt-2 font-semibold">
      Rejected
    </p>
  </div>
</template>
