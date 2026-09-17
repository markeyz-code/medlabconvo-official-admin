<template>
  <div class="space-y-12 animate-in fade-in duration-700">
    <!-- Action Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8 bg-white p-10 rounded-xl border border-slate-200 relative overflow-hidden">
      <!-- Background Decor -->
      <div class="absolute right-0 top-0 w-64 h-64 bg-[#033958]/5 blur-3xl rounded-full"></div>
      
      <div class="relative z-10 space-y-2">
        <h2 class="text-xl font-medium text-slate-900 tracking-normal ">Team Management</h2>
        <p class="text-sm font-medium text-slate-400 tracking-normal">Manage your team members and leadership profiles</p>
      </div>

      <div class="relative z-10 flex items-center gap-4 w-full sm:w-auto">
        <button
          @click="openAddDrawer"
          class="flex-1 sm:flex-none px-10 py-3 bg-[#033958] text-white rounded-2xl font-medium text-sm  tracking-normal hover:bg-[#022a41] transition-all flex items-center justify-center space-x-3 -2xl active:scale-95"
        >
          <Icon name="lucide:plus-circle" class="w-5 h-5" />
          <span>Add Team Member</span>
        </button>
      </div>
    </div>

    <!-- Search & Filters -->
    <div class="flex flex-col md:flex-row gap-6 max-w-4xl">
      <div class="flex-1">
        <AnimatedInput 
          v-model="searchQuery" 
          id="search-teams" 
          label="Search by name or title..." 
          type="text" 
        />
      </div>
      <div class="w-full md:w-64">
        <SelectInput 
          v-model="categoryFilter" 
          :options="[
            { label: 'All Categories', value: '' },
            { label: 'Executive Board', value: 'Executive Board' },
            { label: 'Management Team', value: 'Management Team' },
            { label: 'Volunteer Committee', value: 'Volunteer Committee' },
            { label: 'Advisory Council', value: 'Advisory Council' }
          ]" 
        />
      </div>
    </div>

    <!-- Members Table -->
    <div class="bg-white rounded-xl border border-slate-200 overflow-hidden relative min-h-[400px]">
      <!-- Loading Overlay -->
      <div v-if="loading" class="absolute inset-0 bg-white/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center">
         <div class="w-12 h-12 border-4 border-slate-100 border-t-[#033958] rounded-full animate-spin mb-4"></div>
         <span class="text-sm font-medium  tracking-normal text-[#033958]">Loading members...</span>
      </div>

      <div v-if="!loading && filteredMembers.length === 0" class="py-40 text-center">
        <div class="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
           <Icon name="lucide:users-round" class="w-12 h-12 text-slate-200" />
        </div>
        <h3 class="text-xl font-medium text-slate-900  tracking-normal ">No Members Found</h3>
        <p class="text-sm font-medium text-slate-400  tracking-normal mt-2">No team members match your current filters.</p>
      </div>

      <table v-else class="w-full text-left border-collapse">
        <thead>
          <tr class="border-b border-slate-100">
            <th class="px-10 py-8 text-sm font-medium  tracking-normal text-slate-400">Photo</th>
            <th class="px-10 py-8 text-sm font-medium  tracking-normal text-slate-400">Name & Title</th>
            <th class="px-10 py-8 text-sm font-medium  tracking-normal text-slate-400">Category</th>
            <th class="px-10 py-8 text-sm font-medium  tracking-normal text-slate-400 text-center">Order</th>
            <th class="px-10 py-8 text-sm font-medium  tracking-normal text-slate-400 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-50">
          <tr v-for="member in filteredMembers" :key="member._id" class="group hover:bg-slate-50/50 transition-colors">
            <td class="px-10 py-8">
              <div class="relative w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 -md transform group-hover:scale-110 transition-transform">
                 <img v-if="member.image" :src="member.image" class="w-full h-full object-cover" />
                 <div v-else class="w-full h-full flex items-center justify-center text-slate-300">
                    <Icon name="lucide:user" class="w-8 h-8" />
                 </div>
              </div>
            </td>
            <td class="px-10 py-8">
               <div class="flex flex-col">
                  <span class="text-lg font-medium text-slate-900   tracking-normal">{{ member.name }}</span>
                  <span class="text-sm font-medium text-[#033958]  tracking-normal">{{ member.title }}</span>
               </div>
            </td>
            <td class="px-10 py-8 text-center sm:text-left">
               <div class="inline-flex items-center gap-2 px-3 py-1 bg-[#033958] text-white text-[9px] font-medium  tracking-normal rounded-lg">
                  {{ member.roleCategory || 'General' }}
               </div>
            </td>
            <td class="px-10 py-8 text-center text-sm font-medium text-slate-300">
               {{ member.position }}
            </td>
            <td class="px-10 py-8 text-right">
               <div class="flex items-center justify-end space-x-3 transition-all">
                  <button 
                    @click="openEditDrawer(member)"
                    class="p-3 text-[#033958] hover:bg-[#033958]/10 rounded-xl border border-slate-100 transition-all -sm"
                    title="Edit Member"
                  >
                    <Icon name="lucide:square-pen" class="w-5 h-5" />
                  </button>
                  <button 
                    @click="handleDelete(member._id!)" 
                    class="p-3 text-rose-500 hover:bg-rose-100 rounded-xl border border-slate-100 transition-all -sm"
                    title="Delete Member"
                  >
                    <Icon name="lucide:trash-2" class="w-5 h-5" />
                  </button>
               </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Side Drawer -->
    <ClientOnly>
      <SlideOver 
        v-model="showDrawer" 
        size="full"
        :title="selectedMember ? 'Edit Team Member' : 'Add Team Member'"
      >
        <div class="p-8">
          <TeamMemberForm 
            :member="selectedMember" 
            @save="handleSave" 
            @cancel="showDrawer = false" 
          />
        </div>
      </SlideOver>
    </ClientOnly>

    <!-- Delete Confirmation Modal -->
    <ConfirmModal
      v-model="showDeleteModal"
      title="Delete Member"
      message="Are you sure you want to remove this team member? This action cannot be undone."
      confirmText="Yes, Delete Member"
      @confirm="executeDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { teams_api, type TeamMember } from '@/api_factory/modules/teams'
import { useCustomToast } from '@/composables/core/useCustomToast'
import AnimatedInput from '@/components/ui/AnimatedInput.vue'
import SelectInput from '@/components/ui/SelectInput.vue'
import Icon from '@/components/Icon.vue'
import SlideOver from '@/components/SlideOver.vue'
import TeamMemberForm from '@/components/TeamMemberForm.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'

const { showToast } = useCustomToast()

const members = ref<TeamMember[]>([])
const loading = ref(false)
const searchQuery = ref('')
const categoryFilter = ref('')

const showDrawer = ref(false)
const selectedMember = ref<TeamMember | null>(null)

const showDeleteModal = ref(false)
const memberIdToDelete = ref<string | null>(null)

const fetchMembers = async () => {
  loading.value = true
  try {
    const res = await teams_api.$_get_members()
    members.value = res.data
  } catch (e) {
    showToast({ title: 'Error', message: 'Failed to load team members.', toastType: 'error' })
  } finally {
    loading.value = false
  }
}

onMounted(fetchMembers)

const filteredMembers = computed(() => {
  let list = [...members.value]
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(m => m.name.toLowerCase().includes(q) || m.title.toLowerCase().includes(q))
  }
  if (categoryFilter.value) {
    list = list.filter(m => m.roleCategory === categoryFilter.value)
  }
  return list.sort((a, b) => (a.position || 0) - (b.position || 0))
})

const openAddDrawer = () => {
  selectedMember.value = null
  showDrawer.value = true
}

const openEditDrawer = (member: TeamMember) => {
  selectedMember.value = member
  showDrawer.value = true
}

const handleSave = async (payload: any) => {
  try {
    if (selectedMember.value?._id) {
      await teams_api.$_update_member(selectedMember.value._id, payload)
      showToast({ title: 'Updated', message: 'Team member updated successfully.', toastType: 'success' })
    } else {
      await teams_api.$_create_member(payload)
      showToast({ title: 'Created', message: 'Team member added successfully.', toastType: 'success' })
    }
    showDrawer.value = false
    await fetchMembers()
  } catch (err) {
    showToast({ title: 'Error', message: 'Failed to save team member.', toastType: 'error' })
  }
}

const handleDelete = (id: string) => {
  memberIdToDelete.value = id
  showDeleteModal.value = true
}

const executeDelete = async () => {
  if (!memberIdToDelete.value) return
  
  try {
    await teams_api.$_delete_member(memberIdToDelete.value)
    showToast({ title: 'Deleted', message: 'Team member has been removed.', toastType: 'success' })
    await fetchMembers()
  } catch (e) {
    showToast({ title: 'Error', message: 'Failed to delete team member.', toastType: 'error' })
  } finally {
    showDeleteModal.value = false
    memberIdToDelete.value = null
  }
}
</script>