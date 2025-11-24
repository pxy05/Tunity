<script setup lang="ts">
import type { PositionWithApplication, Assessment } from "~/assets/types/database";

interface Props {
  item: PositionWithApplication;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  edit: [position: PositionWithApplication];
  delete: [position: PositionWithApplication];
}>();

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatDateTime = (dateString: string | undefined) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const getAssessmentTypeLabel = (type: string | undefined): string => {
  if (!type) return "Assessment";
  const labels: Record<string, string> = {
    in_person_interview: "In-Person Interview",
    online_interview: "Online Interview",
    assessment_center: "Assessment Center",
    hirevue: "Hirevue",
    online_assessment: "Online Assessment",
  };
  return labels[type] || type;
};

const isApplied = computed(() => !!props.item.application);

const latestAssessment = computed((): Assessment | null => {
  if (!props.item.assessments || props.item.assessments.length === 0) {
    return null;
  }
  
  // Sort assessments by date (most recent first)
  const sorted = [...props.item.assessments].sort((a, b) => {
    if (!a.date) return 1;
    if (!b.date) return -1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
  
  return sorted[0] || null;
});

const handleEdit = () => {
  emit("edit", props.item);
};

const handleDelete = () => {
  emit("delete", props.item);
};

const handleCardClick = () => {
  if (props.item.id) {
    navigateTo(`/position/${props.item.id}`);
  }
};
</script>

<template>
  <div @click="handleCardClick" class="cursor-pointer">
    <div class="flex justify-between items-start mb-2">
      <div class="flex-1">
        <h3 class="text-xl font-bold text-white/90">
          {{ item.position_name || "Untitled Position" }}
          <span v-if="item.offer" class="text-2xl font-bold text-green-400">
            - Offer Received
          </span>
        </h3>
        <p class="text-lg text-white/90 mb-2">
          {{ item.company_name || "Unknown Company" }}
        </p>
      </div>
      <div class="flex gap-2 ml-4" @click.stop>
        <button
          @click.stop="handleEdit"
          class="px-3 py-1 bg-white/20 text-white rounded hover:bg-white/30 border border-white/30 transition-colors text-sm"
        >
          Edit
        </button>
        <button
          @click.stop="handleDelete"
          class="px-3 py-1 bg-red-500/20 text-white rounded hover:bg-red-500/30 border border-red-400/40 transition-colors text-sm"
        >
          Delete
        </button>
      </div>
    </div>
    
    <div class="space-y-2">
      <div class="text-sm text-white/90">
        <span>{{ item.location || "Location not specified" }}</span>
      </div>
      <div class="text-sm text-white/90">
        <span class="font-semibold">Applied: </span>
        <span>{{ isApplied ? "Yes" : "No" }}</span>
      </div>
      
      <div v-if="latestAssessment" class="text-sm text-white/90 space-y-1">
        <div>
          <span>Latest Assessment: </span>
          <span>{{ formatDateTime(latestAssessment.date) }}</span>
        </div>
        <div>
          <span>Round: </span>
          <span>{{ latestAssessment.round || "N/A" }}</span>
        </div>
        <div>
          <span>Type: </span>
          <span>{{ getAssessmentTypeLabel(latestAssessment.assessment_type) }}</span>
        </div>
        <div>
          <span>Completed: </span>
          <span :class="latestAssessment.completed ? 'text-green-400' : 'text-orange-600'">
            {{ latestAssessment.completed ? "Yes" : "No" }}
          </span>
        </div>
      </div>
      
      <div v-else class="text-sm text-white/90 italic">
        No assessments scheduled
      </div>
      
      <div v-if="item.applied_date" class="text-sm text-white/90">
        <span>Applied: </span>
        <span>{{ formatDate(item.applied_date) }}</span>
      </div>
      
      <p v-if="item.rejected" class="text-sm text-red-600 mt-2 font-semibold">
        Rejected
      </p>
    </div>
  </div>
</template>

