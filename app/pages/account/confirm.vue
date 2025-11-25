<script setup lang="ts">
import useApi from "~/composables/useApi";
import NoTunityUser from "~/components/NoTunityUser.vue";
import type { User } from "~/assets/types/database";

definePageMeta({
  layout: "default",
});

const supabaseUser = useSupabaseUser();
const backendUser = ref<User | null>(null);
const checkingUser = ref(true);
const showNoTunityUser = ref(false);

const { getUser } = useApi;

// Check if backend user exists
const checkBackendUser = async () => {
  console.log("[CONFIRM] checkBackendUser called");
  checkingUser.value = true;
  
  // If no Supabase user, redirect to login
  if (!supabaseUser.value) {
    console.log("[CONFIRM] No Supabase user, redirecting to login");
    navigateTo("/account/login");
    return;
  }

  console.log("[CONFIRM] Supabase user exists:", supabaseUser.value.id, supabaseUser.value.email);
  console.log("[CONFIRM] Checking backend user...");

  // Check if backend user exists
  const result = await getUser();
  
  console.log("[CONFIRM] Backend user check result:", result.error ? `Error: ${result.error.code} - ${result.error.error}` : `Success: ${result.data?.id}`);
  
  if (result.error) {
    // If user not found (404) or other error, show NoTunityUser component
    if (result.error.code === "NOT_FOUND" || result.error.code === "DATABASE_ERROR") {
      console.log("[CONFIRM] Backend user not found, showing NoTunityUser");
      showNoTunityUser.value = true;
    } else {
      // Other errors - show error message
      console.error("[CONFIRM] Error checking user:", result.error);
      showNoTunityUser.value = true;
    }
  } else if (result.data) {
    // Backend user exists - navigate to home
    console.log("[CONFIRM] Backend user found! Navigating to home...");
    backendUser.value = result.data;
    navigateTo("/", { replace: true });
  } else {
    // No backend user found - show NoTunityUser component
    console.log("[CONFIRM] No backend user data, showing NoTunityUser");
    showNoTunityUser.value = true;
  }
  
  checkingUser.value = false;
};

// Watch for Supabase user changes
// The module automatically syncs useSupabaseUser() when session exists
watch(
  supabaseUser,
  async (newUser) => {
    console.log("[CONFIRM] Supabase user watcher triggered:", newUser ? `User: ${newUser.id}` : "No user");
    if (newUser) {
      await checkBackendUser();
    } else {
      console.log("[CONFIRM] No user, redirecting to login");
      navigateTo("/account/login");
    }
  },
  { immediate: true }
);
</script>

<template>
  <div class="grid place-items-center h-[86vh]">
    <div v-if="checkingUser" class="font-michroma text-center glass-card rounded-xl p-8 max-w-[50%] mx-auto mt-4">
      <h2
        class="text-white text-2xl font-bold mb-6 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
      >
        Checking account...
      </h2>
    </div>
    <NoTunityUser v-else-if="showNoTunityUser" />
  </div>
</template>
