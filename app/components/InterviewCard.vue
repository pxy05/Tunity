<script setup lang="ts">
import useDateFormat from "~/composables/useDateFormat";
import TextDisplay from "~/components/TextDisplay.vue";
import ActionButtons from "~/components/UI/ActionButtons.vue";
import type { InterviewWithPosition } from "~/assets/types/database";

interface Props {
  item: InterviewWithPosition;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  edit: [item: InterviewWithPosition];
  delete: [item: InterviewWithPosition];
}>();

const { formatDateTime } = useDateFormat();


const handleCardClick = () => {
  if (props.item.interview.id) {
    navigateTo(`/interview/${props.item.interview.id}`);
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
        <span>Round {{ item.interview.round || "N/A" }}</span>
        <span
          :class="[
            'px-2 py-1 rounded-full text-xs font-medium',
            item.interview.completed
              ? 'bg-green-100 text-green-800'
              : 'bg-orange-100 text-orange-800',
          ]"
        >
          {{ item.interview.completed ? "Completed" : "Uncompleted" }}
        </span>
      </div>
      
      <div class="text-sm">
        <span>Date: </span>
        <span>{{ formatDateTime(item.interview.date) }}</span>
      </div>
      
      <div v-if="item.interview.notes" class="text-sm mt-2">
        <p class="font-semibold">Notes: </p>
        <TextDisplay :text="item.interview.notes" title="Interview Notes" :max-length="150" />
      </div>
      
      <div v-if="item.position.location" class="text-sm">
        <span>Location: </span>
        <span>{{ item.position.location }}</span>
      </div>
    </div>
  </div>
</template>
