<script setup lang="ts">
import useContext from "~/context/tempcontext";

interface Props {
  isOpen: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  close: [];
}>();

const supabase = useSupabaseClient();
const supabaseUser = useSupabaseUser();
const context = useContext();

const showDeleteConfirm = ref(false);
const isDeleting = ref(false);
const error = ref<string | null>(null);

const getApiUrl = () => {
  const config = useRuntimeConfig();
  return config.public.tunityApiUrl;
};

const handleLogout = async () => {
  try {
    await supabase.auth.signOut();
    emit("close");
    navigateTo("/");
  } catch (error) {
    console.error("Error signing out:", error);
  }
};

const handleDeleteUser = async () => {
  if (!supabaseUser.value?.id) {
    error.value = "User not authenticated";
    return;
  }

  isDeleting.value = true;
  error.value = null;

  try {
    const apiURL = getApiUrl();
    const response = await fetch(`${apiURL}/users/${supabaseUser.value.id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const data = await response.json();
      error.value = data.error || "Failed to delete user";
      isDeleting.value = false;
      return;
    }

    // Sign out after successful deletion
    await supabase.auth.signOut();
    emit("close");
    navigateTo("/");
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Failed to delete user";
    console.error("Error deleting user:", e);
    isDeleting.value = false;
  }
};

const closeModal = () => {
  showDeleteConfirm.value = false;
  error.value = null;
  emit("close");
};
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      @click.self="closeModal"
    >
      <div
        class="glass-card-modal p-8 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
        @click.stop
      >
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-3xl font-bold text-white/80">Account</h2>
          <button
            type="button"
            @click="closeModal"
            class="text-white/80 hover:text-white text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <div v-if="!showDeleteConfirm" class="space-y-4">
          <div class="space-y-3">
            <button
              @click="handleLogout"
              class="w-full px-4 py-3 bg-white/20 text-white rounded hover:bg-white/30 border border-white/30 transition-colors text-left"
            >
              Logout
            </button>
            <button
              @click="showDeleteConfirm = true"
              class="w-full px-4 py-3 bg-red-500/20 text-white rounded hover:bg-red-500/30 border border-red-400/40 transition-colors text-left"
            >
              Delete Account
            </button>
          </div>
        </div>

        <div v-else class="space-y-4">
          <div>
            <h3 class="text-xl font-bold text-white/80 mb-2">
              Delete Account
            </h3>
            <p class="text-white/70 mb-4">
              Are you sure you want to delete your account? This action cannot
              be undone and will permanently delete all your data including
              positions, applications, assessments, and offers.
            </p>
          </div>

          <div
            v-if="error"
            class="p-3 bg-red-500/20 border border-red-400/40 text-red-200 rounded"
          >
            {{ error }}
          </div>

          <div class="flex justify-end gap-4">
            <button
              @click="showDeleteConfirm = false"
              class="px-4 py-2 bg-white/20 text-white rounded hover:bg-white/30 border border-white/30 transition-colors"
              :disabled="isDeleting"
            >
              Cancel
            </button>
            <button
              @click="handleDeleteUser"
              class="px-4 py-2 bg-red-500/20 text-white rounded hover:bg-red-500/30 border border-red-400/40 transition-colors"
              :disabled="isDeleting"
            >
              {{ isDeleting ? "Deleting..." : "Delete Account" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

