<template>
  <div class="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <!-- Action Header -->
    <div class="flex flex-col gap-3 rounded-xl border border-slate-100 bg-white p-4 md:flex-row md:items-end md:justify-between">
      <div class="w-full md:w-80">
        <div class="w-full md:w-80">
          <AnimatedInput
            v-model="searchQuery"
            id="search-permissions"
            label="Search permissions"
            type="text"
          />
        </div>
      </div>

      <div class="flex items-center gap-2 w-full md:w-auto">
        <button
          v-if="canCreate"
          @click="openCreateModal"
          class="btn btn-primary w-full md:w-auto"
        >
          <Icon name="lucide:plus-circle" class="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
          <span>Create Permission</span>
        </button>
      </div>
    </div>

    <!-- Permissions Registry -->
    <div class="overflow-hidden rounded-xl border border-slate-100 bg-white">
      <AdminTableLoading v-if="loading" :columns="4" :rows="7" label="Loading permissions" />

      <div v-else-if="filteredPermissions.length" class="overflow-x-auto">
        <table class="admin-table stack-table w-full text-left border-separate border-spacing-0">
          <thead>
            <tr class="bg-slate-50/60 text-[10px] font-bold uppercase tracking-[0.06em] text-slate-400">
              <th class="px-5 py-3 border-b border-slate-100 text-left">Permission name</th>
              <th class="px-5 py-3 border-b border-slate-100 text-left">Resource</th>
              <th class="px-5 py-3 border-b border-slate-100 text-left">Action</th>
              <th class="px-5 py-3 border-b border-slate-100 text-left">Description</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            <tr v-for="perm in filteredPermissions" :key="perm._id" class="group hover:bg-slate-50/50 transition-all duration-300">
              <td class="px-5 py-3.5 text-xs text-slate-600">
                <span class="font-semibold text-slate-900 font-mono text-[11.5px]">{{ perm.name }}</span>
              </td>
              <td class="px-5 py-3.5 text-xs text-slate-600">
                <div class="inline-flex items-center rounded-md border border-blue-100 bg-blue-50 px-2 py-0.5 text-blue-700">
                  <span class="text-[10.5px] font-bold">{{ perm.resource }}</span>
                </div>
              </td>
              <td class="px-5 py-3.5 text-xs text-slate-600">
                <span :class="['rounded-md px-2 py-0.5 text-[10px] font-bold ring-1 ring-inset', getActionBadgeStyle(perm.action)]">
                  {{ perm.action }}
                </span>
              </td>
              <td class="px-5 py-3.5 text-xs text-slate-600">
                <div class="max-w-sm text-[11px] leading-5 text-slate-500">{{ perm.description || `Grants ${perm.action} capability on the ${perm.resource} resource.` }}</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <AdminEmptyState
        v-else
        icon="lucide:key-round"
        title="No permissions found"
        description="The system is currently using default access controls."
      >
        <button v-if="canCreate" class="btn btn-primary" @click="openCreateModal">
          <Icon name="lucide:plus" class="w-4 h-4" />
          Create first permission
        </button>
      </AdminEmptyState>
    </div>

    <Modal v-model="showModal" size="md" title="Create permission" eyebrow="Access control" description="Define a granular capability for a resource.">
      <div class="space-y-4">
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <AnimatedInput v-model="form.resource" id="resource" label="Resource name" type="text" @update:model-value="buildPermName" />
          <AnimatedInput v-model="form.action" id="action" label="Action name" type="text" @update:model-value="buildPermName" />
        </div>

        <div>
          <label class="field-label">Generated identifier</label>
          <div class="relative">
            <Icon name="lucide:tag" class="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input v-model="form.name" type="text" class="input bg-slate-50 pl-9 font-mono" readonly />
          </div>
          <p class="mt-1.5 flex items-center gap-1.5 text-[10px] text-slate-400"><Icon name="lucide:info" class="h-3 w-3" /> Automatically generated from the resource and action.</p>
        </div>

        <div>
          <label class="field-label">Description</label>
          <textarea v-model="form.description" rows="3" class="textarea" placeholder="What does this permission allow?" />
        </div>
      </div>

      <template #footer>
        <button type="button" class="btn btn-outline" @click="closeModal">Cancel</button>
        <button type="button" class="btn btn-primary" :disabled="createLoading || !form.name" @click="handleSave">
          <span v-if="createLoading" class="h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          {{ createLoading ? 'Saving…' : 'Save permission' }}
        </button>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useGetPermissions } from '@/composables/modules/roles/useGetPermissions'
import { useCreatePermission } from '@/composables/modules/roles/useCreatePermission'
import Modal from '@/components/Modal.vue'
import AnimatedInput from '@/components/ui/AnimatedInput.vue'
import Icon from '@/components/Icon.vue'
import { useUser } from '@/composables/modules/auth/user'
import AdminEmptyState from '@/components/AdminEmptyState.vue'
import AdminTableLoading from '@/components/AdminTableLoading.vue'

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
const { hasPermission } = useUser()
const canCreate = computed(() => hasPermission('permissions:create'))

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
