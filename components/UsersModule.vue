<template>
  <div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <!-- Action Header -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 rounded-[1.25rem] border border-slate-100">
      <div class="flex flex-col md:flex-row items-center gap-6 w-full md:w-auto">
        <div class="w-full md:w-80">
          <AnimatedInput
            v-model="searchQuery"
            id="search-users"
            label="Search users"
            type="text"
          />
        </div>
        <div class="w-full md:w-64">
          <SelectInput
            v-model="roleFilter"
            :options="availableRoleOptions"
          />
        </div>
      </div>

      <div class="flex items-center gap-4 w-full md:w-auto">
        <button
          v-if="hasPermission('users:create')"
          @click="showInviteModal = true"
          class="flex-1 md:flex-none px-8 py-4 bg-white border border-slate-200 text-slate-900 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-all flex items-center justify-center space-x-3 group active:scale-95"
        >
          <Icon name="lucide:send" class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          <span>Invite User</span>
        </button>
        <button
          v-if="hasPermission('users:create')"
          @click="openCreateModal"
          class="flex-1 md:flex-none px-8 py-4 bg-[#27628C] text-white rounded-2xl font-bold text-sm hover:bg-[#1F5378] transition-all flex items-center justify-center space-x-3 group active:scale-95"
        >
          <Icon name="lucide:plus" class="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
          <span>Add User</span>
        </button>
      </div>
    </div>

    <!-- Users Registry -->
    <div class="bg-white rounded-[1.5rem] border border-slate-100 overflow-hidden relative">
      <AdminTableLoading v-if="loading" :columns="5" :rows="6" label="Loading users" />

      <div v-else-if="filteredUsers.length" class="overflow-x-auto text-sm">
        <table class="admin-table stack-table w-full text-left border-separate border-spacing-0">
          <thead>
            <tr class="bg-slate-50/50 text-sm font-bold text-slate-400">
              <th class="px-10 py-6 border-b border-slate-100">User details</th>
              <th class="px-10 py-6 border-b border-slate-100">Role</th>
              <th class="px-10 py-6 border-b border-slate-100">Status</th>
              <th class="px-10 py-6 border-b border-slate-100">Joined date</th>
              <th class="px-10 py-6 text-right border-b border-slate-100">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            <tr v-for="user in (filteredUsers as any[])" :key="user._id" class="group hover:bg-slate-50/50 transition-all duration-300">
              <td class="px-10 py-8 whitespace-nowrap">
                <div class="flex items-center">
                  <div :class="['w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl ring-4 ring-slate-50', getUserRoleColor(user.role)]">
                    {{ user.firstName?.[0] || 'U' }}
                  </div>
                  <div class="ml-6">
                    <div class="text-base font-bold text-slate-900 tracking-tight">{{ user.firstName }} {{ user.lastName }}</div>
                    <div class="text-sm font-bold text-slate-400 mt-1 lowercase">{{ user.email }}</div>
                  </div>
                </div>
              </td>
              <td class="px-10 py-8 whitespace-nowrap ">
                <span :class="['px-3 py-1.5 text-sm font-bold rounded-lg ring-1 ring-inset', getRoleBadgeStyle(user.role)]">
                  {{ roleLabel(user.role) || 'Standard' }}
                </span>
              </td>
              <td class="px-10 py-8 whitespace-nowrap ">
                <div class="flex items-center space-x-3">
                  <div :class="['w-2 h-2 rounded-full', user.isActive ? 'bg-emerald-500' : 'bg-slate-300']"></div>
                  <span :class="['text-sm font-bold', user.isActive ? 'text-slate-700' : 'text-slate-400']">
                    {{ user.isActive ? 'Active' : 'Inactive' }}
                  </span>
                </div>
              </td>
              <td class="px-10 py-8 whitespace-nowrap text-sm text-slate-500 font-bold font-sans">
                {{ formatDate(user.createdAt) }}
              </td>
              <td class="px-10 py-8 whitespace-nowrap text-right">
                <div class="flex items-center justify-end space-x-1 text-slate-400">
                  <button
                    v-if="hasPermission('users:update')"
                    @click="editUser(user)"
                    class="p-2 hover:text-[#27628C] hover:bg-slate-50 rounded-xl transition-all"
                    title="Edit user"
                  >
                    <Icon name="lucide:pencil" class="w-5 h-5" />
                  </button>
                  <button
                    v-if="hasPermission('users:delete')"
                    @click="deleteUser(user._id)"
                    class="p-2 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                    title="Delete user"
                  >
                    <Icon name="lucide:trash-2" class="w-5 h-5" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <AdminEmptyState
        v-else
        icon="lucide:users"
        title="No users found"
        description="No administrative users match the current directory or filters."
      >
        <button v-if="hasPermission('users:create')" class="btn btn-primary" @click="openCreateModal">
          <Icon name="lucide:user-plus" class="w-4 h-4" />
          Add user
        </button>
      </AdminEmptyState>
    </div>

    <!-- Invite user (centered) -->
    <Modal
      v-model="showInviteModal"
      title="Invite new user"
      eyebrow="Team access"
      description="Send a secure invitation to a new team member."
      size="md"
      @close="closeInviteModal"
    >
      <div class="space-y-4">
        <div class="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3.5">
          <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#27628C] text-white">
            <Icon name="lucide:shield-check" class="h-4 w-4" />
          </span>
          <div>
            <p class="text-[11px] font-semibold text-[#0A202B]">Invitation protocol</p>
            <p class="mt-0.5 text-[10.5px] leading-5 text-slate-500">They will receive a link to set up their account with the role you choose.</p>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-3 sm:grid-cols-[1.5fr_1fr]">
          <AnimatedInput
            v-model="inviteForm.email"
            id="invite-email"
            label="Email address"
            type="email"
            required
          />
          <SelectInput
            v-model="inviteForm.role"
            label="Role"
            placeholder="Select role"
            :options="availableRoleOptions.filter((option: any) => option.value)"
          />
        </div>

        <div v-if="invitationLink" class="flex flex-col gap-2 rounded-lg border border-emerald-100 bg-emerald-50 p-3 sm:flex-row sm:items-center">
          <div class="min-w-0 flex-1">
            <p class="text-[10px] font-bold uppercase tracking-[0.08em] text-emerald-700">Invitation link ready</p>
            <p class="mt-1 truncate rounded-md border border-emerald-100 bg-white/70 px-2.5 py-1.5 font-mono text-[10px] text-emerald-700">{{ invitationLink }}</p>
          </div>
          <button type="button" class="btn btn-outline shrink-0" @click="copyInviteLink">
            <Icon :name="copied ? 'lucide:badge-check' : 'lucide:clipboard-check'" class="h-3.5 w-3.5" />
            {{ copied ? 'Copied' : 'Copy link' }}
          </button>
        </div>
      </div>

      <template #footer>
        <button type="button" class="btn btn-outline" @click="closeInviteModal">Cancel</button>
        <button
          type="button"
          class="btn btn-primary"
          :disabled="inviteLoading || !inviteForm.email"
          @click="handleSendInvite"
        >
          <span v-if="inviteLoading" class="h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          {{ inviteLoading ? 'Sending…' : 'Send invitation' }}
        </button>
      </template>
    </Modal>

    <!-- Configure personnel (centered) -->
    <Modal v-model="showModal" size="md" title="User settings" eyebrow="Team access" description="Update profile details, role and sign-in credentials.">
      <UserForm
        :user="selectedUser"
        @save="handleSaveUser"
        @cancel="closeModal"
      />
    </Modal>

    <!-- Delete Confirmation Modal -->
    <ConfirmModal
      v-model="showDeleteModal"
      title="Delete User"
      message="Are you sure you want to delete this user? This action will restrict their access to the administrative panel immediately."
      confirmText="Yes, Delete User"
      @confirm="executeDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useGetUsers } from '@/composables/modules/users/useGetUsers'
import { useUser } from '@/composables/modules/auth/user'
import { roleLabel } from '@/utils/permissions'
import { useCreateUser } from '@/composables/modules/users/useCreateUser'
import { useUpdateUser } from '@/composables/modules/users/useUpdateUser'
import { useSoftDeleteUser } from '@/composables/modules/users/useSoftDeleteUser'
import { useInvitations } from '@/composables/modules/users/useInvitations'
import { useGetRoles } from '@/composables/modules/roles/useGetRoles'
import { useCustomToast } from '@/composables/core/useCustomToast'
import AnimatedInput from '@/components/ui/AnimatedInput.vue'
import SelectInput from '@/components/ui/SelectInput.vue'
import Modal from '@/components/Modal.vue'
import Icon from '@/components/Icon.vue'
import UserForm from '@/components/userForm.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'
import AdminEmptyState from '@/components/AdminEmptyState.vue'
import AdminTableLoading from '@/components/AdminTableLoading.vue'

// State
const searchQuery = ref('')
const roleFilter = ref('')
const showModal = ref(false)
const showInviteModal = ref(false)
const selectedUser = ref(null)
const copied = ref(false)
const showDeleteModal = ref(false)
const userIdToDelete = ref('')

const inviteForm = ref({
  email: '',
  role: 'member',
  departmentId: undefined,
  teamId: undefined
})

const availableRoles = [
  'super_admin',
  'executive_director',
  'asst_executive_director',
  'head_of_department',
  'co_lead',
  'member',
  'admin',
  'editor'
]

const { hasPermission } = useUser()
const { roles: roleDirectory, getRoles: getRoleDirectory } = useGetRoles()

const availableRoleOptions = computed(() => {
  const names = Array.from(new Set([
    ...availableRoles,
    ...(roleDirectory.value || []).map((role: any) => String(role.name || '').toLowerCase()).filter(Boolean),
  ]))
  return [
    { label: 'All roles', value: '' },
    ...names.map(role => ({
      label: role.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      value: role,
    })),
  ]
})

// Composables
const { users, loading, getUsers } = useGetUsers()
const { createUser } = useCreateUser()
const { updateUser } = useUpdateUser()
const { softDeleteUser } = useSoftDeleteUser()
const { sendInvitation, loading: inviteLoading, invitationLink } = useInvitations()
const { showToast } = useCustomToast()

onMounted(() => {
  getUsers()
  if (hasPermission('roles:read')) getRoleDirectory().catch(() => {})
})

// Computed
const filteredUsers = computed(() => {
  let filtered = (users.value || []) as any[]
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    filtered = filtered.filter(u => `${u.firstName} ${u.lastName}`.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q))
  }
  if (roleFilter.value) filtered = filtered.filter(u => u.role === roleFilter.value)
  return filtered
})

// Methods
const openCreateModal = () => { selectedUser.value = null; showModal.value = true }
const editUser = (user: any) => { selectedUser.value = user; showModal.value = true }
const closeModal = () => { showModal.value = false; selectedUser.value = null }
const closeInviteModal = () => { showInviteModal.value = false; invitationLink.value = ''; inviteForm.value.email = '' }

const handleSaveUser = async (userData: any) => {
  try {
    if (selectedUser.value) await updateUser((selectedUser.value as any)._id, userData)
    else await createUser(userData)
    await getUsers()
    closeModal()
  } catch (err) { console.error('Ledger update failed:', err) }
}

const deleteUser = (userId: string) => {
  userIdToDelete.value = userId
  showDeleteModal.value = true
}

const executeDelete = async () => {
  try { 
    await softDeleteUser(userIdToDelete.value)
    await getUsers() 
    showToast({ title: "Success", message: "User has been deleted.", toastType: "success" })
  }
  catch (err) { console.error('Deletion protocol failed:', err) }
  finally {
    showDeleteModal.value = false
    userIdToDelete.value = ''
  }
}

const handleSendInvite = async () => {
  try {
    await sendInvitation(inviteForm.value)
  } catch (err) { console.error('Invitation protocol failed:', err) }
}

const copyInviteLink = () => {
  if (invitationLink.value) {
    navigator.clipboard.writeText(invitationLink.value)
    copied.value = true
    showToast({ title: "Copied", message: "Invite link copied to clipboard.", toastType: "success" })
    setTimeout(() => copied.value = false, 2000)
  }
}

const getUserRoleColor = (role: string) => {
  if (role?.includes('admin')) return 'bg-[#27628C]'
  if (role?.includes('director')) return 'bg-indigo-600'
  if (role?.includes('head')) return 'bg-purple-600'
  if (role?.includes('lead')) return 'bg-emerald-600'
  return 'bg-slate-400'
}

const getRoleBadgeStyle = (role: string) => {
  if (role?.includes('admin')) return 'bg-blue-50 text-blue-700 ring-blue-700/10'
  if (role?.includes('director')) return 'bg-indigo-50 text-indigo-700 ring-indigo-700/10'
  if (role?.includes('head')) return 'bg-purple-50 text-purple-700 ring-purple-700/10'
  if (role?.includes('lead')) return 'bg-emerald-50 text-emerald-700 ring-emerald-700/10'
  return 'bg-slate-50 text-slate-600 ring-slate-600/10'
}

const formatDate = (date: string) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}
</script>