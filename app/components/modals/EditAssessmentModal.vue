<script setup lang="ts">
import useApi from "~/composables/useApi";
import useContext from "~/context/tempcontext";
import { getAssessmentTypeLabel } from "~/utils/assessmentTypes";
import type { AssessmentInput, AssessmentWithPosition } from "~/assets/types/database";

interface Props {
  item: AssessmentWithPosition | null;
  isOpen: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  close: [];
  saved: [];
}>();

const context = useContext();

const fieldTitleStyle = "cursor-default text-white/80 flex-2 overflow-hidden";
const fieldPlaceholder = "_____________________________________";

// Assessment fields
const date = ref("");
const round = ref<number | null>(null);
const assessmentType = ref<string>("");
const preNotes = ref("");
const postNotes = ref("");
const completed = ref(false);

// Post-notes modal state
const showPostNotesModal = ref(false);
const pendingPostNotes = ref("");

const assessmentTypeOptions = [
  { value: "in_person_interview", label: "In-Person Interview" },
  { value: "online_interview", label: "Online Interview" },
  { value: "assessment_center", label: "Assessment Center" },
  { value: "hirevue", label: "Hirevue" },
  { value: "online_assessment", label: "Online Assessment" },
];

const error = ref<string | null>(null);
const isSubmitting = ref(false);

watch(
  () => props.item,
  (newItem) => {
    if (newItem?.assessment) {
      const assessment = newItem.assessment;
      date.value = assessment.date
        ? new Date(assessment.date).toISOString().slice(0, 16)
        : "";
      round.value = assessment.round || null;
      assessmentType.value = assessment.assessment_type || "";
      preNotes.value = assessment.pre_notes || "";
      postNotes.value = assessment.post_notes || "";
      completed.value = assessment.completed || false;
    }
  },
  { immediate: true }
);

const toggleCompleted = () => {
  const newCompleted = !completed.value;
  
  // If toggling to completed and post_notes is empty, show modal
  if (newCompleted && !postNotes.value) {
    pendingPostNotes.value = "";
    showPostNotesModal.value = true;
  } else {
    // Otherwise, just toggle
    completed.value = newCompleted;
  }
};

const handlePostNotesModalConfirm = () => {
  postNotes.value = pendingPostNotes.value;
  completed.value = true;
  showPostNotesModal.value = false;
  pendingPostNotes.value = "";
};

const handlePostNotesModalCancel = () => {
  // Still toggle to completed even if user cancels modal
  completed.value = true;
  showPostNotesModal.value = false;
  pendingPostNotes.value = "";
};

const submitAssessment = async (event?: Event) => {
  if (event) {
    event.preventDefault();
  }

  if (isSubmitting.value || !props.item?.assessment.id) return;

  isSubmitting.value = true;
  error.value = null;

  try {
    const assessmentData: AssessmentInput = {
      position_id: props.item.assessment.position_id,
      date: date.value ? new Date(date.value).toISOString() : undefined,
      round: round.value || undefined,
      assessment_type: assessmentType.value as AssessmentInput["assessment_type"],
      pre_notes: preNotes.value || undefined,
      post_notes: postNotes.value || undefined,
      completed: completed.value || undefined,
    };

    const result = await useApi.updateAssessment(
      props.item.assessment.id,
      assessmentData
    );

    if (result.error) {
      error.value = result.error.error;
      isSubmitting.value = false;
      return;
    }

    await context.loadUserData();
    emit("saved");
    emit("close");
  } catch (e) {
    error.value =
      e instanceof Error ? e.message : "Failed to update assessment";
    console.error("Error updating assessment:", e);
    isSubmitting.value = false;
  }
};

const closeModal = () => {
  error.value = null;
  emit("close");
};
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      @click.self="closeModal"
    >
      <div
        class="glass-card-modal p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto mx-4"
        @click.stop
      >
        <form @submit.prevent="submitAssessment" class="text-white/80">
          <div class="flex flex-row justify-between items-start mb-4">
            <h1 class="text-4xl font-bold text-white/80">EDIT ASSESSMENT</h1>
            <button
              type="button"
              @click="closeModal"
              class="text-2xl font-bold text-white/80 hover:text-black"
            >
              ×
            </button>
          </div>

          <div v-if="item" class="mb-4 text-sm text-white/80">
            <p>
              <span class="font-semibold">Position:</span>
              {{ item.position.position_name || "Untitled Position" }}
            </p>
            <p>
              <span class="font-semibold">Company:</span>
              {{ item.position.company_name || "Unknown Company" }}
            </p>
          </div>

          <hr class="border-black/50 border-rounded-full border-2 mb-4" />

          <div class="grid grid-cols-[200px_300px] gap-4 mb-2">
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

            <p :class="fieldTitleStyle">Post-notes:</p>
            <textarea
              class="w-full min-h-[100px] resize-y whitespace-pre-wrap border border-transparent outline-none"
              v-model="postNotes"
              :placeholder="fieldPlaceholder"
              @keydown.enter.stop
            />

            <p :class="fieldTitleStyle">Status:</p>
            <button
              type="button"
              @click="toggleCompleted"
              :class="[
                'px-4 py-2 rounded-full text-sm font-medium transition-colors',
                completed
                  ? 'bg-green-100 text-green-800 hover:bg-green-200'
                  : 'bg-orange-100 text-orange-800 hover:bg-orange-200',
              ]"
            >
              {{ completed ? "Completed" : "Uncompleted" }}
            </button>
          </div>

          <div
            v-if="error"
            class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded"
          >
            {{ error }}
          </div>

          <div class="flex gap-4 justify-end mt-6">
            <button
              type="button"
              class="cursor-pointer glass-ui px-6 py-2 ui-button-compress"
              @click="closeModal"
              :disabled="isSubmitting"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="cursor-pointer glass-ui px-6 py-2 ui-button-compress"
              :disabled="isSubmitting"
            >
              {{ isSubmitting ? "Saving..." : "Save" }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Post-notes Modal -->
    <Teleport to="body">
      <div
        v-if="showPostNotesModal"
        class="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm"
        @click.self="handlePostNotesModalCancel"
      >
        <div
          class="glass-card-modal p-6 max-w-md w-full mx-4"
          @click.stop
        >
          <div class="text-white/80">
            <div class="flex flex-row justify-between items-start mb-4">
              <h2 class="text-2xl font-bold text-white/80">Add Post-Assessment Notes</h2>
              <button
                type="button"
                @click="handlePostNotesModalCancel"
                class="text-2xl font-bold text-white/80 hover:text-black"
              >
                ×
              </button>
            </div>

            <hr class="border-black/50 border-rounded-full border-2 mb-4" />

            <div class="mb-6">
              <p class="text-sm text-white/80 mb-4">
                Would you like to add post-assessment notes? This is optional.
              </p>
              
              <textarea
                v-model="pendingPostNotes"
                class="w-full min-h-[150px] p-2 border border-transparent rounded focus:border-blue-500 focus:outline-none text-white/80 bg-white/10 placeholder:text-white/50 resize-y whitespace-pre-wrap"
                placeholder="Enter post-assessment notes (optional)..."
                @keydown.enter.stop
              />
            </div>

            <div class="flex gap-4 justify-end">
              <button
                type="button"
                class="cursor-pointer glass-ui px-6 py-2 ui-button-compress"
                @click="handlePostNotesModalCancel"
              >
                Skip
              </button>
              <button
                type="button"
                class="cursor-pointer glass-ui px-6 py-2 ui-button-compress"
                @click="handlePostNotesModalConfirm"
              >
                Add Notes
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </Teleport>
</template>

