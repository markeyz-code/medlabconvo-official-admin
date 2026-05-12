<template>
    <div
      v-if="modelValue"
      class="fixed inset-0 z-50 overflow-y-auto"
    >
      <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"></div>
  
        <div class="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white  rounded-lg">
          <div class="flex items-center mb-4">
            <div class="flex-shrink-0 w-10 h-10 mx-auto bg-red-100 rounded-full flex items-center justify-center">
              <Icon name="lucide:alert-triangle" class="w-6 h-6 text-red-600" />
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
            </div>
          </div>
  
          <div class="mb-6">
            <p class="text-sm text-gray-900">{{ message }}</p>
          </div>
  
          <div class="flex justify-end space-x-3">
            <button
              @click="$emit('update:modelValue', false)"
              type="button"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="$emit('confirm')"
              type="button"
              :class="[
                'px-4 py-2 text-sm font-medium text-white border border-transparent rounded-lg transition-colors',
                confirmClass || 'bg-red-600 hover:bg-red-700'
              ]"
            >
              {{ confirmText || 'Confirm' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  interface Props {
    modelValue: boolean
    title: string
    message: string
    confirmText?: string
    confirmClass?: string
  }
  
  defineProps<Props>()
  
  defineEmits<{
    'update:modelValue': [value: boolean]
    confirm: []
  }>()
  </script>
  