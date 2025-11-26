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

onMounted(async () => {
  // Handle OAuth callback manually
  if (process.client) {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      const supabase = useSupabaseClient();

      // Exchange code for session
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error("OAuth exchange error:", error);
        // Clean URL even on error
        window.history.replaceState({}, "", window.location.pathname);
      } else if (data.session) {
        // Success - session created, clean URL
        window.history.replaceState({}, "", window.location.pathname);
      }
    }
  }

  // Load user data if needed
  if (supabaseUser.value?.id && !user.value && !loading.value) {
    await context.loadUserData();
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
