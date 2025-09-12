# Components Directory

This directory contains reusable Vue components that can be used across different pages.

## Structure

- `common/` - Common UI components (buttons, inputs, modals, etc.)
- `layout/` - Layout components (header, footer, navigation, etc.)
- `forms/` - Form-specific components

## Usage

Import components in your pages or other components:

```vue
<script setup lang="ts">
import MyComponent from '@/components/common/MyComponent.vue'
</script>
```