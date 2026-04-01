<template>
    <div class="bg-white rounded-lg shadow-sm border  p-6">
      <div class="flex items-center">
        <div :class="[
          'flex-shrink-0 p-3 rounded-lg',
          colorClasses[color]
        ]">
          <Icon :name="icon" class="w-6 h-6" />
        </div>
        <div class="ml-4 flex-1">
          <div v-if="loading" class="animate-pulse">
            <div class="h-6 bg-gray-200 rounded w-16 mb-1"></div>
            <div class="h-4 bg-gray-200 rounded w-20"></div>
          </div>
          <div v-else>
            <p class="text-2xl font-semibold text-gray-900">{{ value }}</p>
            <p class="text-sm text-gray-500">{{ title }}</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  interface Props {
    title: string
    value: string | number
    icon: string
    color: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'indigo'
    loading?: boolean
  }
  
  defineProps<Props>()
  
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
    red: 'bg-red-100 text-red-600',
    indigo: 'bg-indigo-100 text-indigo-600'
  }
  </script>
  