<script setup lang="ts">
import AddAssessment from "~/components/applicationManagement/AddAssessment.vue";
import useContext from "~/context/tempcontext";

interface Props {
  isOpen: boolean;
  preselectedPositionId?: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  close: [];
}>();

const context = useContext();

const addAssessmentShown = ref(true);

const stateRef = {
  addAssessmentShown: addAssessmentShown,
};

const closeModal = () => {
  emit("close");
};

// Initialize when modal opens
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    addAssessmentShown.value = true;
  }
}, { immediate: true });

// Watch for successful submission
watch(addAssessmentShown, (shown) => {
  if (!shown && props.isOpen) {
    // Component successfully submitted, close modal
    closeModal();
  }
});
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      @click.self="closeModal"
    >
      <div
        class="glass-card-modal p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto mx-4"
        @click.stop
      >
        <div class="flex justify-between items-start mb-4">
          <button
            type="button"
            @click="closeModal"
            class="text-2xl font-bold text-white/80 hover:text-black cursor-pointer ml-auto"
          >
            ×
          </button>
        </div>
        
        <AddAssessment 
          :state-management-reference="stateRef"
          :preselected-position-id="preselectedPositionId"
        />
      </div>
    </div>
  </Teleport>
</template>

