<template>
  <Teleport to="body">
    <transition name="slideover">
      <div v-if="modelValue" class="slideover-root">
        <!-- Backdrop -->
        <transition name="slideover-backdrop">
          <div 
            v-if="modelValue"
            class="slideover-backdrop" 
            @click="close"
            aria-hidden="true"
          ></div>
        </transition>

        <!-- Panel -->
        <transition name="slideover-panel">
          <div 
            v-if="modelValue"
            :class="['slideover-panel', sizeClass]"
          >
            <!-- Header -->
            <div class="slideover-header">
              <div class="slideover-header-content">
                <div class="slideover-header-indicator"></div>
                <h2 class="slideover-title">{{ title }}</h2>
              </div>
              <button 
                @click="close"
                class="slideover-close"
                aria-label="Close panel"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Body -->
            <div class="slideover-body">
              <slot></slot>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import { watch, onMounted, onUnmounted, computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    required: true
  },
  size: {
    type: String as () => 'sm' | 'md' | 'lg' | 'xl' | 'full',
    default: 'md'
  }
})

const emit = defineEmits(['update:modelValue', 'close'])

const sizeClass = computed(() => {
  const sizes: Record<string, string> = {
    sm: 'slideover-sm',
    md: 'slideover-md',
    lg: 'slideover-lg',
    xl: 'slideover-xl',
    full: 'slideover-full',
  }
  return sizes[props.size] || sizes.md
})

const close = () => {
  emit('update:modelValue', false)
  emit('close')
}

const handleEscape = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.modelValue) {
    close()
  }
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
.slideover-root {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  justify-content: flex-end;
}

.slideover-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(3, 57, 88, 0.18);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
}

.slideover-panel {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-left: 1px solid rgba(0, 0, 0, 0.04);
  pointer-events: auto;
}

/* Sizes */
.slideover-sm { width: 100%; max-width: 380px; }
.slideover-md { width: 100%; max-width: 480px; }
.slideover-lg { width: 100%; max-width: 640px; }
.slideover-xl { width: 100%; max-width: 800px; }
.slideover-full { width: 100%; max-width: 100%; }

/* Header */
.slideover-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #f1f5f9;
  flex-shrink: 0;
}

.slideover-header-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.slideover-header-indicator {
  width: 3px;
  height: 20px;
  background: #033958;
  border-radius: 4px;
  flex-shrink: 0;
}

.slideover-title {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.01em;
  line-height: 1.2;
  margin: 0;
}

.slideover-close {
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
  flex-shrink: 0;
}

.slideover-close:hover {
  background: #fef2f2;
  border-color: #fecaca;
  color: #ef4444;
  transform: rotate(90deg);
}

/* Body */
.slideover-body {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}

.slideover-body::-webkit-scrollbar {
  width: 4px;
}

.slideover-body::-webkit-scrollbar-track {
  background: transparent;
}

.slideover-body::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 4px;
}

.slideover-body::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}

/* Transitions */
.slideover-enter-active,
.slideover-leave-active {
  transition: opacity 0.25s ease;
}
.slideover-enter-from,
.slideover-leave-to {
  opacity: 0;
}

.slideover-backdrop-enter-active {
  transition: opacity 0.3s ease;
}
.slideover-backdrop-leave-active {
  transition: opacity 0.2s ease;
}
.slideover-backdrop-enter-from,
.slideover-backdrop-leave-to {
  opacity: 0;
}

.slideover-panel-enter-active {
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}
.slideover-panel-leave-active {
  transition: transform 0.25s cubic-bezier(0.4, 0, 1, 1);
}
.slideover-panel-enter-from {
  transform: translateX(100%);
}
.slideover-panel-leave-to {
  transform: translateX(100%);
}

/* Responsive */
@media (max-width: 640px) {
  .slideover-sm,
  .slideover-md,
  .slideover-lg,
  .slideover-xl {
    max-width: 100%;
  }
}
</style>
