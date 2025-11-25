<script setup lang="ts">
import useApi from "~/composables/useApi";
import type { Application, ApplicationInput, Position } from "~/assets/types/database";

interface Props {
  application: Application | null;
  position: Position | null;
  isOpen: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  close: [];
  saved: [];
}>();

const fieldTitleStyle = "cursor-default text-white/80 flex-2 overflow-hidden";
const fieldPlaceholder = "_____________________________________";

// Application fields
const notes = ref("");
const appliedDate = ref("");

const error = ref<string | null>(null);
const isSubmitting = ref(false);

watch(
  () => [props.application, props.position],
  ([newApplication, newPosition]) => {
    if (newApplication) {
      notes.value = newApplication.notes || "";
    }
    if (newPosition?.applied_date) {
      // Convert ISO date to local date format for input
      const date = new Date(newPosition.applied_date);
      appliedDate.value = date.toISOString().slice(0, 10);
    } else {
      appliedDate.value = "";
    }
  },
  { immediate: true }
);

const submitApplication = async (event?: Event) => {
  if (event) {
    event.preventDefault();
  }

  if (isSubmitting.value || !props.application?.id) return;

  isSubmitting.value = true;
  error.value = null;

  try {
    const userId = useSupabaseUser().value?.id;
    if (!userId) {
      error.value = "User not authenticated";
      isSubmitting.value = false;
      return;
    }

    // Update application
    const applicationData: ApplicationInput = {
      user_id: props.application.user_id,
      position_id: props.application.position_id,
      notes: notes.value || undefined,
    };

    const result = await useApi.updateApplication(
      props.application.id,
      applicationData
    );

    if (result.error) {
      error.value = result.error.error;
      console.error("Application update error:", result.error);
      isSubmitting.value = false;
      return;
    }

    // Update position's applied_date if provided and position exists
    if (props.position?.id) {
      const positionUpdateData: any = {
        user_id: userId,
      };
      
      if (appliedDate.value) {
        positionUpdateData.applied_date = new Date(appliedDate.value).toISOString();
      } else {
        // If date is cleared, set to null/undefined
        positionUpdateData.applied_date = null;
      }

      const positionResult = await useApi.updatePosition(
        props.position.id,
        positionUpdateData
      );

      if (positionResult.error) {
        console.warn("Failed to update applied_date:", positionResult.error);
        // Don't fail the whole operation if position update fails
      }
    }

    // Success - close modal and refresh
    emit("saved");
    closeModal();
  } catch (e) {
    error.value =
      e instanceof Error ? e.message : "Failed to update application";
    console.error("Error updating application:", e);
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
        class="glass-card-modal p-8 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        @click.stop
      >
        <form @submit.prevent="submitApplication" class="text-white/80">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-3xl font-bold">Edit Application</h2>
            <button
              type="button"
              @click="closeModal"
              class="text-white/80 hover:text-white text-2xl font-bold"
            >
              ×
            </button>
          </div>

          <div class="space-y-4">
            <div class="grid grid-cols-[200px_1fr] gap-4">
              <p :class="fieldTitleStyle">Applied Date:</p>
              <input
                class="w-full bg-white/10 text-white/80 placeholder:text-white/50 rounded p-2 border border-transparent outline-none"
                v-model="appliedDate"
                type="date"
                :placeholder="fieldPlaceholder"
              />
            </div>
            <div class="grid grid-cols-[200px_1fr] gap-4">
              <p :class="fieldTitleStyle">Application Notes:</p>
              <textarea
                class="w-full min-h-[150px] resize-y whitespace-pre-wrap border border-transparent outline-none bg-white/10 text-white/80 placeholder:text-white/50 rounded p-2"
                v-model="notes"
                :placeholder="fieldPlaceholder"
                @keydown.enter.stop
              />
            </div>
          </div>

          <div
            v-if="error"
            class="mt-4 p-3 bg-red-500/20 border border-red-400/40 text-red-200 rounded"
          >
            {{ error }}
          </div>

          <div class="flex justify-end gap-4 mt-6">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 bg-white/20 text-white rounded hover:bg-white/30 border border-white/30 transition-colors"
              :disabled="isSubmitting"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-500/20 text-white rounded hover:bg-blue-500/30 border border-blue-400/40 transition-colors"
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

