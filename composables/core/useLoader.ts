import { ref } from 'vue'

const isLoading = ref(false)

export const useLoader = () => {
  const showLoader = () => {
    isLoading.value = true
  }

  const hideLoader = () => {
    isLoading.value = false
  }

  return {
    isLoading,
    showLoader,
    hideLoader
  }
}
