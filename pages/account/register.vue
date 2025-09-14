<script setup lang="ts">
// Register page component
definePageMeta({
  layout: 'default'
})
</script>

<template>
  <div class="text-center glass rounded-xl p-8 max-w-[50%] mx-auto">
    <h2 class="text-white text-2xl font-bold mb-6 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
      Create Account
    </h2>
    <form class="space-y-4">
      <input
        type="text"
        placeholder="Full Name"
        class="text-black w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 hover-expand-ui"
      />
      <input
        type="email"
        placeholder="Email"
        class="text-black w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 hover-expand-ui"
      />
      <input
        type="password"
        placeholder="Password"
        class="text-black w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 hover-expand-ui"
      />
      <button
        type="submit"
        class="w-full py-3 bg-white/20 border border-white/20 hover:bg-white/30 font-semibold rounded-lg transition-all duration-300 hover-expand-ui"
      >
        Create Account
      </button>
    </form>
  </div>
</template>
