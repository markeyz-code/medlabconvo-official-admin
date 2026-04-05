<template>
  <Teleport to="body">
    <transition name="modal">
      <div
        v-if="modelValue"
        class="modal-root"
        @click.self="closeModal"
      >
        <transition name="modal-content">
          <div
            v-if="modelValue"
            :class="['modal-panel', sizeClass]"
            @click.stop
          >
            <!-- Header -->
            <div class="modal-header">
              <div class="modal-header-content">
                <div class="modal-header-indicator"></div>
                <h3 class="modal-title">{{ title }}</h3>
              </div>
              <button @click="closeModal" class="modal-close" aria-label="Close">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <!-- Content -->
            <div class="modal-body">
              <slot />
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, watch, onMounted, onUnmounted } from 'vue'

interface Props {
  modelValue: boolean
  title: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md'
})

const emit = defineEmits(['update:modelValue'])

const sizeClass = computed(() => {
  const sizes: Record<string, string> = {
    sm: 'modal-sm',
    md: 'modal-md',
    lg: 'modal-lg',
    xl: 'modal-xl',
  }
  return sizes[props.size] || sizes.md
})

const closeModal = () => {
  emit('update:modelValue', false)
}

const handleEscape = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.modelValue) closeModal()
}

watch(() => props.modelValue, (isOpen) => {
  document.body.style.overflow = isOpen ? 'hidden' : ''
})

onMounted(() => document.addEventListener('keydown', handleEscape))
onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
  document.body.style.overflow = ''
})
</script>

<style scoped>
.modal-root {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: rgba(3, 57, 88, 0.18);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
}

.modal-panel {
  background: #ffffff;
  border-radius: 20px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  border: 1px solid rgba(0, 0, 0, 0.04);
}

/* Sizes */
.modal-sm { max-width: 420px; }
.modal-md { max-width: 520px; }
.modal-lg { max-width: 680px; }
.modal-xl { max-width: 900px; }

/* Header */
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #f1f5f9;
}

.modal-header-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.modal-header-indicator {
  width: 3px;
  height: 20px;
  background: #033958;
  border-radius: 4px;
  flex-shrink: 0;
}

.modal-title {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.01em;
  margin: 0;
}

.modal-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 10px;
  border: 1px solid #f1f5f9;
  background: #ffffff;
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: #fef2f2;
  border-color: #fecaca;
  color: #ef4444;
  transform: rotate(90deg);
}

/* Body */
.modal-body {
  overflow-y: auto;
}

.modal-body::-webkit-scrollbar {
  width: 4px;
}

.modal-body::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 4px;
}

/* Transitions */
.modal-enter-active { transition: opacity 0.25s ease; }
.modal-leave-active { transition: opacity 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }

.modal-content-enter-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.modal-content-leave-active {
  transition: all 0.2s ease;
}
.modal-content-enter-from {
  opacity: 0;
  transform: scale(0.95) translateY(8px);
}
.modal-content-leave-to {
  opacity: 0;
  transform: scale(0.97) translateY(4px);
}
</style>