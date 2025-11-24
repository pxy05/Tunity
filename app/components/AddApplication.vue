<script setup>
import useContext from "~/context/tempcontext";
import type { PositionWithApplication } from "~/assets/types/database";

const context = useContext();

const props = defineProps({
  userItemId: {
    type: String,
    required: true,
  },
});

const item = context.getApplicationById(props.userItemId) as
  | PositionWithApplication
  | undefined;

const status = computed(() =>
  item ? context.computeStatus(item) : "Unknown"
);
</script>

<template>
  <div
    class="font-michroma glass-card w-[80vw] h-[80vh] rounded-2xl flex flex-col items-center -mb-[10%] "
  >
    <h1 v-if="item">{{ item.position_name || "Untitled Position" }}</h1>
    <p v-if="item">{{ item.company_name || "Unknown Company" }}</p>
    <p v-if="item">{{ status }}</p>
    <p v-if="item">{{ item.created_at }}</p>
    <p v-if="item">{{ item.updated_at }}</p>
    <p v-if="item?.application?.notes" class="mt-4">
      Application Notes: {{ item.application.notes }}
    </p>
    <p v-if="!item">Application not found</p>
  </div>
</template>
