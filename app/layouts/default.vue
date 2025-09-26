<script setup lang="ts">
// Default layout component
import "~/assets/css/main.css";
import Navbar from "~/components/Navbar.vue";
const nav1 = "font-michroma glass-header py-4 sticky top-0 z-50"
</script>

<template>
  <header class="font-michroma sticky top-0 z-50 flex items-center">
    <Navbar />
  </header>
  <body>
    <NuxtPage />
  </body>
</template>
