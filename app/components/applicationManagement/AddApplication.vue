<script setup lang="ts">
import useApi from "~/composables/useApi";
import useContext from "~/context/tempcontext";
import type { ApplicationInput, PositionInput } from "~/assets/types/database";

const props = defineProps<{
  stateManagementReference?: {
    addApplicationShown: Ref<boolean | null>;
  };
}>();

const context = useContext();

const fieldTitleStyle = "cursor-default flex-2 overflow-hidden";
const fieldPlaceholder = "_____________________________________";

// Position fields
const companyName = ref("");
const positionName = ref("");
const location = ref("");
const appliedDeadline = ref("");
const appliedDate = ref("");
const companyNotes = ref("");
const rejected = ref(false);

// Application fields (progressive disclosure)
const hasApplied = ref(false);
const applicationNotes = ref("");

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

    // Step 1: Create Position
    const positionData: PositionInput = {
      user_id: userId,
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

    const positionResult = await useApi.createPosition(positionData);

    if (positionResult.error) {
      error.value = positionResult.error.error;
      console.error("Position creation error:", positionResult.error);
      isSubmitting.value = false;
      return;
    }

    // Check if we have data
    if (!positionResult.data) {
      console.error("Position creation returned no data:", positionResult);
      error.value = "Failed to create position: No data returned from server";
      isSubmitting.value = false;
      return;
    }

    // Log the full response structure for debugging
    console.log("Position creation result:", positionResult);
    console.log("Position data object:", JSON.stringify(positionResult.data, null, 2));
    console.log("Position data keys:", Object.keys(positionResult.data));
    
    // Try different possible ID field names (case-insensitive check)
    const data = positionResult.data as any;
    const positionId = positionResult.data?.id || data?.ID || data?.Id;
    
    if (!positionId) {
      // If no ID in response but position was created, we might need to fetch it
      // OR the backend isn't returning the ID (which is a backend issue)
      console.error("Position created but no ID found in response. Full data:", JSON.stringify(positionResult.data, null, 2));
      error.value = "Position may have been created, but no ID was returned. Please refresh and check your positions.";
      isSubmitting.value = false;
      return;
    }

    console.log("Position created successfully with ID:", positionId);

    // Step 2: Create Application if checkbox is checked
    if (hasApplied.value) {
      console.log("Creating application for position:", positionId);
      const applicationData: ApplicationInput = {
        user_id: userId,
        position_id: positionId,
        notes: applicationNotes.value || undefined,
      };

      console.log("Application data:", applicationData);

      const applicationResult = await useApi.createApplication(applicationData);

      console.log("Application creation result:", applicationResult);

      if (applicationResult.error) {
        // Position was created but Application failed
        error.value = `Position created but application failed: ${applicationResult.error.error}`;
        console.error("Application creation error:", applicationResult.error);
        isSubmitting.value = false;
        return;
      }

      console.log("Application created successfully with ID:", applicationResult.data?.id);
    } else {
      console.log("Application checkbox not checked, skipping application creation");
    }

    // Success - refresh data and navigate back
    await context.loadUserData();
    navigateTo("/");
  } catch (e) {
    error.value =
      e instanceof Error ? e.message : "Failed to create position/application";
    console.error("Error creating position/application:", e);
    isSubmitting.value = false;
  }
};

const closeModal = () => {
  if (props.stateManagementReference) {
    // Legacy support for when used in DashboardView
    props.stateManagementReference.addApplicationShown.value = false;
  } else {
    // Navigate back to dashboard when used as a page
    navigateTo("/");
  }
};
</script>

<template>
  <form @submit.prevent="submitApplication" class="text-white/80">
    <div class="flex flex-row">
      <div class="flex-2">
      <h1 class="text-4xl font-bold mb-2">ADD JOB APPLICATION</h1>
      <p class="text-sm  mb-2">
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

    <!-- Position Details Section -->
    <h2 class="text-2xl font-bold mb-4">POSITION DETAILS</h2>

    <div class="grid grid-cols-[200px_300px] gap-4 mb-2">
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
      <input
        class="w-full"
        v-model="companyNotes"
        type="text"
        :placeholder="fieldPlaceholder"
      />

      <p :class="fieldTitleStyle">Rejected:</p>
      <div class="flex items-center">
        <input
          type="checkbox"
          v-model="rejected"
          class="w-5 h-5 cursor-pointer"
        />
        <span class="ml-2 text-sm">Mark as rejected</span>
      </div>
    </div>

    <!-- Progressive Disclosure: Application Section -->
    <div class="mt-6 mb-4">
      <div class="flex items-center mb-4">
        <input
          type="checkbox"
          v-model="hasApplied"
          id="hasApplied"
          class="w-5 h-5 cursor-pointer"
        />
        <label for="hasApplied" class="ml-2 text-lg font-semibold cursor-pointer">
          I have applied to this position
        </label>
      </div>

      <!-- Application Details (shown when checkbox is checked) -->
      <div
        v-if="hasApplied"
        class="transition-all duration-300 overflow-hidden"
        :class="hasApplied ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'"
      >
        <hr class="border-black/50 border-rounded-full border-2 mb-4" />
        <h2 class="text-2xl font-bold mb-4">APPLICATION DETAILS</h2>

        <div class="grid grid-cols-[200px_300px] gap-4 mb-2">
          <p :class="fieldTitleStyle">Application Notes:</p>
          <textarea
            class="w-full min-h-[100px] resize-y whitespace-pre-wrap border border-transparent outline-none"
            v-model="applicationNotes"
            :placeholder="fieldPlaceholder"
            @keydown.enter.stop
          />
        </div>
      </div>
    </div>

    <div
      v-if="error"
      class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded"
    >
      {{ error }}
    </div>

  </form>
</template>
