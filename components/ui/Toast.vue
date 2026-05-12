<!-- <template>
  <Teleport to="body">
    <div class="fixed bottom-32 left-1/2 transform -translate-x-1/2 z-[9999] flex flex-col-reverse gap-3 max-w-sm w-full items-center px-4">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="[
            'toast-base',
            {
              'bg-[#FEF3F2] border-[#FF383013]': toast.type === 'error',
              'bg-green-50 border-green-200': toast.type === 'success',
              'bg-yellow-50 border-yellow-200': toast.type === 'warning',
              'bg-blue-50 border-blue-200': toast.type === 'info'
            }
          ]"
          class="w-full rounded-2xl border p-[12px] flex items-center gap-3 cursor-pointer"
          @click="removeToast(toast.id)"
        >
          <div class="flex-shrink-0">
            <div :class="[
              'w-8 h-8 rounded-full flex items-center justify-center',
              {
                'text-white': toast.type === 'error',
                'bg-green-500 text-white': toast.type === 'success', 
                'bg-yellow-500 text-white': toast.type === 'warning',
                'bg-blue-500 text-white': toast.type === 'info'
              }
            ]">
              <CheckCircle v-if="toast.type === 'success'" :size="18" />
              <svg v-else-if="toast.type === 'error'" width="30" height="30" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M1.04169 9.99984C1.04169 5.05229 5.05247 1.0415 10 1.0415C14.9476 1.0415 18.9584 5.05229 18.9584 9.99984C18.9584 14.9474 14.9476 18.9582 10 18.9582C5.05247 18.9582 1.04169 14.9474 1.04169 9.99984ZM9.16669 13.3332C9.16669 12.8729 9.5381 12.4998 9.99627 12.4998H10.0038C10.4619 12.4998 10.8334 12.8729 10.8334 13.3332C10.8334 13.7934 10.4619 14.1665 10.0038 14.1665H9.99627C9.5381 14.1665 9.16669 13.7934 9.16669 13.3332ZM9.16669 9.99984C9.16669 10.4601 9.53977 10.8332 10 10.8332C10.4603 10.8332 10.8334 10.4601 10.8334 9.99984V6.6665C10.8334 6.20627 10.4603 5.83317 10 5.83317C9.53977 5.83317 9.16669 6.20627 9.16669 6.6665V9.99984Z" fill="#FF3830"/>
              </svg>

              <AlertTriangle v-else-if="toast.type === 'warning'" :size="18" />
              <Info v-else :size="18" />
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <p :class="[
              'font-medium text-sm leading-tight',
              {
                'text-[#FF3830]': toast.type === 'error',
                'text-green-800': toast.type === 'success',
                'text-yellow-800': toast.type === 'warning', 
                'text-blue-800': toast.type === 'info'
              }
            ]">
              {{ toast.message }}
            </p>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-vue-next'

interface Toast {
  id: number
  title: string
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  duration: number
  timeoutId?: number
}

const toasts = ref<Toast[]>([])
let toastCounter = 0

// Create a new toast
const showToast = (title: string, message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info', duration: number = 5000) => {
  const id = toastCounter++
  const newToast: Toast = { id, title, message, type, duration }
  
  toasts.value.push(newToast)
  
  // Auto-remove toast after duration
  const timeoutId = window.setTimeout(() => {
    removeToast(id)
  }, duration)
  
  // Store timeout ID for cleanup
  newToast.timeoutId = timeoutId
  
  return id
}

// Remove a toast by ID
const removeToast = (id: number) => {
  const index = toasts.value.findIndex(toast => toast.id === id)
  if (index !== -1) {
    // Clear the timeout if it exists
    if (toasts.value[index].timeoutId) {
      clearTimeout(toasts.value[index].timeoutId)
    }
    toasts.value.splice(index, 1)
  }
}

// IMPORTANT: Explicitly expose methods to parent components
defineExpose({
  showToast,
  removeToast
})
</script>

<style scoped>
/* Animations */
.toast-enter-active {
  transition: all 0.3s ease-out;
}

.toast-leave-active {
  transition: all 0.3s ease-in;
}

.toast-enter-from {
  transform: translateY(100%);
  opacity: 0;
}

.toast-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

.toast-base {
  transition: all 0.2s ease-in-out;
}

.toast-base:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}
</style> -->

<template>
  <Teleport to="body">
    <div class="toast-container">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="[
            'toast-item',
            {
              'toast-error': toast.type === 'error',
              'toast-success': toast.type === 'success',
              'toast-warning': toast.type === 'warning',
              'toast-info': toast.type === 'info'
            }
          ]"
          @click="removeToast(toast.id)"
        >
          <div class="toast-icon-wrapper">
            <div :class="['toast-icon', `toast-icon-${toast.type}`]">
              <CheckCircle v-if="toast.type === 'success'" :size="18" />
              <svg v-else-if="toast.type === 'error'" width="30" height="30" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M1.04169 9.99984C1.04169 5.05229 5.05247 1.0415 10 1.0415C14.9476 1.0415 18.9584 5.05229 18.9584 9.99984C18.9584 14.9474 14.9476 18.9582 10 18.9582C5.05247 18.9582 1.04169 14.9474 1.04169 9.99984ZM9.16669 13.3332C9.16669 12.8729 9.5381 12.4998 9.99627 12.4998H10.0038C10.4619 12.4998 10.8334 12.8729 10.8334 13.3332C10.8334 13.7934 10.4619 14.1665 10.0038 14.1665H9.99627C9.5381 14.1665 9.16669 13.7934 9.16669 13.3332ZM9.16669 9.99984C9.16669 10.4601 9.53977 10.8332 10 10.8332C10.4603 10.8332 10.8334 10.4601 10.8334 9.99984V6.6665C10.8334 6.20627 10.4603 5.83317 10 5.83317C9.53977 5.83317 9.16669 6.20627 9.16669 6.6665V9.99984Z" fill="#FF3830"/>
              </svg>
              <AlertTriangle v-else-if="toast.type === 'warning'" :size="18" />
              <Info v-else :size="18" />
            </div>
          </div>
          <div class="toast-content">
            <p :class="['toast-message', `toast-message-${toast.type}`]">
              {{ toast.message }}
            </p>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { CheckCircle, AlertTriangle, Info } from 'lucide-vue-next'

interface Toast {
  id: number
  title: string
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  duration: number
  timeoutId?: number
}

const toasts = ref<Toast[]>([])
let toastCounter = 0

const showToast = (title: string, message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info', duration: number = 5000) => {
  const id = toastCounter++
  const newToast: Toast = { id, title, message, type, duration }
  
  toasts.value.push(newToast)
  
  const timeoutId = window.setTimeout(() => {
    removeToast(id)
  }, duration)
  
  newToast.timeoutId = timeoutId
  
  return id
}

const removeToast = (id: number) => {
  const index = toasts.value.findIndex(toast => toast.id === id)
  if (index !== -1) {
    if (toasts.value[index].timeoutId) {
      clearTimeout(toasts.value[index].timeoutId)
    }
    toasts.value.splice(index, 1)
  }
}

defineExpose({
  showToast,
  removeToast
})
</script>

<style scoped>
/* AGGRESSIVE Z-INDEX FIX - Using !important to override everything */
.toast-container {
  position: fixed !important;
  bottom: 8rem !important;
  left: 50% !important;
  transform: translateX(-50%) !important;
  z-index: 999999 !important;
  display: flex !important;
  flex-direction: column-reverse !important;
  gap: 0.75rem !important;
  max-width: 24rem !important;
  width: 100% !important;
  align-items: center !important;
  padding: 0 1rem !important;
  pointer-events: none !important;
}

.toast-item {
  width: 100% !important;
  border-radius: 1rem !important;
  border-width: 1px !important;
  padding: 0.75rem !important;
  display: flex !important;
  align-items: center !important;
  gap: 0.75rem !important;
  cursor: pointer !important;
  transition: all 0.2s ease-in-out !important;
  pointer-events: auto !important;
  position: relative !important;
  z-index: 999999 !important;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2) !important;
}

.toast-item:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 12px 50px rgba(0, 0, 0, 0.25) !important;
}

/* Toast type styles */
.toast-error {
  background-color: #FEF3F2 !important;
  border-color: rgba(255, 56, 48, 0.075) !important;
}

.toast-success {
  background-color: #f0fdf4 !important;
  border-color: #bbf7d0 !important;
}

.toast-warning {
  background-color: #fefce8 !important;
  border-color: #fef08a !important;
}

.toast-info {
  background-color: #eff6ff !important;
  border-color: #bfdbfe !important;
}

/* Icon wrapper */
.toast-icon-wrapper {
  flex-shrink: 0 !important;
}

.toast-icon {
  width: 2rem !important;
  height: 2rem !important;
  border-radius: 9999px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  color: white !important;
}

.toast-icon-error {
  color: white !important;
}

.toast-icon-success {
  background-color: #22c55e !important;
  color: white !important;
}

.toast-icon-warning {
  background-color: #eab308 !important;
  color: white !important;
}

.toast-icon-info {
  background-color: #3b82f6 !important;
  color: white !important;
}

/* Content */
.toast-content {
  flex: 1 !important;
  min-width: 0 !important;
}

.toast-message {
  font-weight: 500 !important;
  font-size: 0.875rem !important;
  line-height: 1.25 !important;
}

.toast-message-error {
  color: #FF3830 !important;
}

.toast-message-success {
  color: #166534 !important;
}

.toast-message-warning {
  color: #854d0e !important;
}

.toast-message-info {
  color: #1e40af !important;
}

/* Animations */
.toast-enter-active {
  transition: all 0.3s ease-out !important;
}

.toast-leave-active {
  transition: all 0.3s ease-in !important;
}

.toast-enter-from {
  transform: translateY(100%) !important;
  opacity: 0 !important;
}

.toast-leave-to {
  transform: translateY(100%) !important;
  opacity: 0 !important;
}
</style>