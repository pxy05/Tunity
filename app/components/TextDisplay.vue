<script setup lang="ts">
interface Props {
  text: string;
  maxLength?: number;
  title?: string;
}

const props = withDefaults(defineProps<Props>(), {
  maxLength: 200,
  title: "Full Text",
});

const showFullModal = ref(false);
const isTruncated = computed(() => props.text.length > props.maxLength);
const displayedText = computed(() => {
  if (isTruncated.value) {
    return props.text.substring(0, props.maxLength) + "...";
  }
  return props.text;
});

const openFullModal = () => {
  showFullModal.value = true;
};

const closeFullModal = () => {
  showFullModal.value = false;
};
</script>

<template>
  <div>
    <p class="whitespace-pre-wrap">{{ displayedText }}</p>
    <button
      v-if="isTruncated"
      @click="openFullModal"
      class="mt-2 text-sm text-blue-400 hover:text-blue-300 underline"
    >
      See more
    </button>

    <!-- Full Text Modal -->
    <Teleport to="body">
      <div
        v-if="showFullModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        @click.self="closeFullModal"
      >
        <div
          class="glass-card-modal p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto mx-4"
          @click.stop
        >
          <div class="text-white/80">
            <div class="flex flex-row justify-between items-start mb-4">
              <h2 class="text-2xl font-bold text-white/80">{{ title }}</h2>
              <button
                type="button"
                @click="closeFullModal"
                class="text-2xl font-bold text-white/80 hover:text-black"
              >
                ×
              </button>
            </div>

            <hr class="border-black/50 border-rounded-full border-2 mb-4" />

            <div class="mb-6">
              <p class="whitespace-pre-wrap text-white/80">{{ text }}</p>
            </div>

            <div class="flex gap-4 justify-end">
              <button
                type="button"
                class="cursor-pointer glass-ui px-6 py-2 ui-button-compress"
                @click="closeFullModal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

