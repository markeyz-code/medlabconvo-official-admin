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
      <div v-if="modelValue" class="fixed inset-0 z-50 overflow-y-auto">
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" @click="handleBackdropClick"></div>

        <!-- Modal Container -->
        <div class="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
          <Transition
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to-class="opacity-100 translate-y-0 sm:scale-100"
            leave-active-class="transition-all duration-200 ease-in"
            leave-from-class="opacity-100 translate-y-0 sm:scale-100"
            leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div
              v-if="modelValue"
              :class="[
                'relative transform overflow-hidden rounded-[2.5rem] bg-white text-left shadow-sm border border-slate-200 transition-all my-8 w-full',
                sizeClass
              ]"
            >
              <!-- Header -->
              <div class="flex items-center justify-between px-8 py-6 border-b border-slate-50">
                <div class="flex items-center space-x-3">
                  <div class="w-1.5 h-6 bg-[#033958] rounded-full"></div>
                  <h3 class="text-lg font-bold text-slate-900 tracking-tight">{{ title }}</h3>
                </div>
                <button
                  @click="close"
                  class="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all active:scale-90"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <!-- Content -->
              <div class="max-h-[80vh] overflow-y-auto">
                <div :class="paddingClass">
                  <slot />
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, watch, onUnmounted } from 'vue'

interface Props {
  modelValue: boolean
  title: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  closeOnOutsideClick?: boolean
  paddingClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  closeOnOutsideClick: true,
  paddingClass: 'p-6 lg:p-8'
})

const emit = defineEmits(['update:modelValue', 'close'])

const sizeClass = computed(() => {
  switch (props.size) {
    case 'sm': return 'max-w-md'
    case 'md': return 'max-w-xl'
    case 'lg': return 'max-w-3xl'
    case 'xl': return 'max-w-5xl'
    case '2xl': return 'max-w-7xl'
    case 'full': return 'max-w-[95vw]'
    default: return 'max-w-xl'
  }
})

const close = () => {
  emit('update:modelValue', false)
  emit('close')
}

const handleBackdropClick = () => {
  if (props.closeOnOutsideClick) {
    close()
  }
}

// Prevent scrolling when modal is open
watch(() => props.modelValue, (val) => {
  if (val) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>

<style scoped>
/* Custom scrollbar for modal content */
.max-h-\[80vh\]::-webkit-scrollbar {
  width: 6px;
}

.max-h-\[80vh\]::-webkit-scrollbar-track {
  background: transparent;
}

.max-h-\[80vh\]::-webkit-scrollbar-thumb {
  background: #f1f5f9;
  border-radius: 10px;
}

.max-h-\[80vh\]::-webkit-scrollbar-thumb:hover {
  background: #e2e8f0;
}
</style>