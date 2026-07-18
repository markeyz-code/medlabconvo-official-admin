<template>
  <CategoriesModule />
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

import CategoriesModule from '@/components/CategoriesModule.vue'
</script>
