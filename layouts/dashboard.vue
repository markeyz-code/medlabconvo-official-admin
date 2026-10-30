<template>
  <div class="admin-shell">
    <!-- Mobile drawer overlay -->
    <Transition name="fade">
      <button
        v-if="isMobile && sidebarOpen"
        class="sidebar-scrim"
        aria-label="Close navigation"
        @click="closeSidebar"
      />
    </Transition>

    <!-- Sidebar -->
    <aside
      class="admin-sidebar"
      :class="[
        sidebarOpen ? 'is-open' : '',
        isMobile ? '' : collapsed ? 'is-collapsed' : '',
      ]"
      aria-label="Primary navigation"
    >
      <div class="sidebar-brand">
        <NuxtLink to="/dashboard" class="brand-link" @click="closeSidebar">
          <span class="brand-mark">
            <img src="@/assets/img/logo.jpeg" alt="MedLabConvo" />
          </span>
          <span v-if="!collapsed || isMobile" class="brand-copy">
            <span class="brand-name">MedLabConvo</span>
            <span class="brand-sub">Admin console</span>
          </span>
        </NuxtLink>

        <button
          v-if="!isMobile"
          class="collapse-btn"
          :aria-label="collapsed ? 'Expand sidebar' : 'Collapse sidebar'"
          @click="toggleCollapse"
        >
          <Icon :name="collapsed ? 'lucide:chevrons-right' : 'lucide:chevrons-left'" class="w-4 h-4" />
        </button>

        <button
          v-else
          class="collapse-btn"
          aria-label="Close navigation"
          @click="closeSidebar"
        >
          <Icon name="lucide:x" class="w-4 h-4" />
        </button>
      </div>

      <nav class="sidebar-nav scrollbar-slim">
        <template v-for="section in visibleNavigation" :key="section.label">
          <p v-if="!collapsed || isMobile" class="nav-section-label">{{ section.label }}</p>
          <div v-else class="nav-section-rule"></div>

          <template v-for="item in section.items" :key="item.path || item.name">
            <div v-if="item.children" class="nav-group">
              <button
                class="nav-item nav-group-trigger"
                :class="{ 'nav-item-active': isChildActive(item) }"
                :title="collapsed ? item.name : undefined"
                @click="toggleGroup(item.name)"
              >
                <Icon :name="item.icon" class="nav-icon" />
                <span v-if="!collapsed || isMobile" class="nav-text">{{ item.name }}</span>
                <Icon
                  v-if="!collapsed || isMobile"
                  name="lucide:chevron-down"
                  class="nav-chevron"
                  :class="{ 'rotate-180': expandedGroups.includes(item.name) || isChildActive(item) }"
                />
              </button>

              <div
                v-show="(!collapsed || isMobile) && (expandedGroups.includes(item.name) || isChildActive(item))"
                class="nav-children"
              >
                <NuxtLink
                  v-for="child in permittedChildren(item)"
                  :key="child.path"
                  :to="child.path"
                  class="nav-child"
                  :class="{ 'nav-child-active': isActive(child.path) }"
                  @click="closeSidebar"
                >
                  <span class="nav-child-dot"></span>
                  {{ child.name }}
                </NuxtLink>
              </div>
            </div>

            <NuxtLink
              v-else
              :to="item.path"
              class="nav-item"
              :class="{ 'nav-item-active': isActive(item.path) }"
              :title="collapsed ? item.name : undefined"
              @click="closeSidebar"
            >
              <Icon :name="item.icon" class="nav-icon" />
              <span v-if="!collapsed || isMobile" class="nav-text">{{ item.name }}</span>
              <span
                v-if="(!collapsed || isMobile) && item.badge"
                class="nav-badge"
              >
                {{ item.badge }}
              </span>
            </NuxtLink>
          </template>
        </template>
      </nav>

      <div class="sidebar-footer">
        <button class="user-chip" @click="openUserMenu">
          <span class="avatar">{{ initials }}</span>
          <span v-if="!collapsed || isMobile" class="user-chip-copy">
            <span class="user-chip-name">{{ user?.firstName }} {{ user?.lastName }}</span>
            <span class="user-chip-role">{{ roleLabel }}</span>
          </span>
          <Icon
            v-if="!collapsed || isMobile"
            name="lucide:more-vertical"
            class="w-4 h-4 ml-auto text-slate-400"
          />
        </button>
        <button
          v-if="!collapsed || isMobile"
          class="signout-btn"
          @click="showLogoutModal = true"
        >
          <Icon name="lucide:log-out" class="w-4 h-4" />
          Sign out
        </button>
      </div>
    </aside>

    <!-- Main -->
    <div class="admin-main" :class="isMobile ? '' : collapsed ? 'main-collapsed' : 'main-expanded'">
      <header class="admin-header">
        <div class="header-left">
          <button
            class="icon-button mobile-only"
            aria-label="Open navigation"
            @click="openSidebar"
          >
            <Icon name="lucide:menu" class="w-5 h-5" />
          </button>

          <div class="header-context">
            <p class="header-eyebrow">{{ activeSectionLabel }}</p>
            <h1 class="header-title">{{ currentPageTitle }}</h1>
          </div>
        </div>

        <div class="header-actions">
          <button class="search-trigger" @click="showSearchModal = true">
            <Icon name="lucide:search" class="w-4 h-4" />
            <span class="search-label">Search anything…</span>
            <kbd class="search-kbd">⌘K</kbd>
          </button>

          <button class="icon-button search-icon-mobile" aria-label="Search" @click="showSearchModal = true">
            <Icon name="lucide:search" class="w-5 h-5" />
          </button>

          <div class="live-pill mobile-hide">
            <span class="live-dot"></span>
            Live
          </div>

          <div class="header-user" @click="openUserMenu">
            <span class="avatar avatar-sm">{{ initials }}</span>
            <div class="header-user-copy mobile-hide">
              <span class="header-user-name">{{ user?.firstName }} {{ user?.lastName }}</span>
              <span class="header-user-role">{{ roleLabel }}</span>
            </div>
            <Icon name="lucide:chevron-down" class="w-4 h-4 text-slate-400 mobile-hide" />
          </div>
        </div>

        <!-- User dropdown -->
        <Transition name="dropdown">
          <div v-if="userMenuOpen" class="user-menu">
            <div class="user-menu-head">
              <span class="avatar">{{ initials }}</span>
              <div class="min-w-0">
                <p class="user-menu-name">{{ user?.firstName }} {{ user?.lastName }}</p>
                <p class="user-menu-email">{{ user?.email }}</p>
              </div>
            </div>
            <div class="user-menu-meta">
              <span class="badge badge-brand">{{ roleLabel }}</span>
              <span class="user-menu-perms">{{ permissions.length }} permissions</span>
            </div>
            <button class="user-menu-item" @click="refreshAccess">
              <Icon name="lucide:refresh-cw" class="w-4 h-4" />
              Refresh access
            </button>
            <button class="user-menu-item" @click="goToFirstAllowed">
              <Icon name="lucide:layout-dashboard" class="w-4 h-4" />
              My dashboard
            </button>
            <button class="user-menu-item is-danger" @click="showLogoutModal = true; userMenuOpen = false">
              <Icon name="lucide:log-out" class="w-4 h-4" />
              Sign out
            </button>
          </div>
        </Transition>
      </header>

      <main class="admin-content">
        <div class="content-header">
          <div class="content-heading">
            <p class="content-eyebrow">{{ activeSectionLabel }}</p>
            <h2 class="content-title">{{ currentPageTitle }}</h2>
            <p class="content-description">{{ currentPageDescription }}</p>
          </div>
          <div class="content-actions">
            <slot name="header-actions" />
          </div>
        </div>

        <slot />
      </main>

      <!-- Mobile bottom navigation -->
      <nav v-if="isMobile" class="mobile-tabbar" aria-label="Quick navigation">
        <NuxtLink
          v-for="item in mobileTabs"
          :key="item.path"
          :to="item.path"
          class="mobile-tab"
          :class="{ 'mobile-tab-active': isActive(item.path) }"
        >
          <Icon :name="item.icon" class="w-5 h-5" />
          <span>{{ item.short }}</span>
        </NuxtLink>
        <button class="mobile-tab" :class="{ 'mobile-tab-active': sidebarOpen }" @click="openSidebar">
          <Icon name="lucide:menu" class="w-5 h-5" />
          <span>More</span>
        </button>
      </nav>
    </div>

    <!-- Logout confirmation -->
    <Modal v-model="showLogoutModal" title="Sign out of the console?" size="sm">
      <div class="confirm-copy">
        <div class="confirm-icon is-danger">
          <Icon name="lucide:log-out" class="w-6 h-6" />
        </div>
        <p>
          Your session will be terminated on this device. You'll need to sign in with
          a new verification code to return.
        </p>
      </div>
      <template #footer>
        <button class="btn btn-outline w-full sm:w-auto" @click="showLogoutModal = false">
          Stay signed in
        </button>
        <button class="btn btn-danger w-full sm:w-auto" :disabled="logoutLoading" @click="confirmLogout">
          <span v-if="logoutLoading" class="spinner"></span>
          {{ logoutLoading ? 'Signing out…' : 'Yes, sign out' }}
        </button>
      </template>
    </Modal>

    <!-- Command palette -->
    <Modal v-model="showSearchModal" title="Search the console" size="lg">
      <div class="search-modal">
        <div class="search-field">
          <Icon name="lucide:search" class="w-5 h-5 text-slate-400" />
          <input
            ref="searchInputRef"
            v-model="searchQuery"
            type="text"
            placeholder="Search pages, sections and actions…"
            class="search-input"
            @keydown.down.prevent="moveSearch(1)"
            @keydown.up.prevent="moveSearch(-1)"
            @keydown.enter.prevent="openHighlightedResult"
          />
          <button v-if="searchQuery" class="icon-button" aria-label="Clear search" @click="searchQuery = ''">
            <Icon name="lucide:x" class="w-4 h-4" />
          </button>
        </div>

        <div class="search-results scrollbar-slim">
          <p class="search-group-label">
            {{ searchQuery ? 'Results' : 'All accessible sections' }}
          </p>
          <NuxtLink
            v-for="(result, index) in filteredResults"
            :key="result.path"
            :to="result.path"
            class="search-result"
            :class="{ 'is-highlighted': index === searchHighlight }"
            @click="showSearchModal = false"
            @mouseenter="searchHighlight = index"
          >
            <span class="search-result-icon">
              <Icon :name="result.icon || 'lucide:file'" class="w-4 h-4" />
            </span>
            <span class="search-result-copy">
              <span class="search-result-name">{{ result.name }}</span>
              <span v-if="result.parent" class="search-result-parent">{{ result.parent }}</span>
            </span>
            <Icon name="lucide:arrow-up-right" class="w-4 h-4 text-slate-300" />
          </NuxtLink>

          <div v-if="filteredResults.length === 0" class="search-empty">
            <Icon name="lucide:search-x" class="w-8 h-8 text-slate-300" />
            <p>No sections match “{{ searchQuery }}”.</p>
          </div>
        </div>

        <div class="search-hints">
          <span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
          <span><kbd>↵</kbd> open</span>
          <span><kbd>esc</kbd> close</span>
        </div>
      </div>
    </Modal>

    <!-- Global route loader -->
    <Transition name="fade">
      <div v-if="globalLoading" class="global-loader">
        <div class="global-loader-card">
          <span class="spinner spinner-lg"></span>
          <span>Loading…</span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, provide, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Icon from '~/components/Icon.vue'
import Modal from '~/components/Modal.vue'
import { useLogout } from '@/composables/modules/auth/useLogout'
import { useUser } from '@/composables/modules/auth/user'
import { useSession } from '@/composables/useSession'
import { landingRouteFor } from '@/utils/routePermissions'

interface NavItem {
  name: string
  path?: string
  short?: string
  icon: string
  permission?: string
  children?: NavItem[]
  badge?: number | string
}

interface NavSection {
  label: string
  items: NavItem[]
}

const route = useRoute()
const router = useRouter()
const { logout, loading: logoutLoading } = useLogout()
const { user, permissions, hasPermission, roleLabel } = useUser()
const { refreshUser } = useSession()

const isMobile = ref(false)
const sidebarOpen = ref(false)
const collapsed = ref(false)
const userMenuOpen = ref(false)
const showLogoutModal = ref(false)
const showSearchModal = ref(false)
const searchQuery = ref('')
const searchHighlight = ref(0)
const searchInputRef = ref<HTMLInputElement | null>(null)
const expandedGroups = ref<string[]>(['Journo'])
const globalLoading = ref(false)

provide('globalLoading', globalLoading)

const NAVIGATION: NavSection[] = [
  {
    label: 'Overview',
    items: [
      { name: 'Dashboard', path: '/dashboard', short: 'Home', icon: 'lucide:layout-dashboard', permission: 'dashboard:view' },
    ],
  },
  {
    label: 'Audience',
    items: [
      { name: 'Users', path: '/dashboard/users', short: 'Users', icon: 'lucide:users', permission: 'users:read' },
      { name: 'Enquiries', path: '/dashboard/enquiries', short: 'Inbox', icon: 'lucide:messages-square', permission: 'enquiries:read' },
      { name: 'Subscriptions', path: '/dashboard/subscriptions', short: 'Subs', icon: 'lucide:mail', permission: 'subscriptions:read' },
      { name: 'Campaigns', path: '/dashboard/campaigns', icon: 'lucide:send', permission: 'campaigns:read' },
    ],
  },
  {
    label: 'Content',
    items: [
      {
        name: 'Journo',
        icon: 'lucide:file-text',
        permission: 'publications:read',
        children: [
          { name: 'All Journos', path: '/dashboard/publications', icon: 'lucide:file-text', permission: 'publications:read' },
          { name: 'Categories', path: '/dashboard/publications/categories', icon: 'lucide:tags', permission: 'publications:read' },
        ],
      },
      { name: 'Convo Stack', path: '/dashboard/convostack', icon: 'lucide:book-open', permission: 'convostack:read' },
      { name: 'LabCast', path: '/dashboard/labcast', icon: 'lucide:mic', permission: 'labcast:read' },
      { name: 'Blogs', path: '/dashboard/blogs', icon: 'lucide:newspaper', permission: 'blogs:read' },
      { name: 'Short Reads', path: '/dashboard/short-reads', icon: 'lucide:layers', permission: 'short_reads:read' },
      { name: 'Programs', path: '/dashboard/programs', icon: 'lucide:graduation-cap', permission: 'programs:read' },
      { name: 'Inventory', path: '/dashboard/products', icon: 'lucide:archive', permission: 'products:read' },
      { name: 'Forms', path: '/dashboard/forms', icon: 'lucide:clipboard-list', permission: 'forms:read' },
      { name: 'CMS', path: '/dashboard/cms', icon: 'lucide:copy', permission: 'cms:read' },
    ],
  },
  {
    label: 'Organisation',
    items: [
      { name: 'About Us', path: '/dashboard/teams', icon: 'lucide:users-round', permission: 'teams:read' },
      { name: 'Leadership', path: '/dashboard/leadership', icon: 'lucide:user-round-cog', permission: 'teams:read' },
    ],
  },
  {
    label: 'Security & access',
    items: [
      { name: 'Roles', path: '/dashboard/access-control/roles', icon: 'lucide:shield-check', permission: 'roles:read' },
      { name: 'Permissions', path: '/dashboard/access-control/permissions', icon: 'lucide:key-round', permission: 'permissions:read' },
      { name: 'Audit logs', path: '/dashboard/audit', icon: 'lucide:fingerprint', permission: 'audit:read' },
    ],
  },
]

const visibleNavigation = computed<NavSection[]>(() =>
  NAVIGATION.map((section) => ({
    ...section,
    items: section.items.filter((item) => {
      if (item.children) {
        return item.children.some((child) => hasPermission(child.permission || item.permission || ''))
      }
      return hasPermission(item.permission || '')
    }),
  })).filter((section) => section.items.length > 0),
)

const permittedChildren = (item: NavItem) =>
  (item.children || []).filter((child) => hasPermission(child.permission || item.permission || ''))

const flattenedNavigation = computed(() => {
  const result: Array<{ name: string; path: string; icon?: string; parent?: string }> = []
  visibleNavigation.value.forEach((section) => {
    section.items.forEach((item) => {
      if (item.path) result.push({ name: item.name, path: item.path, icon: item.icon })
      permittedChildren(item).forEach((child) => {
        if (child.path) result.push({ name: child.name, path: child.path, icon: child.icon || item.icon, parent: item.name })
      })
    })
  })
  return result
})

const filteredResults = computed(() => {
  if (!searchQuery.value.trim()) return flattenedNavigation.value
  const query = searchQuery.value.toLowerCase()
  return flattenedNavigation.value.filter(
    (item) =>
      item.name.toLowerCase().includes(query) ||
      (item.parent || '').toLowerCase().includes(query),
  )
})

const mobileTabs = computed(() => {
  const preferred = ['/dashboard', '/dashboard/users', '/dashboard/publications', '/dashboard/enquiries']
  const all = flattenedNavigation.value.filter((item) => !item.parent)
  const selected: Array<{ name: string; path: string; icon: string; short: string }> = []

  preferred.forEach((path) => {
    const item = all.find((entry) => entry.path === path)
    if (item) selected.push({ ...item, icon: item.icon || 'lucide:circle', short: item.name.split(' ')[0] })
  })

  for (const item of all) {
    if (selected.length >= 4) break
    if (!selected.some((entry) => entry.path === item.path)) {
      selected.push({ ...item, icon: item.icon || 'lucide:circle', short: item.name.split(' ')[0] })
    }
  }
  return selected.slice(0, 4)
})

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/dashboard/users': 'Users',
  '/dashboard/teams': 'About us',
  '/dashboard/leadership': 'Leadership',
  '/dashboard/enquiries': 'Enquiries',
  '/dashboard/subscriptions': 'Subscriptions',
  '/dashboard/campaigns': 'Campaigns',
  '/dashboard/publications': 'Journo',
  '/dashboard/publications/categories': 'Journo categories',
  '/dashboard/convostack': 'Convo Stack',
  '/dashboard/labcast': 'LabCast',
  '/dashboard/blogs': 'Blogs',
  '/dashboard/short-reads': 'Short Reads',
  '/dashboard/programs': 'Programs',
  '/dashboard/products': 'Inventory',
  '/dashboard/forms': 'Forms',
  '/dashboard/cms': 'CMS',
  '/dashboard/audit': 'Audit logs',
  '/dashboard/access-control/roles': 'Roles',
  '/dashboard/access-control/permissions': 'Permissions',
  '/dashboard/style-guide': 'Design system',
}

const PAGE_DESCRIPTIONS: Record<string, string> = {
  '/dashboard': 'Live platform health, content velocity and the actions that need your attention.',
  '/dashboard/users': 'Manage admin accounts, roles and access state across the console.',
  '/dashboard/teams': 'Maintain the public team profiles, categories and leadership directory.',
  '/dashboard/leadership': 'Curate the leadership directory and public organisation structure.',
  '/dashboard/enquiries': 'Read, triage and resolve messages from the public website.',
  '/dashboard/subscriptions': 'Manage newsletter subscribers and mailing list health.',
  '/dashboard/campaigns': 'Compose, preview and send email campaigns to your audience.',
  '/dashboard/publications': 'Review, approve and publish Journo research submissions.',
  '/dashboard/publications/categories': 'Organise Journo content into reader-friendly categories.',
  '/dashboard/convostack': 'Write, publish and grow the inbuilt Convo Stack publication.',
  '/dashboard/convostack/audience': 'Manage the subscribers who receive every Convo Stack post.',
  '/dashboard/convostack/comments': 'Approve, hide and moderate reader discussion.',
  '/dashboard/convostack/settings': 'Set the name, voice and email details of your publication.',
  '/dashboard/convostack/create': 'Write a new post and publish it to the Convo Stack.',
  '/dashboard/labcast': 'Manage LabCast seasons, episodes, guests and publishing state.',
  '/dashboard/blogs': 'Draft, review and publish editorial blog posts.',
  '/dashboard/short-reads': 'Manage short-form story carousels and cover images.',
  '/dashboard/programs': 'Run programmes, registration windows and applications.',
  '/dashboard/products': 'Manage the inventory, pricing and publication state of products.',
  '/dashboard/forms': 'Build forms, publish them and review submissions.',
  '/dashboard/cms': 'Control dynamic copy and page content across the website.',
  '/dashboard/audit': 'Inspect the immutable record of administrative actions.',
  '/dashboard/access-control/roles': 'Define roles and the permissions bundled into each one.',
  '/dashboard/access-control/permissions': 'Inspect the granular permission catalogue.',
  '/dashboard/style-guide': 'Reference the typography, colour and component system.',
}

const currentPageTitle = computed(() => {
  if (PAGE_TITLES[route.path]) return PAGE_TITLES[route.path]
  const match = flattenedNavigation.value
    .filter((item) => route.path === item.path || route.path.startsWith(`${item.path}/`))
    .sort((a, b) => b.path.length - a.path.length)[0]
  if (match) return match.name
  if (route.path.includes('/create')) return 'Create new'
  if (route.path.includes('/short-reads/')) return 'Edit short read'
  if (route.path.includes('/convostack/')) return 'Edit Convo Stack'
  if (route.path.includes('/leadership/')) return 'Edit team member'
  return 'Admin console'
})

const currentPageDescription = computed(
  () => PAGE_DESCRIPTIONS[route.path] || 'Manage your MedLabConvo platform settings and content.',
)

const activeSectionLabel = computed(() => {
  const section = visibleNavigation.value.find((entry) =>
    entry.items.some((item) => isActive(item.path || '') || (item.children || []).some((child) => isActive(child.path || ''))),
  )
  return section?.label || 'Console'
})

const initials = computed(() => {
  const first = user.value?.firstName?.charAt(0) || ''
  const last = user.value?.lastName?.charAt(0) || ''
  return (first + last || user.value?.email?.charAt(0) || 'A').toUpperCase()
})

const isActive = (path: string) => {
  if (!path) return false
  if (path === '/dashboard') return route.path === '/dashboard'
  return route.path === path || route.path.startsWith(`${path}/`)
}

const isChildActive = (item: NavItem) => (item.children || []).some((child) => isActive(child.path || ''))

const toggleGroup = (name: string) => {
  expandedGroups.value = expandedGroups.value.includes(name)
    ? expandedGroups.value.filter((group) => group !== name)
    : [...expandedGroups.value, name]
}

const openSidebar = () => {
  sidebarOpen.value = true
  if (typeof document !== 'undefined') document.body.classList.add('drawer-open')
}
const closeSidebar = () => {
  if (!isMobile.value) return
  sidebarOpen.value = false
  if (typeof document !== 'undefined') document.body.classList.remove('drawer-open')
}
const toggleCollapse = () => {
  collapsed.value = !collapsed.value
  if (typeof localStorage !== 'undefined') localStorage.setItem('mc-sidebar-collapsed', String(collapsed.value))
}

const openUserMenu = () => {
  userMenuOpen.value = !userMenuOpen.value
}

const goToFirstAllowed = () => {
  userMenuOpen.value = false
  router.push(landingRouteFor(hasPermission))
}

const refreshAccess = async () => {
  userMenuOpen.value = false
  await refreshUser(true)
  if (!hasPermission('dashboard:view')) router.push('/dashboard/forbidden')
}

const confirmLogout = async () => {
  try {
    await logout()
    showLogoutModal.value = false
    router.push('/')
  } catch {
    showLogoutModal.value = false
  }
}

const moveSearch = (direction: number) => {
  if (!filteredResults.value.length) return
  searchHighlight.value =
    (searchHighlight.value + direction + filteredResults.value.length) % filteredResults.value.length
}

const openHighlightedResult = () => {
  const result = filteredResults.value[searchHighlight.value]
  if (!result) return
  showSearchModal.value = false
  router.push(result.path)
}

const syncViewport = () => {
  isMobile.value = typeof window !== 'undefined' && window.innerWidth < 1024
  if (!isMobile.value) {
    sidebarOpen.value = true
    if (typeof document !== 'undefined') document.body.classList.remove('drawer-open')
  } else {
    sidebarOpen.value = false
  }
}

const onKeydown = (event: KeyboardEvent) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault()
    showSearchModal.value = true
  }
  if (event.key === 'Escape') {
    showSearchModal.value = false
    userMenuOpen.value = false
    closeSidebar()
  }
}

const onDocumentClick = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (userMenuOpen.value && !target.closest('.header-user') && !target.closest('.user-menu')) {
    userMenuOpen.value = false
  }
}

watch(route, () => {
  closeSidebar()
  userMenuOpen.value = false
})

watch(showSearchModal, async (open) => {
  if (!open) return
  searchQuery.value = ''
  searchHighlight.value = 0
  await nextTick()
  searchInputRef.value?.focus()
})

onMounted(() => {
  syncViewport()
  if (typeof localStorage !== 'undefined') {
    collapsed.value = localStorage.getItem('mc-sidebar-collapsed') === 'true'
  }
  window.addEventListener('resize', syncViewport)
  window.addEventListener('keydown', onKeydown)
  document.addEventListener('click', onDocumentClick)
})

onUnmounted(() => {
  window.removeEventListener('resize', syncViewport)
  window.removeEventListener('keydown', onKeydown)
  document.removeEventListener('click', onDocumentClick)
  if (typeof document !== 'undefined') document.body.classList.remove('drawer-open')
})
</script>

<style scoped>
.admin-shell {
  min-height: 100vh;
  background: var(--mc-bg);
}

/* ----------------------------- Sidebar ----------------------------- */
.admin-sidebar {
  position: fixed;
  inset: 0 auto 0 0;
  z-index: 60;
  width: 272px;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-right: 1px solid var(--mc-border);
  transition: width 0.25s ease, transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.admin-sidebar.is-collapsed {
  width: 80px;
}

.sidebar-brand {
  height: var(--mc-header-height);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 0 16px;
  border-bottom: 1px solid var(--mc-border);
}

.brand-link {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  text-decoration: none;
}

.brand-mark {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  overflow: hidden;
  flex-shrink: 0;
  border: 1px solid var(--mc-border);
  background: var(--mc-brand-50);
  display: grid;
  place-items: center;
}
.brand-mark img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.brand-copy {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.brand-name {
  font-family: var(--mc-font-heading);
  font-weight: 600;
  font-size: 16px;
  letter-spacing: -0.02em;
  color: var(--mc-ink);
  line-height: 1.1;
  white-space: nowrap;
}
.brand-sub {
  font-size: 10.5px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--mc-subtle);
  margin-top: 2px;
}

.collapse-btn {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: grid;
  place-items: center;
  color: var(--mc-muted);
  border: 1px solid var(--mc-border);
  background: #fff;
  flex-shrink: 0;
  transition: all 0.2s ease;
}
.collapse-btn:hover {
  color: var(--mc-brand);
  background: var(--mc-brand-50);
  border-color: var(--mc-brand-100);
}

.sidebar-nav {
  flex: 1;
  overflow-y: auto;
  padding: 14px 12px 22px;
}

.nav-section-label {
  font-size: 9.5px;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--mc-subtle);
  padding: 18px 10px 7px;
}
.nav-section-label:first-child {
  padding-top: 4px;
}
.nav-section-rule {
  height: 1px;
  background: var(--mc-border);
  margin: 14px 8px;
}

.nav-item {
  width: 100%;
  justify-content: flex-start;
  text-align: left;
  gap: 11px;
  border: 0;
  background: transparent;
  cursor: pointer;
}

/* Scoped styles win over the global `.nav-item` background, so restate the
   active treatment here (it would otherwise be white-on-white). */
.nav-item.nav-item-active {
  background: var(--mc-brand);
  color: #fff;
  box-shadow: 0 10px 22px -14px rgba(39, 98, 140, 0.9);
}
.nav-item.nav-item-active:hover {
  background: var(--mc-brand-600);
  color: #fff;
}
.nav-item.nav-item-active .nav-icon {
  opacity: 1;
}
.nav-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  opacity: 0.9;
}
.nav-text {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.nav-badge {
  font-size: 10.5px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 999px;
  color: var(--mc-brand-700);
  background: var(--mc-brand-50);
}
.nav-item-active .nav-badge {
  color: #fff;
  background: rgba(255, 255, 255, 0.18);
}
.nav-chevron {
  width: 15px;
  height: 15px;
  margin-left: auto;
  transition: transform 0.2s ease;
  opacity: 0.7;
}

.admin-sidebar.is-collapsed .nav-item {
  justify-content: center;
  padding-left: 0;
  padding-right: 0;
}

.nav-children {
  padding: 2px 0 6px 18px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.nav-child {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 7px 10px;
  border-radius: 9px;
  color: var(--mc-muted);
  font-size: 12.5px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.18s ease;
}
.nav-child:hover {
  color: var(--mc-brand-700);
  background: var(--mc-brand-50);
}
.nav-child.nav-child-active {
  color: var(--mc-brand-700);
  background: var(--mc-brand-50);
  font-weight: 600;
}
.nav-child-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: currentColor;
  opacity: 0.5;
}

.sidebar-footer {
  flex-shrink: 0;
  border-top: 1px solid var(--mc-border);
  padding: 12px;
  background: #fff;
}

.user-chip {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  border-radius: 13px;
  border: 1px solid transparent;
  background: transparent;
  text-align: left;
  transition: all 0.18s ease;
}
.user-chip:hover {
  background: var(--mc-brand-50);
  border-color: var(--mc-brand-100);
}

.avatar {
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  border-radius: 11px;
  display: grid;
  place-items: center;
  background: var(--mc-brand);
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.02em;
}
.avatar-sm {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  font-size: 11px;
}

.user-chip-copy {
  min-width: 0;
  display: flex;
  flex-direction: column;
}
.user-chip-name {
  font-size: 12.5px;
  font-weight: 600;
  color: var(--mc-ink);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.user-chip-role {
  font-size: 10.5px;
  color: var(--mc-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.signout-btn {
  width: 100%;
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 9px 10px;
  border-radius: 10px;
  font-size: 12.5px;
  font-weight: 600;
  color: var(--mc-danger);
  border: 0;
  background: transparent;
  transition: background 0.18s ease;
}
.signout-btn:hover {
  background: var(--mc-danger-soft);
}

.admin-sidebar.is-collapsed .sidebar-footer {
  padding: 10px 8px;
}
.admin-sidebar.is-collapsed .user-chip {
  justify-content: center;
  padding: 8px 0;
}

/* ----------------------------- Main ----------------------------- */
.admin-main {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  transition: padding-left 0.25s ease;
}
.main-expanded {
  padding-left: 272px;
}
.main-collapsed {
  padding-left: 80px;
}

.admin-header {
  position: sticky;
  top: 0;
  z-index: 40;
  height: var(--mc-header-height);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 0 clamp(16px, 3vw, 34px);
  background: rgba(255, 255, 255, 0.86);
  backdrop-filter: saturate(180%) blur(14px);
  -webkit-backdrop-filter: saturate(180%) blur(14px);
  border-bottom: 1px solid var(--mc-border);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}
.header-context {
  min-width: 0;
}
.header-eyebrow {
  font-size: 9.5px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--mc-subtle);
  font-weight: 700;
  margin-bottom: 2px;
}
.header-title {
  font-family: var(--mc-font-heading);
  font-size: 17px;
  line-height: 1.15;
  font-weight: 600;
  color: var(--mc-ink);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.icon-button {
  width: 38px;
  height: 38px;
  border-radius: 11px;
  border: 1px solid var(--mc-border);
  background: #fff;
  color: var(--mc-muted);
  display: grid;
  place-items: center;
  transition: all 0.18s ease;
  flex-shrink: 0;
}
.icon-button:hover {
  color: var(--mc-brand);
  border-color: var(--mc-brand-100);
  background: var(--mc-brand-50);
}

.search-trigger {
  display: none;
  align-items: center;
  gap: 9px;
  height: 38px;
  padding: 0 10px 0 12px;
  border-radius: 11px;
  border: 1px solid var(--mc-border);
  background: #f8fbfd;
  color: var(--mc-muted);
  font-size: 12.5px;
  transition: all 0.18s ease;
}
.search-trigger:hover {
  border-color: var(--mc-brand-200);
  background: #fff;
}
.search-label {
  min-width: 128px;
  text-align: left;
}
.search-kbd {
  font-size: 10px;
  font-weight: 700;
  padding: 2px 5px;
  border-radius: 5px;
  background: #fff;
  border: 1px solid var(--mc-border);
  color: var(--mc-subtle);
}
.search-icon-mobile {
  display: grid;
}

.live-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 30px;
  padding: 0 10px;
  border-radius: 999px;
  background: var(--mc-success-soft);
  color: var(--mc-success);
  font-size: 11px;
  font-weight: 700;
  border: 1px solid #bbf7d0;
}
.live-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--mc-success);
  box-shadow: 0 0 0 3px rgba(21, 128, 61, 0.12);
}

.header-user {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 6px;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.18s ease;
}
.header-user:hover {
  background: var(--mc-brand-50);
}
.header-user-copy {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}
.header-user-name {
  font-size: 12.5px;
  font-weight: 600;
  color: var(--mc-ink);
}
.header-user-role {
  font-size: 10.5px;
  color: var(--mc-muted);
}

.user-menu {
  position: absolute;
  top: calc(var(--mc-header-height) - 6px);
  right: clamp(16px, 3vw, 34px);
  width: 264px;
  padding: 10px;
  background: #fff;
  border: 1px solid var(--mc-border);
  border-radius: 16px;
  box-shadow: var(--mc-shadow-lg);
  z-index: 70;
}
.user-menu-head {
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 8px;
}
.user-menu-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--mc-ink);
}
.user-menu-email {
  font-size: 11px;
  color: var(--mc-muted);
  overflow: hidden;
  text-overflow: ellipsis;
}
.user-menu-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 8px 10px;
  border-bottom: 1px solid var(--mc-border);
  margin-bottom: 6px;
}
.user-menu-perms {
  font-size: 10.5px;
  color: var(--mc-subtle);
}
.user-menu-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 9px 10px;
  border-radius: 9px;
  font-size: 12.5px;
  font-weight: 500;
  color: var(--mc-body);
  background: transparent;
  border: 0;
  text-align: left;
}
.user-menu-item:hover {
  background: var(--mc-brand-50);
  color: var(--mc-brand-700);
}
.user-menu-item.is-danger {
  color: var(--mc-danger);
}
.user-menu-item.is-danger:hover {
  background: var(--mc-danger-soft);
}

/* ----------------------------- Content ----------------------------- */
.admin-content {
  flex: 1;
  width: 100%;
  max-width: 1480px;
  margin: 0 auto;
  padding: clamp(18px, 3vw, 34px);
  padding-bottom: 48px;
}

.content-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 18px;
  flex-wrap: wrap;
  margin-bottom: clamp(18px, 2.6vw, 30px);
}
.content-eyebrow {
  font-size: 9.5px;
  letter-spacing: 0.17em;
  text-transform: uppercase;
  color: var(--mc-brand);
  font-weight: 700;
  margin-bottom: 7px;
}
.content-title {
  font-family: var(--mc-font-heading);
  font-size: clamp(25px, 3.3vw, 38px);
  line-height: 1.05;
  font-weight: 600;
  letter-spacing: -0.025em;
  color: var(--mc-ink);
}
.content-description {
  margin-top: 8px;
  max-width: 640px;
  color: var(--mc-muted);
  font-size: 13.5px;
  line-height: 1.6;
}
.content-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* ----------------------------- Mobile ----------------------------- */
.sidebar-scrim {
  position: fixed;
  inset: 0;
  z-index: 55;
  background: rgba(3, 30, 48, 0.42);
  backdrop-filter: blur(3px);
  border: 0;
}

.mobile-tabbar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 50;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 2px;
  padding: 6px 8px calc(6px + env(safe-area-inset-bottom));
  background: rgba(255, 255, 255, 0.94);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-top: 1px solid var(--mc-border);
}
.mobile-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  padding: 6px 2px;
  border-radius: 10px;
  font-size: 9.5px;
  font-weight: 600;
  color: var(--mc-muted);
  text-decoration: none;
  background: transparent;
  border: 0;
}
.mobile-tab-active {
  color: var(--mc-brand);
  background: var(--mc-brand-50);
}

.global-loader {
  position: fixed;
  inset: 0;
  z-index: 80;
  display: grid;
  place-items: center;
  background: rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(3px);
}
.global-loader-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 20px;
  border-radius: 16px;
  background: #fff;
  border: 1px solid var(--mc-border);
  box-shadow: var(--mc-shadow);
  font-size: 13px;
  font-weight: 600;
  color: var(--mc-ink);
}

.confirm-copy {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 14px;
  padding: 6px 0 2px;
  color: var(--mc-muted);
  font-size: 13.5px;
  line-height: 1.65;
}
.confirm-icon {
  width: 54px;
  height: 54px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  background: var(--mc-brand-50);
  color: var(--mc-brand);
}
.confirm-icon.is-danger {
  background: var(--mc-danger-soft);
  color: var(--mc-danger);
}

.search-modal {
  display: flex;
  flex-direction: column;
}
.search-field {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 4px 12px;
  border-bottom: 1px solid var(--mc-border);
}
.search-input {
  flex: 1;
  min-width: 0;
  border: 0;
  outline: none;
  background: transparent;
  font-size: 15px;
  font-weight: 500;
  color: var(--mc-ink);
  padding: 6px 0;
}
.search-results {
  max-height: min(52vh, 420px);
  overflow-y: auto;
  padding: 8px 0 4px;
}
.search-group-label {
  font-size: 9.5px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  font-weight: 700;
  color: var(--mc-subtle);
  padding: 8px 10px;
}
.search-result {
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 9px 10px;
  border-radius: 10px;
  text-decoration: none;
  transition: background 0.12s ease;
}
.search-result.is-highlighted,
.search-result:hover {
  background: var(--mc-brand-50);
}
.search-result-icon {
  width: 32px;
  height: 32px;
  border-radius: 9px;
  display: grid;
  place-items: center;
  background: #fff;
  border: 1px solid var(--mc-border);
  color: var(--mc-brand);
  flex-shrink: 0;
}
.search-result-copy {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}
.search-result-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--mc-ink);
}
.search-result-parent {
  font-size: 10.5px;
  color: var(--mc-subtle);
}
.search-empty {
  padding: 38px 16px;
  text-align: center;
  color: var(--mc-muted);
  font-size: 12.5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
.search-hints {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  padding-top: 12px;
  border-top: 1px solid var(--mc-border);
  color: var(--mc-subtle);
  font-size: 10.5px;
}
.search-hints kbd {
  display: inline-block;
  padding: 1px 5px;
  margin-right: 4px;
  border-radius: 4px;
  background: #f4f8fb;
  border: 1px solid var(--mc-border);
  color: var(--mc-muted);
  font-size: 9.5px;
  font-weight: 700;
}

.spinner {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.35);
  border-top-color: #fff;
  animation: spin 0.7s linear infinite;
  display: inline-block;
}
.spinner-lg {
  width: 20px;
  height: 20px;
  border-color: var(--mc-brand-100);
  border-top-color: var(--mc-brand);
}
.global-loader-card .spinner {
  border-color: var(--mc-brand-100);
  border-top-color: var(--mc-brand);
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.18s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.98);
}

@media (min-width: 768px) {
  .search-trigger {
    display: flex;
  }
  .search-icon-mobile {
    display: none;
  }
}

@media (min-width: 1024px) {
  .admin-sidebar {
    transform: translateX(0) !important;
  }
}

@media (max-width: 1023px) {
  .admin-sidebar {
    width: min(86vw, 318px);
    transform: translateX(-102%);
    box-shadow: var(--mc-shadow-lg);
  }
  .admin-sidebar.is-open {
    transform: translateX(0);
  }
  .main-expanded,
  .main-collapsed {
    padding-left: 0;
  }
  .admin-content {
    padding-bottom: 96px;
  }
  .header-title {
    font-size: 16px;
  }
  .header-eyebrow {
    display: none;
  }
}

@media (max-width: 640px) {
  .content-header {
    align-items: flex-start;
  }
  .content-title {
    font-size: 26px;
  }
  .content-actions {
    width: 100%;
  }
  .content-actions > * {
    flex: 1;
  }
  .header-actions {
    gap: 6px;
  }
  .user-menu {
    right: 12px;
    left: 12px;
    width: auto;
  }
}
</style>
