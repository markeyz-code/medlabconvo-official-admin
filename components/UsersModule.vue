<template>
    <div class="space-y-6">
      <!-- Header Actions -->
      <div class="flex justify-between items-center">
        <div class="flex items-center space-x-4">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search users..."
            class="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <select
            v-model="roleFilter"
            class="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
            <option value="user">User</option>
          </select>
        </div>
        <button
          @click="openCreateModal"
          class="px-4 py-2 bg-black text-white rounded-lg  transition-all duration-200 flex items-center space-x-2"
        >
          <Icon name="heroicons:plus" class="w-4 h-4" />
          <span>Add User</span>
        </button>
      </div>
  
      <!-- Users Table -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-slate-50 border-b border-slate-200">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">User</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Role</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Created</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-slate-200">
              <tr v-for="user in filteredUsers" :key="user._id" class="hover:bg-slate-50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                      <span class="text-white font-medium text-sm">{{ user.firstName?.[0] || 'U' }}</span>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-slate-900">{{ user.firstName }} {{ user.lastName }}</div>
                      <div class="text-sm text-slate-500">{{ user.email }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="[
                    'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                    user.role === 'admin' ? 'bg-red-100 text-red-800' :
                    user.role === 'editor' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  ]">
                    {{ user.role }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="[
                    'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                    user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  ]">
                    {{ user.isActive ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  {{ formatDate(user.createdAt) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex items-center justify-end space-x-2">
                    <button
                      @click="editUser(user)"
                      class="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                    >
                      <Icon name="heroicons:pencil" class="w-4 h-4" />
                    </button>
                    <button
                      @click="deleteUser(user._id)"
                      class="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                    >
                      <Icon name="heroicons:trash" class="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Loading State -->
        <div v-if="loading" class="flex items-center justify-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
        
        <!-- Empty State -->
        <div v-else-if="filteredUsers.length === 0" class="text-center py-12">
          <Icon name="heroicons:users" class="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <p class="text-slate-500">No users found</p>
        </div>
      </div>
  
      <!-- Create/Edit User Modal -->
      <Modal v-model="showModal" title="User Details" size="lg">
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
  
  // Reactive data
  const searchQuery = ref('')
  const roleFilter = ref('')
  const showModal = ref(false)
  const selectedUser = ref(null)
  
  // Composables
  const { users, loading, getUsers } = useGetUsers()
  const { createUser } = useCreateUser()
  const { updateUser } = useUpdateUser()
  const { softDeleteUser } = useSoftDeleteUser()
  
  // Load users on mount
  onMounted(() => {
    getUsers()
  })
  
  // Computed
  const filteredUsers = computed(() => {
    let filtered = users.value
  
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(user => 
        user.firstName?.toLowerCase().includes(query) ||
        user.lastName?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query)
      )
    }
  
    if (roleFilter.value) {
      filtered = filtered.filter(user => user.role === roleFilter.value)
    }
  
    return filtered
  })
  
  // Methods
  const openCreateModal = () => {
    selectedUser.value = null
    showModal.value = true
  }
  
  const editUser = (user: any) => {
    selectedUser.value = user
    showModal.value = true
  }
  
  const closeModal = () => {
    showModal.value = false
    selectedUser.value = null
  }
  
  const handleSaveUser = async (userData: any) => {
    try {
      if (selectedUser.value) {
        await updateUser(selectedUser.value._id, userData)
      } else {
        await createUser(userData)
      }
      await getUsers()
      closeModal()
    } catch (error) {
      console.error('Error saving user:', error)
    }
  }
  
  const deleteUser = async (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        await softDeleteUser(userId)
        await getUsers()
      } catch (error) {
        console.error('Error deleting user:', error)
      }
    }
  }
  
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString()
  }
  </script>
  