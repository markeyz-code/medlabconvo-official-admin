<template>
    <div class="space-y-6">
      <!-- Header Actions -->
      <div class="flex justify-between items-center">
        <div class="flex items-center space-x-4">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search team members..."
            class="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <select
            v-model="departmentFilter"
            class="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Departments</option>
            <option value="engineering">Engineering</option>
            <option value="design">Design</option>
            <option value="marketing">Marketing</option>
            <option value="sales">Sales</option>
            <option value="hr">Human Resources</option>
          </select>
        </div>
        <button
          @click="openCreateModal"
          class="px-4 py-2 bg-black text-white rounded-lg  transition-all duration-200 flex items-center space-x-2"
        >
          <Icon name="heroicons:plus" class="w-4 h-4" />
          <span>Add Member</span>
        </button>
      </div>
  
      <!-- Team Members Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
          v-for="member in filteredMembers"
          :key="member._id"
          class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-all duration-200"
        >
          <!-- Member Avatar -->
          <div class="h-32 bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center relative">
            <div class="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span class="text-2xl font-bold text-white">{{ member.name?.[0] || 'T' }}</span>
            </div>
            <div class="absolute top-4 right-4">
              <div class="flex items-center space-x-1">
                <button
                  @click="editMember(member)"
                  class="p-1 bg-white bg-opacity-20 rounded hover:bg-opacity-30 transition-colors"
                >
                  <Icon name="heroicons:pencil" class="w-4 h-4 text-white" />
                </button>
                <button
                  @click="deleteMember(member._id)"
                  class="p-1 bg-white bg-opacity-20 rounded hover:bg-opacity-30 transition-colors"
                >
                  <Icon name="heroicons:trash" class="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </div>
          
          <!-- Member Info -->
          <div class="p-6">
            <h3 class="font-semibold text-slate-900 mb-1">{{ member.name }}</h3>
            <p class="text-sm text-slate-600 mb-2">{{ member.position }}</p>
            <p class="text-xs text-slate-500 mb-4">{{ member.department }}</p>
            
            <div class="space-y-2">
              <div class="flex items-center text-sm text-slate-600">
                <Icon name="heroicons:envelope" class="w-4 h-4 mr-2" />
                <span class="truncate">{{ member.email }}</span>
              </div>
              <div v-if="member.phone" class="flex items-center text-sm text-slate-600">
                <Icon name="heroicons:phone" class="w-4 h-4 mr-2" />
                <span>{{ member.phone }}</span>
              </div>
            </div>
            
            <div class="mt-4 pt-4 border-t border-slate-200">
              <div class="flex items-center justify-between text-xs text-slate-500">
                <span>Joined: {{ formatDate(member.createdAt) }}</span>
                <span :class="[
                  'px-2 py-1 rounded-full',
                  member.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                ]">
                  {{ member.isActive ? 'Active' : 'Inactive' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
  
      <!-- Empty State -->
      <div v-else-if="filteredMembers.length === 0" class="text-center py-12">
        <Icon name="heroicons:user-group" class="w-12 h-12 text-slate-400 mx-auto mb-4" />
        <p class="text-slate-500">No team members found</p>
      </div>
  
      <!-- Create/Edit Member Modal -->
      <Modal v-model="showModal" title="Team Member Details" size="lg">
        <TeamMemberForm
          :member="selectedMember"
          @save="handleSaveMember"
          @cancel="closeModal"
        />
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
  import Icon from '@/components/Icon.vue'
  
  // Composables
  const { teamMembers, loading, getTeamMembers } = useGetTeamMembers()
  const { createTeamMember } = useCreateTeamMember()
  const { updateTeamMember } = useUpdateTeamMember()
  const { softDeleteTeamMember } = useSoftDeleteTeamMember()
  
  // Reactive data
  const searchQuery = ref('')
  const departmentFilter = ref('')
  const showModal = ref(false)
  const selectedMember = ref(null)
  
  // Load team members on mount
  onMounted(() => {
    getTeamMembers()
  })
  
  // Computed
  const filteredMembers = computed(() => {
    let filtered = teamMembers.value
  
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(member => 
        member.name?.toLowerCase().includes(query) ||
        member.position?.toLowerCase().includes(query) ||
        member.email?.toLowerCase().includes(query)
      )
    }
  
    if (departmentFilter.value) {
      filtered = filtered.filter(member => member.department === departmentFilter.value)
    }
  
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
    if (confirm('Are you sure you want to delete this team member?')) {
      try {
        await softDeleteTeamMember(memberId)
        await getTeamMembers()
      } catch (error) {
        console.error('Error deleting team member:', error)
      }
    }
  }
  
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString()
  }
  </script>
  