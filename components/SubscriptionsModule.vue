<template>
  <div class="space-y-6">
    <!-- Header Actions -->
    <div class="flex justify-between items-center">
      <div class="flex items-center space-x-4">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search subscriptions..."
          class="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <select
          v-model="statusFilter"
          class="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="unsubscribed">Unsubscribed</option>
        </select>
      </div>
      <div class="flex items-center space-x-3">
        <button
          @click="exportSubscriptions"
          class="px-4 py-2 bg-black text-white rounded-lg  transition-all duration-200 flex items-center space-x-2"
        >
          <Icon name="heroicons:arrow-down-tray" class="w-4 h-4" />
          <span>Export</span>
        </button>
        <button
          @click="refreshSubscriptions"
          class="px-4 py-2 bg-black text-white rounded-lg  transition-all duration-200 flex items-center space-x-2"
        >
          <Icon name="heroicons:arrow-path" class="w-4 h-4" />
          <span>Refresh</span>
        </button>
      </div>
    </div>

    <!-- Subscriptions Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-slate-600">Total Subscribers</p>
            <p class="text-2xl font-bold text-slate-900 mt-1">{{ totalSubscribers }}</p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Icon name="heroicons:users" class="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-slate-600">Active Subscriptions</p>
            <p class="text-2xl font-bold text-slate-900 mt-1">{{ activeSubscriptions }}</p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <Icon name="heroicons:check-circle" class="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-slate-600">This Month</p>
            <p class="text-2xl font-bold text-slate-900 mt-1">{{ thisMonthSubscriptions }}</p>
          </div>
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <Icon name="heroicons:calendar" class="w-6 h-6 text-purple-600" />
          </div>
        </div>
      </div>
    </div>

    <!-- Subscriptions Table -->
    <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-slate-50 border-b border-slate-200">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Email</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Subscribed</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Source</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-slate-200">
            <tr v-for="subscription in filteredSubscriptions" :key="subscription._id" class="hover:bg-slate-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                    <Icon name="heroicons:envelope" class="w-4 h-4 text-white" />
                  </div>
                  <div class="ml-3">
                    <div class="text-sm font-medium text-slate-900">{{ subscription.email }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="[
                  'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                  subscription.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                ]">
                  {{ subscription.isActive ? 'Active' : 'Unsubscribed' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                {{ formatDate(subscription.createdAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                {{ subscription.source || 'Website' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center justify-end space-x-2">
                  <button
                    v-if="subscription.isActive"
                    @click="unsubscribeUser(subscription.email)"
                    class="text-orange-600 hover:text-orange-900 p-1 rounded hover:bg-orange-50"
                    title="Unsubscribe"
                  >
                    <Icon name="heroicons:no-symbol" class="w-4 h-4" />
                  </button>
                  <button
                    @click="deleteSubscription(subscription._id)"
                    class="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                    title="Delete"
                  >
                    <Icon name="heroicons:trash" class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
      
      <!-- Empty State -->
      <div v-else-if="filteredSubscriptions.length === 0" class="text-center py-12">
        <Icon name="heroicons:newspaper" class="w-12 h-12 text-slate-400 mx-auto mb-4" />
        <p class="text-slate-500">No subscriptions found</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useGetSubscriptions } from '@/composables/modules/subscriptions/useGetSubscriptions'
import { useUnsubscribe } from '@/composables/modules/subscriptions/useUnsubscribe'
import { useSoftDeleteSubscription } from '@/composables/modules/subscriptions/useSoftDeleteSubscription'

// Composables
const { subscriptions, loading, getSubscriptions } = useGetSubscriptions()
const { unsubscribe } = useUnsubscribe()
const { softDeleteSubscription } = useSoftDeleteSubscription()

// Reactive data
const searchQuery = ref('')
const statusFilter = ref('')

// Load subscriptions on mount
onMounted(() => {
  getSubscriptions()
})

// Computed
const filteredSubscriptions = computed(() => {
  let filtered = subscriptions.value

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

const totalSubscribers = computed(() => subscriptions.value.length)
const activeSubscriptions = computed(() => subscriptions.value.filter(s => s.isActive).length)
const thisMonthSubscriptions = computed(() => {
  const thisMonth = new Date()
  thisMonth.setDate(1)
  return subscriptions.value.filter(s => new Date(s.createdAt) >= thisMonth).length
})

// Methods
const refreshSubscriptions = () => {
  getSubscriptions()
}

const unsubscribeUser = async (email: string) => {
  if (confirm(`Are you sure you want to unsubscribe ${email}?`)) {
    try {
      await unsubscribe(email)
      await getSubscriptions()
    } catch (error) {
      console.error('Error unsubscribing user:', error)
    }
  }
}

const deleteSubscription = async (subscriptionId: string) => {
  if (confirm('Are you sure you want to delete this subscription?')) {
    try {
      await softDeleteSubscription(subscriptionId)
      await getSubscriptions()
    } catch (error) {
      console.error('Error deleting subscription:', error)
    }
  }
}

const exportSubscriptions = () => {
  const csvContent = [
    ['Email', 'Status', 'Subscribed Date', 'Source'],
    ...filteredSubscriptions.value.map(sub => [
      sub.email,
      sub.isActive ? 'Active' : 'Unsubscribed',
      formatDate(sub.createdAt),
      sub.source || 'Website'
    ])
  ].map(row => row.join(',')).join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'subscriptions.csv'
  a.click()
  window.URL.revokeObjectURL(url)
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString()
}
</script>
