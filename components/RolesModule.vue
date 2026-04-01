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
            placeholder="Search roles..."
            class="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#033958] focus:border-transparent font-medium text-slate-700 transition-all"
          />
        </div>
      </div>

      <div class="flex items-center gap-3 w-full md:w-auto">
        <button
          @click="openCreateModal"
          class="flex-1 md:flex-none px-6 py-3 bg-[#033958] text-white rounded-xl font-bold text-sm hover:bg-[#044a73] transition-all flex items-center justify-center space-x-2 shadow-lg shadow-blue-900/10"
        >
          <Icon name="heroicons:plus" class="w-4 h-4" />
          <span>Create Role</span>
        </button>
      </div>
    </div>

    <!-- Roles Ledger -->
    <div class="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden relative">
      <div v-if="loading" class="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex items-center justify-center">
        <div class="flex flex-col items-center">
          <div class="w-12 h-12 border-4 border-slate-100 border-t-[#033958] rounded-full animate-spin mb-4"></div>
          <span class="text-xs font-black text-[#033958] uppercase tracking-widest">Synchronizing...</span>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/50 border-b border-slate-100">
              <th class="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Role Name</th>
              <th class="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Description</th>
              <th class="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Permissions Count</th>
              <th class="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
              <th class="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">System Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            <tr v-for="role in filteredRoles" :key="role._id" class="group hover:bg-slate-50/80 transition-all">
              <td class="px-8 py-5 whitespace-nowrap">
                <div class="text-base font-bold text-slate-900 tracking-tight capitalize">{{ role.name.replace('_', ' ') }}</div>
              </td>
              <td class="px-8 py-5 whitespace-nowrap">
                <div class="text-sm font-medium text-slate-500 max-w-[200px] truncate">{{ role.description || 'No description provided' }}</div>
              </td>
              <td class="px-8 py-5 whitespace-nowrap">
                <div class="inline-flex items-center space-x-2 bg-slate-100 px-3 py-1 rounded-lg">
                  <span class="text-sm font-bold text-slate-700">{{ role.permissions?.length || 0 }}</span>
                  <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Perms</span>
                </div>
              </td>
              <td class="px-8 py-5 whitespace-nowrap">
                <div class="flex items-center space-x-2">
                  <div :class="['w-2 h-2 rounded-full', role.isActive ? 'bg-[#3BAB22] shadow-[0_0_8px_rgba(59,171,34,0.4)]' : 'bg-slate-300']"></div>
                  <span :class="['text-xs font-bold uppercase tracking-tight', role.isActive ? 'text-slate-700' : 'text-slate-400']">
                    {{ role.isActive ? 'Active' : 'Inactive' }}
                  </span>
                </div>
              </td>
              <td class="px-8 py-5 whitespace-nowrap text-right">
                <div class="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    @click="editRole(role)"
                    class="w-10 h-10 flex items-center justify-center text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-xl transition-all"
                    title="Modify Role"
                  >
                    <Icon name="heroicons:pencil-square" class="w-5 h-5" />
                  </button>
                  <button
                    @click="confirmDelete(role._id)"
                    class="w-10 h-10 flex items-center justify-center text-rose-600 bg-rose-50 hover:bg-rose-600 hover:text-white rounded-xl transition-all"
                    title="Delete Role"
                  >
                    <Icon name="heroicons:trash" class="w-5 h-5" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Empty State -->
      <div v-if="!loading && filteredRoles.length === 0" class="py-32 text-center">
        <div class="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Icon name="heroicons:shield-check" class="w-12 h-12 text-slate-200" />
        </div>
        <h3 class="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight">No Roles Found</h3>
        <p class="text-slate-400 font-medium max-w-xs mx-auto">The system returned zero roles matching your criteria.</p>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <Modal v-model="showModal" :title="isEditing ? 'Modify Identity Role' : 'Instantiate New Role'" size="lg">
      <div class="p-6 space-y-6">
        <div>
          <label class="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Role Nomenclature</label>
          <div class="relative">
            <Icon name="heroicons:identification" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              v-model="form.name"
              type="text"
              placeholder="e.g. content_manager"
              class="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#033958] font-bold text-slate-700"
            />
          </div>
        </div>

        <div>
          <label class="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Description</label>
          <textarea
            v-model="form.description"
            rows="3"
            placeholder="Briefly describe the purpose of this role..."
            class="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#033958] font-medium text-slate-700 resize-none"
          ></textarea>
        </div>

        <div>
          <label class="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">System Permissions</label>
          <div class="bg-slate-50 border border-slate-200 rounded-2xl p-4 max-h-64 overflow-y-auto w-full">
            <div v-if="permsLoading" class="text-center py-4">
              <div class="w-6 h-6 border-2 border-slate-200 border-t-[#033958] rounded-full animate-spin mx-auto"></div>
            </div>
            <div v-else-if="permissions.length === 0" class="text-center py-4 text-sm font-medium text-slate-500">
              No permissions available. Create permissions first.
            </div>
            <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label v-for="perm in permissions" :key="perm._id" class="flex items-start space-x-3 p-3 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer border border-transparent hover:border-slate-200">
                <input
                  type="checkbox"
                  :value="perm.name"
                  v-model="form.permissions"
                  class="mt-1 w-4 h-4 text-[#033958] border-slate-300 rounded focus:ring-[#033958]"
                />
                <div>
                  <div class="text-sm font-bold text-slate-800">{{ perm.name }}</div>
                  <div class="text-xs font-medium text-slate-500 mt-0.5">{{ perm.description || `${perm.action} on ${perm.resource}` }}</div>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div class="flex items-center space-x-3 pt-2">
          <input
            id="isActiveToggle"
            type="checkbox"
            v-model="form.isActive"
            class="w-5 h-5 text-[#3BAB22] border-slate-300 rounded focus:ring-[#3BAB22]"
          />
          <label for="isActiveToggle" class="text-sm font-bold text-slate-700 cursor-pointer">
            Set role as Active upon instantiation
          </label>
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
            :disabled="actionLoading || !form.name"
            class="px-10 py-4 bg-[#033958] text-white rounded-2xl font-black text-sm hover:bg-[#044a73] disabled:bg-slate-100 disabled:text-slate-400 transition-all shadow-xl shadow-blue-900/10 flex items-center space-x-3 uppercase tracking-widest"
          >
            <div v-if="actionLoading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <span>{{ actionLoading ? 'Processing...' : 'Save Role' }}</span>
          </button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useGetRoles } from '@/composables/modules/roles/useGetRoles'
import { useCreateRole } from '@/composables/modules/roles/useCreateRole'
import { useUpdateRole } from '@/composables/modules/roles/useUpdateRole'
import { useDeleteRole } from '@/composables/modules/roles/useDeleteRole'
import { useGetPermissions } from '@/composables/modules/roles/useGetPermissions'

// State
const searchQuery = ref('')
const showModal = ref(false)
const selectedRole = ref<any>(null)

const form = ref({
  name: '',
  description: '',
  permissions: [] as string[],
  isActive: true
})

// Composables
const { roles, loading, getRoles } = useGetRoles()
const { createRole, loading: createLoading } = useCreateRole()
const { updateRole, loading: updateLoading } = useUpdateRole()
const { deleteRole } = useDeleteRole()
const { permissions, loading: permsLoading, getPermissions } = useGetPermissions()

// Computed
const filteredRoles = computed(() => {
  let res = roles.value || []
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    res = res.filter(r => r.name.toLowerCase().includes(q) || (r.description && r.description.toLowerCase().includes(q)))
  }
  return res
})

const isEditing = computed(() => !!selectedRole.value)
const actionLoading = computed(() => createLoading.value || updateLoading.value)

// Hooks
onMounted(() => {
  getRoles()
  getPermissions()
})

// Methods
const openCreateModal = () => {
  selectedRole.value = null
  form.value = {
    name: '',
    description: '',
    permissions: [],
    isActive: true
  }
  showModal.value = true
}

const editRole = (role: any) => {
  selectedRole.value = role
  form.value = {
    name: role.name,
    description: role.description || '',
    permissions: role.permissions || [],
    isActive: role.isActive !== false
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  setTimeout(() => {
    selectedRole.value = null
  }, 300)
}

const handleSave = async () => {
  try {
    if (isEditing.value) {
      await updateRole(selectedRole.value._id, form.value)
    } else {
      await createRole(form.value)
    }
    await getRoles()
    closeModal()
  } catch (err) {
    console.error('Save failed:', err)
  }
}

const confirmDelete = async (id: string) => {
  if (confirm('Irreversible Action: Are you absolutely sure you want to delete this Role?')) {
    try {
      await deleteRole(id)
      await getRoles()
    } catch (err) {
      console.error('Delete failed:', err)
    }
  }
}
</script>
