<script setup>
import useContext from "~/context/tempcontext";

const { user } = useContext();
</script>

<template>
  <nav
    class="text-black flex pt-4 pb-10 w-full fade-bottom sticky top-0 z-50 font-michroma"
  >
    <div class="ml-6 flex-1 justify-start text-3xl font-bold">
      <NuxtLink class="hover-expand-ui" to="/">>Tunity</NuxtLink>
    </div>
    <div class="mr-6 flex flex-1 justify-end gap-4">
      <NuxtLink to="/" class="glass-nav-link px-6 py-2">Home</NuxtLink>
      <NuxtLink to="/" class="glass-nav-link px-6 py-2">About</NuxtLink>
      <NuxtLink to="/" class="glass-nav-link px-6 py-2">Contact</NuxtLink>
    </div>
  </nav>
</template>

<style scoped></style>
