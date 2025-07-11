<template>
  <div class="space-y-6">
    <!-- Welcome Section -->
    <div class="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 rounded-2xl p-6 md:p-8 text-white relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm"></div>
      <div class="relative z-10">
        <h1 class="text-2xl md:text-3xl font-bold mb-2">Welcome back!</h1>
        <p class="text-blue-100 text-sm md:text-base">Here's what's happening with your platform today</p>
      </div>
      <div class="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full animate-pulse"></div>
      <div class="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full animate-bounce"></div>
    </div>

    <!-- Stats Cards - All Sidebar Navigation Items -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6">
      <NuxtLink
        v-for="(stat, index) in allStats"
        :key="stat.title"
        :to="stat.link"
        class="bg-white block rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-lg transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 animate-fade-in-up group overflow-hidden relative"
        :style="{ 'animation-delay': `${index * 150}ms` }"
      >
        <!-- Floating background decoration -->
        <div class="absolute -top-4 -right-4 w-16 h-16 rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-300" 
             :class="getStatColor(stat.color)"></div>
        
        <div class="relative z-10">
          <!-- Header with icon and change indicator -->
          <div class="flex items-center justify-between mb-4">
            <div :class="[
              'w-12 h-12 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300',
              getStatColor(stat.color)
            ]">
              <Icon :name="stat.icon" class="w-6 h-6 text-white animate-pulse-soft" />
            </div>
            <div :class="[
              'px-2 py-1 rounded-full text-xs font-medium animate-bounce-subtle',
              stat.change.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            ]">
              {{ stat.change }}
            </div>
          </div>
          
          <!-- Title -->
          <h3 class="text-slate-600 text-sm font-medium mb-2 group-hover:text-slate-700 transition-colors">
            {{ stat.title }}
          </h3>
          
          <!-- Value with counter animation -->
          <div class="flex items-baseline space-x-2">
            <p class="text-2xl font-bold text-slate-900 group-hover:text-slate-800 transition-colors">
              {{ stat.value || '0' }}
            </p>
            <div class="w-2 h-2 rounded-full animate-pulse"></div>
          </div>
          
          <!-- Progress bar -->
          <div class="mt-4 bg-slate-100 rounded-full h-2 overflow-hidden">
            <div 
              class="h-full rounded-full animate-slide-in-right transition-all duration-1000"
              :class="getStatColor(stat.color)"
              :style="{ width: `${Math.min((parseInt(stat.value) || 0) / 100 * 80 + 20, 100)}%` }"
            ></div>
          </div>
        </div>
      </NuxtLink>
    </div>

    <!-- Recent Activities from Audit Logs -->
    <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-semibold text-slate-800">Recent Activities</h3>
        <button
          @click="refreshRecentActivities"
          class="text-sm text-blue-600 hover:text-blue-700 flex items-center space-x-1 transition-colors"
        >
          <Icon name="heroicons:arrow-path" class="w-4 h-4" />
          <span>Refresh</span>
        </button>
      </div>
      <div class="space-y-4 max-h-80 overflow-y-auto">
        <div
          v-for="(activity, index) in recentActivities"
          :key="activity._id"
          class="flex items-start space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors animate-slide-in-left"
          :style="{ 'animation-delay': `${index * 100}ms` }"
        >
          <div :class="[
            'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 animate-pulse-soft',
            getActivityColor(activity.action)
          ]">
            <Icon :name="getActivityIcon(activity.action)" class="w-4 h-4 text-white" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-slate-800 truncate">
              {{ formatActivityDescription(activity) }}
            </p>
            <p class="text-xs text-slate-500 mt-1">{{ formatRelativeTime(activity.createdAt) }}</p>
          </div>
        </div>
      </div>
      
      <div v-if="!recentActivities?.length && !loadingActivities" class="text-center py-8">
        <div class="w-16 h-16 bg-gradient-to-r from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-4 animate-float">
          <Icon name="heroicons:shield-check" class="w-8 h-8 text-slate-400" />
        </div>
        <p class="text-slate-500 text-sm">No recent activities</p>
      </div>
      
      <div v-if="loadingActivities" class="text-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
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

// Composables
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

// Load all data on mount
onMounted(async () => {
  await Promise.all([
    getUsers(),
    getEnquiries(),
    getSubscriptions(),
    getBlogs(),
    getTeamMembers(),
    getPublications(),
    getLabCasts(),
    getProducts(),
    getPrograms(),
    getForms(),
    getAuditLogs() // Get recent 10 audit logs for activities
  ])
})

// Computed stats - All sidebar navigation items
const allStats = computed(() => [
  {
    title: 'Users',
    value: users?.value?.length?.toString() || '0',
    change: '+12%',
    icon: 'heroicons:users',
    color: 'blue',
    link: '/dashboard/users'
  },
  {
    title: 'Enquiries',
    value: enquiries?.value?.length?.toString() || '0',
    change: '+5%',
    icon: 'heroicons:envelope',
    color: 'green',
    link: '/dashboard/enquires'
  },
  {
    title: 'Subscriptions',
    value: subscriptions?.value?.length?.toString() || '0',
    change: '+18%',
    icon: 'heroicons:newspaper',
    color: 'purple',
    link: '/dashboard/subscriptions'
  },
  {
    title: 'Team Members',
    value: teamMembers?.value?.length?.toString() || '0',
    change: '+3%',
    icon: 'heroicons:user-group',
    color: 'orange',
    link: '/dashboard/teams'
  },
  {
    title: 'Publications',
    value: publications?.value?.length?.toString() || '0',
    change: '+8%',
    icon: 'heroicons:document-text',
    color: 'indigo',
    link: '/dashboard/publications'
  },
  {
    title: 'LabCast',
    value: labcasts?.value?.length?.toString() || '0',
    change: '+15%',
    icon: 'heroicons:film',
    color: 'pink',
    link: '/dashboard/labcast'
  },
  {
    title: 'Products',
    value: products?.value?.length?.toString() || '0',
    change: '+22%',
    icon: 'heroicons:cube',
    color: 'teal',
    link: '/dashboard/products'
  },
  {
    title: 'Programs',
    value: programs?.value?.length?.toString() || '0',
    change: '+11%',
    icon: 'heroicons:academic-cap',
    color: 'emerald',
    link: '/dashboard/programs'
  },
  {
    title: 'Blogs',
    value: blogs?.value?.length?.toString() || '0',
    change: '+7%',
    icon: 'heroicons:pencil-square',
    color: 'amber',
    link: '/dashboard/blogs'
  },
  {
    title: 'Forms',
    value: forms?.value?.length?.toString() || '0',
    change: '+4%',
    icon: 'heroicons:document-duplicate',
    color: 'rose',
    link: '/dashboard/forms'
  },
  {
    title: 'Audit Logs',
    value: auditLogs?.value?.length?.toString() || '0',
    change: '+25%',
    icon: 'heroicons:shield-check',
    color: 'slate',
    link: '/dashboard/audit'
  }
])

// Recent activities from audit logs
const recentActivities = computed(() => {
  return auditLogs?.value?.slice(0, 8) || []
})

// Methods
const refreshRecentActivities = async () => {
  await getAuditLogs()
}

const getStatColor = (color: string) => {
  const colors = {
    blue: 'bg-gradient-to-r from-blue-500 to-blue-600',
    green: 'bg-gradient-to-r from-green-500 to-green-600',
    purple: 'bg-gradient-to-r from-purple-500 to-purple-600',
    orange: 'bg-gradient-to-r from-orange-500 to-orange-600',
    indigo: 'bg-gradient-to-r from-indigo-500 to-indigo-600',
    pink: 'bg-gradient-to-r from-pink-500 to-pink-600',
    teal: 'bg-gradient-to-r from-teal-500 to-teal-600',
    emerald: 'bg-gradient-to-r from-emerald-500 to-emerald-600',
    amber: 'bg-gradient-to-r from-amber-500 to-amber-600',
    rose: 'bg-gradient-to-r from-rose-500 to-rose-600'
  }
  return colors[color as keyof typeof colors] || 'bg-gradient-to-r from-slate-500 to-slate-600'
}

const getActivityColor = (action: string) => {
  const colors = {
    create: 'bg-green-500',
    update: 'bg-blue-500',
    delete: 'bg-red-500',
    soft_delete: 'bg-orange-500',
    restore: 'bg-purple-500',
    login: 'bg-emerald-500',
    logout: 'bg-gray-500'
  }
  return colors[action as keyof typeof colors] || 'bg-slate-500'
}

const getActivityIcon = (action: string) => {
  const icons = {
    create: 'heroicons:plus',
    update: 'heroicons:pencil',
    delete: 'heroicons:trash',
    soft_delete: 'heroicons:archive-box',
    restore: 'heroicons:arrow-path',
    login: 'heroicons:arrow-right-on-rectangle',
    logout: 'heroicons:arrow-left-on-rectangle'
  }
  return icons[action as keyof typeof icons] || 'heroicons:information-circle'
}

const formatActivityDescription = (activity: any) => {
  const resource = activity.resource?.replace('_', ' ') || 'item'
  const action = activity.action || 'action'
  
  const descriptions = {
    create: `Created new ${resource}`,
    update: `Updated ${resource}`,
    delete: `Deleted ${resource}`,
    soft_delete: `Archived ${resource}`,
    restore: `Restored ${resource}`,
    login: 'User logged in',
    logout: 'User logged out'
  }
  
  return descriptions[action as keyof typeof descriptions] || `${action} ${resource}`
}

const formatRelativeTime = (date: string) => {
  const now = new Date()
  const activityDate = new Date(date)
  const diffInMinutes = Math.floor((now.getTime() - activityDate.getTime()) / (1000 * 60))
  
  if (diffInMinutes < 1) return 'Just now'
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
  if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d ago`
  
  return activityDate.toLocaleDateString()
}
</script>

<style scoped>
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.6s ease-out forwards;
}

.animate-fade-in {
  animation: fade-in 0.4s ease-out forwards;
}

.animate-spin-slow {
  animation: spin-slow 3s linear infinite;
}
</style>
