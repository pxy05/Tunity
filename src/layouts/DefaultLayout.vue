<script setup lang="ts">
// Default layout component
</script>

<template>
  <div class="h-screen w-screen flex flex-col">
    <!-- Header -->
    <header class="glass-header py-4 sticky top-0 z-50">
      <nav class="px-4 flex flex-row items-center">
        <router-link to="/" class="flex-1 ml-[12%] text-white text-2xl font-bold justify-start"
          >Tunity</router-link
        >
        <div class="flex mr-[12%] flex-1 gap-4 justify-end">
          <router-link
            to="/"
            class="glass-nav-link px-4 py-2 rounded-lg"
            active-class="bg-white/20"
          >
            Home
          </router-link>
          <router-link
            to="/account/login"
            class="glass-nav-link px-4 py-2 rounded-lg"
            active-class="bg-white/20"
          >
            Login
          </router-link>
          <router-link
            to="/account/register"
            class="glass-nav-link px-4 py-2 rounded-lg"
            active-class="bg-white/20"
          >
            Register
          </router-link>
        </div>
      </nav>
    </header>

    <!-- Main Content -->
    <main class="flex-1 flex justify-center items-center m-4">
      <router-view />
    </main>
  </div>
</template>
