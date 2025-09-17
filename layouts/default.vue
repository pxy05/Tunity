<script setup lang="ts">
// Default layout component
import '~/assets/css/main.css'
</script>

<template>
  <div class="h-screen w-screen flex flex-col">
    <!-- Header -->
    <header class="font-michroma glass-header py-4 sticky top-0 z-50">
      <nav class="px-4 flex flex-row items-center">
        <NuxtLink
          to="/"
          class="mr-[30%] flex-1 text-center text-white text-2xl font-bold transition-transform duration-200 hover:scale-110"
        >
          >Tunity</NuxtLink
        >
        <div class="flex mr-[12%] flex-1 gap-4 justify-end">
          <NuxtLink
            to="/"
            class="glass-nav-link px-4 py-2 rounded-lg"
            active-class="bg-white/20"
          >
            Home
          </NuxtLink>
          <NuxtLink
            to="/account/login"
            class="glass-nav-link px-4 py-2 rounded-lg"
            active-class="bg-white/20"
          >
            Login
          </NuxtLink>
          <NuxtLink
            to="/account/register"
            class="glass-nav-link px-4 py-2 rounded-lg"
            active-class="bg-white/20"
          >
            Register
          </NuxtLink>
        </div>
      </nav>
    </header>

    <!-- Main Content -->
    <main class="flex-1 flex justify-center items-center m-4">
      <NuxtPage />
    </main>
  </div>
</template>
