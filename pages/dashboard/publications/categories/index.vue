<template>
  <CategoriesModule />
</template>

<script setup lang="ts">
import { definePageMeta } from '#imports'
import CategoriesModule from '@/components/CategoriesModule.vue'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})
</script>
