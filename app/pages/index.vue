<script setup lang="ts">
import useContext from "~/context/tempcontext";
import DashboardView from "~/components/DashboardView.vue";
import WelcomeView from "~/components/WelcomeView.vue";
import NoTunityUser from "~/components/NoTunityUser.vue";

const { user, userItems } = useContext();
const supabaseUser = useSupabaseUser();
console.log(supabaseUser.value);

definePageMeta({
  layout: "default",
});
</script>

<template>
  <DashboardView v-if="user && supabaseUser" :user-items="userItems || []" />
  <NoTunityUser v-if="!user && supabaseUser" />
  <WelcomeView v-else />
</template>
