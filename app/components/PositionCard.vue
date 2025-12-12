<script setup lang="ts">
import useDateFormat from "~/composables/useDateFormat";
import { getAssessmentTypeLabel } from "~/utils/assessmentTypes";
import ActionButtons from "~/components/UI/ActionButtons.vue";
import AddAssessmentModal from "~/components/modals/AddAssessmentModal.vue";
import AddOfferModal from "~/components/modals/AddOfferModal.vue";
import useContext from "~/context/tempcontext";
import type {
  PositionWithApplication,
  Assessment,
} from "~/assets/types/database";

interface Props {
  item: PositionWithApplication;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  edit: [position: PositionWithApplication];
  delete: [position: PositionWithApplication];
}>();

const { formatDate, formatDateTime } = useDateFormat();
const context = useContext();

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

// Modal states
const showAddDropdown = ref(false);
const addAssessmentModalOpen = ref(false);
const addOfferModalOpen = ref(false);

const handleCardClick = () => {
  if (props.item.id) {
    navigateTo(`/position/${props.item.id}`);
  }
};

const toggleAddDropdown = (event: Event) => {
  event.stopPropagation();
  showAddDropdown.value = !showAddDropdown.value;
};

const handleAddAssessment = (event: Event) => {
  event.stopPropagation();
  showAddDropdown.value = false;
  addAssessmentModalOpen.value = true;
};

const handleAddOffer = (event: Event) => {
  event.stopPropagation();
  showAddDropdown.value = false;
  addOfferModalOpen.value = true;
};

const handleAssessmentModalClose = async () => {
  addAssessmentModalOpen.value = false;
  await context.loadUserData();
};

const handleOfferModalClose = async () => {
  addOfferModalOpen.value = false;
  await context.loadUserData();
};

// Close dropdown when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!target.closest(".add-dropdown-container")) {
    showAddDropdown.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
  <div @click="handleCardClick" class="cursor-pointer">
    <div
      class="flex justify-between items-start mb-2 relative add-dropdown-container"
    >
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
      <div class="flex items-center gap-2">
        <div class="relative">
          <button
            @click.stop="toggleAddDropdown"
            class="w-8 h-8 flex items-center justify-center bg-white/20 hover:bg-white/30 border border-white/30 rounded-[2px] text-white font-bold text-lg transition-colors cursor-pointer"
            title="Add Assessment or Offer"
          >
            +
          </button>
          <div
            v-if="showAddDropdown"
            class="absolute right-0 top-full mt-1 bg-white/90 backdrop-blur-sm rounded-[2px] shadow-lg z-50 min-w-[160px]"
            @click.stop
          >
            <button
              @click="handleAddAssessment"
              class="w-full text-left px-4 py-2 hover:bg-white/50 text-black text-sm transition-colors cursor-pointer"
            >
              Add Assessment
            </button>
            <button
              @click="handleAddOffer"
              class="w-full text-left px-4 py-2 hover:bg-white/50 text-black text-sm transition-colors cursor-pointer border-t border-black/10"
            >
              Add Offer
            </button>
          </div>
        </div>
        <ActionButtons
          size="sm"
          @edit="emit('edit', item)"
          @delete="emit('delete', item)"
        />
      </div>
    </div>

    <!-- Modals -->
    <AddAssessmentModal
      :is-open="addAssessmentModalOpen"
      :preselected-position-id="item.id"
      @close="handleAssessmentModalClose"
    />

    <AddOfferModal
      :is-open="addOfferModalOpen"
      :preselected-position-id="item.id"
      @close="handleOfferModalClose"
    />

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
          <span>{{
            getAssessmentTypeLabel(latestAssessment.assessment_type)
          }}</span>
        </div>
        <div>
          <span>Completed: </span>
          <span
            :class="
              latestAssessment.completed ? 'text-green-400' : 'text-orange-600'
            "
          >
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
