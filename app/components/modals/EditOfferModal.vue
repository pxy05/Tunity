<script setup lang="ts">
import useApi from "~/composables/useApi";
import useContext from "~/context/tempcontext";
import type { OfferInput, OfferWithPosition } from "~/assets/types/database";

interface Props {
  item: OfferWithPosition | null;
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

// Offer fields
const receivedAt = ref("");

const error = ref<string | null>(null);
const isSubmitting = ref(false);

watch(
  () => props.item,
  (newItem) => {
    if (newItem?.offer) {
      const offer = newItem.offer;
      receivedAt.value = offer.received_at
        ? new Date(offer.received_at).toISOString().slice(0, 16)
        : "";
    }
  },
  { immediate: true }
);

const submitOffer = async (event?: Event) => {
  if (event) {
    event.preventDefault();
  }

  if (isSubmitting.value || !props.item?.offer.id) return;

  isSubmitting.value = true;
  error.value = null;

  try {
    const offerData: OfferInput = {
      user_id: props.item.offer.user_id,
      position_id: props.item.offer.position_id,
      received_at: receivedAt.value ? new Date(receivedAt.value).toISOString() : undefined,
    };

    const result = await useApi.updateOffer(
      props.item.offer.id,
      offerData
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
      e instanceof Error ? e.message : "Failed to update offer";
    console.error("Error updating offer:", e);
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
        <form @submit.prevent="submitOffer" class="text-white/80">
          <div class="flex flex-row justify-between items-start mb-4">
            <h1 class="text-4xl font-bold text-white/80">EDIT OFFER</h1>
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
            <p :class="fieldTitleStyle">Received Date & Time*:</p>
            <input
              class="w-full"
              v-model="receivedAt"
              type="datetime-local"
              :placeholder="fieldPlaceholder"
              required
            />
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

