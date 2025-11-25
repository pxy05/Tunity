<script setup lang="ts">
definePageMeta({
  layout: "default",
});

const supabase = useSupabaseClient();

const formData = ref({
  email: "",
  password: "",
});

const showErrorModal = ref(false);
const errorMessage = ref("");
const isLoading = ref(false);

const handleSubmit = async (event: Event) => {
  event.preventDefault();

  if (!formData.value.email || !formData.value.password) {
    errorMessage.value = "Please fill in all fields";
    showErrorModal.value = true;
    return;
  }

  isLoading.value = true;
  errorMessage.value = "";

  try {
    // Sign up with Supabase (only authentication)
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: formData.value.email,
      password: formData.value.password,
    });

    if (authError) {
      errorMessage.value = authError.message;
      showErrorModal.value = true;
      isLoading.value = false;
      return;
    }

    if (!authData.user) {
      errorMessage.value = "Failed to create authentication account";
      showErrorModal.value = true;
      isLoading.value = false;
      return;
    }

    // Success - navigate to confirm page (which will check for backend user)
    navigateTo("/account/confirm");
  } catch (error: any) {
    errorMessage.value =
      error.message || "An error occurred during registration";
    showErrorModal.value = true;
  } finally {
    isLoading.value = false;
  }
};

const closeErrorModal = () => {
  showErrorModal.value = false;
  errorMessage.value = "";
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
        Create Account
      </h2>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <input
          v-model="formData.email"
          type="email"
          placeholder="Email"
          class="text-black w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 hover-expand-ui"
          required
        />
        <input
          v-model="formData.password"
          type="password"
          placeholder="Password"
          class="text-black w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 hover-expand-ui"
          required
        />
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full py-3 bg-white/20 border border-white/20 hover:bg-white/30 font-semibold rounded-lg transition-all duration-300 hover-expand-ui disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {{ isLoading ? "Creating Account..." : "Create Account" }}
        </button>
      </form>

      <!-- Error Modal -->
      <div
        v-if="showErrorModal"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        @click="closeErrorModal"
      >
        <div
          class="bg-white rounded-lg p-6 max-w-md mx-4 shadow-lg"
          @click.stop
        >
          <div class="text-center">
            <h3 class="text-lg font-semibold text-gray-800 mb-2">
              Registration Error
            </h3>
            <p class="text-gray-600 mb-4">{{ errorMessage }}</p>
            <button
              @click="closeErrorModal"
              class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
