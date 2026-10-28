/** Fallback route → permission map for pages that don't declare meta.permission. */
export const ROUTE_PERMISSIONS: Array<{ prefix: string; permission: string }> = [
  { prefix: "/dashboard/access-control/roles", permission: "roles:read" },
  { prefix: "/dashboard/access-control/permissions", permission: "permissions:read" },
  { prefix: "/dashboard/users", permission: "users:read" },
  { prefix: "/dashboard/teams", permission: "teams:read" },
  { prefix: "/dashboard/leadership", permission: "teams:read" },
  { prefix: "/dashboard/enquiries", permission: "enquiries:read" },
  { prefix: "/dashboard/subscriptions", permission: "subscriptions:read" },
  { prefix: "/dashboard/campaigns", permission: "campaigns:read" },
  { prefix: "/dashboard/publications", permission: "publications:read" },
  { prefix: "/dashboard/convostack", permission: "convostack:read" },
  { prefix: "/dashboard/labcast", permission: "labcast:read" },
  { prefix: "/dashboard/products", permission: "products:read" },
  { prefix: "/dashboard/programs", permission: "programs:read" },
  { prefix: "/dashboard/blogs", permission: "blogs:read" },
  { prefix: "/dashboard/forms", permission: "forms:read" },
  { prefix: "/dashboard/cms", permission: "cms:read" },
  { prefix: "/dashboard/short-reads", permission: "short_reads:read" },
  { prefix: "/dashboard/audit", permission: "audit:read" },
  { prefix: "/dashboard/style-guide", permission: "dashboard:view" },
]

export function permissionForRoute(path: string): string | null {
  if (path === "/dashboard/forbidden" || path === "/dashboard/profile") return null
  const match = ROUTE_PERMISSIONS.find(
    (route) => path === route.prefix || path.startsWith(`${route.prefix}/`),
  )
  return match?.permission || "dashboard:view"
}

const LANDING_ROUTES: Array<{ path: string; permission: string }> = [
  { path: "/dashboard", permission: "dashboard:view" },
  { path: "/dashboard/publications", permission: "publications:read" },
  { path: "/dashboard/blogs", permission: "blogs:read" },
  { path: "/dashboard/labcast", permission: "labcast:read" },
  { path: "/dashboard/convostack", permission: "convostack:read" },
  { path: "/dashboard/forms", permission: "forms:read" },
  { path: "/dashboard/programs", permission: "programs:read" },
  { path: "/dashboard/products", permission: "products:read" },
  { path: "/dashboard/short-reads", permission: "short_reads:read" },
  { path: "/dashboard/cms", permission: "cms:read" },
  { path: "/dashboard/users", permission: "users:read" },
  { path: "/dashboard/enquiries", permission: "enquiries:read" },
  { path: "/dashboard/teams", permission: "teams:read" },
  { path: "/dashboard/audit", permission: "audit:read" },
  { path: "/dashboard/access-control/roles", permission: "roles:read" },
  { path: "/dashboard/access-control/permissions", permission: "permissions:read" },
]

export function landingRouteFor(hasPermission: (permission: string) => boolean): string {
  return LANDING_ROUTES.find((route) => hasPermission(route.permission))?.path || "/dashboard/forbidden"
}
