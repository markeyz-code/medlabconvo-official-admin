<template>
  <div class="">
    <!-- Page header -->
    <!-- <div class="sm:flex sm:justify-between sm:items-center mb-8">
      <div class="mb-4 sm:mb-0">
        <h1 class="text-2xl md:text-2xl text-slate-800 font-bold">Roles ✨</h1>
        <p class="text-slate-500 font-medium text-sm mt-1">Manage user roles and assign permissions.</p>
      </div>
    </div> -->

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
