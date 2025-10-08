<script setup lang="ts">
definePageMeta({
  layout: "default",
});

const supabase = useSupabaseClient();
const email = ref("");
const password = ref("");

const loggingIn = ref(false);
const loginError = ref("");

const handleSubmit = async () => {
  if (email.value === "" || password.value === "") {
    loginError.value = "Please enter an email and password";
    return;
  }

  loggingIn.value = true;
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  });
  loggingIn.value = false;
  if (error) {
    loginError.value = error.message;
  } else {
    navigateTo("/account/confirm");
  }
};

const handleGitHubLogin = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: `${window.location.origin}/account/confirm`,
    },
  });

  if (error) {
    loginError.value = error.message;
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
      <form class="space-y-4" @submit="handleSubmit">
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
          class="w-full py-3 bg-white/20 border border-white/20 hover:bg-white/30 font-semibold rounded-lg transition-all duration-300 hover-expand-ui"
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
        class="w-full py-3 bg-gray-900/40 border border-white/20 hover:bg-gray-900/60 text-white font-semibold rounded-lg transition-all duration-300 hover-expand-ui flex items-center justify-center gap-3"
      >
        <img
          src="/github-mark.svg"
          alt="GitHub"
          class="w-5 h-5 brightness-0 invert"
        />
        <span>Continue with GitHub</span>
      </button>
    </div>
  </div>
</template>
