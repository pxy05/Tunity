<script setup lang="ts">
import useDateFormat from "~/composables/useDateFormat";
import ActionButtons from "~/components/UI/ActionButtons.vue";
import type { OfferWithPosition } from "~/assets/types/database";

interface Props {
  item: OfferWithPosition;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  edit: [item: OfferWithPosition];
  delete: [item: OfferWithPosition];
}>();

const { formatDate, formatDateTime } = useDateFormat();

const handleCardClick = () => {
  if (props.item.offer.id) {
    navigateTo(`/offer/${props.item.offer.id}`);
  }
};
</script>

<template>
  <div @click="handleCardClick" class="cursor-pointer">
    <div class="flex justify-between items-start mb-2">
      <div class="flex-1">
        <h3 class="text-xl font-bold text-white/80">
          {{ item.position.position_name || "Untitled Position" }}
        </h3>
        <p class="text-lg text-white/80 mb-2">
          {{ item.position.company_name || "Unknown Company" }}
        </p>
      </div>
      <ActionButtons size="sm" @edit="emit('edit', item)" @delete="emit('delete', item)" />
    </div>
    
    <div class="space-y-2">
      <div class="flex items-center gap-2 text-sm">
        <span
          class="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
        >
          Offer Received
        </span>
      </div>
      
      <div class="text-sm">
        <span>Received: </span>
        <span>{{ formatDate(item.offer.received_at) }}</span>
      </div>
      
      <div v-if="item.position.location" class="text-sm">
        <span>Location: </span>
        <span>{{ item.position.location }}</span>
      </div>
    </div>
  </div>
</template>
