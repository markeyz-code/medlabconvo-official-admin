<template>
  <div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <!-- Action Header -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 rounded-[2rem] border border-slate-100">
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
          v-if="hasPermission('users:write')"
          @click="showInviteModal = true"
          class="flex-1 md:flex-none px-8 py-4 bg-white border border-slate-200 text-slate-900 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-all flex items-center justify-center space-x-3 group active:scale-95"
        >
          <Icon name="lucide:send" class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          <span>Invite User</span>
        </button>
        <button
          v-if="hasPermission('users:write')"
          @click="openCreateModal"
          class="flex-1 md:flex-none px-8 py-4 bg-[#033958] text-white rounded-2xl font-bold text-sm hover:bg-[#044a73] transition-all flex items-center justify-center space-x-3 group active:scale-95"
        >
          <Icon name="lucide:plus" class="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
          <span>Add User</span>
        </button>
      </div>
    </div>

    <!-- Users Registry -->
    <div class="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden relative">
      <div v-if="loading" class="absolute inset-0 bg-white/80 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center">
        <div class="w-12 h-12 border-4 border-slate-100 border-t-[#033958] rounded-full animate-spin mb-4"></div>
        <span class="text-sm font-bold text-[#033958]">Loading users...</span>
      </div>

      <div class="overflow-x-auto text-sm">
        <table class="w-full text-left border-separate border-spacing-0">
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
                    <div class="text-[10px] font-bold text-slate-400 mt-1 lowercase">{{ user.email }}</div>
                  </div>
                </div>
              </td>
              <td class="px-10 py-8 whitespace-nowrap uppercase">
                <span :class="['px-3 py-1.5 text-[10px] font-bold rounded-lg ring-1 ring-inset', getRoleBadgeStyle(user.role)]">
                  {{ user.role?.replace('_', ' ') || 'standard' }}
                </span>
              </td>
              <td class="px-10 py-8 whitespace-nowrap uppercase">
                <div class="flex items-center space-x-3">
                  <div :class="['w-2 h-2 rounded-full', user.isActive ? 'bg-emerald-500' : 'bg-slate-300']"></div>
                  <span :class="['text-[10px] font-bold', user.isActive ? 'text-slate-700' : 'text-slate-400']">
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
                    v-if="hasPermission('users:write')"
                    @click="editUser(user)"
                    class="p-2 hover:text-[#033958] hover:bg-slate-50 rounded-xl transition-all"
                    title="Edit user"
                  >
                    <Icon name="lucide:pencil" class="w-5 h-5" />
                  </button>
                  <button
                    v-if="hasPermission('users:write')"
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
      
      <!-- Empty State -->
      <div v-if="!loading && filteredUsers.length === 0" class="py-32 text-center bg-slate-50/30">
        <div class="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-slate-100">
          <Icon name="lucide:users" class="w-10 h-10 text-slate-100" />
        </div>
        <h3 class="text-xl font-bold text-slate-900 mb-2 tracking-tight">No users found</h3>
        <p class="text-slate-400 text-sm font-medium max-w-[280px] mx-auto leading-relaxed">No administrative users found in the current directory.</p>
      </div>
    </div>

    <!-- Invite User Modal -->
    <Modal v-model="showInviteModal" title="Invite new user" size="lg">
      <div class="p-8 space-y-10">
        <div class="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
          <div class="flex items-start gap-4">
             <div class="w-10 h-10 bg-[#033958] rounded-xl flex items-center justify-center text-white flex-shrink-0">
               <Icon name="lucide:shield-check" class="w-6 h-6" />
             </div>
             <div>
               <p class="text-[#033958] text-sm font-bold uppercase tracking-widest mb-3">Invitation protocol</p>
               <p class="text-slate-600 text-sm font-medium leading-relaxed">Send an invitation to a new team member. They will receive a link to set up their account with the specified role.</p>
             </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
          <AnimatedInput
            v-model="inviteForm.email"
            id="invite-email"
            label="Email address"
            type="email"
            required
          />
          <SelectInput
            v-model="inviteForm.role"
            :options="availableRoleOptions"
          />
        </div>

        <div v-if="invitationLink" class="bg-emerald-50 p-8 rounded-[2rem] border border-emerald-100 flex items-center justify-between gap-6 animate-in fade-in zoom-in-95">
          <div class="flex-1 min-w-0">
            <p class="text-emerald-800 text-[10px] font-bold uppercase tracking-widest mb-3">Invitation link generated</p>
            <p class="text-emerald-700 text-sm truncate font-mono bg-white/50 px-4 py-2 rounded-lg border border-emerald-100">{{ invitationLink }}</p>
          </div>
          <button 
            @click="copyInviteLink"
            class="flex-shrink-0 px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold text-sm hover:bg-emerald-700 transition-all flex items-center space-x-3 active:scale-95"
          >
            <Icon :name="copied ? 'lucide:badge-check' : 'lucide:clipboard-check'" class="w-4 h-4" />
            <span>{{ copied ? 'Link copied' : 'Copy link' }}</span>
          </button>
        </div>

        <div class="flex justify-end pt-10 border-t border-slate-50 gap-6">
          <button
            @click="closeInviteModal"
            class="text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="handleSendInvite"
            :disabled="inviteLoading || !inviteForm.email"
            class="px-12 py-5 bg-[#3BAB22] text-white rounded-2xl font-bold text-sm hover:bg-[#2d851a] disabled:bg-slate-100 disabled:text-slate-400 transition-all flex items-center space-x-3 active:scale-95"
          >
            <div v-if="inviteLoading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <span>{{ inviteLoading ? 'Sending...' : 'Send invitation' }}</span>
          </button>
        </div>
      </div>
    </Modal>

    <!-- Configure Personnel (SlideOver) -->
    <SlideOver v-model="showModal" title="User settings">
      <UserForm
        :user="selectedUser"
        @save="handleSaveUser"
        @cancel="closeModal"
      />
    </SlideOver>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useGetUsers } from '@/composables/modules/users/useGetUsers'
import { useUser } from '@/composables/modules/auth/user'
import { useCreateUser } from '@/composables/modules/users/useCreateUser'
import { useUpdateUser } from '@/composables/modules/users/useUpdateUser'
import { useSoftDeleteUser } from '@/composables/modules/users/useSoftDeleteUser'
import { useInvitations } from '@/composables/modules/users/useInvitations'
import { useCustomToast } from '@/composables/core/useCustomToast'
import AnimatedInput from '@/components/ui/AnimatedInput.vue'
import SelectInput from '@/components/ui/SelectInput.vue'
import SlideOver from '@/components/SlideOver.vue'
import Modal from '@/components/Modal.vue'
import Icon from '@/components/Icon.vue'
import UserForm from '@/components/userForm.vue'

// State
const searchQuery = ref('')
const roleFilter = ref('')
const showModal = ref(false)
const showInviteModal = ref(false)
const selectedUser = ref(null)
const copied = ref(false)

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

const availableRoleOptions = computed(() => [
  { label: 'All roles', value: '' },
  ...availableRoles.map(role => ({
    label: role.replace(/_/g, ' ').charAt(0).toUpperCase() + role.replace(/_/g, ' ').slice(1),
    value: role
  }))
])

// Composables
const { users, loading, getUsers } = useGetUsers()
const { hasPermission } = useUser()
const { createUser } = useCreateUser()
const { updateUser } = useUpdateUser()
const { softDeleteUser } = useSoftDeleteUser()
const { sendInvitation, loading: inviteLoading, invitationLink } = useInvitations()
const { showToast } = useCustomToast()

onMounted(() => { getUsers() })

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

const deleteUser = async (userId: string) => {
  if (confirm('Are you sure you want to delete this user?')) {
    try { await softDeleteUser(userId); await getUsers() }
    catch (err) { console.error('Deletion protocol failed:', err) }
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
  if (role?.includes('admin')) return 'bg-[#033958]'
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