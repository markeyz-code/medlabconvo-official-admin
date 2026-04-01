<template>
  <div class="space-y-6">
    <!-- Header Actions -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
      <div class="flex items-center space-x-4 w-full md:w-auto text-slate-700">
        <div class="relative w-full md:w-80">
          <Icon name="heroicons:magnifying-glass" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search identities or roles..."
            class="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#033958] font-medium transition-all"
          />
        </div>
      </div>
      <button
        @click="openCreateModal"
        class="w-full md:w-auto px-6 py-3 bg-[#033958] text-white rounded-xl font-bold text-sm hover:bg-[#044a73] transition-all flex items-center justify-center space-x-2 shadow-lg shadow-blue-900/10"
      >
        <Icon name="heroicons:plus" class="w-4 h-4" />
        <span>Instantiate Member</span>
      </button>
    </div>

    <!-- Team Members Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative">
      <div v-if="loading" class="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex items-center justify-center rounded-3xl">
        <div class="flex flex-col items-center">
          <div class="w-12 h-12 border-4 border-slate-100 border-t-[#033958] rounded-full animate-spin mb-4"></div>
        </div>
      </div>

      <div
        v-for="member in filteredMembers"
        :key="member._id"
        class="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 group"
      >
        <!-- Member Avatar -->
        <div class="h-40 bg-slate-100 relative group-hover:scale-105 transition-transform duration-500 overflow-hidden">
          <img v-if="member.image" :src="member.image" class="w-full h-full object-cover" />
          <div v-else class="w-full h-full bg-gradient-to-br from-[#033958] to-[#3BAB22] flex items-center justify-center">
             <span class="text-4xl font-black text-white/50">{{ member.initials || member.name?.substring(0, 2) || 'TM' }}</span>
          </div>

          <div class="absolute inset-x-0 top-0 p-4 bg-gradient-to-b from-black/50 to-transparent flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <button
              @click="editMember(member)"
              class="w-8 h-8 flex items-center justify-center bg-white/20 backdrop-blur-md rounded-lg hover:bg-white/40 transition-colors"
            >
              <Icon name="heroicons:pencil" class="w-4 h-4 text-white" />
            </button>
            <button
              @click="deleteMember(member._id)"
              class="w-8 h-8 flex items-center justify-center bg-rose-500/80 backdrop-blur-md rounded-lg hover:bg-rose-600 transition-colors"
            >
              <Icon name="heroicons:trash" class="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
        
        <!-- Member Info -->
        <div class="p-6 relative bg-white">
          <div class="flex justify-between items-start mb-2">
             <h3 class="font-bold text-slate-900 text-lg tracking-tight">{{ member.name }}</h3>
             <span :class="['text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md bg-slate-100', member.isActive ? 'text-[#3BAB22]' : 'text-slate-400']">{{ member.isActive ? 'Active' : 'Offline' }}</span>
          </div>
          <p class="text-sm font-semibold text-[#033958] mb-1 tracking-tight uppercase">{{ member.title }}</p>
          <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-4">Pos: {{ member.position }}</p>
          
          <div class="text-xs text-slate-500 line-clamp-3 mb-4 font-medium leading-relaxed">
            {{ member.bio || 'No biography instantiated.' }}
          </div>
          
          <div class="flex items-center space-x-3 pt-4 border-t border-slate-100">
            <a v-for="profile in member.profiles || []" :key="profile.type" :href="profile.url" target="_blank" class="text-slate-400 hover:text-[#033958] transition-colors">
               <Icon :name="profile.type === 'linkedin' ? 'mdi:linkedin' : 'mdi:twitter'" class="w-5 h-5" />
            </a>
            <span v-if="!member.profiles || member.profiles.length === 0" class="text-xs text-slate-300 font-medium italic">No linked profiles</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!loading && filteredMembers.length === 0" class="text-center py-20 bg-white rounded-3xl border border-slate-200">
      <div class="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon name="heroicons:user-group" class="w-10 h-10 text-slate-300" />
      </div>
      <p class="text-slate-500 font-medium">Zero administrative personnel found matching query criteria.</p>
    </div>

    <!-- Create/Edit Member Modal -->
    <Modal v-model="showModal" size="lg" :title="selectedMember ? 'Modify Identity Parameters' : 'Instantiate Identity parameters'">
      <div class="p-6">
        <TeamMemberForm
          :member="selectedMember"
          @save="handleSaveMember"
          @cancel="closeModal"
        />
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useGetTeamMembers } from '@/composables/modules/teams/useGetTeamMembers'
import { useCreateTeamMember } from '@/composables/modules/teams/useCreateTeamMember'
import { useUpdateTeamMember } from '@/composables/modules/teams/useUpdateTeamMember'
import { useSoftDeleteTeamMember } from '@/composables/modules/teams/useSoftDeleteTeamMember'
import Modal from '@/components/Modal.vue'
import TeamMemberForm from '@/components/TeamMemberForm.vue'

// Composables
const { teamMembers, loading, getTeamMembers } = useGetTeamMembers()
const { createTeamMember } = useCreateTeamMember()
const { updateTeamMember } = useUpdateTeamMember()
const { softDeleteTeamMember } = useSoftDeleteTeamMember()

// Reactive data
const searchQuery = ref('')
const showModal = ref(false)
const selectedMember = ref(null)

// Load team members on mount
onMounted(() => {
  getTeamMembers()
})

// Computed
const filteredMembers = computed(() => {
  let filtered = teamMembers.value || []

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(m => 
      m.name?.toLowerCase().includes(query) ||
      m.title?.toLowerCase().includes(query)
    )
  }

  // Sort by position
  filtered = [...filtered].sort((a, b) => (a.position || 99) - (b.position || 99))
  return filtered
})

// Methods
const openCreateModal = () => {
  selectedMember.value = null
  showModal.value = true
}

const editMember = (member: any) => {
  selectedMember.value = member
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedMember.value = null
}

const handleSaveMember = async (memberData: any) => {
  try {
    if (selectedMember.value) {
      await updateTeamMember(selectedMember.value._id, memberData)
    } else {
      await createTeamMember(memberData)
    }
    await getTeamMembers()
    closeModal()
  } catch (error) {
    console.error('Error saving team member:', error)
  }
}

const deleteMember = async (memberId: string) => {
  if (confirm('Irreversible Protocol Request: Are you absolutely certain you wish to delete this Personnel Record?')) {
    try {
      await softDeleteTeamMember(memberId)
      await getTeamMembers()
    } catch (error) {
      console.error('Error deleting team member:', error)
    }
  }
}
</script>