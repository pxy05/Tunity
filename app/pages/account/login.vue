<script setup lang="ts">
definePageMeta({
  layout: "default",
});

const supabase = useSupabaseClient();
const supabaseUser = useSupabaseUser();
const email = ref("");
const password = ref("");

const loggingIn = ref(false);
const loginError = ref("");
const loggingInWithGitHub = ref(false);

const handleSubmit = async () => {
  if (email.value === "" || password.value === "") {
    loginError.value = "Please enter an email and password";
    return;
  }

  loggingIn.value = true;
  loginError.value = "";

  // signInWithPassword automatically stores the session
  // The @nuxtjs/supabase module automatically syncs useSupabaseUser()
  // and handles session persistence - no manual intervention needed
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  });
  
  if (error) {
    loggingIn.value = false;
    console.error("[LOGIN] Login failed:", error);
    loginError.value = error.message;
    return;
  }

  console.log("[LOGIN] Login successful! User:", data.user?.id);
  console.log("[LOGIN] Session stored automatically by @nuxtjs/supabase module");
  
  // Wait for next tick to allow module to sync useSupabaseUser()
  await nextTick();
  
  // Check if user state is already synced (should be instant with module)
  if (supabaseUser.value) {
    console.log("[LOGIN] User state synced, navigating to confirm...");
    loggingIn.value = false;
    navigateTo("/account/confirm");
  } else {
    // If not synced yet, wait a moment (module should sync quickly)
    // Use a short timeout as fallback
    const checkUser = setInterval(() => {
      if (supabaseUser.value) {
        console.log("[LOGIN] User state synced after wait, navigating...");
        clearInterval(checkUser);
        loggingIn.value = false;
        navigateTo("/account/confirm");
      }
    }, 100);
    
    // Fallback timeout
    setTimeout(() => {
      clearInterval(checkUser);
      if (supabaseUser.value) {
        loggingIn.value = false;
        navigateTo("/account/confirm");
      } else {
        // Session exists but user state not synced - navigate anyway
        // Module should sync on next page
        console.log("[LOGIN] Navigating - module will sync on next page");
        loggingIn.value = false;
        navigateTo("/account/confirm");
      }
    }, 1000);
  }
};

const handleGitHubLogin = async () => {
  // Only run on client side
  if (!process.client) return;

  loggingInWithGitHub.value = true;
  loginError.value = "";

  try {
    // Get the current origin for redirect URL
    // The @nuxtjs/supabase module handles the OAuth callback automatically
    // After GitHub auth, Supabase redirects to this URL with the session
    const redirectTo = `${window.location.origin}/account/confirm`;

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: redirectTo,
      },
    });

    if (error) {
      console.error("[LOGIN] GitHub OAuth error:", error);
      loginError.value = error.message || "Failed to initiate GitHub login";
      loggingInWithGitHub.value = false;
      return;
    }

    // If successful, data.url contains the redirect URL to GitHub
    // The browser will navigate there automatically
    // After GitHub auth, user will be redirected back to /account/confirm
    // The @nuxtjs/supabase module will handle the session automatically
    console.log("[LOGIN] GitHub OAuth initiated, redirecting to:", data.url);
    // Note: The browser will navigate away, so we don't need to do anything else
    // The loggingInWithGitHub state will reset when the page unloads
  } catch (err) {
    console.error("[LOGIN] GitHub OAuth exception:", err);
    loginError.value = err instanceof Error ? err.message : "An error occurred during GitHub login";
    loggingInWithGitHub.value = false;
  }
};
</script>

<template>
  <div class="grid place-items-center h-[86vh] text-black">
    <div
      class="font-michroma text-center glass-card rounded-xl p-8 max-w-[50%] mx-auto mt-4"
    >
      <h2
        class="text-2xl font-bold mb-6 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
      >
        Sign In
      </h2>
      <form class="space-y-4" @submit.prevent="handleSubmit">
        <input
          v-model="email"
          type="email"
          placeholder="Email"
          class="text-black w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 hover-expand-ui"
        />
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          class="text-black w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 hover-expand-ui"
        />
        <button
          type="submit"
          class="w-full py-3 bg-white/20 border border-white/20 hover:bg-white/30 font-semibold rounded-lg transition-all duration-300 hover-expand-ui cursor-pointer"
        >
          {{ loggingIn ? "Logging In..." : "Sign In" }}
        </button>
        <p v-if="loginError" class="text-red-500">{{ loginError }}</p>
      </form>

      <div class="flex items-center my-6">
        <div class="flex-1 h-px bg-white/20"></div>
        <span class="px-4 text-white/60 text-sm">OR</span>
        <div class="flex-1 h-px bg-white/20"></div>
      </div>

      <button
        @click="handleGitHubLogin"
        type="button"
        :disabled="loggingInWithGitHub"
        class="w-full py-3 bg-gray-900/40 border border-white/20 hover:bg-gray-900/60 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-300 hover-expand-ui flex items-center justify-center gap-3 cursor-pointer"
      >
        <img
          src="/github-mark.svg"
          alt="GitHub"
          class="w-5 h-5 brightness-0 invert"
        />
        <span>{{ loggingInWithGitHub ? "Redirecting to GitHub..." : "Continue with GitHub" }}</span>
      </button>
    </div>
  </div>
</template>
