<template>
  <div class="space-y-10 animate-in fade-in duration-700">
    <!-- Welcome Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-200">
      <div>
        <h1 class="text-4xl font-black text-slate-900 tracking-tight mb-2">Platform Intelligence Hub</h1>
        <p class="text-slate-500 font-medium text-lg antialiased">Real-time operational overview and cross-departmental analytics for MedLabConvo.</p>
      </div>
      <div class="flex items-center space-x-3">
        <button 
          @click="refreshData"
          class="flex items-center space-x-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm group"
        >
          <Icon name="heroicons:arrow-path" :class="['w-5 h-5 text-slate-400 group-hover:rotate-180 transition-transform duration-500', loadingActivities ? 'animate-spin' : '']" />
          <span>Sync Data</span>
        </button>
      </div>
    </div>

    <!-- KPI Metrics Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-6">
      <NuxtLink
        v-for="stat in allStats"
        :key="stat.title"
        :to="stat.link"
        class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:border-[#033958]/20 transition-all group overflow-hidden relative"
      >
        <div class="flex justify-between items-start mb-6">
          <div :class="['p-3 rounded-xl ring-1 ring-inset', stat.bgColor]">
            <Icon :name="stat.icon" :class="['w-6 h-6', stat.textColor]" />
          </div>
          <span :class="['text-[10px] font-black px-2 py-1 rounded uppercase tracking-wider', stat.changeColor]">
            {{ stat.change }}
          </span>
        </div>
        <div>
          <p class="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">{{ stat.title }}</p>
          <h3 class="text-3xl font-black text-slate-900 tracking-tight">{{ stat.value }}</h3>
        </div>
        <!-- Subtle accent border on hover -->
        <div class="absolute bottom-0 left-0 w-full h-1 bg-transparent group-hover:bg-[#3BAB22] transition-all duration-300"></div>
      </NuxtLink>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-10">
      <!-- Activity Feed -->
      <div class="xl:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 class="text-xl font-black text-slate-900 tracking-tight">Audit Trail</h3>
            <p class="text-slate-500 text-sm font-medium">Monitoring the last 8 administrative actions across the platform.</p>
          </div>
          <Icon name="heroicons:finger-print" class="w-8 h-8 text-slate-300" />
        </div>
        
        <div class="divide-y divide-slate-100 max-h-[520px] overflow-y-auto custom-scrollbar">
          <div
            v-for="activity in (recentActivities as any)"
            :key="activity._id"
            class="p-6 flex items-start space-x-5 hover:bg-slate-50 transition-colors"
          >
            <div :class="['w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm', getActivityBg(activity.action)]">
              <Icon :name="getActivityIcon(activity.action)" class="w-6 h-6 text-white" />
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between gap-4 mb-2">
                <p class="text-slate-900 font-bold text-sm truncate uppercase tracking-tight">
                  <span class="text-blue-600 bg-blue-50 px-2 py-0.5 rounded mr-2">{{ activity.action }}</span>
                  {{ activity.resource?.replace('_', ' ') || 'system item' }}
                </p>
                <span class="text-[10px] font-black text-slate-400 whitespace-nowrap">{{ formatRelativeTime(activity.createdAt) }}</span>
              </div>
              <p class="text-slate-500 text-sm leading-relaxed font-medium antialiased">
                {{ formatActivityDescription(activity) }}
              </p>
            </div>
          </div>
          
          <div v-if="!recentActivities?.length" class="py-20 text-center">
            <Icon name="heroicons:inbox" class="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <p class="text-slate-400 font-bold tracking-tight">No recent administrative logs found.</p>
          </div>
        </div>
        
        <NuxtLink to="/dashboard/audit" class="block w-full py-5 text-center bg-slate-50 text-[#033958] font-black text-xs uppercase tracking-widest hover:bg-[#033958] hover:text-white transition-all border-t border-slate-100">
          View Detailed Audit History
        </NuxtLink>
      </div>

      <!-- Quick Action Panel -->
      <div class="space-y-6">
        <div class="bg-[#033958] rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden group">
          <div class="absolute -right-8 -top-8 w-40 h-40 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all duration-700"></div>
          <h3 class="text-2xl font-black mb-4 relative z-10">Invite New Collaborator</h3>
          <p class="text-blue-100/70 text-sm font-medium mb-8 leading-relaxed relative z-10">Expand your team's capabilities by inviting new members with specific roles and departmental permissions.</p>
          <NuxtLink to="/dashboard/users" class="inline-flex items-center px-6 py-3 bg-[#3BAB22] text-white rounded-xl font-bold text-sm shadow-xl hover:bg-[#2d851a] transition-all group relative z-10">
            <span>Initiate Invitation</span>
            <Icon name="heroicons:paper-airplane" class="ml-2 w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </NuxtLink>
        </div>

        <div class="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <h3 class="text-xl font-black text-slate-900 tracking-tight mb-6">Service Health</h3>
          <div class="space-y-4">
            <div v-for="service in ['API Gateway', 'Core Database', 'Mail Service', 'Storage']" :key="service" class="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span class="text-xs font-bold text-slate-600 uppercase tracking-wider">{{ service }}</span>
              <div class="flex items-center space-x-2">
                <span class="text-[10px] font-black text-green-600 uppercase">Operational</span>
                <div class="w-1.5 h-1.5 rounded-full bg-green-500 shadow-sm shadow-green-200"></div>
              </div>
            </div>
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

const allStats = computed(() => [
  { title: 'Users DB', value: users?.value?.length || 0, change: '+4.2%', icon: 'heroicons:users', bgColor: 'bg-blue-50 ring-blue-100', textColor: 'text-blue-600', changeColor: 'bg-green-50 text-green-700', link: '/dashboard/users' },
  { title: 'Teams', value: teamMembers?.value?.length || 0, change: '+1.5%', icon: 'heroicons:user-group', bgColor: 'bg-indigo-50 ring-indigo-100', textColor: 'text-indigo-600', changeColor: 'bg-green-50 text-green-700', link: '/dashboard/teams' },
  { title: 'Inbound', value: enquiries?.value?.length || 0, change: '-2.1%', icon: 'heroicons:chat-bubble-left-right', bgColor: 'bg-emerald-50 ring-emerald-100', textColor: 'text-emerald-600', changeColor: 'bg-slate-50 text-slate-700', link: '/dashboard/enquiries' },
  { title: 'Inventory', value: products?.value?.length || 0, change: 'Stable', icon: 'heroicons:shopping-bag', bgColor: 'bg-amber-50 ring-amber-100', textColor: 'text-amber-600', changeColor: 'bg-slate-50 text-slate-700', link: '/dashboard/products' },
  { title: 'Programs', value: programs?.value?.length || 0, change: '+8%', icon: 'heroicons:academic-cap', bgColor: 'bg-rose-50 ring-rose-100', textColor: 'text-rose-600', changeColor: 'bg-green-50 text-green-700', link: '/dashboard/programs' },
  { title: 'Audit Logs', value: auditLogs?.value?.length || 0, change: 'Active', icon: 'heroicons:finger-print', bgColor: 'bg-slate-50 ring-slate-100', textColor: 'text-slate-600', changeColor: 'bg-blue-50 text-blue-700', link: '/dashboard/audit' }
])

const recentActivities = computed(() => auditLogs?.value?.slice(0, 8) || [])

const refreshData = async () => {
  await Promise.all([getUsers(), getEnquiries(), getSubscriptions(), getBlogs(), getTeamMembers(), getPublications(), getLabCasts(), getProducts(), getPrograms(), getForms(), getAuditLogs()])
}

const getActivityBg = (action: string) => {
  const map = { create: 'bg-green-500', update: 'bg-[#033958]', delete: 'bg-rose-500', login: 'bg-[#3BAB22]', logout: 'bg-slate-400' }
  return map[action as keyof typeof map] || 'bg-slate-500'
}

const getActivityIcon = (action: string) => {
  const map = { create: 'heroicons:plus-circle', update: 'heroicons:arrow-path', delete: 'heroicons:trash', login: 'heroicons:key', logout: 'heroicons:lock-closed' }
  return map[action as keyof typeof map] || 'heroicons:information-circle'
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
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
</style>
