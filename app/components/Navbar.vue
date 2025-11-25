<script setup>
import useContext from "~/context/tempcontext";
import AccountModal from "~/components/modals/AccountModal.vue";

const { user } = useContext();

const supabaseUser = useSupabaseUser();
const accountModalOpen = ref(false);

const openAccountModal = () => {
  accountModalOpen.value = true;
};

const closeAccountModal = () => {
  accountModalOpen.value = false;
};
</script>

<template>
  <nav
    class="text-black flex pt-4 pb-10 w-full fade-bottom fixed top-0 left-0 right-0 z-50 font-michroma bg-white/80 backdrop-blur-sm"
  >
    <div class="ml-6 flex-1 justify-start text-3xl font-bold">
      <NuxtLink class="hover-expand-ui" to="/">>Tunity</NuxtLink>
    </div>
    <div class="mr-6 flex flex-1 justify-end gap-4">
      <NuxtLink to="/" class="glass-nav-link px-6 py-2">Home</NuxtLink>
      <button
        v-if="supabaseUser"
        @click="openAccountModal"
        class="glass-nav-link px-6 py-2 cursor-pointer"
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
