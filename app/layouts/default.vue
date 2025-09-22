<script setup lang="ts">
// Default layout component
import "~/assets/css/main.css";
import useContext from "~/context/tempcontext";
import Navbar from "~/components/Navbar.vue";

const { user } = useContext();
</script>

<template>
  <div class="w-full">
    <!-- Header -->
    <header class="font-michroma glass-header py-4 sticky top-0 z-50">
      <Navbar />
    </header>

    <!-- Main Content -->
    <main>
      <NuxtPage />
    </main>
  </div>
</template>
