

// src/composables/core/useCustomToast.ts
import { ref, shallowRef, onMounted, createApp, h } from 'vue'
import ToastComponent from '@/components/core/Toast.vue'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface ToastOptions {
  title: string
  message: string
  toastType: ToastType
  duration?: number
}

// Create a singleton instance
let toastApp: any = null
let toastInstance: any = null

export const useCustomToast = () => {
  // Initialize toast on first call
  if (!toastApp && typeof window !== 'undefined') {
    // Create container
    const toastContainer = document.createElement('div')
    toastContainer.id = 'toast-container'
    document.body.appendChild(toastContainer)
    
    // Create app instance
    toastApp = createApp(ToastComponent)
    toastInstance = toastApp.mount('#toast-container')
  }
  
  // Show toast function
  const showToast = (options: ToastOptions) => {
    if (!toastInstance) {
      console.error('Toast component not initialized')
      return
    }
    
    const { title, message, toastType, duration = 5000 } = options
    
    // Map toastType to the type expected by the component
    const type = toastType as ToastType
    
    // Call the exposed method
    return toastInstance.showToast(title, message, type, duration)
  }
  
  return {
    showToast
  }
}