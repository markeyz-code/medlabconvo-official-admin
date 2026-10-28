<template>
  <div class="access-page">
    <div class="access-card">
      <div class="access-icon">
        <Icon name="lucide:shield-off" class="w-9 h-9" />
      </div>

      <p class="access-eyebrow">Restricted area</p>
      <h1 class="access-title">You don't have access to this section</h1>
      <p class="access-copy">
        Your role <span class="access-role">{{ roleLabel }}</span> doesn't include the
        <code v-if="needed" class="access-code">{{ needed }}</code>
        permission. Ask a super admin to update your role or permissions.
      </p>

      <div class="access-actions">
        <button class="btn btn-primary" @click="router.push(firstAllowedRoute)">
          <Icon name="lucide:arrow-left" class="w-4 h-4" />
          Go to my dashboard
        </button>
        <button class="btn btn-ghost" @click="confirmLogout">
          Sign out
        </button>
      </div>

      <div class="access-meta">
        <span>Signed in as {{ user?.email }}</span>
        <span class="access-dot"></span>
        <span>{{ permissions.length }} permissions</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Icon from '~/components/Icon.vue'
import { useUser } from '@/composables/modules/auth/user'
import { useLogout } from '@/composables/modules/auth/useLogout'
import { landingRouteFor, permissionForRoute } from '@/utils/routePermissions'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

const route = useRoute()
const router = useRouter()
const { user, permissions, roleLabel, hasPermission } = useUser()
const { logout } = useLogout()

const needed = computed(() => (route.query.need as string) || '')

const firstAllowedRoute = computed(() => landingRouteFor(hasPermission))

const confirmLogout = async () => {
  await logout()
  router.push('/')
}

onMounted(() => {
  // If the user actually has access (e.g. they navigated back after a role
  // change), don't leave them stranded here.
  const from = route.query.from as string
  if (from) {
    const required = permissionForRoute(from)
    if (!required || hasPermission(required)) router.replace(from)
  }
})
</script>

<style scoped>
.access-page {
  min-height: 60vh;
  display: grid;
  place-items: center;
  padding: 24px 4px 48px;
}
.access-card {
  width: 100%;
  max-width: 560px;
  background: #fff;
  border: 1px solid var(--mc-border);
  border-radius: 24px;
  padding: clamp(28px, 5vw, 48px);
  text-align: center;
  box-shadow: var(--mc-shadow-sm);
}
.access-icon {
  width: 68px;
  height: 68px;
  margin: 0 auto 20px;
  border-radius: 22px;
  display: grid;
  place-items: center;
  color: var(--mc-brand);
  background: var(--mc-brand-50);
  border: 1px solid var(--mc-brand-100);
}
.access-eyebrow {
  font-family: var(--mc-font-heading);
  font-size: 12px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--mc-brand);
  margin-bottom: 10px;
}
.access-title {
  font-family: var(--mc-font-heading);
  font-size: clamp(24px, 4vw, 34px);
  line-height: 1.1;
  color: var(--mc-ink);
  margin-bottom: 14px;
}
.access-copy {
  color: var(--mc-muted);
  font-size: 15px;
  line-height: 1.7;
}
.access-role {
  font-weight: 600;
  color: var(--mc-ink);
}
.access-code {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 12px;
  padding: 2px 7px;
  border-radius: 7px;
  background: var(--mc-brand-50);
  color: var(--mc-brand);
}
.access-actions {
  margin-top: 28px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
}
.access-meta {
  margin-top: 28px;
  padding-top: 18px;
  border-top: 1px solid var(--mc-border);
  font-size: 12px;
  color: var(--mc-muted);
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}
.access-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--mc-border-strong);
}
</style>
