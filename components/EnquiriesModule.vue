<template>
  <div class="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <!-- Filters -->
    <div class="flex flex-col gap-3 rounded-xl border border-slate-100 bg-white p-4 lg:flex-row lg:items-end lg:justify-between">
      <div class="grid w-full gap-3 sm:grid-cols-[minmax(0,20rem)_12rem]">
        <AnimatedInput v-model="searchQuery" id="search-enquiries" label="Search enquiries" type="text" />
        <SelectInput v-model="statusFilter" label="Status" :options="statusOptions" />
      </div>

      <div class="flex items-center justify-between gap-2 sm:justify-end">
        <div class="flex items-center gap-0.5 rounded-lg border border-slate-200 bg-slate-50 p-0.5">
          <button
            type="button"
            class="flex h-7 w-7 items-center justify-center rounded-md transition"
            :class="viewMode === 'table' ? 'bg-white text-[#27628C] shadow-sm' : 'text-slate-400 hover:text-slate-700'"
            title="Table view"
            aria-label="Table view"
            @click="viewMode = 'table'"
          >
            <Icon name="lucide:list" class="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            class="flex h-7 w-7 items-center justify-center rounded-md transition"
            :class="viewMode === 'grid' ? 'bg-white text-[#27628C] shadow-sm' : 'text-slate-400 hover:text-slate-700'"
            title="Grid view"
            aria-label="Grid view"
            @click="viewMode = 'grid'"
          >
            <Icon name="lucide:layout-grid" class="h-3.5 w-3.5" />
          </button>
        </div>
        <button type="button" class="btn btn-primary" @click="refreshEnquiries">
          <Icon name="lucide:refresh-cw" class="h-3.5 w-3.5" :class="{ 'animate-spin': loading }" />
          Refresh
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="overflow-hidden rounded-xl border border-slate-100 bg-white">
      <AdminTableLoading :columns="5" :rows="5" label="Loading enquiries" />
    </div>

    <!-- Empty -->
    <div v-else-if="filteredEnquiries.length === 0" class="overflow-hidden rounded-xl border border-slate-100 bg-white">
      <AdminEmptyState
        icon="lucide:messages-square"
        title="No enquiries found"
        description="No active enquiries or support tickets match the current filters."
      />
    </div>

    <!-- Table (default) -->
    <div v-else-if="viewMode === 'table'" class="overflow-hidden rounded-xl border border-slate-100 bg-white">
      <div class="overflow-x-auto">
        <table class="admin-table stack-table w-full">
          <thead>
            <tr class="border-b border-slate-100 bg-slate-50/60">
              <th class="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.06em] text-slate-400">Sender</th>
              <th class="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.06em] text-slate-400">Phone</th>
              <th class="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.06em] text-slate-400">Message</th>
              <th class="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.06em] text-slate-400">Status</th>
              <th class="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.06em] text-slate-400">Received</th>
              <th class="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-[0.06em] text-slate-400">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            <tr
              v-for="enquiry in filteredEnquiries"
              :key="enquiry._id"
              class="cursor-pointer transition hover:bg-slate-50/70"
              @click="viewEnquiry(enquiry)"
            >
              <td class="px-4 py-3">
                <div class="flex items-center gap-2.5">
                  <span :class="['flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold text-white', getStatusBg(enquiry.status)]">
                    {{ enquiry.firstName?.[0] || '?' }}
                  </span>
                  <div class="min-w-0">
                    <p class="truncate text-[11.5px] font-semibold text-slate-900">{{ enquiry.firstName }} {{ enquiry.lastName }}</p>
                    <p class="truncate text-[10px] text-slate-400">{{ enquiry.email }}</p>
                  </div>
                </div>
              </td>
              <td data-label="Phone" class="px-4 py-3">
                <span class="text-[10.5px] font-medium text-slate-600">{{ enquiry.phoneNumber || '—' }}</span>
              </td>
              <td data-label="Message" class="max-w-[26rem] px-4 py-3">
                <p class="line-clamp-2 text-[10.5px] leading-5 text-slate-500">{{ enquiry.message }}</p>
              </td>
              <td data-label="Status" class="px-4 py-3">
                <span :class="['inline-flex rounded-full px-2 py-0.5 text-[9px] font-bold capitalize', getStatusBadge(enquiry.status)]">
                  {{ statusLabel(enquiry.status) }}
                </span>
              </td>
              <td data-label="Received" class="whitespace-nowrap px-4 py-3">
                <span class="text-[10.5px] text-slate-500">{{ formatDate(enquiry.createdAt) }}</span>
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center justify-end gap-1">
                  <button
                    v-if="hasPermission('enquiries:delete')"
                    type="button"
                    class="rounded-md p-1.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                    title="Delete enquiry"
                    @click.stop="deleteEnquiry(enquiry._id)"
                  >
                    <Icon name="lucide:trash-2" class="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    class="rounded-md p-1.5 text-[#27628C] transition hover:bg-[#27628C]/10"
                    title="View enquiry"
                    @click.stop="viewEnquiry(enquiry)"
                  >
                    <Icon name="lucide:chevron-right" class="h-3.5 w-3.5" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="border-t border-slate-100 bg-slate-50/40 px-4 py-2.5">
        <p class="text-[10px] font-medium text-slate-400">{{ filteredEnquiries.length }} enquiries</p>
      </div>
    </div>

    <!-- Grid (optional) -->
    <div v-else class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      <article
        v-for="enquiry in filteredEnquiries"
        :key="enquiry._id"
        class="group relative cursor-pointer overflow-hidden rounded-xl border border-slate-100 bg-white p-4 transition hover:border-slate-200"
        @click="viewEnquiry(enquiry)"
      >
        <div :class="['absolute right-0 top-0 h-1 w-16 rounded-bl-full', getStatusColor(enquiry.status)]" />
        <div class="flex items-start gap-2.5">
          <span :class="['flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[12px] font-bold text-white', getStatusBg(enquiry.status)]">
            {{ enquiry.firstName?.[0] || '?' }}
          </span>
          <div class="min-w-0 flex-1">
            <p class="truncate text-[11.5px] font-semibold text-slate-900">{{ enquiry.firstName }} {{ enquiry.lastName }}</p>
            <p class="truncate text-[10px] text-slate-400">{{ enquiry.email }}</p>
          </div>
          <span :class="['rounded-full px-2 py-0.5 text-[9px] font-bold capitalize', getStatusBadge(enquiry.status)]">{{ statusLabel(enquiry.status) }}</span>
        </div>

        <div class="mt-3 flex flex-wrap items-center gap-2">
          <span class="inline-flex items-center gap-1 rounded-md bg-[#27628C]/5 px-2 py-1 text-[10px] font-semibold text-[#27628C]">
            <Icon name="lucide:phone" class="h-3 w-3" />{{ enquiry.phoneNumber || 'No phone' }}
          </span>
          <span class="inline-flex items-center gap-1 text-[10px] text-slate-400"><Icon name="lucide:calendar" class="h-3 w-3" />{{ formatDate(enquiry.createdAt) }}</span>
        </div>

        <p class="mt-3 line-clamp-3 text-[10.5px] leading-5 text-slate-500">{{ enquiry.message }}</p>

        <div class="mt-4 flex items-center justify-between border-t border-slate-50 pt-3">
          <span class="text-[9.5px] font-medium text-slate-400">Open enquiry</span>
          <div class="flex items-center gap-1">
            <button
              v-if="hasPermission('enquiries:delete')"
              type="button"
              class="rounded-md p-1.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
              title="Delete enquiry"
              @click.stop="deleteEnquiry(enquiry._id)"
            >
              <Icon name="lucide:trash-2" class="h-3.5 w-3.5" />
            </button>
            <span class="rounded-md bg-[#27628C]/5 p-1.5 text-[#27628C]"><Icon name="lucide:chevron-right" class="h-3.5 w-3.5" /></span>
          </div>
        </div>
      </article>
    </div>

    <!-- Enquiry detail -->
    <Modal
      v-model="showDetailModal"
      size="lg"
      eyebrow="Enquiry"
      :title="selectedEnquiry ? `${selectedEnquiry.firstName} ${selectedEnquiry.lastName}` : 'Enquiry details'"
      description="Review the sender, message and status."
      @close="closeDetailModal"
    >
      <div v-if="selectedEnquiry" class="space-y-4">
        <div class="grid gap-3 sm:grid-cols-2">
          <div class="rounded-lg border border-slate-100 bg-slate-50 p-3">
            <p class="text-[9px] font-bold uppercase tracking-[0.08em] text-slate-400">Email</p>
            <a :href="`mailto:${selectedEnquiry.email}`" class="mt-1 block truncate text-[11.5px] font-semibold text-[#27628C]">{{ selectedEnquiry.email }}</a>
          </div>
          <div class="rounded-lg border border-slate-100 bg-slate-50 p-3">
            <p class="text-[9px] font-bold uppercase tracking-[0.08em] text-slate-400">Phone</p>
            <p class="mt-1 text-[11.5px] font-semibold text-slate-800">{{ selectedEnquiry.phoneNumber || 'Not provided' }}</p>
          </div>
        </div>

        <div class="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-100 px-3 py-2.5">
          <div class="flex items-center gap-2">
            <span :class="['rounded-full px-2 py-0.5 text-[9px] font-bold capitalize', getStatusBadge(selectedEnquiry.status)]">{{ statusLabel(selectedEnquiry.status) }}</span>
            <span class="text-[10px] text-slate-400">{{ formatDate(selectedEnquiry.createdAt) }}</span>
          </div>
          <span class="text-[9.5px] text-slate-400">{{ formatDetailedDate(selectedEnquiry.createdAt) }}</span>
        </div>

        <div>
          <p class="field-label">Message</p>
          <div class="whitespace-pre-wrap rounded-lg border border-slate-100 bg-slate-50 p-3.5 text-[11.5px] leading-6 text-slate-600">{{ selectedEnquiry.message }}</div>
        </div>
      </div>

      <template #footer>
        <button type="button" class="btn btn-outline" @click="closeDetailModal">Close</button>
        <a v-if="selectedEnquiry" :href="`mailto:${selectedEnquiry.email}`" class="btn btn-primary">
          <Icon name="lucide:mail" class="h-3.5 w-3.5" /> Reply by email
        </a>
      </template>
    </Modal>

    <ConfirmModal
      v-model="showDeleteModal"
      title="Delete Enquiry"
      message="Are you sure you want to delete this enquiry? This action cannot be undone."
      confirm-text="Delete enquiry"
      @confirm="executeDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useGetEnquiries } from '@/composables/modules/enquires/useGetEnquiries'
import { useSoftDeleteEnquiry } from '@/composables/modules/enquires/useSoftDeleteEnquiry'
import Modal from '@/components/Modal.vue'
import AnimatedInput from '@/components/ui/AnimatedInput.vue'
import SelectInput from '@/components/ui/SelectInput.vue'
import Icon from '@/components/Icon.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'
import { useUser } from '@/composables/modules/auth/user'
import AdminEmptyState from '@/components/AdminEmptyState.vue'
import AdminTableLoading from '@/components/AdminTableLoading.vue'

const { hasPermission } = useUser()
const { enquiries, loading, getEnquiries } = useGetEnquiries()
const { softDeleteEnquiry } = useSoftDeleteEnquiry()

const searchQuery = ref('')
const statusFilter = ref('')
const viewMode = ref<'table' | 'grid'>('table')
const showDetailModal = ref(false)
const selectedEnquiry = ref<any>(null)
const showDeleteModal = ref(false)
const idToDelete = ref('')

const statusOptions = [
  { label: 'All statuses', value: '' },
  { label: 'Pending', value: 'pending' },
  { label: 'In progress', value: 'in-progress' },
  { label: 'Resolved', value: 'resolved' },
]

onMounted(() => getEnquiries())

const filteredEnquiries = computed(() => {
  let filtered = (enquiries.value || []) as any[]
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    filtered = filtered.filter(enquiry =>
      enquiry.firstName?.toLowerCase().includes(q)
      || enquiry.lastName?.toLowerCase().includes(q)
      || enquiry.email?.toLowerCase().includes(q)
      || enquiry.message?.toLowerCase().includes(q),
    )
  }
  if (statusFilter.value) filtered = filtered.filter(enquiry => enquiry.status === statusFilter.value)
  return filtered
})

const refreshEnquiries = () => getEnquiries()

const viewEnquiry = (enquiry: any) => {
  selectedEnquiry.value = enquiry
  showDetailModal.value = true
}

const closeDetailModal = () => {
  showDetailModal.value = false
  window.setTimeout(() => { selectedEnquiry.value = null }, 250)
}

const deleteEnquiry = (enquiryId: string) => {
  idToDelete.value = enquiryId
  showDeleteModal.value = true
}

const executeDelete = async () => {
  try {
    await softDeleteEnquiry(idToDelete.value)
    await getEnquiries()
  } catch (error) {
    console.error('Purge failed:', error)
  } finally {
    showDeleteModal.value = false
    idToDelete.value = ''
  }
}

const formatDate = (date: string) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

const formatDetailedDate = (date: string) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

const statusLabel = (status: string) => {
  if (status === 'in-progress') return 'In progress'
  if (status === 'resolved') return 'Resolved'
  return 'Pending'
}

const getStatusColor = (status: string) => {
  if (status === 'pending') return 'bg-amber-400'
  if (status === 'in-progress') return 'bg-blue-500'
  return 'bg-emerald-500'
}

const getStatusBg = (status: string) => {
  if (status === 'pending') return 'bg-amber-500'
  if (status === 'in-progress') return 'bg-[#27628C]'
  return 'bg-emerald-600'
}

const getStatusBadge = (status: string) => {
  if (status === 'pending') return 'bg-amber-50 text-amber-700'
  if (status === 'in-progress') return 'bg-blue-50 text-blue-700'
  return 'bg-emerald-50 text-emerald-700'
}
</script>
