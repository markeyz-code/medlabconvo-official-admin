<template>
  <div class="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
    <!-- Page header -->
    <div class="sm:flex sm:justify-between sm:items-center mb-8">
      <div class="mb-4 sm:mb-0">
        <h1 class="text-2xl md:text-3xl text-slate-800 font-bold">Permissions Table ✨</h1>
        <p class="text-slate-500 font-medium text-sm mt-1">Define atomic constraints and granular access vectors over specific system resources.</p>
      </div>
    </div>

    <!-- Core component -->
    <PermissionsModule />
  </div>
</template>

<script setup lang="ts">
import { definePageMeta } from '#imports'
import PermissionsModule from '@/components/PermissionsModule.vue'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})
</script>
