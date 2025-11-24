<script setup lang="ts">
import useApi from "~/composables/useApi";
import useContext from "~/context/tempcontext";
import type { InterviewInput, InterviewWithPosition } from "~/assets/types/database";

interface Props {
  item: InterviewWithPosition | null;
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

// Interview fields
const date = ref("");
const round = ref<number | null>(null);
const notes = ref("");
const completed = ref(false);

const error = ref<string | null>(null);
const isSubmitting = ref(false);

watch(
  () => props.item,
  (newItem) => {
    if (newItem?.interview) {
      const interview = newItem.interview;
      date.value = interview.date
        ? new Date(interview.date).toISOString().slice(0, 16)
        : "";
      round.value = interview.round || null;
      notes.value = interview.notes || "";
      completed.value = interview.completed || false;
    }
  },
  { immediate: true }
);

const submitInterview = async (event?: Event) => {
  if (event) {
    event.preventDefault();
  }

  if (isSubmitting.value || !props.item?.interview.id) return;

  isSubmitting.value = true;
  error.value = null;

  try {
    const interviewData: InterviewInput = {
      position_id: props.item.interview.position_id,
      date: date.value ? new Date(date.value).toISOString() : undefined,
      round: round.value || undefined,
      notes: notes.value || undefined,
      completed: completed.value || undefined,
    };

    const result = await useApi.updateInterview(
      props.item.interview.id,
      interviewData
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
      e instanceof Error ? e.message : "Failed to update interview";
    console.error("Error updating interview:", e);
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
        <form @submit.prevent="submitInterview" class="text-white/80">
          <div class="flex flex-row justify-between items-start mb-4">
            <h1 class="text-4xl font-bold text-white/80">EDIT INTERVIEW</h1>
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

            <p :class="fieldTitleStyle">Notes:</p>
            <textarea
              class="w-full min-h-[100px] resize-y whitespace-pre-wrap border border-transparent outline-none"
              v-model="notes"
              :placeholder="fieldPlaceholder"
              @keydown.enter.stop
            />

            <p :class="fieldTitleStyle">Completed:</p>
            <div class="flex items-center">
              <input
                type="checkbox"
                v-model="completed"
                class="w-5 h-5 cursor-pointer"
              />
              <span class="ml-2 text-sm text-white/80">Mark as completed</span>
            </div>
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
  </Teleport>
</template>

