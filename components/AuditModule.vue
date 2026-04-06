<template>
  <div class="space-y-6">
    <!-- Header Actions -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100">
      <div class="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
        <div class="w-full md:w-64">
          <AnimatedInput
            v-model="searchQuery"
            id="audit-search"
            label="Search logs"
            type="text"
          />
        </div>
        <div class="w-full md:w-48">
          <SelectInput
            v-model="actionFilter"
            label="Action"
            :options="[
              { label: 'All actions', value: '' },
              { label: 'Create', value: 'create' },
              { label: 'Update', value: 'update' },
              { label: 'Delete', value: 'delete' },
              { label: 'Archive', value: 'soft_delete' },
              { label: 'Restore', value: 'restore' },
              { label: 'Login', value: 'login' },
              { label: 'Logout', value: 'logout' }
            ]"
          />
        </div>
        <div class="w-full md:w-48">
          <SelectInput
            v-model="resourceFilter"
            label="Resource"
            :options="[
              { label: 'All resources', value: '' },
              { label: 'Users', value: 'user' },
              { label: 'Blogs', value: 'blog' },
              { label: 'Publications', value: 'publication' },
              { label: 'Programs', value: 'program' },
              { label: 'Teams', value: 'team_member' },
              { label: 'Forms', value: 'form' },
              { label: 'Enquiries', value: 'enquiry' },
              { label: 'Subscriptions', value: 'subscription' }
            ]"
          />
        </div>
      </div>
      <button
        @click="refreshAuditLogs"
        class="w-full md:w-auto px-8 py-4 bg-[#033958] text-white rounded-2xl font-bold text-sm hover:bg-[#044a73] transition-all flex items-center justify-center space-x-3 active:scale-95"
      >
        <Icon name="lucide:refresh-cw" class="w-4 h-4" />
        <span>Refresh</span>
      </button>
    </div>

    <!-- Audit Logs Timeline -->
    <div class="bg-white rounded-2xl border border-slate-100 overflow-hidden relative">
      <div class="p-8">
        <h3 class="text-xl font-bold text-slate-900 mb-8 tracking-tight">System activity</h3>
        
        <div class="space-y-6">
          <div
            v-for="log in filteredAuditLogs"
            :key="log._id"
            class="flex items-start space-x-5 p-5 rounded-2xl border border-transparent hover:border-slate-50 hover:bg-slate-50/50 transition-all duration-300 group"
          >
            <!-- Action Icon -->
            <div :class="[
              'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110',
              getActionColor(log.action)
            ]">
              <Icon :name="getActionIcon(log.action)" class="w-6 h-6 text-white" />
            </div>
            
            <!-- Log Details -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center space-x-3">
                  <span class="text-sm font-bold text-slate-900">{{ getActionLabel(log.action) }}</span>
                  <span class="w-1 h-1 rounded-full bg-slate-300"></span>
                  <span class="text-sm font-bold text-slate-400 uppercase tracking-widest">{{ log.resource.replace('_', ' ') }}</span>
                  <span v-if="log.resourceId" class="px-2 py-0.5 text-[10px] font-bold bg-slate-100 text-slate-500 rounded-lg">
                    ID: {{ log.resourceId.slice(-8) }}
                  </span>
                </div>
                <span class="text-sm font-medium text-slate-400">{{ formatDate(log.createdAt) }}</span>
              </div>
              
              <p class="text-sm text-slate-600 font-medium mb-3">
                User <span class="text-slate-900 font-bold">{{ log.userId.slice(-8) }}</span> 
                {{ getActionDescription(log.action, log.resource) }}
              </p>
              
              <!-- Metadata -->
              <div v-if="log.metadata" class="flex flex-wrap items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <span v-if="log.metadata.ip" class="flex items-center">
                  <Icon name="lucide:globe" class="w-3 h-3 mr-1" />
                  {{ log.metadata.ip }}
                </span>
                <span v-if="log.metadata.method" class="px-1.5 py-0.5 bg-slate-50 rounded border border-slate-100">{{ log.metadata.method }}</span>
                <span v-if="log.metadata.url" class="truncate max-w-[200px]">{{ log.metadata.url }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-20 bg-white/80 absolute inset-0 z-10">
        <div class="flex flex-col items-center">
          <div class="w-12 h-12 border-4 border-slate-100 border-t-[#033958] rounded-full animate-spin mb-4"></div>
          <span class="text-sm font-bold text-slate-400">Loading history...</span>
        </div>
      </div>
      
      <!-- Empty State -->
      <div v-else-if="filteredAuditLogs?.length === 0" class="text-center py-24">
        <div class="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-slate-100">
          <Icon name="lucide:shield-check" class="w-10 h-10 text-slate-100" />
        </div>
        <h3 class="text-xl font-bold text-slate-900 mb-2 tracking-tight">No activity found</h3>
        <p class="text-slate-400 text-sm font-medium">There are no records matching your search criteria.</p>
      </div>
    </div>

    <!-- Load More Button -->
    <div v-if="hasMore && filteredAuditLogs?.length > 0" class="text-center pt-4">
      <button
        @click="loadMore"
        :disabled="loadingMore"
        class="px-10 py-4 bg-white border border-slate-200 text-slate-900 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-all disabled:opacity-50 active:scale-95"
      >
        <span>{{ loadingMore ? 'Loading more...' : 'Load more logs' }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useGetAuditLogs } from '@/composables/modules/audit/useGetAuditLogs'
import AnimatedInput from '@/components/ui/AnimatedInput.vue'
import SelectInput from '@/components/ui/SelectInput.vue'
import Icon from '~/components/Icon.vue'

// Composables
const { auditLogs, loading, getAuditLogs } = useGetAuditLogs()

// Reactive data
const searchQuery = ref('')
const actionFilter = ref('')
const resourceFilter = ref('')
const loadingMore = ref(false)
const hasMore = ref(true)
const currentLimit = ref(50)

// Load audit logs on mount
onMounted(() => {
  getAuditLogs(currentLimit.value)
})

// Computed
const filteredAuditLogs = computed(() => {
  let filtered = auditLogs.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(log => 
      log.resource?.toLowerCase().includes(query) ||
      log.action?.toLowerCase().includes(query) ||
      log.userId?.toLowerCase().includes(query)
    )
  }

  if (actionFilter.value) {
    filtered = filtered.filter(log => log.action === actionFilter.value)
  }

  if (resourceFilter.value) {
    filtered = filtered.filter(log => log.resource === resourceFilter.value)
  }

  return filtered
})

// Methods
const refreshAuditLogs = () => {
  currentLimit.value = 50
  getAuditLogs(currentLimit.value)
}

const loadMore = async () => {
  loadingMore.value = true
  currentLimit.value += 50
  await getAuditLogs(currentLimit.value)
  loadingMore.value = false
}

const getActionColor = (action: string) => {
  const colors = {
    create: 'bg-emerald-500',
    update: 'bg-blue-500',
    delete: 'bg-rose-500',
    soft_delete: 'bg-amber-500',
    restore: 'bg-indigo-500',
    login: 'bg-[#033958]',
    logout: 'bg-slate-400'
  }
  return colors[action as keyof typeof colors] || 'bg-slate-400'
}

const getActionIcon = (action: string) => {
  const icons = {
    create: 'lucide:plus',
    update: 'lucide:pencil',
    delete: 'lucide:trash-2',
    soft_delete: 'lucide:archive',
    restore: 'lucide:refresh-cw',
    login: 'lucide:log-in',
    logout: 'lucide:log-out'
  }
  return icons[action as keyof typeof icons] || 'lucide:info'
}

const getActionLabel = (action: string) => {
  const labels = {
    create: 'Created',
    update: 'Updated',
    delete: 'Deleted',
    soft_delete: 'Archived',
    restore: 'Restored',
    login: 'Logged In',
    logout: 'Logged Out'
  }
  return labels[action as keyof typeof labels] || action
}

const getActionDescription = (action: string, resource: string) => {
  const resourceName = resource.replace('_', ' ')
  const descriptions = {
    create: `created a new ${resourceName}`,
    update: `updated a ${resourceName}`,
    delete: `permanently deleted a ${resourceName}`,
    soft_delete: `archived a ${resourceName}`,
    restore: `restored a ${resourceName}`,
    login: 'signed into the system',
    logout: 'signed out of the system'
  }
  return descriptions[action as keyof typeof descriptions] || `performed ${action} on ${resourceName}`
}

const formatDate = (date: string) => {
  const now = new Date()
  const logDate = new Date(date)
  const diffInMinutes = Math.floor((now.getTime() - logDate.getTime()) / (1000 * 60))
  
  if (diffInMinutes < 1) return 'Just now'
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
  if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d ago`
  
  return logDate.toLocaleDateString()
}
</script>