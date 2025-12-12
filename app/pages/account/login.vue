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

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  });

  if (error) {
    loggingIn.value = false;
    loginError.value = error.message;
    return;
  }

  // Success - navigate to home, let home page handle the rest
  loggingIn.value = false;
  navigateTo("/");
};

const handleGitHubLogin = async () => {
  if (!process.client) return;

  loggingInWithGitHub.value = true;
  loginError.value = "";

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: `${window.location.origin}/`,
    },
  });

  if (error) {
    loginError.value = error.message || "Failed to initiate GitHub login";
    loggingInWithGitHub.value = false;
  }
  // If successful, browser redirects to GitHub, then Supabase module handles callback
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
        <span>{{
          loggingInWithGitHub
            ? "Redirecting to GitHub..."
            : "Continue with GitHub"
        }}</span>
      </button>

      <button
        type="button"
        disabled
        class="w-full py-3 bg-white/40 border border-white/20 text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-3 cursor-not-allowed opacity-75 mt-3"
      >
        <svg
          class="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        <div class="flex flex-col items-start">
          <span>Continue with Google</span>
          <span class="text-xs text-white/60 font-normal">Coming soon</span>
        </div>
      </button>
    </div>
  </div>
</template>
