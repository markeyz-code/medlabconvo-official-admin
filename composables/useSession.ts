import { ref } from "vue"
import { auth_api } from "@/api_factory/modules/auth"
import { useUser } from "@/composables/modules/auth/user"

const refreshing = ref(false)
let lastRefresh = 0

export const useSession = () => {
  const { token, setUser, user, permissions } = useUser()

  /**
   * Pulls the authoritative user + permissions from the API.
   * Called on boot, route middleware and after role changes so a revoked
   * role cannot keep browsing with a stale cookie.
   */
  const refreshUser = async (force = false): Promise<any | null> => {
    if (!token.value) return null
    if (refreshing.value) return user.value
    if (!force && Date.now() - lastRefresh < 5_000 && permissions.value.length) {
      return user.value
    }

    refreshing.value = true
    try {
      const response = await auth_api.$_get_me()
      const payload = response?.data?.user || response?.data
      if (payload) {
        setUser(payload)
        lastRefresh = Date.now()
        return payload
      }
      return null
    } catch {
      return null
    } finally {
      refreshing.value = false
    }
  }

  return { refreshUser, refreshing }
}
