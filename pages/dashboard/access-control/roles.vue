<template>
  <div class="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
    <!-- Page header -->
    <div class="sm:flex sm:justify-between sm:items-center mb-8">
      <div class="mb-4 sm:mb-0">
        <h1 class="text-2xl md:text-3xl text-slate-800 font-bold">Roles Ledger ✨</h1>
        <p class="text-slate-500 font-medium text-sm mt-1">Manage system identities, access contours, and assign aggregated operational privileges.</p>
      </div>
    </div>

    <!-- Core component -->
    <RolesModule />
  </div>
</template>

<script setup lang="ts">
import { definePageMeta } from '#imports'
import RolesModule from '@/components/RolesModule.vue'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})
</script>
