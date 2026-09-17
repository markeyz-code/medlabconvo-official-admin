<template>
    <div class="bg-white rounded-xl  border border-slate-200 p-6 hover: transition-shadow duration-200">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-slate-600">{{ title }}</p>
          <p class="text-lg font-bold text-slate-900 mt-1">{{ value }}</p>
          <div class="flex items-center mt-2">
            <span :class="[
              'text-sm font-medium',
              change?.startsWith('+') ? 'text-green-600' : 'text-red-600'
            ]">
              {{ change }}
            </span>
            <span class="text-sm text-slate-500 ml-1">from last month</span>
          </div>
        </div>
        <div :class="[
          'w-12 h-12 rounded-lg flex items-center justify-center',
          `bg-${color}-100`
        ]">
          <Icon :name="icon" :class="[`text-${color}-600`, 'w-6 h-6']" />
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  interface Props {
    title: string
    value: string
    change: string
    icon: string
    color: string
  }
  
  defineProps<Props>()
  </script>
  