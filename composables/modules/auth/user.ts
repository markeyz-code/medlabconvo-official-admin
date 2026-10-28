import { computed, ref } from "vue"
import { useCookie } from "#app"
import { hasPermission as checkPermission, roleLabel } from "@/utils/permissions"

const runtimeData = {
  auth: ref(),
  user: ref<any>({}),
  token: ref(""),
}

export const useUser = () => {
  const tokenCookie = useCookie<string | null>("token", {
    maxAge: 60 * 60 * 24 * 7,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  })
  const userCookie = useCookie<any>("user", {
    maxAge: 60 * 60 * 24 * 7,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  })

  const id = computed(() => userCookie.value?.id || userCookie.value?._id || "")

  const user = computed(() => userCookie.value || runtimeData.user.value || {})

  const permissions = computed<string[]>(() => {
    const raw = userCookie.value?.permissions ?? runtimeData.user.value?.permissions
    return Array.isArray(raw) ? raw : []
  })

  const role = computed(() => userCookie.value?.role || "")

  const isLoggedIn = computed(() => {
    const hasToken = !!tokenCookie.value
    const hasUser = !!userCookie.value && typeof userCookie.value === "object" && Object.keys(userCookie.value).length > 0
    return hasToken && hasUser
  })

  const isEmailVerified = computed(() => userCookie.value?.isEmailVerified)

  /** True when the user has at least one permission in the admin console. */
  const isAdmin = computed(() => permissions.value.length > 0)

  const hasPermission = (permission: string): boolean => checkPermission(permissions.value, permission)

  const hasAnyPermission = (required: string[] = []): boolean =>
    required.length === 0 || required.some((permission) => hasPermission(permission))

  const logOut = () => {
    tokenCookie.value = null
    userCookie.value = null
    runtimeData.token.value = ""
    runtimeData.user.value = {}
    if (typeof location !== "undefined") location.href = "/"
  }

  const setToken = (token: string) => {
    tokenCookie.value = token
    runtimeData.token.value = token
  }

  const setUser = (data: any) => {
    if (!data) return
    userCookie.value = data
    runtimeData.user.value = data
  }

  const createUser = (data: any) => {
    const accessToken = data?.access_token
    const userData = data?.user

    if (accessToken) {
      tokenCookie.value = accessToken
      runtimeData.token.value = accessToken
    }
    if (userData) {
      userCookie.value = userData
      runtimeData.user.value = userData
    }
  }

  const updateUser = (newUser: any) => {
    const updatedUser = { ...(userCookie.value || {}), ...newUser }
    userCookie.value = updatedUser
    runtimeData.user.value = updatedUser
  }

  // Hydrate runtime state from cookies (client-side navigation / reload).
  if (!runtimeData.token.value && tokenCookie.value) runtimeData.token.value = tokenCookie.value
  if (
    (!runtimeData.user.value || Object.keys(runtimeData.user.value).length === 0) &&
    userCookie.value
  ) {
    runtimeData.user.value = userCookie.value
  }

  return {
    id,
    isLoggedIn,
    isEmailVerified,
    isAdmin,
    role,
    roleLabel: computed(() => roleLabel(role.value)),
    permissions,
    createUser,
    setUser,
    updateUser,
    setToken,
    logOut,
    hasPermission,
    hasAnyPermission,
    user,
    token: computed(() => tokenCookie.value || ""),
  }
}
