<template>
  <div class="dashboard">
    <!-- Welcome strip -->
    <section class="welcome">
      <div class="welcome-copy">
        <p class="welcome-eyebrow">{{ greeting }}, {{ user?.firstName || 'Admin' }}</p>
        <h2 class="welcome-title">
          Here's what's happening across
          <span>MedLabConvo</span> today.
        </h2>
        <p class="welcome-meta">
          <span class="live-dot"></span>
          {{ roleLabel }} access
          <span class="welcome-divider"></span>
          {{ accessibleStats.length }} sections available to you
        </p>
      </div>
      <div class="welcome-actions">
        <NuxtLink v-if="can('users:create')" to="/dashboard/users" class="welcome-action">
          <span class="welcome-action-icon"><Icon name="lucide:user-plus" class="w-4 h-4" /></span>
          <span>
            <strong>Invite a teammate</strong>
            <small>Add an admin with scoped access</small>
          </span>
          <Icon name="lucide:arrow-up-right" class="w-4 h-4 ml-auto opacity-50" />
        </NuxtLink>
        <NuxtLink v-else-if="can('publications:read')" to="/dashboard/publications" class="welcome-action">
          <span class="welcome-action-icon"><Icon name="lucide:file-plus-2" class="w-4 h-4" /></span>
          <span>
            <strong>Review Journo</strong>
            <small>Approve the latest submissions</small>
          </span>
          <Icon name="lucide:arrow-up-right" class="w-4 h-4 ml-auto opacity-50" />
        </NuxtLink>
      </div>
    </section>

    <!-- KPI cards -->
    <section>
      <div class="section-head">
        <div>
          <h3 class="section-title">Platform pulse</h3>
          <p class="section-sub">Counts are scoped to the sections you can access.</p>
        </div>
        <span v-if="loadingStats" class="inline-loading">
          <span class="mini-spinner"></span>
          Syncing
        </span>
      </div>

      <div class="metric-grid">
        <NuxtLink
          v-for="stat in accessibleStats"
          :key="stat.title"
          :to="stat.link"
          class="metric-card"
        >
          <span class="metric-icon" :style="{ background: stat.soft, color: stat.color }">
            <Icon :name="stat.icon" class="w-5 h-5" />
          </span>
          <span class="metric-value">{{ stat.value }}</span>
          <span class="metric-label">{{ stat.title }}</span>
          <span class="metric-link">
            Open
            <Icon name="lucide:arrow-right" class="w-3.5 h-3.5" />
          </span>
        </NuxtLink>
      </div>

      <div v-if="accessibleStats.length === 0" class="dashboard-empty">
        <Icon name="lucide:shield" class="w-8 h-8" />
        <p>No dashboard sections are available for your role yet.</p>
        <NuxtLink to="/dashboard/forbidden" class="btn btn-outline">See why</NuxtLink>
      </div>
    </section>

    <section class="dashboard-grid">
      <!-- Activity -->
      <div v-if="can('audit:read')" class="panel">
        <div class="panel-head">
          <div>
            <h3 class="panel-title">Recent activity</h3>
            <p class="panel-sub">Last administrative actions</p>
          </div>
          <span class="panel-chip">
            <Icon name="lucide:fingerprint" class="w-3.5 h-3.5" />
            Audit
          </span>
        </div>

        <div class="activity-list scrollbar-slim">
          <div v-for="activity in recentActivities" :key="activity._id || activity.id" class="activity-row">
            <span class="activity-icon" :style="{ background: activityTone(activity.action).soft, color: activityTone(activity.action).color }">
              <Icon :name="activityIcon(activity.action)" class="w-4 h-4" />
            </span>
            <div class="activity-copy">
              <p>
                <span class="activity-action">{{ activity.action }}</span>
                {{ (activity.resource || 'system item').replace(/_/g, ' ') }}
              </p>
              <span>{{ relativeTime(activity.createdAt) }}</span>
            </div>
          </div>

          <div v-if="recentActivities.length === 0" class="activity-empty">
            <Icon name="lucide:inbox" class="w-7 h-7" />
            <p>No activity recorded yet.</p>
          </div>
        </div>

        <NuxtLink to="/dashboard/audit" class="panel-link">
          View all audit logs
          <Icon name="lucide:arrow-right" class="w-3.5 h-3.5" />
        </NuxtLink>
      </div>

      <!-- Quick actions -->
      <div class="panel">
        <div class="panel-head">
          <div>
            <h3 class="panel-title">Quick actions</h3>
            <p class="panel-sub">Only what your role can do</p>
          </div>
          <span class="panel-chip">
            <Icon name="lucide:zap" class="w-3.5 h-3.5" />
            Shortcuts
          </span>
        </div>

        <div class="quick-list">
          <NuxtLink
            v-for="action in quickActions"
            :key="action.path"
            :to="action.path"
            class="quick-row"
          >
            <span class="quick-icon">
              <Icon :name="action.icon" class="w-4 h-4" />
            </span>
            <span class="quick-copy">
              <strong>{{ action.title }}</strong>
              <small>{{ action.subtitle }}</small>
            </span>
            <Icon name="lucide:chevron-right" class="w-4 h-4 text-slate-300" />
          </NuxtLink>

          <div v-if="quickActions.length === 0" class="activity-empty">
            <Icon name="lucide:lock" class="w-7 h-7" />
            <p>No actions available for your role.</p>
          </div>
        </div>
      </div>

      <!-- Distribution -->
      <div v-if="distribution.length" class="panel">
        <div class="panel-head">
          <div>
            <h3 class="panel-title">Content distribution</h3>
            <p class="panel-sub">Relative volume by content type</p>
          </div>
          <span class="panel-chip">
            <Icon name="lucide:chart-no-axes-column" class="w-3.5 h-3.5" />
            Live
          </span>
        </div>
        <div class="distribution">
          <div v-for="item in distribution" :key="item.label" class="distribution-row">
            <div class="distribution-meta">
              <span>{{ item.label }}</span>
              <strong>{{ item.count }}</strong>
            </div>
            <div class="distribution-track">
              <span :style="{ width: `${item.percentage}%`, background: item.color }"></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import Icon from '~/components/Icon.vue'
import { useUser } from '@/composables/modules/auth/user'
import { useGetUsers } from '@/composables/modules/users/useGetUsers'
import { useGetEnquiries } from '@/composables/modules/enquires/useGetEnquiries'
import { useGetSubscriptions } from '@/composables/modules/subscriptions/useGetSubscriptions'
import { useGetBlogs } from '@/composables/modules/blogs/useGetBlogs'
import { useGetTeamMembers } from '@/composables/modules/teams/useGetTeamMembers'
import { useGetPublications } from '@/composables/modules/publications/useGetPublications'
import { useGetLabCasts } from '@/composables/modules/labcast/useGetLabCasts'
import { useGetProducts } from '@/composables/modules/products/useGetProducts'
import { useGetPrograms } from '@/composables/modules/programs/useGetPrograms'
import { useGetForms } from '@/composables/modules/forms/useGetForms'
import { useGetAuditLogs } from '@/composables/modules/audit/useGetAuditLogs'
import { useGetConvoStacks } from '@/composables/modules/convostack/useGetConvoStacks'

const { user, roleLabel, hasPermission } = useUser()

const can = (permission: string) => hasPermission(permission)

const users = useGetUsers()
const enquiries = useGetEnquiries()
const subscriptions = useGetSubscriptions()
const blogs = useGetBlogs()
const teamMembers = useGetTeamMembers()
const publications = useGetPublications()
const labcasts = useGetLabCasts()
const products = useGetProducts()
const programs = useGetPrograms()
const forms = useGetForms()
const audit = useGetAuditLogs()
const convoStacks = useGetConvoStacks()

const loadingStats = ref(true)

interface StatDefinition {
  title: string
  permission: string
  link: string
  icon: string
  color: string
  soft: string
  value: () => number
  load?: () => Promise<any>
}

const STAT_DEFINITIONS: StatDefinition[] = [
  { title: 'Users', permission: 'users:read', link: '/dashboard/users', icon: 'lucide:users', color: '#27628c', soft: '#eff6fb', value: () => users.users.value?.length || 0, load: () => users.getUsers() },
  { title: 'Leadership', permission: 'teams:read', link: '/dashboard/teams', icon: 'lucide:users-round', color: '#7c3aed', soft: '#f5f3ff', value: () => teamMembers.teamMembers.value?.length || 0, load: () => teamMembers.getTeamMembers() },
  { title: 'Subscribers', permission: 'subscriptions:read', link: '/dashboard/subscriptions', icon: 'lucide:mail', color: '#15803d', soft: '#ecfdf3', value: () => subscriptions.subscriptions.value?.length || 0, load: () => subscriptions.getSubscriptions() },
  { title: 'Enquiries', permission: 'enquiries:read', link: '/dashboard/enquiries', icon: 'lucide:message-square', color: '#b45309', soft: '#fffaeb', value: () => enquiries.enquiries.value?.length || 0, load: () => enquiries.getEnquiries() },
  { title: 'Journo', permission: 'publications:read', link: '/dashboard/publications', icon: 'lucide:file-text', color: '#7c3aed', soft: '#f5f3ff', value: () => publications.publications.value?.length || 0, load: () => publications.getPublications() },
  { title: 'Blogs', permission: 'blogs:read', link: '/dashboard/blogs', icon: 'lucide:newspaper', color: '#0369a1', soft: '#e0f2fe', value: () => blogs.blogs.value?.length || 0, load: () => blogs.getBlogs() },
  { title: 'LabCast', permission: 'labcast:read', link: '/dashboard/labcast', icon: 'lucide:mic', color: '#be185d', soft: '#fdf2f8', value: () => labcasts.labcasts.value?.length || 0, load: () => labcasts.getLabCasts() },
  { title: 'Convo Stack', permission: 'convostack:read', link: '/dashboard/convostack', icon: 'lucide:book-open', color: '#0f766e', soft: '#f0fdfa', value: () => convoStacks.publications.value?.length || 0, load: () => convoStacks.getPublications() },
  { title: 'Products', permission: 'products:read', link: '/dashboard/products', icon: 'lucide:archive', color: '#c2410c', soft: '#fff7ed', value: () => products.products.value?.length || 0, load: () => products.getProducts() },
  { title: 'Programs', permission: 'programs:read', link: '/dashboard/programs', icon: 'lucide:graduation-cap', color: '#be123c', soft: '#fff1f2', value: () => programs.programs.value?.length || 0, load: () => programs.getPrograms() },
  { title: 'Forms', permission: 'forms:read', link: '/dashboard/forms', icon: 'lucide:clipboard-list', color: '#0e7490', soft: '#ecfeff', value: () => forms.forms.value?.length || 0, load: () => forms.getForms() },
  { title: 'Audit logs', permission: 'audit:read', link: '/dashboard/audit', icon: 'lucide:fingerprint', color: '#475569', soft: '#f1f5f9', value: () => audit.auditLogs.value?.length || 0, load: () => audit.getAuditLogs() },
]

const accessibleStats = computed(() =>
  STAT_DEFINITIONS.filter((stat) => can(stat.permission)).map((stat) => ({
    ...stat,
    value: stat.value(),
  })),
)

const quickActions = computed(() => {
  const actions = [
    { title: 'Create a user', subtitle: 'Provision a new admin account', path: '/dashboard/users', icon: 'lucide:user-plus', permission: 'users:create' },
    { title: 'Review Journo', subtitle: 'Approve pending publications', path: '/dashboard/publications', icon: 'lucide:file-check-2', permission: 'publications:update' },
    { title: 'Send a campaign', subtitle: 'Compose an audience email', path: '/dashboard/campaigns', icon: 'lucide:send', permission: 'campaigns:create' },
    { title: 'Publish a blog', subtitle: 'Draft and publish editorial content', path: '/dashboard/blogs', icon: 'lucide:newspaper', permission: 'blogs:create' },
    { title: 'Add an episode', subtitle: 'Publish a new LabCast episode', path: '/dashboard/labcast', icon: 'lucide:mic', permission: 'labcast:create' },
    { title: 'Manage roles', subtitle: 'Adjust role permissions', path: '/dashboard/access-control/roles', icon: 'lucide:shield-check', permission: 'roles:read' },
  ]
  return actions.filter((action) => can(action.permission)).slice(0, 6)
})

const distribution = computed(() => {
  const items = [
    { label: 'Journo', permission: 'publications:read', count: publications.publications.value?.length || 0, color: '#7c3aed' },
    { label: 'Blogs', permission: 'blogs:read', count: blogs.blogs.value?.length || 0, color: '#0369a1' },
    { label: 'LabCast', permission: 'labcast:read', count: labcasts.labcasts.value?.length || 0, color: '#be185d' },
    { label: 'Convo Stack', permission: 'convostack:read', count: convoStacks.publications.value?.length || 0, color: '#0f766e' },
    { label: 'Programs', permission: 'programs:read', count: programs.programs.value?.length || 0, color: '#be123c' },
    { label: 'Products', permission: 'products:read', count: products.products.value?.length || 0, color: '#c2410c' },
  ].filter((item) => can(item.permission))

  const max = Math.max(...items.map((item) => item.count), 1)
  return items.map((item) => ({ ...item, percentage: Math.round((item.count / max) * 100) }))
})

const recentActivities = computed(() => audit.auditLogs.value?.slice(0, 7) || [])

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
})

const relativeTime = (date: string) => {
  if (!date) return '—'
  const diff = Math.floor((Date.now() - new Date(date).getTime()) / 60000)
  if (diff < 1) return 'just now'
  if (diff < 60) return `${diff}m ago`
  if (diff < 1440) return `${Math.floor(diff / 60)}h ago`
  return `${Math.floor(diff / 1440)}d ago`
}

const activityIcon = (action: string) =>
  ({
    create: 'lucide:plus-circle',
    update: 'lucide:refresh-cw',
    delete: 'lucide:trash-2',
    soft_delete: 'lucide:archive',
    login: 'lucide:key-round',
    logout: 'lucide:lock',
  })[action] || 'lucide:info'

const activityTone = (action: string) =>
  ({
    create: { color: '#15803d', soft: '#ecfdf3' },
    update: { color: '#27628c', soft: '#eff6fb' },
    delete: { color: '#d92d20', soft: '#fef3f2' },
    soft_delete: { color: '#b45309', soft: '#fffaeb' },
    login: { color: '#7c3aed', soft: '#f5f3ff' },
  })[action] || { color: '#6b8192', soft: '#f4f7f9' }

onMounted(async () => {
  const permitted = STAT_DEFINITIONS.filter((stat) => can(stat.permission) && stat.load)
  await Promise.allSettled(permitted.map((stat) => stat.load?.()))
  loadingStats.value = false
})
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: clamp(20px, 3vw, 32px);
}

/* Welcome */
.welcome {
  position: relative;
  overflow: hidden;
  border-radius: 24px;
  border: 1px solid var(--mc-brand-500);
  background:
    radial-gradient(120% 140% at 100% 0%, rgba(255, 255, 255, 0.16) 0%, transparent 55%),
    linear-gradient(120deg, #1f5378 0%, #27628c 58%, #3a7499 100%);
  color: #fff;
  padding: clamp(22px, 3.5vw, 40px);
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
  box-shadow: 0 26px 50px -34px rgba(31, 83, 120, 0.8);
}
.welcome::after {
  content: '';
  position: absolute;
  right: -70px;
  top: -100px;
  width: 260px;
  height: 260px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.16);
  box-shadow: 0 0 0 40px rgba(255, 255, 255, 0.04), 0 0 0 90px rgba(255, 255, 255, 0.03);
  pointer-events: none;
}
.welcome-copy {
  position: relative;
  z-index: 1;
  max-width: 620px;
}
.welcome-eyebrow {
  font-family: var(--mc-font-heading);
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.72);
  font-weight: 600;
  margin-bottom: 10px;
}
.welcome-title {
  font-family: var(--mc-font-heading);
  color: #fff;
  font-size: clamp(25px, 3.4vw, 38px);
  line-height: 1.1;
  font-weight: 600;
  letter-spacing: -0.03em;
  margin: 0;
}
.welcome-title span {
  color: #cfe9f8;
  white-space: nowrap;
}
.welcome-meta {
  margin-top: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  font-size: 11.5px;
  color: rgba(255, 255, 255, 0.76);
}
.welcome-divider {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.45);
}
.live-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #86efac;
  box-shadow: 0 0 0 3px rgba(134, 239, 172, 0.2);
}
.welcome-actions {
  position: relative;
  z-index: 1;
  width: min(100%, 330px);
}
.welcome-action {
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 12px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.18);
  text-decoration: none;
  color: #fff;
  transition: background 0.18s ease, transform 0.18s ease;
  backdrop-filter: blur(8px);
}
.welcome-action:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}
.welcome-action-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  background: rgba(255, 255, 255, 0.16);
  flex-shrink: 0;
}
.welcome-action strong {
  display: block;
  font-size: 12.5px;
  font-weight: 600;
}
.welcome-action small {
  display: block;
  font-size: 10.5px;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 2px;
}

/* Section heads */
.section-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 13px;
}
.section-title {
  font-family: var(--mc-font-heading);
  font-size: 19px;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--mc-ink);
}
.section-sub {
  margin-top: 3px;
  font-size: 12px;
  color: var(--mc-muted);
}
.inline-loading {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 10.5px;
  font-weight: 600;
  color: var(--mc-muted);
}
.mini-spinner {
  width: 11px;
  height: 11px;
  border-radius: 50%;
  border: 2px solid var(--mc-brand-100);
  border-top-color: var(--mc-brand);
  animation: spin 0.7s linear infinite;
}

/* Metrics */
.metric-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(148px, 1fr));
  gap: 10px;
}
.metric-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  padding: 16px;
  border-radius: 16px;
  background: #fff;
  border: 1px solid var(--mc-border);
  box-shadow: var(--mc-shadow-sm);
  text-decoration: none;
  transition: transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;
  overflow: hidden;
}
.metric-card:hover {
  transform: translateY(-2px);
  border-color: var(--mc-brand-200);
  box-shadow: var(--mc-shadow);
}
.metric-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  margin-bottom: 10px;
}
.metric-value {
  font-family: var(--mc-font-heading);
  font-size: 30px;
  line-height: 1;
  font-weight: 600;
  letter-spacing: -0.03em;
  color: var(--mc-ink);
}
.metric-label {
  font-size: 11.5px;
  font-weight: 600;
  color: var(--mc-muted);
  margin-top: 4px;
}
.metric-link {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: var(--mc-brand);
  margin-top: 12px;
  opacity: 0;
  transform: translateX(-3px);
  transition: all 0.18s ease;
}
.metric-card:hover .metric-link {
  opacity: 1;
  transform: translateX(0);
}

.dashboard-empty {
  padding: 42px 20px;
  border-radius: 18px;
  border: 1px dashed var(--mc-border-strong);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  color: var(--mc-muted);
  font-size: 13px;
}

/* Panels */
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 14px;
}
.panel {
  grid-column: span 12;
  background: #fff;
  border: 1px solid var(--mc-border);
  border-radius: 18px;
  box-shadow: var(--mc-shadow-sm);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.panel-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 18px;
  border-bottom: 1px solid var(--mc-border);
}
.panel-title {
  font-family: var(--mc-font-heading);
  font-size: 15.5px;
  font-weight: 600;
  color: var(--mc-ink);
}
.panel-sub {
  font-size: 11px;
  color: var(--mc-muted);
  margin-top: 2px;
}
.panel-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 8px;
  border-radius: 999px;
  background: var(--mc-brand-50);
  border: 1px solid var(--mc-brand-100);
  color: var(--mc-brand-700);
  font-size: 9.5px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  flex-shrink: 0;
}

.activity-list {
  max-height: 360px;
  overflow-y: auto;
  padding: 6px;
}
.activity-row {
  display: flex;
  gap: 11px;
  padding: 9px 10px;
  border-radius: 11px;
}
.activity-row:hover {
  background: #f8fbfd;
}
.activity-icon {
  width: 32px;
  height: 32px;
  border-radius: 9px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}
.activity-copy {
  min-width: 0;
  flex: 1;
}
.activity-copy p {
  font-size: 12.5px;
  color: var(--mc-body);
  line-height: 1.4;
}
.activity-action {
  display: inline-block;
  font-size: 9.5px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  padding: 1px 6px;
  border-radius: 5px;
  background: var(--mc-brand-50);
  color: var(--mc-brand-700);
  margin-right: 4px;
}
.activity-copy > span {
  font-size: 10.5px;
  color: var(--mc-subtle);
}
.activity-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 36px 16px;
  color: var(--mc-subtle);
  font-size: 12px;
  text-align: center;
}
.panel-link {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 11px;
  border-top: 1px solid var(--mc-border);
  font-size: 11.5px;
  font-weight: 700;
  color: var(--mc-brand);
  text-decoration: none;
  margin-top: auto;
}
.panel-link:hover {
  background: var(--mc-brand-50);
}

.quick-list {
  padding: 6px;
  display: flex;
  flex-direction: column;
}
.quick-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 10px;
  border-radius: 11px;
  text-decoration: none;
  transition: background 0.15s ease;
}
.quick-row:hover {
  background: #f8fbfd;
}
.quick-icon {
  width: 32px;
  height: 32px;
  border-radius: 9px;
  background: var(--mc-brand-50);
  color: var(--mc-brand);
  display: grid;
  place-items: center;
  flex-shrink: 0;
}
.quick-copy {
  flex: 1;
  min-width: 0;
}
.quick-copy strong {
  display: block;
  font-size: 12.5px;
  font-weight: 600;
  color: var(--mc-ink);
}
.quick-copy small {
  display: block;
  font-size: 10.5px;
  color: var(--mc-muted);
  margin-top: 1px;
}

.distribution {
  padding: 16px 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 13px;
}
.distribution-row {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.distribution-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 11.5px;
  color: var(--mc-muted);
  font-weight: 600;
}
.distribution-meta strong {
  color: var(--mc-ink);
  font-size: 12px;
}
.distribution-track {
  height: 6px;
  border-radius: 999px;
  background: #eef4f8;
  overflow: hidden;
}
.distribution-track span {
  display: block;
  height: 100%;
  border-radius: 999px;
  min-width: 3px;
  transition: width 0.5s ease;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (min-width: 900px) {
  .panel:nth-child(1) {
    grid-column: span 7;
  }
  .panel:nth-child(2) {
    grid-column: span 5;
  }
  .panel:nth-child(3) {
    grid-column: span 12;
  }
}

@media (min-width: 640px) {
  .panel:nth-child(3) .distribution {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px 26px;
  }
}

@media (max-width: 640px) {
  .metric-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .metric-card {
    padding: 13px;
  }
  .metric-value {
    font-size: 26px;
  }
  .welcome-actions {
    width: 100%;
  }
}
</style>
