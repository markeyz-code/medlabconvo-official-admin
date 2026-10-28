import { useUser } from "@/composables/modules/auth/user"
import { useSession } from "@/composables/useSession"

/**
 * Boot-time permission hydration. A cookie can be days old, so always pull
 * the current role + permissions before the first protected screen renders.
 */
export default defineNuxtPlugin(async () => {
  const { isLoggedIn } = useUser()
  if (!isLoggedIn.value) return
  try {
    await useSession().refreshUser(true)
  } catch {
    // The axios interceptor handles expired sessions.
  }
})
