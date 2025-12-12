<script setup lang="ts">
import useApi from "~/composables/useApi";
import useContext from "~/context/tempcontext";
import type { AssessmentInput, PositionWithApplication } from "~/assets/types/database";

const props = defineProps<{
  stateManagementReference?: {
    addAssessmentShown: Ref<boolean | null>;
  };
  preselectedPositionId?: string;
}>();

const context = useContext();

const fieldTitleStyle = "cursor-default text-white/80 flex-2 overflow-hidden";
const fieldPlaceholder = "_____________________________________";

// Assessment fields
const selectedPositionId = ref<string>(props.preselectedPositionId || "");
const date = ref("");
const round = ref<number | null>(null);
const assessmentType = ref<string>("");
const preNotes = ref("");
const completed = ref(false);

const assessmentTypeOptions = [
  { value: "in_person_interview", label: "In-Person Interview" },
  { value: "online_interview", label: "Online Interview" },
  { value: "assessment_center", label: "Assessment Center" },
  { value: "hirevue", label: "Hirevue" },
  { value: "online_assessment", label: "Online Assessment" },
];

const error = ref<string | null>(null);
const isSubmitting = ref(false);

// Get available positions for dropdown
const availablePositions = computed(() => {
  if (!context.userItems?.value) return [];
  return context.userItems.value.filter((item) => item != null && item.id != null);
});

// Watch for preselected position changes
watch(() => props.preselectedPositionId, (newId) => {
  if (newId) {
    selectedPositionId.value = newId;
  }
}, { immediate: true });

const submitAssessment = async (event?: Event) => {
  if (event) {
    event.preventDefault();
  }

  if (isSubmitting.value) return;

  if (!selectedPositionId.value) {
    error.value = "Please select a position";
    return;
  }

  if (!date.value) {
    error.value = "Please select a date and time";
    return;
  }

  if (!assessmentType.value) {
    error.value = "Please select an assessment type";
    return;
  }

  isSubmitting.value = true;
  error.value = null;

  try {
    const assessmentData: AssessmentInput = {
      position_id: selectedPositionId.value,
      date: date.value ? new Date(date.value).toISOString() : undefined,
      round: round.value || undefined,
      assessment_type: assessmentType.value as AssessmentInput["assessment_type"],
      pre_notes: preNotes.value || undefined,
      completed: completed.value || undefined,
    };

    const result = await useApi.createAssessment(assessmentData);

    if (result.error) {
      error.value = result.error.error;
      console.error("Assessment creation error:", result.error);
      isSubmitting.value = false;
      return;
    }

    // Success - refresh data
    await context.loadUserData();
    
    // Close modal if used with stateManagementReference, otherwise navigate
    if (props.stateManagementReference) {
      props.stateManagementReference.addAssessmentShown.value = false;
    } else {
      navigateTo("/");
    }
  } catch (e) {
    error.value =
      e instanceof Error ? e.message : "Failed to create assessment";
    console.error("Error creating assessment:", e);
    isSubmitting.value = false;
  }
};

const closeModal = () => {
  if (props.stateManagementReference) {
    // Legacy support for when used in DashboardView
    props.stateManagementReference.addAssessmentShown.value = false;
  } else {
    // Navigate back to dashboard when used as a page
    navigateTo("/");
  }
};
</script>

<template>
  <form @submit.prevent="submitAssessment" class="text-white/80">
    <div class="flex flex-row">
      <div class="flex-2">
        <h1 class="text-4xl font-bold mb-2">ADD ASSESSMENT</h1>
        <p class="text-sm text-white/80 mb-2">
          Fields indicated with a * are <span class="font-bold">required.</span>
        </p>
      </div>
      <div class="grid grid-rows-2 justify-items-end gap-2 w-full flex-1 mb-4">
        <button
          type="submit"
          class="cursor-pointer glass-ui min-w-[33%] max-w-[33%] p-2 ui-button-compress"
          :disabled="isSubmitting"
        >
          {{ isSubmitting ? "Submitting..." : "Submit" }}
        </button>
        <button
          type="button"
          class="cursor-pointer glass-ui min-w-[33%] max-w-[33%] p-2 ui-button-compress"
          @click="closeModal"
          :disabled="isSubmitting"
        >
          Close
        </button>
      </div>
    </div>
    <hr class="border-black/50 border-rounded-full border-2 mb-4" />

    <!-- Assessment Details Section -->
    <h2 class="text-2xl font-bold mb-4">ASSESSMENT DETAILS</h2>

    <div class="grid grid-cols-[200px_300px] gap-4 mb-2">
      <p :class="fieldTitleStyle">Position*:</p>
      <select
        class="w-full white"
        v-model="selectedPositionId"
        required
      >
        <option value="">Select a position...</option>
        <option
          class="text-black"
          v-for="position in availablePositions"
          :key="position?.id"
          :value="position?.id"
        >
          {{ position?.company_name || "Unknown Company" }} - {{ position?.position_name || "Untitled Position" }}
        </option>
      </select>

      <p :class="fieldTitleStyle">Date & Time*:</p>
      <input
        class="w-full"
        v-model="date"
        type="datetime-local"
        :placeholder="fieldPlaceholder"
        required
      />

      <p :class="fieldTitleStyle">Round:</p>
      <input
        class="w-full"
        v-model.number="round"
        type="number"
        min="1"
        :placeholder="fieldPlaceholder"
      />

      <p :class="fieldTitleStyle">Assessment Type*:</p>
      <select
        class="w-full white"
        v-model="assessmentType"
        required
      >
        <option value="">Select assessment type...</option>
        <option
          class="text-black"
          v-for="option in assessmentTypeOptions"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>

      <p :class="fieldTitleStyle">Pre-notes:</p>
      <textarea
        class="w-full min-h-[100px] resize-y whitespace-pre-wrap border border-transparent outline-none"
        v-model="preNotes"
        :placeholder="fieldPlaceholder"
        @keydown.enter.stop
      />
    </div>

    <div
      v-if="error"
      class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded"
    >
      {{ error }}
    </div>
  </form>
</template>

