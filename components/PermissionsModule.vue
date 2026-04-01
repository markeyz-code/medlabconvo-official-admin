<template>
  <div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <!-- Action Header -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
      <div class="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
        <div class="relative w-full md:w-80">
          <Icon name="heroicons:magnifying-glass" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search permissions..."
            class="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#2d8719] focus:border-transparent font-medium text-slate-700 transition-all"
          />
        </div>
      </div>

      <div class="flex items-center gap-3 w-full md:w-auto">
        <button
          @click="openCreateModal"
          class="flex-1 md:flex-none px-6 py-3 bg-[#3BAB22] text-white rounded-xl font-bold text-sm hover:bg-[#2d851a] transition-all flex items-center justify-center space-x-2 shadow-lg shadow-green-900/10"
        >
          <Icon name="heroicons:plus-circle" class="w-4 h-4" />
          <span>New Permission</span>
        </button>
      </div>
    </div>

    <!-- Permissions Ledger -->
    <div class="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden relative">
      <div v-if="loading" class="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex items-center justify-center">
        <div class="flex flex-col items-center">
          <div class="w-12 h-12 border-4 border-slate-100 border-t-[#3BAB22] rounded-full animate-spin mb-4"></div>
          <span class="text-xs font-black text-[#3BAB22] uppercase tracking-widest">Synchronizing...</span>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/50 border-b border-slate-100">
              <th class="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Permission Identity</th>
              <th class="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Resource Target</th>
              <th class="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Action Type</th>
              <th class="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Description</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            <tr v-for="perm in filteredPermissions" :key="perm._id" class="group hover:bg-slate-50/80 transition-all">
              <td class="px-8 py-5 whitespace-nowrap">
                <div class="text-base font-bold text-slate-900 tracking-tight">{{ perm.name }}</div>
              </td>
              <td class="px-8 py-5 whitespace-nowrap">
                <div class="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-lg">
                  <span class="text-xs font-bold uppercase tracking-wider">{{ perm.resource }}</span>
                </div>
              </td>
              <td class="px-8 py-5 whitespace-nowrap">
                <span :class="['px-3 py-1 text-[10px] font-black rounded-lg uppercase tracking-wider ring-1 ring-inset', getActionBadgeStyle(perm.action)]">
                  {{ perm.action }}
                </span>
              </td>
              <td class="px-8 py-5">
                <div class="text-sm font-medium text-slate-500 max-w-sm truncate">{{ perm.description || 'No specific description' }}</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Empty State -->
      <div v-if="!loading && filteredPermissions.length === 0" class="py-32 text-center">
        <div class="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Icon name="heroicons:key" class="w-12 h-12 text-slate-200" />
        </div>
        <h3 class="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight">No Permissions Found</h3>
        <p class="text-slate-400 font-medium max-w-xs mx-auto">The system returned zero granular permissions matching your criteria.</p>
      </div>
    </div>

    <!-- Create Modal -->
    <Modal v-model="showModal" title="Establish Granular Permission" size="lg">
      <div class="p-6 space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Resource Target</label>
            <div class="relative">
              <Icon name="heroicons:cube" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                v-model="form.resource"
                @input="buildPermName"
                type="text"
                placeholder="e.g. blog, user, reporting"
                class="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#3BAB22] font-bold text-slate-700 lowercase"
              />
            </div>
          </div>
          <div>
            <label class="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Action Vector</label>
            <div class="relative">
              <Icon name="heroicons:bolt" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                v-model="form.action"
                @input="buildPermName"
                type="text"
                placeholder="e.g. create, read, delete"
                class="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#3BAB22] font-bold text-slate-700 lowercase"
              />
            </div>
          </div>
        </div>

        <div>
          <label class="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Computed Identifier (Name)</label>
          <div class="relative">
            <Icon name="heroicons:tag" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              v-model="form.name"
              type="text"
              placeholder="e.g. blog:create"
              class="w-full pl-12 pr-4 py-4 bg-slate-100 border border-slate-200 rounded-2xl text-slate-600 font-mono text-sm shadow-inner"
              readonly
            />
          </div>
          <p class="text-xs text-slate-400 mt-2 font-medium ml-1 flex items-center">
            <Icon name="heroicons:information-circle" class="mr-1 w-4 h-4" />
            Auto-generated from Resource and Action structure.
          </p>
        </div>

        <div>
          <label class="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Description / Purpose</label>
          <textarea
            v-model="form.description"
            rows="3"
            placeholder="What does this permission unlock?"
            class="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#3BAB22] font-medium text-slate-700 resize-none"
          ></textarea>
        </div>

        <div class="flex justify-end pt-6 gap-4">
          <button
            @click="closeModal"
            class="px-8 py-4 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors uppercase tracking-widest"
          >
            Cancel
          </button>
          <button
            @click="handleSave"
            :disabled="createLoading || !form.name"
            class="px-10 py-4 bg-[#3BAB22] text-white rounded-2xl font-black text-sm hover:bg-[#2d851a] disabled:bg-slate-100 disabled:text-slate-400 transition-all shadow-xl shadow-green-900/10 flex items-center space-x-3 uppercase tracking-widest"
          >
            <div v-if="createLoading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <span>{{ createLoading ? 'Injecting...' : 'Seal Permission' }}</span>
          </button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useGetPermissions } from '@/composables/modules/roles/useGetPermissions'
import { useCreatePermission } from '@/composables/modules/roles/useCreatePermission'

// State
const searchQuery = ref('')
const showModal = ref(false)

const form = ref({
  name: '',
  resource: '',
  action: '',
  description: ''
})

// Composables
const { permissions, loading, getPermissions } = useGetPermissions()
const { createPermission, loading: createLoading } = useCreatePermission()

// Computed
const filteredPermissions = computed(() => {
  let res = permissions.value || []
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    res = res.filter(p => p.name.toLowerCase().includes(q) || p.resource.toLowerCase().includes(q) || p.action.toLowerCase().includes(q))
  }
  return res
})

// Hooks
onMounted(() => { getPermissions() })

// Methods
const openCreateModal = () => {
  form.value = {
    name: '',
    resource: '',
    action: '',
    description: ''
  }
  showModal.value = true
}

const buildPermName = () => {
    form.value.name = `${form.value.resource ? form.value.resource.toLowerCase() : ''}${form.value.resource && form.value.action ? ':' : ''}${form.value.action ? form.value.action.toLowerCase() : ''}`
}

const closeModal = () => { showModal.value = false }

const handleSave = async () => {
  try {
    await createPermission(form.value)
    await getPermissions()
    closeModal()
  } catch (err) {
    console.error('Save failed:', err)
  }
}

const getActionBadgeStyle = (action: string) => {
  const act = action?.toLowerCase() || ''
  if (act.includes('create') || act.includes('add')) return 'bg-emerald-50 text-emerald-700 ring-emerald-700/10'
  if (act.includes('read') || act.includes('view') || act.includes('get')) return 'bg-indigo-50 text-indigo-700 ring-indigo-700/10'
  if (act.includes('update') || act.includes('edit')) return 'bg-amber-50 text-amber-700 ring-amber-700/10'
  if (act.includes('delete') || act.includes('remove')) return 'bg-rose-50 text-rose-700 ring-rose-700/10'
  if (act.includes('approve') || act.includes('publish')) return 'bg-purple-50 text-purple-700 ring-purple-700/10'
  return 'bg-slate-50 text-slate-600 ring-slate-600/10'
}
</script>
