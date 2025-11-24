<script setup lang="ts">
interface Props {
  isOpen: boolean;
  companyName: string;
  itemType: "position" | "interview" | "assessment" | "offer";
}

const props = defineProps<Props>();

const emit = defineEmits<{
  confirm: [];
  cancel: [];
}>();

const confirmationText = ref("");

const isConfirmed = computed(() => {
  return confirmationText.value === props.companyName;
});

const handleConfirm = () => {
  if (isConfirmed.value) {
    emit("confirm");
    confirmationText.value = "";
  }
};

const handleCancel = () => {
  confirmationText.value = "";
  emit("cancel");
};
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      @click.self="handleCancel"
    >
      <div
        class="glass-card-modal p-6 max-w-md w-full mx-4"
        @click.stop
      >
        <div class="text-white/80">
          <div class="flex flex-row justify-between items-start mb-4">
            <h1 class="text-3xl font-bold text-white/80">DELETE CONFIRMATION</h1>
            <button
              type="button"
              @click="handleCancel"
              class="text-2xl font-bold text-white/80 hover:text-black"
            >
              ×
            </button>
          </div>

          <hr class="border-black/50 border-rounded-full border-2 mb-4" />

          <div class="mb-6">
            <p class="text-lg mb-4 text-white/80">
              Are you sure you want to delete this {{ itemType }}?
            </p>
            <p class="text-sm text-white/80 mb-4">
              This action cannot be undone. To confirm, please type the company name:
            </p>
            <p class="font-bold text-lg mb-2 text-white/80">{{ companyName }}</p>
            
            <input
              v-model="confirmationText"
              type="text"
              class="w-full p-2 border-2 border-black/30 rounded focus:border-red-500 focus:outline-none"
              placeholder="Type company name to confirm"
              @keyup.enter="handleConfirm"
            />
          </div>

          <div
            v-if="confirmationText && !isConfirmed"
            class="mb-4 p-2 bg-yellow-100 border border-yellow-400 text-white/80 rounded text-sm"
          >
            Company name does not match. Please type exactly: {{ companyName }}
          </div>

          <div class="flex gap-4 justify-end">
            <button
              type="button"
              class="cursor-pointer glass-ui px-6 py-2 ui-button-compress"
              @click="handleCancel"
            >
              Cancel
            </button>
            <button
              type="button"
              class="cursor-pointer px-6 py-2 ui-button-compress bg-red-500 text-white hover:bg-red-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              @click="handleConfirm"
              :disabled="!isConfirmed"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

