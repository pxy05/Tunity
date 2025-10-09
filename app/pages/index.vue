<script setup lang="ts">
import useContext from "~/context/tempcontext";
import DashboardView from "~/components/DashboardView.vue";
import WelcomeView from "~/components/WelcomeView.vue";

const { user, userItems } = useContext();
const supabaseUser = useSupabaseUser();
console.log(supabaseUser.value);

definePageMeta({
  layout: "default",
});
</script>

<template>
  <DashboardView v-if="user" :user-items="userItems || []" />
  <WelcomeView v-else />
</template>
