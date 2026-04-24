<template>
  <div class="space-y-10 animate-in fade-in duration-700">
    <!-- KPI Metrics Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-5">
      <NuxtLink
        v-for="stat in allStats"
        :key="stat.title"
        :to="stat.link"
        class="bg-white rounded-2xl p-5 border border-slate-100 hover:border-[#033958]/20 transition-all group overflow-hidden relative"
      >
        <div class="flex justify-between items-start mb-4">
          <div :class="['p-2.5 rounded-xl ring-1 ring-inset', stat.bgColor]">
            <Icon :name="stat.icon" :class="['w-5 h-5', stat.textColor]" />
          </div>
        </div>
        <div>
          <p class="text-slate-400 text-xs font-semibold mb-1">{{ stat.title }}</p>
          <h3 class="text-2xl font-bold text-slate-900 tracking-tight">{{ stat.value }}</h3>
        </div>
        <div class="absolute bottom-0 left-0 w-full h-0.5 bg-transparent group-hover:bg-[#033958] transition-all duration-300"></div>
      </NuxtLink>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
      <!-- Activity Feed -->
      <div class="xl:col-span-2 bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div class="p-6 border-b border-slate-50 flex items-center justify-between">
          <div>
            <h3 class="text-base font-bold text-slate-900">Recent activity</h3>
            <p class="text-slate-400 text-sm font-medium">Last 8 administrative actions</p>
          </div>
          <Icon name="lucide:fingerprint" class="w-6 h-6 text-slate-200" />
        </div>
        
        <div class="divide-y divide-slate-50 max-h-[440px] overflow-y-auto custom-scrollbar">
          <div
            v-for="activity in (recentActivities as any)"
            :key="activity._id"
            class="px-6 py-4 flex items-start space-x-4 hover:bg-slate-50/50 transition-colors"
          >
            <div :class="['w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0', getActivityBg(activity.action)]">
              <Icon :name="getActivityIcon(activity.action)" class="w-4 h-4 text-white" />
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between gap-4 mb-1">
                <p class="text-slate-900 font-semibold text-sm truncate">
                  <span class="text-[#033958] bg-blue-50 px-1.5 py-0.5 rounded text-xs mr-1.5">{{ activity.action }}</span>
                  {{ activity.resource?.replace('_', ' ') || 'system item' }}
                </p>
                <span class="text-xs font-medium text-slate-400 whitespace-nowrap">{{ formatRelativeTime(activity.createdAt) }}</span>
              </div>
              <p class="text-slate-400 text-xs leading-relaxed font-medium">
                {{ formatActivityDescription(activity) }}
              </p>
            </div>
          </div>
          
          <div v-if="!recentActivities?.length" class="py-16 text-center">
            <Icon name="lucide:inbox" class="w-12 h-12 text-slate-200 mx-auto mb-3" />
            <p class="text-slate-400 font-medium text-sm">No recent activity</p>
          </div>
        </div>
        
        <NuxtLink to="/dashboard/audit" class="block w-full py-4 text-center text-[#033958] font-semibold text-sm hover:bg-slate-50 transition-all border-t border-slate-50">
          View all audit logs
        </NuxtLink>
      </div>

      <!-- Right Column -->
      <div class="space-y-6">
        <!-- Invite Card -->
        <div class="bg-[#033958] rounded-2xl p-6 text-white relative overflow-hidden group">
          <div class="absolute -right-8 -top-8 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all duration-700"></div>
          <h3 class="text-lg font-bold mb-3 relative z-10">Invite collaborator</h3>
          <p class="text-blue-100/70 text-sm font-medium mb-6 leading-relaxed relative z-10">Expand your team by inviting new members with specific roles.</p>
          <NuxtLink to="/dashboard/users" class="inline-flex items-center px-5 py-2.5 bg-[#3BAB22] text-white rounded-xl font-semibold text-sm hover:bg-[#2d851a] transition-all group/btn relative z-10">
            <span>Send invitation</span>
            <Icon name="lucide:send" class="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </NuxtLink>
        </div>

        <!-- Content Distribution Chart -->
        <div class="bg-white rounded-2xl border border-slate-100 p-6">
          <h3 class="text-base font-bold text-slate-900 mb-5">Content distribution</h3>
          <div class="space-y-3">
            <div v-for="item in contentDistribution" :key="item.label" class="group">
              <div class="flex items-center justify-between mb-1.5">
                <span class="text-xs font-semibold text-slate-500">{{ item.label }}</span>
                <span class="text-xs font-bold text-slate-900">{{ item.count }}</span>
              </div>
              <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  :style="{ width: item.percentage + '%' }" 
                  :class="['h-full rounded-full transition-all duration-700 group-hover:opacity-80', item.color]"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Monthly Activity Sparkline -->
        <div class="bg-white rounded-2xl border border-slate-100 p-6">
          <div class="flex items-center justify-between mb-5">
            <h3 class="text-base font-bold text-slate-900">Activity trend</h3>
            <span class="text-xs font-medium text-slate-400">Last 7 days</span>
          </div>
          <div class="flex items-end justify-between gap-1.5 h-24">
            <div 
              v-for="(bar, i) in weeklyActivity" 
              :key="i" 
              class="flex-1 rounded-md transition-all duration-300 hover:opacity-80 cursor-default relative group/bar"
              :style="{ height: bar.height + '%' }"
              :class="bar.isToday ? 'bg-[#033958]' : 'bg-slate-200'"
            >
              <div class="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-opacity text-sm font-bold text-slate-600 whitespace-nowrap">
                {{ bar.count }}
              </div>
            </div>
          </div>
          <div class="flex justify-between mt-2">
            <span v-for="(bar, i) in weeklyActivity" :key="'label-' + i" class="text-sm font-medium text-slate-400 flex-1 text-center">
              {{ bar.day }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
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

const { users, getUsers } = useGetUsers()
const { enquiries, getEnquiries } = useGetEnquiries()
const { subscriptions, getSubscriptions } = useGetSubscriptions()
const { blogs, getBlogs } = useGetBlogs()
const { teamMembers, getTeamMembers } = useGetTeamMembers()
const { publications, getPublications } = useGetPublications()
const { labcasts, getLabCasts } = useGetLabCasts()
const { products, getProducts } = useGetProducts()
const { programs, getPrograms } = useGetPrograms()
const { forms, getForms } = useGetForms()
const { auditLogs, loading: loadingActivities, getAuditLogs } = useGetAuditLogs()
const { publications: convoStacks, getPublications: getConvoStacks } = useGetConvoStacks()

// Real stats from actual API data
const allStats = computed(() => [
  { title: 'Users', value: users?.value?.length || 0, icon: 'lucide:users', bgColor: 'bg-blue-50 ring-blue-100', textColor: 'text-blue-600', link: '/dashboard/users' },
  { title: 'Leadership', value: teamMembers?.value?.length || 0, icon: 'lucide:users-round', bgColor: 'bg-indigo-50 ring-indigo-100', textColor: 'text-indigo-600', link: '/dashboard/teams' },
  { title: 'Subscribers', value: subscriptions?.value?.length || 0, icon: 'lucide:mail', bgColor: 'bg-emerald-50 ring-emerald-100', textColor: 'text-emerald-600', link: '/dashboard/subscriptions' },
  { title: 'Enquiries', value: enquiries?.value?.length || 0, icon: 'lucide:message-square', bgColor: 'bg-amber-50 ring-amber-100', textColor: 'text-amber-600', link: '/dashboard/enquiries' },
  { title: 'Journo', value: publications?.value?.length || 0, icon: 'lucide:file-text', bgColor: 'bg-purple-50 ring-purple-100', textColor: 'text-purple-600', link: '/dashboard/publications' },
  { title: 'Blogs', value: blogs?.value?.length || 0, icon: 'lucide:newspaper', bgColor: 'bg-sky-50 ring-sky-100', textColor: 'text-sky-600', link: '/dashboard/blogs' },
  { title: 'LabCast', value: labcasts?.value?.length || 0, icon: 'lucide:mic', bgColor: 'bg-pink-50 ring-pink-100', textColor: 'text-pink-600', link: '/dashboard/labcast' },
  { title: 'Convo Stack', value: convoStacks?.value?.length || 0, icon: 'lucide:book-open', bgColor: 'bg-teal-50 ring-teal-100', textColor: 'text-teal-600', link: '/dashboard/convostack' },
  { title: 'Products', value: products?.value?.length || 0, icon: 'lucide:archive', bgColor: 'bg-orange-50 ring-orange-100', textColor: 'text-orange-600', link: '/dashboard/products' },
  { title: 'Programs', value: programs?.value?.length || 0, icon: 'lucide:graduation-cap', bgColor: 'bg-rose-50 ring-rose-100', textColor: 'text-rose-600', link: '/dashboard/programs' },
  { title: 'Forms', value: forms?.value?.length || 0, icon: 'lucide:clipboard-list', bgColor: 'bg-cyan-50 ring-cyan-100', textColor: 'text-cyan-600', link: '/dashboard/forms' },
  { title: 'Audit logs', value: auditLogs?.value?.length || 0, icon: 'lucide:fingerprint', bgColor: 'bg-slate-50 ring-slate-200', textColor: 'text-slate-600', link: '/dashboard/audit' },
])

// Content distribution bar chart based on real data
const contentDistribution = computed(() => {
  const items = [
    { label: 'Journo', count: publications?.value?.length || 0, color: 'bg-purple-500' },
    { label: 'Blogs', count: blogs?.value?.length || 0, color: 'bg-sky-500' },
    { label: 'LabCast episodes', count: labcasts?.value?.length || 0, color: 'bg-pink-500' },
    { label: 'Convo Stack', count: convoStacks?.value?.length || 0, color: 'bg-teal-500' },
    { label: 'Programs', count: programs?.value?.length || 0, color: 'bg-rose-500' },
    { label: 'Products', count: products?.value?.length || 0, color: 'bg-orange-500' },
  ]
  const maxCount = Math.max(...items.map(i => i.count), 1)
  return items.map(item => ({
    ...item,
    percentage: Math.round((item.count / maxCount) * 100)
  }))
})

// Weekly activity chart derived from audit logs by day
const weeklyActivity = computed(() => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const todayIndex = new Date().getDay() // 0=Sun
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  
  // Count audit logs per day of week from the last 7 days
  const dayCounts: Record<string, number> = {}
  days.forEach(d => dayCounts[d] = 0)
  
  const now = new Date()
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  
  ;(auditLogs?.value || []).forEach((log: any) => {
    const logDate = new Date(log.createdAt)
    if (logDate >= sevenDaysAgo) {
      const dayName = dayNames[logDate.getDay()]
      if (dayName in dayCounts) {
        dayCounts[dayName]++
      }
    }
  })

  const maxCount = Math.max(...Object.values(dayCounts), 1)
  const todayName = dayNames[todayIndex]
  
  return days.map(day => ({
    day,
    count: dayCounts[day],
    height: Math.max((dayCounts[day] / maxCount) * 100, 8), // minimum 8% visibility
    isToday: day === todayName,
  }))
})

const recentActivities = computed(() => auditLogs?.value?.slice(0, 8) || [])

const getActivityBg = (action: string) => {
  const map: Record<string, string> = { create: 'bg-green-500', update: 'bg-[#033958]', delete: 'bg-rose-500', login: 'bg-[#3BAB22]', logout: 'bg-slate-400' }
  return map[action] || 'bg-slate-500'
}

const getActivityIcon = (action: string) => {
  const map: Record<string, string> = { create: 'lucide:plus-circle', update: 'lucide:refresh-cw', delete: 'lucide:trash-2', login: 'lucide:key-round', logout: 'lucide:lock' }
  return map[action] || 'lucide:info'
}

const formatActivityDescription = (activity: any) => {
  const resource = activity.resource?.replace('_', ' ') || 'platform item'
  const action = activity.action || 'modified'
  return `${action.charAt(0).toUpperCase() + action.slice(1)} ${resource} in the administrative environment.`
}

const formatRelativeTime = (date: string) => {
  const diff = Math.floor((new Date().getTime() - new Date(date).getTime()) / 60000)
  if (diff < 1) return 'now'
  if (diff < 60) return `${diff}m`
  if (diff < 1440) return `${Math.floor(diff / 60)}h`
  return `${Math.floor(diff / 1440)}d`
}

onMounted(async () => {
  await Promise.all([
    getUsers(), getEnquiries(), getSubscriptions(), getBlogs(), 
    getTeamMembers(), getPublications(), getLabCasts(), getProducts(), 
    getPrograms(), getForms(), getAuditLogs(), getConvoStacks()
  ])
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
</style>
