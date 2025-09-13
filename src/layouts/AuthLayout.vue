<script setup lang="ts">
// Authentication layout component
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <!-- Gradient Overlay -->
    <div class="absolute inset-0 bg-gradient-to-br from-indigo-500/30 to-purple-600/30"></div>

    <div class="w-full max-w-md relative z-10">
      <!-- Auth Header -->
      <header class="text-center mb-8">
        <h1 class="text-white text-4xl font-bold mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
          Tunity
        </h1>
        <p class="text-white/90 text-lg drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]">Welcome back</p>
      </header>

      <!-- Auth Content -->
      <main class="mb-8">
        <div class="">
          <router-view />
        </div>
      </main>

      <!-- Auth Footer -->
      <footer class="text-center">
        <p class="text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]">
          Need help?
          <a href="#" class="text-white font-medium hover:underline"> Contact Support </a>
        </p>
      </footer>
    </div>
  </div>
</template>
