<template>
  <div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <!-- Action Header -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 rounded-[2rem] border border-slate-100">
      <div class="flex flex-col md:flex-row items-center gap-6 w-full md:w-auto">
        <div class="w-full md:w-80">
          <AnimatedInput
            v-model="searchQuery"
            id="search-enquiries"
            label="Search enquiries"
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
          @click="refreshEnquiries"
          class="flex-1 md:flex-none px-8 py-4 bg-[#033958] text-white rounded-2xl font-bold text-sm hover:bg-[#044a73] transition-all flex items-center justify-center space-x-3 group active:scale-95"
        >
          <Icon name="lucide:refresh-cw" class="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
          <span>Refresh</span>
        </button>
      </div>
    </div>

    <!-- Enquiries Registry -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div v-for="i in 6" :key="i" class="h-64 bg-slate-100/50 rounded-[2rem] animate-pulse"></div>
    </div>

    <div v-else-if="filteredEnquiries.length === 0" class="py-32 text-center bg-white rounded-[2.5rem] border border-slate-100">
      <div class="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-slate-100">
        <Icon name="lucide:mail-open" class="w-10 h-10 text-slate-100" />
      </div>
      <h3 class="text-xl font-bold text-slate-900 mb-2 tracking-tight">No enquiries found</h3>
      <p class="text-slate-400 text-sm font-medium max-w-[280px] mx-auto leading-relaxed">No active enquiries or support tickets found in the database.</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div
        v-for="enquiry in filteredEnquiries"
        :key="enquiry._id"
        class="group bg-white rounded-[2rem] border border-slate-100 p-8 hover:border-slate-200 transition-all duration-500 cursor-pointer relative overflow-hidden"
        @click="viewEnquiry(enquiry)"
      >
        <div :class="['absolute top-0 right-0 w-24 h-1 rounded-bl-full transition-colors', getStatusColor(enquiry.status)]"></div>

        <div class="flex items-start justify-between mb-8">
          <div class="flex items-center space-x-5">
            <div :class="['w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl ring-4 ring-slate-50', getStatusBg(enquiry.status)]">
              {{ enquiry.name?.[0] || '?' }}
            </div>
            <div>
              <h3 class="text-sm font-bold text-slate-900 tracking-tight">{{ enquiry.firstName }} {{ enquiry.lastName }}</h3>
              <p class="text-sm font-bold text-slate-400 mt-1 lowercase">{{ enquiry.email }}</p>
            </div>
          </div>
        </div>
        
        <div class="space-y-4 mb-8">
          <div class="flex items-center gap-2">
            <div class="px-3 py-1 bg-[#033958]/5 text-[#033958] text-sm font-black uppercase tracking-widest rounded-lg">
              <Icon name="lucide:phone" class="w-3 h-3 inline mr-1" />
              {{ enquiry.phoneNumber }}
            </div>
          </div>
          <p class="text-sm text-slate-600 font-medium leading-relaxed line-clamp-3 antialiased">{{ enquiry.message }}</p>
        </div>
        
        <div class="flex items-center justify-between pt-6 border-t border-slate-50">
          <div class="flex items-center space-x-2 text-sm font-bold text-slate-400">
            <Icon name="lucide:calendar" class="w-3.5 h-3.5" />
            <span>{{ formatDate(enquiry.createdAt) }}</span>
          </div>
          
          <div class="flex items-center space-x-2 transition-opacity duration-300">
            <button
              @click.stop="deleteEnquiry(enquiry._id)"
              class="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
              title="Delete enquiry"
            >
              <Icon name="lucide:trash-2" class="w-5 h-5" />
            </button>
            <div class="p-2 text-blue-400 bg-blue-50 rounded-xl">
              <Icon name="lucide:chevron-right" class="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Enquiry Detail Sheet -->
    <SlideOver v-model="showDetailModal" size="full" title="Enquiry details">
      <div v-if="selectedEnquiry" class="p-8 space-y-10">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div class="space-y-2">
            <label class="block text-sm font-bold text-slate-400 uppercase tracking-widest">Sender identity</label>
            <p class="text-base font-bold text-slate-900 uppercase italic">{{ selectedEnquiry.firstName }} {{ selectedEnquiry.lastName }}</p>
          </div>
          <div class="space-y-2">
            <label class="block text-sm font-bold text-slate-400 uppercase tracking-widest">Email address</label>
            <p class="text-base font-bold text-[#033958] lowercase">{{ selectedEnquiry.email }}</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-10 pt-6 border-t border-slate-50">
          <div class="space-y-2">
            <label class="block text-sm font-bold text-slate-400 uppercase tracking-widest">Phone line</label>
            <p class="text-base font-bold text-slate-900">{{ selectedEnquiry.phoneNumber }}</p>
          </div>
          <div class="space-y-2">
            <label class="block text-sm font-bold text-slate-400 uppercase tracking-widest">Current Status</label>
            <div :class="['inline-block px-4 py-1.5 rounded-full text-sm font-black uppercase text-white tracking-widest', getStatusBg(selectedEnquiry.status)]">
              {{ selectedEnquiry.status || 'Pending' }}
            </div>
          </div>
        </div>
        
        <div class="space-y-4 pt-6 border-t border-slate-50">
          <label class="block text-sm font-bold text-slate-400 uppercase tracking-widest">Message content</label>
          <div class="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 shadow-inner">
            <p class="text-sm font-medium text-slate-700 leading-[2] whitespace-pre-wrap antialiased">{{ selectedEnquiry.message }}</p>
          </div>
        </div>

        <div class="bg-[#033958] p-8 rounded-[2rem] text-white flex items-center justify-between shadow-xl">
          <div>
            <p class="text-sm font-black uppercase tracking-[0.2em] opacity-60 mb-1">Time received</p>
            <p class="text-sm font-bold">{{ formatDetailedDate(selectedEnquiry.createdAt) }}</p>
          </div>
          <div class="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/10">
            <Icon name="lucide:clock" class="w-6 h-6" />
          </div>
        </div>
        
        <div class="flex justify-end pt-10 border-t border-slate-50">
          <button
            @click="closeDetailModal"
            class="px-12 py-5 bg-[#033958] text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-black transition-all active:scale-95 shadow-xl"
          >
            Dismiss
          </button>
        </div>
      </div>
    </SlideOver>

    <!-- Delete Confirmation Modal -->
    <ConfirmModal
      v-model="showDeleteModal"
      title="Delete Enquiry"
      message="Are you sure you want to delete this enquiry? This action cannot be undone."
      confirmText="Yes, Delete Enquiry"
      @confirm="executeDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useGetEnquiries } from '@/composables/modules/enquires/useGetEnquiries'
import { useSoftDeleteEnquiry } from '@/composables/modules/enquires/useSoftDeleteEnquiry'
import SlideOver from '@/components/SlideOver.vue'
import AnimatedInput from '@/components/ui/AnimatedInput.vue'
import SelectInput from '@/components/ui/SelectInput.vue'
import Icon from '@/components/Icon.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'

// Composables
const { enquiries, loading, getEnquiries } = useGetEnquiries()
const { softDeleteEnquiry } = useSoftDeleteEnquiry()

// State
const searchQuery = ref('')
const statusFilter = ref('')
const showDetailModal = ref(false)
const selectedEnquiry = ref<any>(null)
const showDeleteModal = ref(false)
const idToDelete = ref('')

const statusOptions = [
  { label: 'All status', value: '' },
  { label: 'Pending', value: 'pending' },
  { label: 'In progress', value: 'in-progress' },
  { label: 'Resolved', value: 'resolved' }
]

// Hooks
onMounted(() => { getEnquiries() })

// Computed
const filteredEnquiries = computed(() => {
  let filtered = (enquiries.value || []) as any[]
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(enquiry => 
      enquiry.name?.toLowerCase().includes(query) ||
      enquiry.email?.toLowerCase().includes(query) ||
      enquiry.subject?.toLowerCase().includes(query)
    )
  }
  if (statusFilter.value) {
    filtered = filtered.filter(enquiry => enquiry.status === statusFilter.value)
  }
  return filtered
})

// Methods
const refreshEnquiries = () => { getEnquiries() }

const viewEnquiry = (enquiry: any) => {
  selectedEnquiry.value = enquiry
  showDetailModal.value = true
}

const closeDetailModal = () => {
  showDetailModal.value = false
  setTimeout(() => { selectedEnquiry.value = null }, 300)
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
    hour12: true 
  })
}

const getStatusColor = (status: string) => {
  if (status === 'pending') return 'bg-amber-400'
  if (status === 'in-progress') return 'bg-blue-500'
  return 'bg-emerald-500'
}

const getStatusBg = (status: string) => {
  if (status === 'pending') return 'bg-amber-500'
  if (status === 'in-progress') return 'bg-primary'
  return 'bg-emerald-600'
}
</script>