<script setup lang="ts">
import useDateFormat from "~/composables/useDateFormat";
import { getAssessmentTypeLabel } from "~/utils/assessmentTypes";
import TextDisplay from "~/components/TextDisplay.vue";
import ActionButtons from "~/components/UI/ActionButtons.vue";
import type { AssessmentWithPosition } from "~/assets/types/database";

interface Props {
  item: AssessmentWithPosition;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  edit: [item: AssessmentWithPosition];
  delete: [item: AssessmentWithPosition];
}>();

const { formatDateTime } = useDateFormat();

const assessmentTitle = computed(() => {
  const round = props.item.assessment.round || "N/A";
  const typeLabel = getAssessmentTypeLabel(props.item.assessment.assessment_type);
  return `Round ${round} - ${typeLabel}`;
});


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
      <ActionButtons size="sm" @edit="emit('edit', item)" @delete="emit('delete', item)" />
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

