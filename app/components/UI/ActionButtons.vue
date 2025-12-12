<script setup lang="ts">
interface Props {
  size?: "sm" | "md";
}

const props = withDefaults(defineProps<Props>(), {
  size: "md",
});

const emit = defineEmits<{
  edit: [];
  delete: [];
}>();

const handleEdit = () => {
  emit("edit");
};

const handleDelete = () => {
  emit("delete");
};

const buttonClasses = computed(() => {
  return props.size === "sm"
    ? "px-3 py-1 text-sm"
    : "px-4 py-2";
});
</script>

<template>
  <div class="flex gap-2" @click.stop>
    <button
      @click.stop="handleEdit"
      :class="[
        buttonClasses,
        'bg-white/20 text-white rounded hover:bg-white/30 border border-white/30 transition-colors cursor-pointer',
      ]"
    >
      Edit
    </button>
    <button
      @click.stop="handleDelete"
      :class="[
        buttonClasses,
        'bg-red-500/20 text-white rounded hover:bg-red-500/30 border border-red-400/40 transition-colors cursor-pointer',
      ]"
    >
      Delete
    </button>
  </div>
</template>

