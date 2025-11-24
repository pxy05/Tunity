<script setup lang="ts">
import AddInterview from "~/components/applicationManagement/AddInterview.vue";

definePageMeta({
  layout: "default",
});
</script>

<template>
  <div class="flex justify-center items-center min-h-[calc(100vh-10rem)] p-6">
    <div class="glass-card p-8 rounded-2xl w-full max-w-4xl">
      <AddInterview />
    </div>
  </div>
</template>

