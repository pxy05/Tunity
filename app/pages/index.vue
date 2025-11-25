<script setup lang="ts">
import useContext from "~/context/tempcontext";
import DashboardView from "~/components/DashboardView.vue";
import WelcomeView from "~/components/WelcomeView.vue";
import NoTunityUser from "~/components/NoTunityUser.vue";

const context = useContext();
const user = context.user;
const userItems = context.userItems;
const loading = context.loading;
const supabaseUser = useSupabaseUser();

definePageMeta({
  layout: "default",
});

// Ensure context loads user data when page mounts if user is available
onMounted(async () => {
  console.log("[INDEX] Page mounted");
  console.log("[INDEX] supabaseUser:", supabaseUser.value ? `${supabaseUser.value.id} (${supabaseUser.value.email})` : "null");
  console.log("[INDEX] user:", user.value ? `${user.value.id} (${user.value.username})` : "null");
  console.log("[INDEX] loading:", loading.value);
  console.log("[INDEX] userItems:", userItems.value?.length || 0, "items");
  
  if (supabaseUser.value?.id && !user.value && !loading.value) {
    console.log("[INDEX] Supabase user exists but context hasn't loaded, triggering manually...");
    // If Supabase user exists but context hasn't loaded, trigger it manually
    await context.loadUserData();
    console.log("[INDEX] After manual load - user:", user.value ? `${user.value.id}` : "null", "loading:", loading.value);
  }
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
