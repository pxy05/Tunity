<script setup>
import useContext from "~/context/tempcontext";

const { user } = useContext();
const head1 = "p-4 flex flex-row font-michroma glass-header w-full"
"flex pt-4 pb-10 w-full fade-bottom"

function getCss(hello) {

  switch(hello) {
    case 1:
      return "p-4 flex flex-row w-[100%] font-michroma glass-header";
    case 2:
      return "flex pt-4 pb-10 w-[100%] fade-bottom";
    default:
      return "";
  }
}

</script>

<template>
  <nav :class="getCss(2)">
    <div class="ml-2 flex-1 justify-start text-white text-3xl font-bold">
      <NuxtLink class="hover-expand-ui" to="/">>Tunity</NuxtLink>
    </div>
    <div class="mr-2 flex flex-1 justify-end gap-4">
      <NuxtLink to="/" class="glass-nav-link px-4 py-2 rounded-lg fade-bottom"
        >Home</NuxtLink
      >
      <NuxtLink to="/" class="glass-nav-link px-4 py-2 rounded-lg fade-bottom"
        >About</NuxtLink
      >
      <NuxtLink to="/" class="glass-nav-link px-4 py-2 rounded-lg fade-bottom"
        >Contact</NuxtLink
      >
    </div>
  </nav>
</template>

<style scoped></style>
