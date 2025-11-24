<script setup lang="ts">
import useContext from "~/context/tempcontext";
import type { PositionWithApplication } from "~/assets/types/database";

interface Props {
  item: PositionWithApplication;
}

const props = defineProps<Props>();
const context = useContext();

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const status = computed(() => context.computeStatus(props.item));
</script>

<template>
  <div>
    <div class="flex justify-between items-start mb-2">
      <h3 class="text-xl font-bold text-black/80">
        {{ item.position_name || "Untitled Position" }}
      </h3>
      <span
        :class="[
          'px-3 py-1 rounded-full text-sm font-medium',
          status === 'Applied'
            ? 'bg-blue-100 text-blue-800'
            : status === 'Interviewing'
              ? 'bg-orange-100 text-orange-800'
              : status === 'Rejected'
                ? 'bg-red-100 text-red-800'
                : 'bg-gray-100 text-gray-800',
        ]"
      >
        {{ status }}
      </span>
    </div>
    <p class="text-lg text-black/70 mb-2">
      {{ item.company_name || "Unknown Company" }}
    </p>
    <div class="flex justify-between text-sm text-black/60">
      <span>{{ item.location || "Location not specified" }}</span>
      <span v-if="item.applied_date">
        {{ formatDate(item.applied_date) }}
      </span>
    </div>
    <div class="flex justify-between text-sm text-black/50 mt-2">
      <span v-if="item.assessments && item.assessments.length > 0">
        {{ item.assessments.length }} assessment(s)
      </span>
      <span v-if="item.applied_deadline">
        Deadline: {{ formatDate(item.applied_deadline) }}
      </span>
    </div>
    <p v-if="item.rejected" class="text-sm text-red-600 mt-2 font-semibold">
      Rejected
    </p>
  </div>
</template>
