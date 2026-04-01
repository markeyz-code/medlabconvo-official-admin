import { defineNuxtRouteMiddleware, navigateTo, useCookie } from "#app"

export default defineNuxtRouteMiddleware((to, from) => {
  // Check if user is authenticated via cookie
  const token = useCookie("token")

  if (!token.value) {
    return navigateTo("/")
  }
})
