<template>
  <div class="">
    <!-- Page header -->
    <!-- <div class="sm:flex sm:justify-between sm:items-center mb-8">
      <div class="mb-4 sm:mb-0">
        <h1 class="text-lg md:text-lg text-slate-800 font-bold">Permissions ✨</h1>
        <p class="text-slate-500 font-medium text-sm mt-1">Define specific actions allowed in the system.</p>
      </div>
    </div> -->

    <!-- Core component -->
    <PermissionsModule />
  </div>
</template>

<script setup lang="ts">

import PermissionsModule from '@/components/PermissionsModule.vue'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})
</script>
