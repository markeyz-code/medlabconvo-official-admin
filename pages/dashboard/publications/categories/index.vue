<template>
  <CategoriesModule />
</template>

<script setup lang="ts">

import CategoriesModule from '@/components/CategoriesModule.vue'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})
</script>
