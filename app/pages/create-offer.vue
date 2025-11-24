<script setup lang="ts">
import AddOffer from "~/components/applicationManagement/AddOffer.vue";

definePageMeta({
  layout: "default",
});
</script>

<template>
  <div class="flex justify-center items-center min-h-[calc(100vh-10rem)] p-6">
    <div class="glass-card p-8 rounded-2xl w-full max-w-4xl">
      <AddOffer />
    </div>
  </div>
</template>

