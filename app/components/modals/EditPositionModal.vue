<script setup lang="ts">
import useApi from "~/composables/useApi";
import useContext from "~/context/tempcontext";
import type { PositionInput, PositionWithApplication } from "~/assets/types/database";

interface Props {
  position: PositionWithApplication | null;
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

// Position fields
const companyName = ref("");
const positionName = ref("");
const location = ref("");
const appliedDeadline = ref("");
const appliedDate = ref("");
const companyNotes = ref("");
const rejected = ref(false);

const error = ref<string | null>(null);
const isSubmitting = ref(false);

watch(
  () => props.position,
  (newPosition) => {
    if (newPosition) {
      companyName.value = newPosition.company_name || "";
      positionName.value = newPosition.position_name || "";
      location.value = newPosition.location || "";
      appliedDeadline.value = newPosition.applied_deadline
        ? new Date(newPosition.applied_deadline).toISOString().split("T")[0]
        : "";
      appliedDate.value = newPosition.applied_date
        ? new Date(newPosition.applied_date).toISOString().split("T")[0]
        : "";
      companyNotes.value = newPosition.company_notes || "";
      rejected.value = newPosition.rejected || false;
    }
  },
  { immediate: true }
);

const submitPosition = async (event?: Event) => {
  if (event) {
    event.preventDefault();
  }

  if (isSubmitting.value || !props.position?.id) return;

  isSubmitting.value = true;
  error.value = null;

  try {
    const positionData: PositionInput = {
      user_id: props.position.user_id,
      company_name: companyName.value || undefined,
      position_name: positionName.value || undefined,
      location: location.value || undefined,
      applied_deadline: appliedDeadline.value
        ? new Date(appliedDeadline.value).toISOString()
        : undefined,
      applied_date: appliedDate.value
        ? new Date(appliedDate.value).toISOString()
        : undefined,
      company_notes: companyNotes.value || undefined,
      rejected: rejected.value || undefined,
    };

    const result = await useApi.updatePosition(props.position.id, positionData);

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
      e instanceof Error ? e.message : "Failed to update position";
    console.error("Error updating position:", e);
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
        <form @submit.prevent="submitPosition" class="text-white/80">
          <div class="flex flex-row justify-between items-start mb-4">
            <h1 class="text-4xl font-bold text-white/80">EDIT POSITION</h1>
            <button
              type="button"
              @click="closeModal"
              class="text-2xl font-bold text-white/80 hover:text-black"
            >
              ×
            </button>
          </div>

          <hr class="border-black/50 border-rounded-full border-2 mb-4" />

          <div class="grid grid-cols-[200px_300px] gap-4 mb-2 text-white/80">
            <p :class="fieldTitleStyle">Company Name*:</p>
            <input
              class="w-full"
              v-model="companyName"
              type="text"
              :placeholder="fieldPlaceholder"
              required
            />

            <p :class="fieldTitleStyle">Position Name*:</p>
            <input
              class="w-full"
              v-model="positionName"
              type="text"
              :placeholder="fieldPlaceholder"
              required
            />

            <p :class="fieldTitleStyle">Location:</p>
            <input
              class="w-full"
              v-model="location"
              type="text"
              :placeholder="fieldPlaceholder"
            />

            <p :class="fieldTitleStyle">Applied Date:</p>
            <input
              class="w-full"
              v-model="appliedDate"
              type="date"
              :placeholder="fieldPlaceholder"
            />

            <p :class="fieldTitleStyle">Application Deadline:</p>
            <input
              class="w-full"
              v-model="appliedDeadline"
              type="date"
              :placeholder="fieldPlaceholder"
            />

            <p :class="fieldTitleStyle">Company Notes:</p>
            <textarea
              class="w-full min-h-[100px] resize-y whitespace-pre-wrap border border-transparent outline-none"
              v-model="companyNotes"
              :placeholder="fieldPlaceholder"
              @keydown.enter.stop
            />

            <p :class="fieldTitleStyle">Rejected:</p>
            <div class="flex items-center">
              <input
                type="checkbox"
                v-model="rejected"
                class="w-5 h-5 cursor-pointer"
              />
              <span class="ml-2 text-sm text-white/80">Mark as rejected</span>
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

