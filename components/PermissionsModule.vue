<template>
  <div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <!-- Action Header -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 rounded-3xl border border-slate-100">
      <div class="flex flex-col md:flex-row items-center gap-6 w-full md:w-auto">
        <div class="w-full md:w-80">
          <AnimatedInput
            v-model="searchQuery"
            id="search-permissions"
            label="Search permissions"
            type="text"
          />
        </div>
      </div>

      <div class="flex items-center gap-4 w-full md:w-auto">
        <button
          @click="openCreateModal"
          class="flex-1 md:flex-none px-8 py-4 bg-[#033958] text-white rounded-2xl font-bold text-sm hover:bg-[#022f42] transition-all flex items-center justify-center space-x-3 group active:scale-95"
        >
          <Icon name="lucide:plus-circle" class="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
          <span>Create Permission</span>
        </button>
      </div>
    </div>

    <!-- Permissions Registry -->
    <div class="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden relative">
      <!-- Loading Overlay -->
      <div v-if="loading" class="absolute inset-0 bg-white/80 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center">
        <div class="w-12 h-12 border-4 border-slate-100 border-t-[#033958] rounded-full animate-spin mb-4"></div>
        <span class="text-sm font-bold text-[#033958]">Loading permissions...</span>
      </div>

      <div class="overflow-x-auto text-sm">
        <table class="w-full text-left border-separate border-spacing-0">
          <thead>
            <tr class="bg-slate-50/50 text-sm font-bold text-slate-400">
              <th class="px-10 py-6 border-b border-slate-100">Permission name</th>
              <th class="px-10 py-6 border-b border-slate-100">Resource</th>
              <th class="px-10 py-6 border-b border-slate-100">Action</th>
              <th class="px-10 py-6 border-b border-slate-100">Description</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            <tr v-for="perm in filteredPermissions" :key="perm._id" class="group hover:bg-slate-50/50 transition-all duration-300">
              <td class="px-10 py-8">
                <span class="font-bold text-slate-900 font-mono text-sm">{{ perm.name }}</span>
              </td>
              <td class="px-10 py-8">
                <div class="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-lg border border-blue-100">
                  <span class="text-[10px] font-bold">{{ perm.resource }}</span>
                </div>
              </td>
              <td class="px-10 py-8">
                <span :class="['px-3 py-1 text-[10px] font-bold rounded-lg ring-1 ring-inset', getActionBadgeStyle(perm.action)]">
                  {{ perm.action }}
                </span>
              </td>
              <td class="px-10 py-8">
                <div class="font-medium text-slate-500 max-w-sm leading-relaxed">{{ perm.description || `Grants ${perm.action} capability on the ${perm.resource} resource.` }}</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Empty State -->
      <div v-if="!loading && filteredPermissions.length === 0" class="py-32 text-center bg-slate-50/30">
        <div class="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-slate-100">
          <Icon name="lucide:key" class="w-10 h-10 text-slate-100" />
        </div>
        <h3 class="text-xl font-bold text-slate-900 mb-2 tracking-tight">No permissions found</h3>
        <p class="text-slate-400 text-sm font-medium max-w-[240px] mx-auto leading-relaxed">The system is currently using default access controls.</p>
        <button
          @click="openCreateModal"
          class="mt-8 px-8 py-4 bg-white border border-slate-200 text-slate-900 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-all active:scale-95"
        >
          Create first permission
        </button>
      </div>
    </div>

    <!-- Injection Sheet -->
    <SlideOver v-model="showModal" title="Create permission">
      <div class="p-8 space-y-10">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <AnimatedInput
            v-model="form.resource"
            @update:modelValue="buildPermName"
            id="resource"
            label="Resource name"
            type="text"
          />
          <AnimatedInput
            v-model="form.action"
            @update:modelValue="buildPermName"
            id="action"
            label="Action name"
            type="text"
          />
        </div>

        <div class="space-y-4 pt-4 border-t border-slate-50">
          <label class="block text-sm font-bold text-slate-400 ml-1">Generated permission string</label>
          <div class="relative group">
            <div class="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#3BAB22] transition-colors">
              <Icon name="lucide:tag" class="w-5 h-5" />
            </div>
            <input
              v-model="form.name"
              type="text"
              class="w-full pl-16 pr-8 py-5 bg-slate-50 border border-slate-100 rounded-2xl text-slate-700 font-mono text-sm outline-none transition-all focus:bg-white focus:border-[#3BAB22] focus:ring-1 focus:ring-[#3BAB22]"
              readonly
            />
          </div>
          <div class="flex items-center gap-2 text-[10px] font-bold text-slate-400 ml-1">
            <Icon name="lucide:info" class="w-4 h-4" />
            This identifier is automatically created from your resource and action.
          </div>
        </div>

        <div class="space-y-4 pt-4 border-t border-slate-50">
          <label class="block text-sm font-bold text-slate-400 ml-1">Description</label>
          <textarea
            v-model="form.description"
            rows="4"
            class="w-full p-6 bg-slate-50 border border-slate-100 rounded-3xl focus:ring-2 focus:ring-[#3BAB22] focus:bg-white font-medium text-slate-700 resize-none transition-all outline-none"
            placeholder="Explain what this permission allows..."
          ></textarea>
        </div>

        <div class="flex justify-end pt-10 gap-6 border-t border-slate-50">
          <button
            @click="closeModal"
            class="text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="handleSave"
            :disabled="createLoading || !form.name"
            class="px-12 py-5 bg-[#033958] text-white rounded-2xl font-bold text-sm hover:bg-[#022f42] disabled:bg-slate-100 disabled:text-slate-400 transition-all flex items-center space-x-3 active:scale-95"
          >
            <div v-if="createLoading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <span>{{ createLoading ? 'Saving...' : 'Save Permission' }}</span>
          </button>
        </div>
      </div>
    </SlideOver>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useGetPermissions } from '@/composables/modules/roles/useGetPermissions'
import { useCreatePermission } from '@/composables/modules/roles/useCreatePermission'
import SlideOver from '@/components/SlideOver.vue'
import AnimatedInput from '@/components/ui/AnimatedInput.vue'
import Icon from '@/components/Icon.vue'

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
    res = res.filter(p => p.name?.toLowerCase().includes(q) || p.resource?.toLowerCase().includes(q) || p.action?.toLowerCase().includes(q))
  }
  return res
})

// Hooks
onMounted(async () => {
  try {
    await getPermissions()
  } catch (err) {
    console.error('Permission fetch failed:', err)
  }
})

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
  if (act.includes('create') || act.includes('add')) return 'bg-emerald-50 text-emerald-700 ring-emerald-500/30'
  if (act.includes('read') || act.includes('view') || act.includes('get')) return 'bg-indigo-50 text-indigo-700 ring-indigo-500/30'
  if (act.includes('update') || act.includes('edit')) return 'bg-amber-50 text-amber-700 ring-amber-500/30'
  if (act.includes('delete') || act.includes('remove')) return 'bg-rose-50 text-rose-700 ring-rose-500/30'
  if (act.includes('approve') || act.includes('publish')) return 'bg-purple-50 text-purple-700 ring-purple-500/30'
  return 'bg-slate-50 text-slate-600 ring-slate-400/30'
}
</script>
