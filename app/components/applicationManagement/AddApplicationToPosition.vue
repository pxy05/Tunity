<script setup lang="ts">
import useApi from "~/composables/useApi";
import type { ApplicationInput } from "~/assets/types/database";

interface Props {
  positionId: string;
}

const props = defineProps<Props>();

const applicationNotes = ref("");
const appliedDate = ref("");

const error = ref<string | null>(null);
const isSubmitting = ref(false);

const submitApplication = async (event?: Event) => {
  if (event) {
    event.preventDefault();
  }

  if (isSubmitting.value) return;

  isSubmitting.value = true;
  error.value = null;

  try {
    const userId = useSupabaseUser().value?.id;
    if (!userId) {
      error.value = "User not authenticated";
      isSubmitting.value = false;
      return;
    }

    const applicationData: ApplicationInput = {
      user_id: userId,
      position_id: props.positionId,
      notes: applicationNotes.value || undefined,
    };

    const applicationResult = await useApi.createApplication(applicationData);

    if (applicationResult.error) {
      error.value = applicationResult.error.error;
      console.error("Application creation error:", applicationResult.error);
      isSubmitting.value = false;
      return;
    }

    // Update position's applied_date if provided
    if (appliedDate.value) {
      const positionResult = await useApi.getPosition(props.positionId);
      if (positionResult.data) {
        const updateResult = await useApi.updatePosition(props.positionId, {
          user_id: userId,
          applied_date: new Date(appliedDate.value).toISOString(),
        });
        if (updateResult.error) {
          console.warn("Failed to update applied_date:", updateResult.error);
        }
      }
    }

    // Success - navigate back to position detail page
    navigateTo(`/position/${props.positionId}`);
  } catch (e) {
    error.value =
      e instanceof Error ? e.message : "Failed to create application";
    console.error("Error creating application:", e);
    isSubmitting.value = false;
  }
};

const closeForm = () => {
  navigateTo(`/position/${props.positionId}`);
};
</script>

<template>
  <form @submit.prevent="submitApplication" class="text-white/80">
    <div class="flex flex-row">
      <div class="flex-2">
        <h1 class="text-4xl font-bold mb-2">ADD APPLICATION</h1>
        <p class="text-sm mb-2">
          Add an application record for this position.
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
          @click="closeForm"
          :disabled="isSubmitting"
        >
          Cancel
        </button>
      </div>
    </div>
    <hr class="border-black/50 border-rounded-full border-2 mb-4" />

    <!-- Application Details Section -->
    <h2 class="text-2xl font-bold mb-4">APPLICATION DETAILS</h2>

    <div class="grid grid-cols-[200px_300px] gap-4 mb-2">
      <p class="cursor-default flex-2 overflow-hidden">Applied Date:</p>
      <input
        class="w-full"
        v-model="appliedDate"
        type="date"
        placeholder="_____________________________________"
      />

      <p class="cursor-default flex-2 overflow-hidden">Application Notes:</p>
      <textarea
        class="w-full min-h-[100px] resize-y whitespace-pre-wrap border border-transparent outline-none"
        v-model="applicationNotes"
        placeholder="_____________________________________"
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

