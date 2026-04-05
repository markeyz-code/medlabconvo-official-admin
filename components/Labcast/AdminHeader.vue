<template>
    <div class="mb-8">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">{{ title }}</h1>
          <p v-if="subtitle" class="mt-1 text-sm text-gray-900">{{ subtitle }}</p>
        </div>
        <div v-if="$slots.actions" class="mt-4 sm:mt-0">
          <slot name="actions" />
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  interface Props {
    title: string
    subtitle?: string
  }
  
  defineProps<Props>()
  </script>
  