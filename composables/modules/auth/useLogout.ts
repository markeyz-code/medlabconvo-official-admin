import { ref } from 'vue'
import { useUser } from '@/composables/modules/auth/user'

export const useLogout = () => {
  const loading = ref(false)

  const logout = async () => {
    loading.value = true
    
    try {
      const { logOut } = useUser()
      logOut()
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    logout,
  }
}