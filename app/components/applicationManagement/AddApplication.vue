<script setup lang="ts">
import useApi from "~/composables/useApi";
import type { Application } from "~/assets/types/database";
import DatePicker from "primevue/datepicker";
import { Form } from "@primevue/forms";
import Button from "primevue/button";

const props = defineProps<{
  stateManagementReference: {
    addApplicationShown: Ref<boolean | null>;
  };
}>();

const fieldTitleStyle = "cursor-default text-black/80 flex-2 overflow-hidden";
const fieldPlaceholder = "_____________________________________";

const applicationTitle = ref("");
const companyName = ref("");
const applicationStatus = ref("");
const applicationLocation = ref("");
const applicationLink = ref("");
const applicationAppliedDate = ref("");
const applicationNotes = ref("");

const application = computed(() => ({
  user_id: useSupabaseUser().value?.id || "",
  company: companyName.value,
  status: applicationStatus.value,
  appli_title: applicationTitle.value,
  appli_location: applicationLocation.value,
  appli_notes: applicationNotes.value,
  appli_url: applicationLink.value,
  appli_deadline: applicationAppliedDate.value,
}));
const error = ref<string | null>(null);

const appliedDateSubmitter = () => {};

const submitApplication = async () => {
  try {
    const result = await useApi.createApplication(application.value);
    if (result) {
      error.value = result;
      console.error("Error creating application:", result);
    }
  } catch (e) {
    error.value =
      e instanceof Error ? e.message : "Failed to create application";
    console.error("Error creating application:", e);
  }
};

const closeModal = () => {
  props.stateManagementReference.addApplicationShown.value = false;
};
</script>

<template>
  <div class="text-black">
    <h1 class="text-4xl font-bold mb-2">APPLICATION</h1>
    <p class="text-sm text-black/50 mb-2">
      Fields indicated with a * are <span class="font-bold">required.</span>
    </p>
    <hr class="border-black/50 border-rounded-full border-2 mb-4" />
    <h2 class="text-2xl font-bold mb-4">COMPANY DETAILS</h2>

    <div class="flex flex-col gap-4 mb-2">
      <div class="flex flex-row gap-2 ui-button-compress-slight">
        <p :class="fieldTitleStyle">Application Role Name:</p>
        <input
          class="flex-10"
          v-model="applicationTitle"
          type="text"
          :placeholder="fieldPlaceholder"
        />
      </div>

      <div class="flex flex-row gap-2 ui-button-compress-slight">
        <p :class="fieldTitleStyle">Company Name*:</p>
        <input
          class="flex-10"
          v-model="companyName"
          type="text"
          :placeholder="fieldPlaceholder"
        />
      </div>

      <div class="flex flex-row gap-2 ui-button-compress-slight">
        <p :class="fieldTitleStyle">Application Location:</p>
        <input
          class="flex-10"
          v-model="applicationLocation"
          type="text"
          :placeholder="fieldPlaceholder"
        />
      </div>

      <div class="flex flex-row gap-2 ui-button-compress-slight">
        <p :class="fieldTitleStyle">Application Link:</p>
        <input
          class="flex-10"
          v-model="applicationLink"
          type="text"
          :placeholder="fieldPlaceholder"
        />
      </div>

      <hr class="border-black/50 border-rounded-full border-2" />
      <h2 class="text-2xl font-bold">APPLICATION DETAILS</h2>

      <div class="flex flex-row gap-2 ui-button-compress-slight">
        <p :class="fieldTitleStyle">Application Applied Date:</p>
        <DatePicker
          v-model="applicationAppliedDate"
          dateFormat="dd/mm/yy"
          showIcon
          iconDisplay="input"
        />
        <Button label="Verify" />
      </div>

      <div class="flex flex-row gap-2 ui-button-compress-slight">
        <p :class="fieldTitleStyle">Application Notes:</p>
        <input
          class="flex-10"
          v-model="applicationNotes"
          type="text"
          :placeholder="fieldPlaceholder"
        />
      </div>

      <div class="flex flex-row gap-2 ui-button-compress-slight">
        <p :class="fieldTitleStyle">Application Status:</p>
        <input
          class="flex-10"
          v-model="applicationStatus"
          type="text"
          :placeholder="fieldPlaceholder"
        />
      </div>
    </div>
    <div class="grid grid-rows-2 justify-items-end gap-2 w-full">
      <button
        class="cursor-pointer glass-ui min-w-[33%] max-w-[33%] p-2 ui-button-compress"
        @click="submitApplication"
      >
        Submit
      </button>
      <button
        class="cursor-pointer glass-ui min-w-[33%] max-w-[33%] p-2 ui-button-compress"
        @click="closeModal"
      >
        Close
      </button>
    </div>
  </div>
</template>
