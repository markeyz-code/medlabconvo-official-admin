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
            placeholder="Search by name or email..."
            class="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#033958] focus:border-transparent font-medium text-slate-700 transition-all"
          />
        </div>
        <select
          v-model="roleFilter"
          class="w-full md:w-48 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#033958] focus:border-transparent font-bold text-slate-700 text-sm appearance-none cursor-pointer tracking-tight uppercase"
        >
          <option value="">All Access Levels</option>
          <option v-for="role in availableRoles" :key="role" :value="role">{{ role.replace('_', ' ') }}</option>
        </select>
      </div>

      <div class="flex items-center gap-3 w-full md:w-auto">
        <button
          @click="showInviteModal = true"
          class="flex-1 md:flex-none px-6 py-3 bg-[#033958] text-white rounded-xl font-bold text-sm hover:bg-[#044a73] transition-all flex items-center justify-center space-x-2 shadow-lg shadow-blue-900/10"
        >
          <Icon name="heroicons:paper-airplane" class="w-4 h-4" />
          <span>Invite Member</span>
        </button>
        <button
          @click="openCreateModal"
          class="flex-1 md:flex-none px-6 py-3 bg-[#3BAB22] text-white rounded-xl font-bold text-sm hover:bg-[#2d851a] transition-all flex items-center justify-center space-x-2 shadow-lg shadow-green-900/10"
        >
          <Icon name="heroicons:plus" class="w-4 h-4" />
          <span>Create User</span>
        </button>
      </div>
    </div>

    <!-- Users Ledger -->
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
              <th class="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Administrative Identity</th>
              <th class="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Auth Role</th>
              <th class="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Connectivity status</th>
              <th class="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Acquisition Date</th>
              <th class="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">System Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            <tr v-for="user in (filteredUsers as any[])" :key="user._id" class="group hover:bg-slate-50/80 transition-all">
              <td class="px-8 py-5 whitespace-nowrap">
                <div class="flex items-center">
                  <div :class="['w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-sm ring-4 ring-slate-50', getUserRoleColor(user.role)]">
                    {{ user.firstName?.[0] || 'U' }}
                  </div>
                  <div class="ml-5">
                    <div class="text-base font-bold text-slate-900 tracking-tight">{{ user.firstName }} {{ user.lastName }}</div>
                    <div class="text-sm text-slate-400 font-medium">{{ user.email }}</div>
                  </div>
                </div>
              </td>
              <td class="px-8 py-5 whitespace-nowrap">
                <span :class="['px-3 py-1 text-[10px] font-black rounded-lg uppercase tracking-wider ring-1 ring-inset', getRoleBadgeStyle(user.role)]">
                  {{ user.role?.replace('_', ' ') || 'standard' }}
                </span>
              </td>
              <td class="px-8 py-5 whitespace-nowrap">
                <div class="flex items-center space-x-2">
                  <div :class="['w-2 h-2 rounded-full', user.isActive ? 'bg-[#3BAB22] shadow-[0_0_8px_rgba(59,171,34,0.4)]' : 'bg-slate-300']"></div>
                  <span :class="['text-xs font-bold uppercase tracking-tight', user.isActive ? 'text-slate-700' : 'text-slate-400']">
                    {{ user.isActive ? 'Enabled' : 'Restricted' }}
                  </span>
                </div>
              </td>
              <td class="px-8 py-5 whitespace-nowrap text-sm text-slate-500 font-bold tracking-tight uppercase">
                {{ formatDate(user.createdAt) }}
              </td>
              <td class="px-8 py-5 whitespace-nowrap text-right">
                <div class="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    @click="editUser(user)"
                    class="w-10 h-10 flex items-center justify-center text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-xl transition-all"
                    title="Modify User"
                  >
                    <Icon name="heroicons:pencil-square" class="w-5 h-5" />
                  </button>
                  <button
                    @click="deleteUser(user._id)"
                    class="w-10 h-10 flex items-center justify-center text-rose-600 bg-rose-50 hover:bg-rose-600 hover:text-white rounded-xl transition-all"
                    title="Revoke Access"
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
      <div v-if="!loading && filteredUsers.length === 0" class="py-32 text-center">
        <div class="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Icon name="heroicons:users" class="w-12 h-12 text-slate-200" />
        </div>
        <h3 class="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight">No Personnel Found</h3>
        <p class="text-slate-400 font-medium max-w-xs mx-auto">The system ledger returned zero results for your current search parameters.</p>
      </div>
    </div>

    <!-- Invite Member Modal -->
    <Modal v-model="showInviteModal" title="Personnel Access Invitation" size="lg">
      <div class="p-4 space-y-8">
        <div class="bg-[#033958]/5 p-6 rounded-2xl border border-[#033958]/10">
          <p class="text-[#033958] text-sm font-bold leading-relaxed antialiased uppercase tracking-wide mb-2 flex items-center">
            <Icon name="heroicons:information-circle" class="mr-2 w-5 h-5" />
            Invitation Protocol
          </p>
          <p class="text-slate-600 text-sm font-medium">Generate a secure authentication link for a new team member. Once accepted, the user will be prompted to finalize their profile identity.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label class="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Email Address</label>
            <div class="relative">
              <Icon name="heroicons:envelope" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                v-model="inviteForm.email"
                type="email"
                placeholder="identity@medlabconvo.com"
                class="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#033958] font-bold text-slate-700"
              />
            </div>
          </div>
          <div>
            <label class="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Privilege Level</label>
            <div class="relative">
              <Icon name="heroicons:shield-check" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <select
                v-model="inviteForm.role"
                class="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#033958] font-bold text-slate-700 uppercase appearance-none"
              >
                <option v-for="role in availableRoles" :key="role" :value="role">{{ role.replace('_', ' ') }}</option>
              </select>
            </div>
          </div>
        </div>

        <div v-if="invitationLink" class="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 flex items-center justify-between gap-4 animate-in fade-in zoom-in-95">
          <div class="flex-1 min-w-0 pr-4 overflow-hidden">
            <p class="text-emerald-800 text-[10px] font-black uppercase tracking-widest mb-2">Secure Link Generated</p>
            <p class="text-emerald-600 text-sm truncate font-mono">{{ invitationLink }}</p>
          </div>
          <button 
            @click="copyInviteLink"
            class="flex-shrink-0 px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-xs hover:bg-emerald-700 transition-all flex items-center space-x-2"
          >
            <Icon :name="copied ? 'heroicons:check-badge' : 'heroicons:clipboard-document-check'" class="w-4 h-4" />
            <span>{{ copied ? 'Copied' : 'Copy' }}</span>
          </button>
        </div>

        <div class="flex justify-end pt-8 border-t border-slate-100 gap-4">
          <button
            @click="closeInviteModal"
            class="px-8 py-4 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors uppercase tracking-widest"
          >
            Cancel
          </button>
          <button
            @click="handleSendInvite"
            :disabled="inviteLoading || !inviteForm.email"
            class="px-10 py-4 bg-[#3BAB22] text-white rounded-2xl font-black text-sm hover:bg-[#2d851a] disabled:bg-slate-100 disabled:text-slate-400 transition-all shadow-xl shadow-green-900/10 flex items-center space-x-3 uppercase tracking-widest"
          >
            <div v-if="inviteLoading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <span>{{ inviteLoading ? 'Dispatching...' : 'Send Invitation' }}</span>
          </button>
        </div>
      </div>
    </Modal>

    <!-- Create/Edit User Modal -->
    <Modal v-model="showModal" title="Identity Configuration" size="lg">
      <UserForm
        :user="selectedUser"
        @save="handleSaveUser"
        @cancel="closeModal"
      />
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useGetUsers } from '@/composables/modules/users/useGetUsers'
import { useCreateUser } from '@/composables/modules/users/useCreateUser'
import { useUpdateUser } from '@/composables/modules/users/useUpdateUser'
import { useSoftDeleteUser } from '@/composables/modules/users/useSoftDeleteUser'
import { useInvitations } from '@/composables/modules/users/useInvitations'
import { useCustomToast } from '@/composables/core/useCustomToast'

// Reactive data
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

// Composables
const { users, loading, getUsers } = useGetUsers()
const { createUser } = useCreateUser()
const { updateUser } = useUpdateUser()
const { softDeleteUser } = useSoftDeleteUser()
const { sendInvitation, loading: inviteLoading, invitationLink } = useInvitations()
const { showToast } = useCustomToast()

onMounted(() => { getUsers() })

// Computed
const filteredUsers = computed(() => {
  let filtered = users.value || []
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    filtered = filtered.filter(u => `${u.firstName} ${u.lastName}`.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
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
    if (selectedUser.value) await updateUser(selectedUser.value._id, userData)
    else await createUser(userData)
    await getUsers()
    closeModal()
  } catch (err) { console.error('Ledger update failed:', err) }
}

const deleteUser = async (userId: string) => {
  if (confirm('Irreversible Action: Are you sure you want to revoke this user\'s access to the administrative ledger?')) {
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

const formatDate = (date: string) => new Date(date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
</script>