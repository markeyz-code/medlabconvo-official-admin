<script setup lang="ts">
import { useGetSubscriptions } from '@/composables/modules/subscriptions/useGetSubscriptions'
import { useCreateSubscription } from '@/composables/modules/subscriptions/useCreateSubscription'
import { useUnsubscribe } from '@/composables/modules/subscriptions/useUnsubscribe'
import { useHardDeleteSubscription } from '@/composables/modules/subscriptions/useHardDeleteSubscription'
import Modal from '@/components/Modal.vue'
import AnimatedInput from '@/components/ui/AnimatedInput.vue'
import AdminTableLoading from '@/components/AdminTableLoading.vue'
import AdminEmptyState from '@/components/AdminEmptyState.vue'

const { subscriptions, loading, getSubscriptions } = useGetSubscriptions()
const { createSubscription, loading: creating } = useCreateSubscription()
const { unsubscribe } = useUnsubscribe()
const { hardDeleteSubscription } = useHardDeleteSubscription()

const search = ref('')
const status = ref<'all' | 'active' | 'inactive'>('all')
const showAdd = ref(false)
const email = ref('')
const showDelete = ref(false)
const deleting = ref<any>(null)

onMounted(() => getSubscriptions())

const filtered = computed(() => {
  let list = subscriptions.value || []
  if (status.value !== 'all') list = list.filter((s: any) => status.value === 'active' ? s.isActive : !s.isActive)
  if (search.value) {
    const q = search.value.toLowerCase()
    list = list.filter((s: any) => s.email?.toLowerCase().includes(q))
  }
  return list
})

const activeCount = computed(() => (subscriptions.value || []).filter((s: any) => s.isActive).length)
const inactiveCount = computed(() => (subscriptions.value || []).filter((s: any) => !s.isActive).length)
const thisMonth = computed(() => {
  const now = new Date()
  return (subscriptions.value || []).filter((s: any) => {
    const date = new Date(s.createdAt || 0)
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
  }).length
})

const addSubscriber = async () => {
  if (!email.value.trim()) return
  await createSubscription({ email: email.value.trim() })
  email.value = ''
  showAdd.value = false
  await getSubscriptions()
}

const handleUnsubscribe = async (subscriber: any) => {
  await unsubscribe(subscriber.email)
  subscriber.isActive = false
}

const confirmDelete = (subscriber: any) => {
  deleting.value = subscriber
  showDelete.value = true
}

const handleDelete = async () => {
  if (!deleting.value) return
  await hardDeleteSubscription(deleting.value._id || deleting.value.id)
  showDelete.value = false
  deleting.value = null
  await getSubscriptions()
}

const exportCsv = () => {
  const rows = [['Email', 'Status', 'Joined', 'Interests']]
  filtered.value.forEach((s: any) => rows.push([
    s.email,
    s.isActive ? 'Active' : 'Inactive',
    s.createdAt ? new Date(s.createdAt).toLocaleDateString() : '',
    Array.isArray(s.subscribedTo) ? s.subscribedTo.join('; ') : '',
  ]))
  const csv = rows.map(row => row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `convo-stack-audience-${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

const formatDate = (value?: string) => value ? new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'
</script>

<template>
  <div class="space-y-5">
    <div class="grid gap-3 sm:grid-cols-3">
      <div class="rounded-2xl border border-slate-100 bg-white p-4">
        <p class="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">Active subscribers</p>
        <p class="mt-2 text-2xl font-bold tracking-[-0.04em] text-slate-900">{{ activeCount }}</p>
        <p class="mt-1 text-[10px] text-slate-400">Receiving every published post</p>
      </div>
      <div class="rounded-2xl border border-slate-100 bg-white p-4">
        <p class="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">Joined this month</p>
        <p class="mt-2 text-2xl font-bold tracking-[-0.04em] text-[#27628C]">{{ thisMonth }}</p>
        <p class="mt-1 text-[10px] text-slate-400">New readers in the current month</p>
      </div>
      <div class="rounded-2xl border border-slate-100 bg-white p-4">
        <p class="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">Unsubscribed</p>
        <p class="mt-2 text-2xl font-bold tracking-[-0.04em] text-slate-500">{{ inactiveCount }}</p>
        <p class="mt-1 text-[10px] text-slate-400">No longer receiving newsletters</p>
      </div>
    </div>

    <div class="rounded-2xl border border-slate-100 bg-white">
      <div class="flex flex-col gap-3 border-b border-slate-100 p-4 lg:flex-row lg:items-center lg:justify-between">
        <div class="flex flex-1 flex-col gap-2 sm:flex-row">
          <div class="relative w-full sm:max-w-xs">
            <Icon name="lucide:search" class="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input v-model="search" type="search" placeholder="Search by email" class="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-xs outline-none focus:border-[#27628C]/40" />
          </div>
          <select v-model="status" class="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-600 outline-none">
            <option value="all">All subscribers</option>
            <option value="active">Active</option>
            <option value="inactive">Unsubscribed</option>
          </select>
        </div>
        <div class="flex items-center gap-2">
          <button type="button" class="btn btn-secondary" @click="exportCsv"><Icon name="lucide:download" class="h-3.5 w-3.5" /> Export CSV</button>
          <button type="button" class="btn btn-primary" @click="showAdd = true"><Icon name="lucide:plus" class="h-3.5 w-3.5" /> Add subscriber</button>
        </div>
      </div>

      <AdminTableLoading v-if="loading" :columns="4" :rows="5" label="Loading audience" />

      <div v-else-if="filtered.length" class="overflow-x-auto">
        <table class="admin-table stack-table w-full">
          <thead>
            <tr class="border-b border-slate-100 bg-slate-50/50">
              <th class="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400">Email</th>
              <th class="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400">Status</th>
              <th class="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400">Joined</th>
              <th class="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400">Interests</th>
              <th class="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            <tr v-for="subscriber in filtered" :key="subscriber._id || subscriber.email" class="hover:bg-slate-50/60">
              <td class="px-4 py-3">
                <p class="text-xs font-semibold text-slate-900">{{ subscriber.email }}</p>
              </td>
              <td class="px-4 py-3">
                <span class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold" :class="subscriber.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'">
                  <span class="h-1.5 w-1.5 rounded-full" :class="subscriber.isActive ? 'bg-emerald-500' : 'bg-slate-400'" />
                  {{ subscriber.isActive ? 'Active' : 'Unsubscribed' }}
                </span>
              </td>
              <td class="px-4 py-3 text-xs text-slate-500">{{ formatDate(subscriber.createdAt) }}</td>
              <td class="px-4 py-3 text-[10px] text-slate-500">{{ (subscriber.subscribedTo || []).join(', ') || 'All updates' }}</td>
              <td class="px-4 py-3">
                <div class="flex items-center justify-end gap-1">
                  <button v-if="subscriber.isActive" type="button" class="p-2 text-slate-400 hover:text-amber-600" title="Unsubscribe" @click="handleUnsubscribe(subscriber)"><Icon name="lucide:mail-x" class="h-4 w-4" /></button>
                  <button type="button" class="p-2 text-slate-400 hover:text-red-500" title="Delete subscriber" @click="confirmDelete(subscriber)"><Icon name="lucide:trash-2" class="h-4 w-4" /></button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <AdminEmptyState v-else icon="lucide:users" title="No subscribers yet" description="Readers who subscribe to the Convo Stack will appear here." />
    </div>

    <Modal v-model="showAdd" title="Add subscriber" size="sm">
      <form class="space-y-4 p-5" @submit.prevent="addSubscriber">
        <AnimatedInput v-model="email" id="new-subscriber-email" label="Email address" type="email" />
        <p class="text-[11px] leading-5 text-slate-500">The reader will receive the next published post by email.</p>
        <div class="flex justify-end gap-2 border-t border-slate-100 pt-3">
          <button type="button" class="btn btn-secondary" @click="showAdd = false">Cancel</button>
          <button type="submit" class="btn btn-primary" :disabled="creating || !email">Add subscriber</button>
        </div>
      </form>
    </Modal>

    <Modal v-model="showDelete" title="Delete subscriber" size="sm">
      <div class="space-y-4 p-5">
        <p class="text-xs leading-5 text-slate-600">Permanently delete <strong>{{ deleting?.email }}</strong> from the audience? This cannot be undone.</p>
        <div class="flex justify-end gap-2 border-t border-slate-100 pt-3">
          <button type="button" class="btn btn-secondary" @click="showDelete = false">Cancel</button>
          <button type="button" class="btn btn-danger" @click="handleDelete">Delete</button>
        </div>
      </div>
    </Modal>
  </div>
</template>
