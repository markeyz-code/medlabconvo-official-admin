import { defineNuxtRouteMiddleware, navigateTo, useCookie } from "#app"
import { useUser } from "@/composables/modules/auth/user"
import { useSession } from "@/composables/useSession"
import { permissionForRoute } from "@/utils/routePermissions"

export default defineNuxtRouteMiddleware(async (to) => {
  const token = useCookie<string | null>("token")
  if (!token.value) {
    return navigateTo("/")
  }

  const { refreshUser } = useSession()
  await refreshUser()

  const { permissions, hasPermission, isAdmin } = useUser()

  // Avoid a redirect loop; this page renders its own "no access" state.
  if (to.path === "/dashboard/forbidden") return

  // Members and accounts with no admin permissions must never see admin chrome.
  if (!isAdmin.value) {
    return navigateTo("/dashboard/forbidden")
  }

  const required =
    (to.meta?.permission as string | undefined) || permissionForRoute(to.path) || null

  if (required && !hasPermission(required)) {
    return navigateTo({ path: "/dashboard/forbidden", query: { from: to.fullPath, need: required } })
  }

  // Keep the permission list fresh for very long-lived tabs.
  if (permissions.value.length === 0) {
    return navigateTo("/dashboard/forbidden")
  }
})
