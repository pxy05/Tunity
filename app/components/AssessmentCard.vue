<script setup lang="ts">
import TextDisplay from "~/components/TextDisplay.vue";
import type { AssessmentWithPosition } from "~/assets/types/database";

interface Props {
  item: AssessmentWithPosition;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  edit: [item: AssessmentWithPosition];
  delete: [item: AssessmentWithPosition];
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

const assessmentTitle = computed(() => {
  const round = props.item.assessment.round || "N/A";
  const typeLabel = getAssessmentTypeLabel(props.item.assessment.assessment_type);
  return `Round ${round} - ${typeLabel}`;
});

const handleEdit = () => {
  emit("edit", props.item);
};

const handleDelete = () => {
  emit("delete", props.item);
};

const handleCardClick = () => {
  if (props.item.assessment.id) {
    navigateTo(`/assessment/${props.item.assessment.id}`);
  }
};
</script>

<template>
  <div @click="handleCardClick" class="cursor-pointer">
    <div class="flex justify-between items-start mb-2">
      <div class="flex-1">
        <h3 class="text-xl font-bold text-white/80">
          {{ item.position.position_name || "Untitled Position" }}
        </h3>
        <p class="text-lg text-white/80 mb-2">
          {{ item.position.company_name || "Unknown Company" }}
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
      <div class="flex items-center gap-2 text-sm">
        <span>{{ assessmentTitle }}</span>
        <button
          @click.stop="handleEdit"
          :class="[
            'px-2 py-1 rounded-full text-xs font-medium transition-colors',
            item.assessment.completed
              ? 'bg-green-100 text-green-800 hover:bg-green-200'
              : 'bg-orange-100 text-orange-800 hover:bg-orange-200',
          ]"
        >
          {{ item.assessment.completed ? "Completed" : "Uncompleted" }}
        </button>
      </div>
      
      <div class="text-sm">
        <span>Date: </span>
        <span>{{ formatDateTime(item.assessment.date) }}</span>
      </div>
      
      <div v-if="item.assessment.pre_notes" class="text-sm mt-2">
        <p class="font-semibold">Pre-notes: </p>
        <TextDisplay :text="item.assessment.pre_notes" title="Pre-notes" :max-length="150" />
      </div>
      
      <div v-if="item.assessment.post_notes" class="text-sm mt-2">
        <p class="font-semibold">Post-notes: </p>
        <TextDisplay :text="item.assessment.post_notes" title="Post-notes" :max-length="150" />
      </div>
      
      <div v-if="item.position.location" class="text-sm">
        <span>Location: </span>
        <span>{{ item.position.location }}</span>
      </div>
    </div>
  </div>
</template>

