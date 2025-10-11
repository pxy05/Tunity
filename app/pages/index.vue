<script setup lang="ts">
import useContext from "~/context/tempcontext";
import DashboardView from "~/components/DashboardView.vue";
import WelcomeView from "~/components/WelcomeView.vue";
import NoTunityUser from "~/components/NoTunityUser.vue";

const { user, userItems, loading } = useContext();
const supabaseUser = useSupabaseUser();

definePageMeta({
  layout: "default",
});
</script>

<template>
  <div v-if="loading" class="flex items-center justify-center h-screen">
    <div class="glass-card p-8 rounded-2xl">
      <div class="flex flex-col items-center gap-4">
        <div
          class="animate-spin rounded-full h-16 w-16 border-b-4 border-black/80"
        ></div>
        <p class="text-xl font-bold text-black/80">Loading...</p>
      </div>
    </div>
  </div>
  <DashboardView
    v-else-if="user && supabaseUser"
    :user-items="userItems || []"
  />
  <NoTunityUser v-else-if="!user && supabaseUser" />
  <WelcomeView v-else />
</template>
