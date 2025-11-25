<script setup lang="ts">
import AddApplicationToPosition from "~/components/applicationManagement/AddApplicationToPosition.vue";

definePageMeta({
  layout: "default",
});

const route = useRoute();
const positionId = route.params.positionId as string;
</script>

<template>
  <div class="flex justify-center items-center min-h-[calc(100vh-10rem)] p-6">
    <div class="glass-card p-8 rounded-2xl w-full max-w-4xl">
      <AddApplicationToPosition :position-id="positionId" />
    </div>
  </div>
</template>

