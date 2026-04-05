<template>
  <main>
    <div class="">
      <!-- <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
          <h1 class="text-base font-semibold leading-6 text-gray-900">Content Management</h1>
          <p class="mt-2 text-sm text-gray-700">Manage all dynamic content and pages across your platform seamlessly.</p>
        </div>
      </div> -->
      <PagesModule />
    </div>
  </main>
</template>

<script setup lang="ts">
import { definePageMeta } from '#imports'

definePageMeta({
  layout: 'dashboard'
})
</script>
