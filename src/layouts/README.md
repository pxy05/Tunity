# Layouts Directory

This directory contains layout components that wrap your pages, similar to Next.js layouts.

## Available Layouts

### DefaultLayout
- **Usage**: Main application layout with header, navigation, and footer
- **Applied to**: Home page and other main pages
- **Features**: 
  - Navigation bar with brand and links
  - Main content area
  - Footer

### AuthLayout  
- **Usage**: Authentication pages layout with centered card design
- **Applied to**: Login and Register pages
- **Features**:
  - Gradient background
  - Centered auth card
  - Clean, focused design for forms

## How to Use

### 1. Layout Assignment
Layouts are automatically assigned based on route names in `App.vue`:
- **Auth pages** (`login`, `register`) → `AuthLayout`
- **All other pages** → `DefaultLayout`

### 2. Create New Layouts
1. Create a new `.vue` file in this directory
2. Import it in `App.vue`
3. Add logic to assign it based on route name

### 3. Layout Structure
Each layout should contain:
- `<router-view />` - where page content will be rendered
- Consistent styling and structure
- Responsive design

## Next.js Comparison
- **Next.js**: `export default function Layout({ children }) { ... }`
- **Vue**: `<template><router-view /></template>` + `definePageMeta({ layout: 'name' })`
