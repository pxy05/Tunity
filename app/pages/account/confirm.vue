<script setup lang="ts">
definePageMeta({
  layout: "default",
});

const user = useSupabaseUser();

watch(
  user,
  () => {
    if (user.value) {
      // Redirect to protected page
      return navigateTo("/");
    }
  },
  { immediate: true }
);
</script>

<template>
  <div class="grid place-items-center h-[86vh]">
    <div
      class="font-michroma text-center glass-card rounded-xl p-8 max-w-[50%] mx-auto mt-4"
    >
      <h2
        class="text-white text-2xl font-bold mb-6 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
      >
        Waiting for login...
      </h2>
    </div>
  </div>
</template>
