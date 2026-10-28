/**
 * Mirror of `backend/src/common/constants/permissions.ts`.
 * Keep the two catalogues in sync — they are the contract between apps.
 */
export const PERMISSION_RESOURCES = {
  dashboard: ["view"],
  users: ["read", "create", "update", "delete"],
  roles: ["read", "create", "update", "delete"],
  permissions: ["read", "create", "update", "delete"],
  audit: ["read"],
  teams: ["read", "create", "update", "delete"],
  enquiries: ["read", "create", "update", "delete"],
  subscriptions: ["read", "create", "update", "delete"],
  campaigns: ["read", "create", "update", "delete"],
  publications: ["read", "create", "update", "delete", "publish"],
  convostack: ["read", "create", "update", "delete"],
  labcast: ["read", "create", "update", "delete"],
  products: ["read", "create", "update", "delete"],
  programs: ["read", "create", "update", "delete"],
  blogs: ["read", "create", "update", "delete", "publish"],
  forms: ["read", "create", "update", "delete"],
  cms: ["read", "update", "delete"],
  short_reads: ["read", "create", "update", "delete"],
  images: ["create", "delete"],
} as const

export type PermissionResource = keyof typeof PERMISSION_RESOURCES

export const ALL_PERMISSIONS: string[] = Object.entries(PERMISSION_RESOURCES).flatMap(
  ([resource, actions]) => actions.map((action) => `${resource}:${action}`),
)

export const ROLE_PERMISSIONS: Record<string, string[]> = {
  super_admin: ["*"],
  executive_director: ["*"],
  asst_executive_director: [
    "dashboard:view",
    ...expandResource("users"),
    ...expandResource("audit"),
    ...expandResource("teams"),
    ...expandResource("enquiries"),
    ...expandResource("subscriptions"),
    ...expandResource("campaigns"),
    ...expandResource("publications"),
    ...expandResource("convostack"),
    ...expandResource("labcast"),
    ...expandResource("products"),
    ...expandResource("programs"),
    ...expandResource("blogs"),
    ...expandResource("forms"),
    ...expandResource("cms"),
    ...expandResource("short_reads"),
    ...expandResource("images"),
  ],
  admin: [
    "dashboard:view",
    ...expandResource("users"),
    ...expandResource("audit"),
    ...expandResource("teams"),
    ...expandResource("enquiries"),
    ...expandResource("subscriptions"),
    ...expandResource("campaigns"),
    ...expandResource("publications"),
    ...expandResource("convostack"),
    ...expandResource("labcast"),
    ...expandResource("products"),
    ...expandResource("programs"),
    ...expandResource("blogs"),
    ...expandResource("forms"),
    ...expandResource("cms"),
    ...expandResource("short_reads"),
    ...expandResource("images"),
  ],
  editor: [
    "dashboard:view",
    ...expandResource("publications"),
    ...expandResource("convostack"),
    ...expandResource("blogs"),
    ...expandResource("labcast"),
    ...expandResource("forms"),
    ...expandResource("programs"),
    ...expandResource("campaigns"),
    ...expandResource("images"),
  ],
  head_of_department: [
    "dashboard:view",
    ...expandResource("teams"),
    ...expandResource("publications"),
    ...expandResource("programs"),
    ...expandResource("images"),
  ],
  co_lead: [
    "dashboard:view",
    "teams:read",
    ...expandResource("publications"),
    ...expandResource("images"),
  ],
  member: [],
}

function expandResource(resource: PermissionResource): string[] {
  return PERMISSION_RESOURCES[resource].map((action) => `${resource}:${action}`)
}

export const PERMISSION_ALIASES: Record<string, string[]> = {
  "users:write": ["users:create", "users:update", "users:delete"],
  "roles:write": ["roles:create", "roles:update", "roles:delete"],
  "teams:write": ["teams:create", "teams:update", "teams:delete"],
  "enquiries:write": ["enquiries:create", "enquiries:update", "enquiries:delete"],
  "subscriptions:write": ["subscriptions:create", "subscriptions:update", "subscriptions:delete"],
  "campaigns:write": ["campaigns:create", "campaigns:update", "campaigns:delete"],
  "publications:write": ["publications:create", "publications:update", "publications:delete"],
  "convostack:write": ["convostack:create", "convostack:update", "convostack:delete"],
  "labcast:write": ["labcast:create", "labcast:update", "labcast:delete"],
  "products:write": ["products:create", "products:update", "products:delete"],
  "programs:write": ["programs:create", "programs:update", "programs:delete"],
  "blogs:write": ["blogs:create", "blogs:update", "blogs:delete"],
  "forms:write": ["forms:create", "forms:update", "forms:delete"],
  "cms:write": ["cms:update", "cms:delete"],
  "short_reads:write": ["short_reads:create", "short_reads:update", "short_reads:delete"],
}

export function expandPermissions(permissions: string[] = []): string[] {
  const expanded = new Set<string>()
  for (const permission of permissions) {
    expanded.add(permission)
    if (permission === "*") {
      ALL_PERMISSIONS.forEach((item) => expanded.add(item))
      continue
    }
    if (permission.endsWith(":*")) {
      const resource = permission.slice(0, -2)
      ALL_PERMISSIONS.filter((item) => item.startsWith(`${resource}:`)).forEach((item) => expanded.add(item))
      continue
    }
    const aliases = PERMISSION_ALIASES[permission]
    if (aliases) aliases.forEach((item) => expanded.add(item))
  }
  return Array.from(expanded)
}

export function hasPermission(granted: string[] = [], required: string): boolean {
  if (!required) return true
  if (granted.includes("*")) return true
  if (granted.includes(required)) return true
  const [resource] = required.split(":")
  if (granted.includes(`${resource}:*`)) return true
  return expandPermissions(granted).includes(required)
}

export function hasAnyPermission(granted: string[] = [], required: string[] = []): boolean {
  return required.some((permission) => hasPermission(granted, permission))
}

export function hasAllPermissions(granted: string[] = [], required: string[] = []): boolean {
  return required.every((permission) => hasPermission(granted, permission))
}

export const ROLE_LABELS: Record<string, string> = {
  super_admin: "Super Admin",
  executive_director: "Executive Director",
  asst_executive_director: "Assistant Executive Director",
  head_of_department: "Head of Department",
  co_lead: "Co-Lead",
  admin: "Admin",
  editor: "Editor",
  member: "Member",
}

export function roleLabel(role?: string): string {
  if (!role) return "Unassigned"
  return ROLE_LABELS[role] || role.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
}

/** Routes that are safe for any authenticated admin user. */
export const ALWAYS_ALLOWED_ROUTES = ["/dashboard", "/dashboard/forbidden", "/dashboard/profile"]

/** Map an API request to the permission it requires. Used by the axios guard. */
export function permissionForRequest(method: string, url: string): string | null {
  const clean = (url || "").split("?")[0].replace(/^\/+/, "")
  const verb = (method || "get").toLowerCase()
  const segments = clean.split("/")
  const root = segments[0]
  const rest = segments.slice(1)

  const read = { get: "read", head: "read" }[verb]
  const write = ["post", "patch", "put"].includes(verb)
  const remove = verb === "delete"

  if (root === "auth") return null
  if (root === "users" || root === "invitations") {
    if (segments[1] === "signup") return write ? "users:create" : null
    if (read) return "users:read"
    if (write) return "users:create"
    if (remove) return "users:delete"
  }
  if (root === "roles") {
    if (rest[0] === "permissions") {
      if (read) return "permissions:read"
      if (write) return "permissions:update"
    }
    if (read) return "roles:read"
    if (write) return segments.length > 1 ? "roles:update" : "roles:create"
    if (remove) return "roles:delete"
  }
  if (root === "audit") return "audit:read"
  if (root === "teams" || root === "admin") {
    if (root === "admin") return read ? "teams:read" : "teams:update"
    if (read) return "teams:read"
    if (write) return segments.length > 1 ? "teams:update" : "teams:create"
    if (remove) return "teams:delete"
  }
  if (root === "enquiries") {
    if (read) return "enquiries:read"
    if (write) return "enquiries:create"
    if (remove) return "enquiries:delete"
  }
  if (root === "subscriptions") {
    if (read) return "subscriptions:read"
    if (write) return "subscriptions:update"
    if (remove) return "subscriptions:delete"
  }
  if (root === "emails") {
    if (read) return "campaigns:read"
    if (write) return rest.length === 1 ? "campaigns:create" : "campaigns:update"
  }
  if (root === "publications" || (root === "journo" && rest[0] === "categories")) {
    if (read) return "publications:read"
    if (remove) return "publications:delete"
    if (write) {
      if (verb === "post") return "publications:create"
      if (clean.includes("/publish")) return "publications:publish"
      return "publications:update"
    }
  }
  if (root === "convostack") {
    if (read) return "convostack:read"
    if (remove) return "convostack:delete"
    if (write) return rest.length ? "convostack:update" : "convostack:create"
  }
  if (root === "labcast") {
    if (read) return "labcast:read"
    if (remove) return "labcast:delete"
    if (write) return rest.length ? "labcast:update" : "labcast:create"
  }
  if (root === "products") {
    if (read) return "products:read"
    if (remove) return "products:delete"
    if (write) return rest.length ? "products:update" : "products:create"
  }
  if (root === "programs") {
    if (read) return "programs:read"
    if (remove) return "programs:delete"
    if (write) return rest.length ? "programs:update" : "programs:create"
  }
  if (root === "blogs") {
    if (read) return "blogs:read"
    if (remove) return "blogs:delete"
    if (write) return rest.length ? "blogs:update" : "blogs:create"
  }
  if (root === "forms") {
    if (read) return clean.includes("/public/") ? null : "forms:read"
    if (remove) return "forms:delete"
    if (write) {
      if (clean.includes("/submit/")) return null
      return rest.length ? "forms:update" : "forms:create"
    }
  }
  if (root === "cms") {
    if (read) return "cms:read"
    if (remove) return "cms:delete"
    if (write) return "cms:update"
  }
  if (root === "short-reads") {
    if (read) return "short_reads:read"
    if (remove) return "short_reads:delete"
    if (write) return rest.length ? "short_reads:update" : "short_reads:create"
  }
  if (root === "images" || root === "cloudinary") {
    if (read) return null
    if (remove) return "images:delete"
    if (write) return "images:create"
  }
  return null
}
