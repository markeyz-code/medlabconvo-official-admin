<template>
  <CategoriesModule />
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
  permission: 'publications:read'
})

import CategoriesModule from '@/components/CategoriesModule.vue'
</script>
