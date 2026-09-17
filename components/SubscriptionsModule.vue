<template>
  <div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <!-- Action Header -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 rounded-[2rem] border border-slate-100">
      <div class="flex flex-col md:flex-row items-center gap-6 w-full md:w-auto">
        <div class="w-full md:w-80">
          <AnimatedInput
            v-model="searchQuery"
            id="search-subscriptions"
            label="Search subscribers"
            type="text"
          />
        </div>
        <div class="w-full md:w-64">
          <SelectInput
            v-model="statusFilter"
            :options="statusOptions"
          />
        </div>
      </div>

      <div class="flex items-center gap-4 w-full md:w-auto">
        <button
          @click="exportSubscriptions"
          class="flex-1 md:flex-none px-8 py-4 bg-white border border-slate-200 text-slate-900 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-all flex items-center justify-center space-x-3 group active:scale-95"
        >
          <Icon name="lucide:download" class="w-4 h-4 group-hover:translate-y-1 transition-transform" />
          <span>Export CSV</span>
        </button>
        <button
          @click="refreshSubscriptions"
          class="flex-1 md:flex-none px-8 py-4 bg-[#033958] text-white rounded-2xl font-bold text-sm hover:bg-[#044a73] transition-all flex items-center justify-center space-x-3 group active:scale-95"
        >
          <Icon name="lucide:refresh-cw" class="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
          <span>Refresh</span>
        </button>
      </div>
    </div>

    <!-- Subscriptions Metrics -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="bg-white rounded-[2rem] border border-slate-100 p-8 hover:border-slate-200 transition-all duration-500 group">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-bold text-slate-400 mb-2">Total audience</p>
            <p class="text-lg font-bold text-slate-900 tracking-normal">{{ totalSubscribers }}</p>
          </div>
          <div class="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-[#033958] group-hover:text-white transition-colors duration-500 border border-slate-100">
            <Icon name="lucide:users" class="w-8 h-8" />
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-[2rem] border border-slate-100 p-8 hover:border-emerald-100 transition-all duration-500 group">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-bold text-slate-400 mb-2">Active subscribers</p>
            <p class="text-lg font-bold text-emerald-600 tracking-normal">{{ activeSubscriptions }}</p>
          </div>
          <div class="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-500 border border-emerald-100">
            <Icon name="lucide:badge-check" class="w-8 h-8" />
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-[2rem] border border-slate-100 p-8 hover:border-blue-100 transition-all duration-500 group">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-bold text-slate-400 mb-2">New this month</p>
            <p class="text-lg font-bold text-blue-600 tracking-normal">{{ thisMonthSubscriptions }}</p>
          </div>
          <div class="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-500 border border-blue-100">
            <Icon name="lucide:bar-chart-3" class="w-8 h-8" />
          </div>
        </div>
      </div>
    </div>

    <!-- Subscriptions Ledger -->
    <div class="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden relative">
       <!-- Loading Overlay -->
      <div v-if="loading" class="absolute inset-0 bg-white/80 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center">
        <div class="w-12 h-12 border-4 border-slate-100 border-t-[#033958] rounded-full animate-spin mb-4"></div>
        <span class="text-sm font-bold text-[#033958]">Loading records...</span>
      </div>

      <div class="overflow-x-auto text-sm">
        <table class="w-full text-left border-separate border-spacing-0">
          <thead>
            <tr class="bg-slate-50/50 text-sm font-bold text-slate-400">
              <th class="px-10 py-6 border-b border-slate-100">Email address</th>
              <th class="px-10 py-6 border-b border-slate-100">Status</th>
              <th class="px-10 py-6 border-b border-slate-100">Joined date</th>
              <th class="px-10 py-6 border-b border-slate-100">Subscribed To</th>
              <th class="px-10 py-6 border-b border-slate-100">Source</th>
              <th class="px-10 py-6 text-right border-b border-slate-100">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            <tr v-for="subscription in filteredSubscriptions" :key="subscription._id" class="group hover:bg-slate-50/50 transition-all duration-300">
              <td class="px-10 py-8 whitespace-nowrap text-slate-700 font-medium">
                {{ subscription.email }}
              </td>
              <td class="px-10 py-8 whitespace-nowrap ">
                <div class="flex items-center space-x-3">
                  <div :class="['w-2 h-2 rounded-full', subscription.isActive ? 'bg-emerald-500' : 'bg-rose-500']"></div>
                  <span :class="['text-sm font-bold', subscription.isActive ? 'text-emerald-700' : 'text-rose-700']">
                    {{ subscription.isActive ? 'Active' : 'Unsubscribed' }}
                  </span>
                </div>
              </td>
              <td class="px-10 py-8 whitespace-nowrap text-slate-500 font-medium font-sans">
                {{ formatDate(subscription.createdAt) }}
              </td>
              <td class="px-10 py-8 whitespace-nowrap">
                <div class="flex flex-wrap gap-2" v-if="subscription.subscribedTo?.length">
                  <span v-for="item in subscription.subscribedTo" :key="item" class="px-2 py-1 bg-cyan-50 text-cyan-700 border border-cyan-100 rounded-md text-xs font-bold">
                    {{ item }}
                  </span>
                </div>
                <span v-else class="text-slate-400 text-sm font-medium">All</span>
              </td>
              <td class="px-10 py-8 whitespace-nowrap">
                 <span class="px-3 py-1.5 bg-slate-50 text-slate-500 border border-slate-100 rounded-lg text-sm font-bold">
                  {{ subscription.source || 'Website' }}
                 </span>
              </td>
              <td class="px-10 py-8 whitespace-nowrap text-right">
                <div class="flex items-center justify-end space-x-2 text-slate-400">
                  <button
                    v-if="subscription.isActive"
                    @click="unsubscribeUser(subscription.email)"
                    class="p-2 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all"
                    title="Unsubscribe user"
                  >
                    <Icon name="lucide:ban" class="w-5 h-5" />
                  </button>
                  <button
                    @click="deleteSubscription(subscription._id)"
                    class="p-2 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                    title="Delete record"
                  >
                    <Icon name="lucide:trash-2" class="w-5 h-5" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Empty State -->
      <div v-if="!loading && filteredSubscriptions.length === 0" class="py-32 text-center bg-slate-50/30">
        <div class="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-slate-100">
          <Icon name="lucide:newspaper" class="w-10 h-10 text-slate-100" />
        </div>
        <h3 class="text-xl font-bold text-slate-900 mb-2 tracking-tight">No records found</h3>
        <p class="text-slate-400 text-sm font-medium max-w-[280px] mx-auto leading-relaxed">No subscriber identities found in the database.</p>
      </div>
    </div>

    <!-- Unsubscribe Confirmation Modal -->
    <ConfirmModal
      v-model="showUnsubscribeModal"
      title="Unsubscribe User"
      :message="`Are you sure you want to unsubscribe ${emailToUnsubscribe}? They will no longer receive automated notifications.`"
      confirmText="Yes, Unsubscribe"
      confirmClass="bg-amber-600 hover:bg-amber-700"
      @confirm="executeUnsubscribe"
    />

    <!-- Delete Confirmation Modal -->
    <ConfirmModal
      v-model="showDeleteModal"
      title="Delete Record"
      message="Are you sure you want to delete this subscription record? This action cannot be undone."
      confirmText="Yes, Delete Record"
      @confirm="executeDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useGetSubscriptions } from '@/composables/modules/subscriptions/useGetSubscriptions'
import { useUnsubscribe } from '@/composables/modules/subscriptions/useUnsubscribe'
import { useSoftDeleteSubscription } from '@/composables/modules/subscriptions/useSoftDeleteSubscription'
import AnimatedInput from '@/components/ui/AnimatedInput.vue'
import SelectInput from '@/components/ui/SelectInput.vue'
import Icon from '@/components/Icon.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'

// Composables
const { subscriptions, loading, getSubscriptions } = useGetSubscriptions()
const { unsubscribe } = useUnsubscribe()
const { softDeleteSubscription } = useSoftDeleteSubscription()

// State
const searchQuery = ref('')
const statusFilter = ref('')

const statusOptions = [
  { label: 'All status', value: '' },
  { label: 'Active', value: 'active' },
  { label: 'Unsubscribed', value: 'unsubscribed' }
]

// Modal States
const showUnsubscribeModal = ref(false)
const emailToUnsubscribe = ref('')
const showDeleteModal = ref(false)
const idToDelete = ref('')

// Hooks
onMounted(() => { getSubscriptions() })

// Computed
const filteredSubscriptions = computed(() => {
  let filtered = (subscriptions.value || []) as any[]
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(subscription => 
      subscription.email?.toLowerCase().includes(query)
    )
  }
  if (statusFilter.value) {
    filtered = filtered.filter(subscription => 
      statusFilter.value === 'active' ? subscription.isActive : !subscription.isActive
    )
  }
  return filtered
})

const totalSubscribers = computed(() => subscriptions.value?.length || 0)
const activeSubscriptions = computed(() => (subscriptions.value || []).filter(s => s.isActive).length)
const thisMonthSubscriptions = computed(() => {
  const thisMonth = new Date()
  thisMonth.setDate(1)
  return (subscriptions.value || []).filter(s => s.createdAt && new Date(s.createdAt) >= thisMonth).length
})

// Methods
const refreshSubscriptions = () => { getSubscriptions() }

const unsubscribeUser = (email: string) => {
  emailToUnsubscribe.value = email
  showUnsubscribeModal.value = true
}

const executeUnsubscribe = async () => {
  try {
    await unsubscribe(emailToUnsubscribe.value)
    await getSubscriptions()
  } catch (error) {
    console.error('Unsubscribe failed:', error)
  } finally {
    showUnsubscribeModal.value = false
    emailToUnsubscribe.value = ''
  }
}

const deleteSubscription = (subscriptionId: string) => {
  idToDelete.value = subscriptionId
  showDeleteModal.value = true
}

const executeDelete = async () => {
  try {
    await softDeleteSubscription(idToDelete.value)
    await getSubscriptions()
  } catch (error) {
    console.error('Deletion failed:', error)
  } finally {
    showDeleteModal.value = false
    idToDelete.value = ''
  }
}

const exportSubscriptions = () => {
  const csvContent = [
    ['Email', 'Status', 'Subscribed Date', 'Subscribed To', 'Source'],
    ...(filteredSubscriptions.value || []).map(sub => [
      sub.email,
      sub.isActive ? 'Active' : 'Unsubscribed',
      formatDate(sub.createdAt || ''),
      (sub.subscribedTo || []).join('; '),
      sub.source || 'Website'
    ])
  ].map(row => row.join(',')).join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `medlab_subscriptions_${new Date().toISOString().split('T')[0]}.csv`
  a.click()
  window.URL.revokeObjectURL(url)
}

const formatDate = (date: string) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}
</script>
