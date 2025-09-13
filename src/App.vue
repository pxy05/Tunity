<script setup lang="ts">
import '@fontsource/michroma'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import DefaultLayout from './layouts/DefaultLayout.vue'
import AuthLayout from './layouts/AuthLayout.vue'

// Main app component
const route = useRoute()

// Define layout mapping based on route
const layout = computed(() => {
  const routeName = route.name as string

  // Auth pages use AuthLayout
  if (routeName === 'account.login' || routeName === 'account.register') {
    return AuthLayout
  }

  // All other pages use DefaultLayout
  return DefaultLayout
})
</script>

<template>
  <div id="app">
    <component :is="layout">
      <router-view />
    </component>
  </div>
</template>
