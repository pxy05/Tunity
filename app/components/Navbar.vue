<script setup>
import useContext from "~/context/tempcontext";
import AccountModal from "~/components/modals/AccountModal.vue";
import { useTheme } from "~/composables/useTheme";

const { user } = useContext();
const { theme } = useTheme();

const supabaseUser = useSupabaseUser();
const accountModalOpen = ref(false);

const openAccountModal = () => {
  accountModalOpen.value = true;
};

const closeAccountModal = () => {
  accountModalOpen.value = false;
};

const navbarBg = computed(() => {
  if (theme.value === "dark") return "bg-gray-800/80";
  if (theme.value === "light") return "bg-gray-200/80";
  return "bg-white/80"; // transparent mode
});

const textColor = computed(() => {
  if (theme.value === "light") return "text-black/70";
  return "text-white/70";
});
</script>

<template>
  <nav
    :class="[
      'flex pt-4 pb-10 w-full fade-bottom fixed top-0 left-0 right-0 z-50 font-michroma backdrop-blur-sm',
      navbarBg,
      textColor,
    ]"
  >
    <div class="ml-6 flex-1 justify-start text-3xl font-bold">
      <NuxtLink :class="['hover-expand-ui', textColor]" to="/">>Tunity</NuxtLink>
    </div>
    <div class="mr-6 flex flex-1 justify-end gap-4">
      <NuxtLink :class="['glass-nav-link px-6 py-2', textColor]" to="/">Home</NuxtLink>
      <button
        v-if="supabaseUser"
        @click="openAccountModal"
        :class="['glass-nav-link px-6 py-2 cursor-pointer', textColor]"
      >
        Account
      </button>
    </div>

    <AccountModal
      :is-open="accountModalOpen"
      @close="closeAccountModal"
    />
  </nav>
</template>

<style scoped></style>
