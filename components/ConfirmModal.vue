<template>
    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-300 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="modelValue"
          class="fixed inset-0 z-50 overflow-y-auto"
        >
          <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"></div>
  
            <Transition
              enter-active-class="transition-all duration-300 ease-out"
              enter-from-class="opacity-0 scale-95 translate-y-4"
              enter-to-class="opacity-100 scale-100 translate-y-0"
              leave-active-class="transition-all duration-200 ease-in"
              leave-from-class="opacity-100 scale-100 translate-y-0"
              leave-to-class="opacity-0 scale-95 translate-y-4"
            >
              <div
                v-if="modelValue"
                class="inline-block w-full max-w-sm p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white rounded-2xl shadow-sm border border-slate-200 border border-slate-100"
              >
                <div class="flex gap-y-6 flex-col items-center mb-4">
                  <div class="flex-shrink-0 w-10 h-10 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                    <AlertTriangle class="w-6 h-6 text-red-600" />
                  </div>
                  <div class="ml-4">
                    <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
                  </div>
                </div>
  
                <div class="mb-6">
                  <p class="text-sm text-center text-gray-900">{{ message }}</p>
                </div>
  
                <div class="flex justify-between space-x-3">
                  <button
                    @click="$emit('update:modelValue', false)"
                    type="button"
                    class="px-4 py-2 text-sm w-full font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    @click="$emit('confirm')"
                    type="button"
                    :class="[
                      'px-4 py-2 text-sm w-full font-medium text-white border border-transparent rounded-lg transition-colors',
                      confirmClass || 'bg-red-600 hover:bg-red-700'
                    ]"
                  >
                    {{ confirmText || 'Confirm' }}
                  </button>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </Transition>
    </Teleport>
  </template>
  
  <script setup lang="ts">
  import { AlertTriangle } from 'lucide-vue-next'
  
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
  