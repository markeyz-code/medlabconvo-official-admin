<template>
    <div class="flex items-center justify-between">
      <div class="flex-1 flex justify-between sm:hidden">
        <button
          @click="$emit('page-change', currentPage - 1)"
          :disabled="currentPage <= 1"
          class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          @click="$emit('page-change', currentPage + 1)"
          :disabled="currentPage >= totalPages"
          class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
      
      <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-gray-700">
            Showing
            <span class="font-medium">{{ startItem }}</span>
            to
            <span class="font-medium">{{ endItem }}</span>
            of
            <span class="font-medium">{{ totalCount }}</span>
            results
          </p>
        </div>
        
        <div>
          <nav class="relative z-0 inline-flex rounded-md  -space-x-px">
            <button
              @click="$emit('page-change', currentPage - 1)"
              :disabled="currentPage <= 1"
              class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-900 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Icon name="lucide:chevron-left" class="w-5 h-5" />
            </button>
            
            <button
              v-for="page in visiblePages"
              :key="page"
              @click="$emit('page-change', page)"
              :class="[
                'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                page === currentPage
                  ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                  : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50'
              ]"
            >
              {{ page }}
            </button>
            
            <button
              @click="$emit('page-change', currentPage + 1)"
              :disabled="currentPage >= totalPages"
              class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-900 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Icon name="lucide:chevron-right" class="w-5 h-5" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue'
  // import Icon from './Icon.vue'
  
  interface Props {
    currentPage: number
    totalCount: number
    perPage: number
  }
  
  const props = defineProps<Props>()
  
  defineEmits<{
    'page-change': [page: number]
  }>()
  
  const totalPages = computed(() => Math.ceil(props.totalCount / props.perPage))
  const startItem = computed(() => (props.currentPage - 1) * props.perPage + 1)
  const endItem = computed(() => Math.min(props.currentPage * props.perPage, props.totalCount))
  
  const visiblePages = computed(() => {
    const pages = []
    const maxVisible = 7
    const half = Math.floor(maxVisible / 2)
    
    let start = Math.max(1, props.currentPage - half)
    let end = Math.min(totalPages.value, start + maxVisible - 1)
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1)
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    
    return pages
  })
  </script>
  