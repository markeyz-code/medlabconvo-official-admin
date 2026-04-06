<template>
  <div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <!-- Action Header -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 rounded-3xl border border-slate-100">
      <div class="flex flex-col md:flex-row items-center gap-6 w-full md:w-auto">
        <div class="w-full md:w-80">
          <AnimatedInput
            v-model="searchQuery"
            id="search-roles"
            label="Search roles"
            type="text"
          />
        </div>
      </div>

      <div class="flex items-center gap-4 w-full md:w-auto">
        <button
          @click="openCreateModal"
          class="flex-1 md:flex-none px-8 py-4 bg-[#033958] text-white rounded-2xl font-bold text-sm hover:bg-[#044a73] transition-all flex items-center justify-center space-x-3 group active:scale-95"
        >
          <Icon name="lucide:plus" class="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
          <span>Create role</span>
        </button>
      </div>
    </div>

    <!-- Roles Inventory -->
    <div class="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden relative">
      <!-- Loading Overlay -->
      <div v-if="loading" class="absolute inset-0 bg-white/80 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center">
        <div class="w-12 h-12 border-4 border-slate-100 border-t-[#033958] rounded-full animate-spin mb-4"></div>
        <span class="text-sm font-bold text-[#033958]">Loading roles...</span>
      </div>

      <div class="overflow-x-auto text-sm">
        <table class="w-full text-left border-separate border-spacing-0">
          <thead>
            <tr class="bg-slate-50/50 text-sm font-bold text-slate-400">
              <th class="px-10 py-6 border-b border-slate-100">Role name</th>
              <th class="px-10 py-6 border-b border-slate-100">Permissions</th>
              <th class="px-10 py-6 border-b border-slate-100">Status</th>
              <th class="px-10 py-6 text-right border-b border-slate-100">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            <tr v-for="role in filteredRoles" :key="role._id" class="group hover:bg-slate-50/50 transition-all duration-300">
              <td class="px-10 py-8">
                <div class="flex flex-col">
                  <span class="text-sm font-bold text-slate-900 tracking-tight mb-1">{{ role.name.replace('_', ' ') }}</span>
                  <span class="text-sm font-medium text-slate-400 max-w-xs truncate">{{ role.description || 'System role definition.' }}</span>
                </div>
              </td>
              <td class="px-10 py-8">
                <div class="flex items-center gap-3">
                  <div class="px-3 py-1 bg-slate-100 rounded-lg border border-slate-200">
                    <span class="text-sm font-bold text-slate-700">{{ role.permissions?.length || 0 }}</span>
                  </div>
                  <span class="text-[10px] font-bold text-slate-400">Active permissions</span>
                </div>
              </td>
              <td class="px-10 py-8">
                <div class="flex items-center space-x-3">
                  <div :class="['w-2 h-2 rounded-full', role.isActive ? 'bg-emerald-500' : 'bg-slate-300']"></div>
                  <span :class="['text-sm font-bold capitalize', role.isActive ? 'text-emerald-700' : 'text-slate-400']">
                    {{ role.isActive ? 'active' : 'disabled' }}
                  </span>
                </div>
              </td>
              <td class="px-10 py-8 text-right">
                <div class="flex items-center justify-end space-x-1 text-slate-400">
                  <button
                    @click="editRole(role)"
                    class="p-2 hover:text-[#033958] hover:bg-[#033958]/5 rounded-xl transition-all"
                    title="Edit role"
                  >
                    <Icon name="lucide:square-pen" class="w-5 h-5" />
                  </button>
                  <button
                    @click="confirmDelete(role._id)"
                    class="p-2 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                    title="Delete role"
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
      <div v-if="!loading && filteredRoles.length === 0" class="py-32 text-center bg-slate-50/30">
        <div class="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-slate-100">
          <Icon name="lucide:shield-check" class="w-10 h-10 text-slate-100" />
        </div>
        <h3 class="text-xl font-bold text-slate-900 mb-2 tracking-tight">No roles found</h3>
        <p class="text-slate-400 text-sm font-medium max-w-[240px] mx-auto leading-relaxed">No administrative roles found in the database.</p>
        <button
          @click="openCreateModal"
          class="mt-8 px-8 py-4 bg-white border border-slate-200 text-slate-900 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-all active:scale-95"
        >
          Create first role
        </button>
      </div>
    </div>

    <!-- Configuration Sheet -->
    <SlideOver v-model="showModal" :title="isEditing ? 'Edit role' : 'Create role'">
      <div class="p-8 space-y-10">
        <div class="space-y-8">
           <AnimatedInput
            v-model="form.name"
            label="Role name"
            id="roleName"
            type="text"
            required
          />

          <div class="space-y-4">
            <label class="block text-sm font-bold text-slate-400 ml-1">Description</label>
            <textarea
              v-model="form.description"
              rows="4"
              class="w-full p-6 bg-slate-50 border border-slate-100 rounded-3xl focus:ring-2 focus:ring-[#033958] focus:bg-white font-medium text-slate-700 resize-none transition-all outline-none"
              placeholder="Describe what this role is for..."
            ></textarea>
          </div>
        </div>

        <div class="space-y-6">
          <div class="flex items-center justify-between px-1">
            <label class="text-sm font-bold text-slate-400">Permissions matrix</label>
            <span class="text-sm font-bold text-blue-600">{{ form.permissions.length }} selected</span>
          </div>
          
          <div class="bg-slate-50/50 border border-slate-100 rounded-[2rem] p-6 max-h-[400px] overflow-y-auto custom-scrollbar">
            <div v-if="permsLoading" class="text-center py-12 flex flex-col items-center">
              <div class="w-8 h-8 border-2 border-slate-200 border-t-[#033958] rounded-full animate-spin mb-4"></div>
              <span class="text-sm font-bold text-slate-400">Loading permissions...</span>
            </div>
            <div v-else-if="permissions.length === 0" class="text-center py-12">
              <p class="text-sm font-bold text-slate-400">No permissions found</p>
            </div>
            <div v-else class="grid grid-cols-1 gap-3">
              <label 
                v-for="perm in permissions" 
                :key="perm._id" 
                :class="[
                  'flex items-start space-x-4 p-5 rounded-2xl transition-all cursor-pointer border',
                  form.permissions.includes(perm.name) 
                    ? 'bg-white border-[#033958] ring-1 ring-[#033958]' 
                    : 'bg-white border-slate-50 hover:border-slate-200'
                ]"
              >
                <div class="relative flex items-center mt-1">
                  <input
                    type="checkbox"
                    :value="perm.name"
                    v-model="form.permissions"
                    class="peer h-5 w-5 cursor-pointer appearance-none rounded-lg border border-slate-200 bg-slate-50 transition-all checked:bg-[#033958] checked:border-[#033958] outline-none"
                  />
                  <div class="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100">
                    <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M5 13l4 4L19 7"/></svg>
                  </div>
                </div>
                <div class="flex-1">
                  <div class="text-sm font-bold text-slate-900 font-mono mb-1">{{ perm.name }}</div>
                  <div class="text-sm font-medium text-slate-500 leading-relaxed">{{ perm.description || `${perm.action} authorization for ${perm.resource}.` }}</div>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100 font-bold text-[10px]">
          <div class="flex flex-col">
            <span class="text-slate-900">Active status</span>
            <span class="text-slate-400 mt-1">Operational immediately</span>
          </div>
          <label class="relative inline-flex cursor-pointer items-center">
            <input type="checkbox" v-model="form.isActive" class="peer sr-only" />
            <div class="peer h-7 w-12 rounded-full bg-slate-200 after:absolute after:left-[4px] after:top-[4px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-emerald-500 peer-checked:after:translate-x-full peer-focus:outline-none"></div>
          </label>
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
            :disabled="actionLoading || !form.name"
            class="px-12 py-5 bg-[#033958] text-white rounded-2xl font-bold text-sm hover:bg-[#044a73] disabled:bg-slate-100 disabled:text-slate-400 transition-all flex items-center space-x-3 active:scale-95"
          >
            <div v-if="actionLoading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <span>{{ actionLoading ? 'Processing...' : (isEditing ? 'Save changes' : 'Create role') }}</span>
          </button>
        </div>
      </div>
    </SlideOver>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useGetRoles } from '@/composables/modules/roles/useGetRoles'
import { useCreateRole } from '@/composables/modules/roles/useCreateRole'
import { useUpdateRole } from '@/composables/modules/roles/useUpdateRole'
import { useDeleteRole } from '@/composables/modules/roles/useDeleteRole'
import { useGetPermissions } from '@/composables/modules/roles/useGetPermissions'
import SlideOver from '@/components/SlideOver.vue'
import AnimatedInput from '@/components/ui/AnimatedInput.vue'
import Icon from '@/components/Icon.vue'

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
    res = res.filter(r => r.name?.toLowerCase().includes(q) || (r.description && r.description.toLowerCase().includes(q)))
  }
  return res
})

const isEditing = computed(() => !!selectedRole.value)
const actionLoading = computed(() => createLoading.value || updateLoading.value)

// Hooks
onMounted(async () => {
  try {
    await Promise.all([
      getRoles(),
      getPermissions()
    ])
  } catch (err) {
    console.error('Initial fetch failed:', err)
  }
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
  if (confirm('Are you sure you want to delete this role?')) {
    try {
      await deleteRole(id)
      await getRoles()
    } catch (err) {
      console.error('Delete failed:', err)
    }
  }
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #E2E8F0;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #CBD5E1;
}
</style>
