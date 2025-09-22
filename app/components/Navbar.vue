<script setup>
import useContext from "~/context/tempcontext";

const { user } = useContext();
</script>

<template>
  <nav class="px-4 flex flex-row font-michroma">
    <div class="ml-2 flex-1 justify-start text-white text-2xl font-bold">
      <NuxtLink class="hover-expand-ui" to="/">>Tunity</NuxtLink>
    </div>
    <div class="mr-2 flex flex-1 justify-end gap-4">
      <NuxtLink to="/" class="glass-nav-link px-4 py-2 rounded-lg"
        >Home</NuxtLink
      >
      <NuxtLink to="/" class="glass-nav-link px-4 py-2 rounded-lg"
        >About</NuxtLink
      >
      <NuxtLink to="/" class="glass-nav-link px-4 py-2 rounded-lg"
        >Contact</NuxtLink
      >
    </div>
  </nav>
</template>

<style scoped></style>
