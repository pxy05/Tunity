<script setup lang="ts">
import Navbar from "~/components/Navbar.vue";
import ThemeToggle from "~/components/UI/ThemeToggle.vue";
</script>

<template>
  <div>
    <Navbar />
    <div class="pt-20">
      <NuxtPage />
    </div>
    <ThemeToggle />
  </div>
</template>
