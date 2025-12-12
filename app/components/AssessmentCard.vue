<script setup lang="ts">
import useDateFormat from "~/composables/useDateFormat";
import { getAssessmentTypeLabel } from "~/utils/assessmentTypes";
import TextDisplay from "~/components/TextDisplay.vue";
import ActionButtons from "~/components/UI/ActionButtons.vue";
import useApi from "~/composables/useApi";
import useContext from "~/context/tempcontext";
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
const context = useContext();

// Local state for optimistic update
const completed = ref(props.item.assessment.completed || false);

// Sync with props changes
watch(() => props.item.assessment.completed, (newValue) => {
  completed.value = newValue || false;
}, { immediate: true });

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

const handleToggleCompleted = async (event: Event) => {
  event.stopPropagation();
  
  if (!props.item.assessment.id) return;
  
  const newCompleted = !completed.value;
  
  // Optimistic update
  completed.value = newCompleted;
  
  try {
    const assessmentData = {
      position_id: props.item.assessment.position_id || undefined,
      date: props.item.assessment.date ? new Date(props.item.assessment.date).toISOString() : undefined,
      round: props.item.assessment.round || undefined,
      assessment_type: props.item.assessment.assessment_type || undefined,
      pre_notes: props.item.assessment.pre_notes || undefined,
      post_notes: props.item.assessment.post_notes || undefined,
      completed: newCompleted,
    };
    
    const result = await useApi.updateAssessment(props.item.assessment.id, assessmentData);
    
    if (result.error) {
      // Revert on error
      completed.value = !newCompleted;
      console.error("Error updating assessment:", result.error);
      return;
    }
    
    // Refresh data to sync with server
    await context.loadUserData();
  } catch (e) {
    // Revert on error
    completed.value = !newCompleted;
    console.error("Error toggling assessment completed status:", e);
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
      </div>
      <ActionButtons size="sm" @edit="emit('edit', item)" @delete="emit('delete', item)" />
    </div>
    
    <div class="space-y-2">
      <div class="flex items-center gap-2 text-sm mb-2">
        <span>{{ assessmentTitle }}</span>
        <label 
          @click.stop
          class="flex items-center gap-1 cursor-pointer"
        >
          <span v-if="!completed" class="text-white/90">Completed?</span>
          <input
            type="checkbox"
            :checked="completed"
            @change="handleToggleCompleted"
            class="w-4 h-4 cursor-pointer"
          />
          <span v-if="completed" class="text-green-400">Completed.</span>
        </label>
      </div>
      
      <div class="flex items-center gap-2 mb-2">
        <span class="px-2 py-1 bg-white/20 text-white/80 rounded text-xs">
          [{{ item.position.company_name || "Unknown Company" }}]
        </span>
        <span class="px-2 py-1 bg-white/20 text-white/80 rounded text-xs">
          [{{ item.position.position_name || "Untitled Position" }}]
        </span>
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

