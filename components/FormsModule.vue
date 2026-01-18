<template>
  <div class="space-y-6">
    <!-- Header Actions -->
    <div class="flex justify-between items-center">
      <div class="flex items-center space-x-4">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search forms..."
          class="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <select
          v-model="statusFilter"
          class="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      <button
        @click="openCreateModal"
        class="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-all duration-200 flex items-center space-x-2"
      >
        <Icon name="heroicons:plus" class="w-4 h-4" />
        <span>Create Form</span>
      </button>
    </div>

    <!-- Forms Table -->
    <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-slate-200">
          <thead class="bg-slate-50">
            <tr>
              <th scope="col" class="px-6 py-6 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Title
              </th>
              <th scope="col" class="px-6 py-6 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Description
              </th>
              <th scope="col" class="px-6 py-6 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" class="px-6 py-6 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Fields
              </th>
              <th scope="col" class="px-6 py-6 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Submissions
              </th>
              <th scope="col" class="px-6 py-6 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Form URL
              </th>
              <th scope="col" class="px-6 py-6 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Created
              </th>
              <th scope="col" class="px-6 py-6 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-slate-200">
            <tr
              v-for="form in filteredForms"
              :key="form._id"
              class="hover:bg-slate-50 transition-colors duration-150"
            >
              <!-- Title -->
              <td class="px-6 py-6 whitespace-nowrap">
                <div class="flex items-center">
                  <!-- <Icon name="heroicons:clipboard-document-list" class="w-5 h-5 text-cyan-600 mr-2" /> -->
                  <div class="text-sm font-medium text-slate-900">{{ form.title }}</div>
                </div>
              </td>

              <!-- Description -->
              <td class="px-6 py-6">
                <div class="text-sm text-slate-600 max-w-xs truncate" :title="form.description">
                  {{ form.description }}
                </div>
              </td>

              <!-- Status -->
              <td class="px-6 py-6 whitespace-nowrap">
                <button
                  @click="toggleFormStatus(form)"
                  :disabled="togglingFormId === form._id"
                  :class="[
                    'px-3 py-1  inline-flex items-center text-xs leading-5 font-semibold rounded-full transition-all duration-200 cursor-pointer',
                    form.isActive ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-red-100 text-red-800 hover:bg-red-200',
                    togglingFormId === form._id ? 'opacity-50 cursor-not-allowed' : ''
                  ]"
                  :title="`Click to ${form.isActive ? 'deactivate' : 'activate'}`"
                >
                  <span v-if="togglingFormId === form._id" class="mr-1">
                    <svg class="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </span>
                  {{ form.isActive ? 'Active' : 'Inactive' }}
                </button>
              </td>

              <!-- Fields Count -->
              <td class="px-6 py-6 whitespace-nowrap">
                <div class="text-sm text-slate-900 text-center">{{ form.fields?.length || 0 }}</div>
              </td>

              <!-- Submissions Count -->
              <td class="px-6 py-6 whitespace-nowrap">
                <div class="text-sm text-slate-900 text-center">{{ form.submissionsCount || 0 }}</div>
              </td>

              <!-- Form URL -->
              <td class="px-6 py-6">
                <div class="flex items-center space-x-2">
                  <a 
                    :href="`https://www.medlabconvo.com/forms/submit/${form?.accessToken}`"
                    target="_blank"
                    class="text-sm text-blue-600 hover:text-blue-800 hover:underline truncate max-w-[200px]"
                    :title="`https://www.medlabconvo.com/forms/submit/${form?.accessToken}`"
                  >
                    /forms/submit/{{ form?.accessToken?.substring(0, 8) }}...
                  </a>
                  <button
                    @click.stop="copyFormUrl(form)"
                    :class="[
                      'p-1.5 rounded transition-all duration-200 flex items-center justify-center',
                      copiedFormId === form._id 
                        ? 'text-green-600 bg-green-50' 
                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                    ]"
                    :title="copiedFormId === form._id ? 'Copied!' : 'Copy URL to clipboard'"
                  >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#000000" viewBox="0 0 256 256"><path d="M184,64H40a8,8,0,0,0-8,8V216a8,8,0,0,0,8,8H184a8,8,0,0,0,8-8V72A8,8,0,0,0,184,64Zm-8,144H48V80H176ZM224,40V184a8,8,0,0,1-16,0V48H72a8,8,0,0,1,0-16H216A8,8,0,0,1,224,40Z"></path></svg>
                  </button>
                </div>
              </td>

              <!-- Created Date -->
              <td class="px-6 py-6 whitespace-nowrap">
                <div class="text-sm text-slate-500">{{ formatDate(form.createdAt) }}</div>
              </td>

              <!-- Actions -->
              <td class="px-6 py-6 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center justify-end space-x-2">
                  <button
                    @click="editForm(form, 'edit')"
                    class="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                    title="Edit Form"
                  >
                    <Icon name="heroicons:pencil" class="w-4 h-4" />
                  </button>
                  <button
                    @click="viewSubmissions(form)"
                    class="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-50"
                    title="View Submissions"
                  >
                    <Icon name="heroicons:eye" class="w-4 h-4" />
                  </button>
                  <button
                    @click="deleteForm(form._id)"
                    class="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                    title="Delete Form"
                  >
                    <Icon name="heroicons:trash" class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600"></div>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredForms?.length === 0" class="text-center py-12 bg-white rounded-xl shadow-sm border border-slate-200">
      <Icon name="heroicons:clipboard-document-list" class="w-12 h-12 text-slate-400 mx-auto mb-4" />
      <p class="text-slate-500">No forms found</p>
    </div>

    <!-- Create/Edit Form Modal -->
    <Modal v-model="showModal" title="Form Builder" size="xl">
      <FormBuilder
        :form="selectedForm"
        :mode="mode"
        @save="handleSaveForm"
        @cancel="closeModal"
      />
    </Modal>

    <!-- Submissions Modal -->
    <Modal v-model="showSubmissionsModal" title="Form Submissions" size="xl">
      <FormSubmissions
        v-if="selectedForm"
        :form="selectedForm"
        @close="closeSubmissionsModal"
      />
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useGetForms } from '@/composables/modules/forms/useGetForms'
import { useCreateForm } from '@/composables/modules/forms/useCreateForm'
import { useUpdateForm } from '@/composables/modules/forms/useUpdateForm'
import { useSoftDeleteForm } from '@/composables/modules/forms/useSoftDeleteForm'
import { useCustomToast } from "@/composables/core/useCustomToast"

// Composables
const { forms, loading, getForms } = useGetForms()
const { createForm } = useCreateForm()
const { updateForm } = useUpdateForm()
const { softDeleteForm } = useSoftDeleteForm()
  const { showToast } = useCustomToast()

// Reactive data
const searchQuery = ref('')
const statusFilter = ref('')
const showModal = ref(false)
const showSubmissionsModal = ref(false)
const mode = ref<'create' | 'edit'>('create') 
const selectedForm = ref(null)
const copiedFormId = ref<string | null>(null)
const togglingFormId = ref<string | null>(null)

// Load forms on mount
onMounted(() => {
  getForms()
})

// Computed
const filteredForms = computed(() => {
  let filtered = forms.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(form => 
      form.title?.toLowerCase().includes(query) ||
      form.description?.toLowerCase().includes(query)
    )
  }

  if (statusFilter.value) {
    filtered = filtered.filter(form => 
      statusFilter.value === 'active' ? form.isActive : !form.isActive
    )
  }

  return filtered
})

// Methods
const openCreateModal = () => {
  selectedForm.value = null
  showModal.value = true
}

const editForm = (form: any, action: any) => {
  console.log('Editing form:', form, 'Action:', action)
  selectedForm.value = form
  mode.value = action
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedForm.value = null
}

const viewSubmissions = (form: any) => {
  selectedForm.value = form
  showSubmissionsModal.value = true
}

const closeSubmissionsModal = () => {
  showSubmissionsModal.value = false
  selectedForm.value = null
}

const handleSaveForm = async (formData: any) => {
  try {
    if (selectedForm.value && mode.value === 'edit') {
      // Create a clean copy of formData without MongoDB _id fields
      const cleanedFormData = {
        ...formData,
        fields: formData.fields?.map((field: any) => {
          const { _id, ...fieldWithoutId } = field
          return fieldWithoutId
        })
      }
      
      // Remove MongoDB-specific fields that shouldn't be sent in update
      delete cleanedFormData._id
      delete cleanedFormData.createdAt
      delete cleanedFormData.updatedAt
      delete cleanedFormData.__v
      delete cleanedFormData.submissionsCount
      delete cleanedFormData.accessToken
      delete cleanedFormData.programTitle
      
      await updateForm(selectedForm.value._id, cleanedFormData)
    } else {
      await createForm(formData)
    }
    await getForms()
    closeModal()
  } catch (error) {
    console.error('Error saving form:', error)
  }
}

// const handleSaveForm = async (formData: any) => {
//   try {
//     if (selectedForm.value && mode.value === 'edit') {
//       await updateForm(selectedForm.value._id, formData)
//     } else {
//       await createForm(formData)
//     }
//     await getForms()
//     closeModal()
//   } catch (error) {
//     console.error('Error saving form:', error)
//   }
// }

const deleteForm = async (formId: string) => {
  if (confirm('Are you sure you want to delete this form?')) {
    try {
      await softDeleteForm(formId)
      await getForms()
    } catch (error) {
      console.error('Error deleting form:', error)
    }
  }
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString()
}

const copyFormUrl = async (form: any) => {
  try {
    const formUrl = `https://www.medlabconvo.com/forms/submit/${form.accessToken}`
    await navigator.clipboard.writeText(formUrl)
    
    // Show success feedback
    copiedFormId.value = form._id
            showToast({
          title: "Success",
          message: "Form URL copied to clipboard",
          toastType: "success",
          duration: 3000,
        })
    
    // Reset after 2 seconds
    setTimeout(() => {
      copiedFormId.value = null
    }, 2000)
  } catch (error) {
    console.error('Error copying URL:', error)
    alert('Failed to copy URL. Please try again.')
  }
}

const toggleFormStatus = async (form: any) => {
  // Prevent multiple simultaneous toggles
  if (togglingFormId.value === form._id) {
    return
  }

  try {
    togglingFormId.value = form._id
    
    // Create updated form data with toggled status
    const updatedFormData = {
      // ...form,
      isActive: !form.isActive
    }
    
    // Remove MongoDB specific fields that shouldn't be sent in update
    // delete updatedFormData._id
    // delete updatedFormData.createdAt
    // delete updatedFormData.updatedAt
    // delete updatedFormData.__v
    
    // Call the update composable
    await updateForm(form._id, updatedFormData)
    
    // Refresh the forms list to reflect the change
    await getForms()
  } catch (error) {
    console.error('Error toggling form status:', error)
    alert('Failed to update form status. Please try again.')
  } finally {
    togglingFormId.value = null
  }
}
</script>