<script setup>
import useContext from "~/context/tempcontext";

const context = useContext();

const props = defineProps({
  userItemId: {
    type: String,
    required: true,
  },
});

const application = context.getApplicationById(props.userItemId);

console.log(application);
</script>

<template>
  <div
    class="font-michroma glass-card w-[80vw] h-[80vh] rounded-2xl flex flex-col items-center -mb-[10%]"
  >
    <h1>{{ application.title }}</h1>
    <p>{{ application.description }}</p>
    <p>{{ application.status }}</p>
    <p>{{ application.created_at }}</p>
    <p>{{ application.updated_at }}</p>
  </div>
</template>
