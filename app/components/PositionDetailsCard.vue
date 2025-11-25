<script setup lang="ts">
import useDateFormat from "~/composables/useDateFormat";
import TextDisplay from "~/components/TextDisplay.vue";
import type { Position, Application, Assessment } from "~/assets/types/database";

interface Props {
  position: Position;
  application?: Application | null;
  positionAssessments?: Assessment[];
}

const props = defineProps<Props>();

const { formatDate } = useDateFormat();

const positionStatus = computed(() => {
  if (props.position.rejected) {
    return { label: "Rejected", class: "bg-red-100 text-red-800" };
  }
  // Note: PositionDetailsCard doesn't receive offer prop, so we check position.offer if available
  if ((props.position as any).offer) {
    return { label: "Offer", class: "bg-green-100 text-green-800" };
  }
  if (props.positionAssessments && props.positionAssessments.length > 0) {
    return { label: "Interviewing", class: "bg-orange-100 text-orange-800" };
  }
  if (props.application) {
    return { label: "Applied", class: "bg-blue-100 text-blue-800" };
  }
  return { label: "Saved", class: "bg-gray-100 text-gray-800" };
});
</script>

<template>
  <div v-if="position" class="glass-card bg-white/20 p-6 rounded-lg">
    <h2 class="text-2xl font-bold text-white/90 mb-6">Position & Company</h2>
    
    <div class="space-y-4 text-white/90">
      <div>
        <h3 class="text-xl font-semibold mb-2">
          {{ position.position_name || "Untitled Position" }}
        </h3>
        <p class="text-lg text-white/80 mb-4">
          {{ position.company_name || "Unknown Company" }}
        </p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <span class="font-semibold">Location: </span>
          <span>{{ position.location || "Not specified" }}</span>
        </div>
        
        <div v-if="position.applied_date">
          <span class="font-semibold">Applied Date: </span>
          <span>{{ formatDate(position.applied_date) }}</span>
        </div>
        
        <div v-if="position.applied_deadline">
          <span class="font-semibold">Application Deadline: </span>
          <span>{{ formatDate(position.applied_deadline) }}</span>
        </div>
        
        <div>
          <span class="font-semibold">Status: </span>
          <span
            :class="[
              'px-2 py-1 rounded-full text-xs font-medium',
              positionStatus.class,
            ]"
          >
            {{ positionStatus.label }}
          </span>
        </div>
        
        <div v-if="position.company_notes" class="md:col-span-2">
          <span class="font-semibold">Company Notes: </span>
          <div class="mt-1 text-white/70">
            <TextDisplay :text="position.company_notes" title="Company Notes" />
          </div>
        </div>
      </div>
      
      <div v-if="position.id" class="mt-4">
        <button
          @click="navigateTo(`/position/${position.id}`)"
          class="px-4 py-2 glass-card text-white rounded hover:bg-white/50 transition-colors"
        >
          View Full Position Details &#8669
        </button>
      </div>
    </div>
  </div>
</template>

