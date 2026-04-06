<template>
  <div class="space-y-6">
    <!-- Header Actions -->
    <div class="flex justify-between items-center">
      <div class="flex items-center space-x-6 flex-1 max-w-2xl">
        <div class="flex-1">
          <AnimatedInput
            v-model="searchQuery"
            id="formSearch"
            label="Search forms"
            type="text"
          />
        </div>
        <div class="w-64">
          <SelectInput
            v-model="statusFilter"
            label="Filter by status"
            :options="[
              { label: 'All status', value: '' },
              { label: 'Active', value: 'active' },
              { label: 'Inactive', value: 'inactive' }
            ]"
          />
        </div>
      </div>
      <button
        @click="openCreateModal"
        class="px-10 py-4 bg-[#033958] text-white rounded-2xl font-bold text-sm hover:bg-[#022f42] transition-all active:scale-95 flex items-center space-x-3"
      >
        <Plus class="w-4 h-4" />
        <span>Create Form</span>
      </button>
    </div>

    <!-- Forms Table -->
    <div class="bg-white rounded-3xl border border-slate-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-slate-100 text-sm">
          <thead class="bg-slate-50">
            <tr>
              <th scope="col" class="px-6 py-5 text-left font-bold text-slate-400">
                Title
              </th>
              <th scope="col" class="px-6 py-5 text-left font-bold text-slate-400">
                Description
              </th>
              <th scope="col" class="px-6 py-5 text-left font-bold text-slate-400">
                Status
              </th>
              <th scope="col" class="px-6 py-5 text-left font-bold text-slate-400">
                Fields
              </th>
              <th scope="col" class="px-6 py-5 text-left font-bold text-slate-400">
                Submissions
              </th>
              <th scope="col" class="px-6 py-5 text-left font-bold text-slate-400">
                Form URL
              </th>
              <th scope="col" class="px-6 py-5 text-left font-bold text-slate-400">
                Created
              </th>
              <th scope="col" class="px-6 py-5 text-right font-bold text-slate-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-slate-50">
            <tr
              v-for="form in filteredForms"
              :key="form._id"
              class="hover:bg-slate-50/50 transition-colors duration-150"
            >
              <!-- Title -->
              <td class="px-6 py-5 whitespace-nowrap">
                <div class="font-bold text-slate-900">{{ form.title }}</div>
              </td>

              <!-- Description -->
              <td class="px-6 py-5">
                <div class="text-slate-500 max-w-xs truncate" :title="form.description">
                  {{ form.description }}
                </div>
              </td>

              <!-- Status -->
              <td class="px-6 py-5 whitespace-nowrap">
                <button
                  @click="toggleFormStatus(form)"
                  :disabled="togglingFormId === form._id"
                  :class="[
                    'px-3 py-1 inline-flex items-center text-sm font-bold rounded-full transition-all duration-200',
                    form.isActive ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
                    togglingFormId === form._id ? 'opacity-50 cursor-not-allowed' : ''
                  ]"
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
              <td class="px-6 py-5 whitespace-nowrap">
                <div class="text-slate-700 font-medium">{{ form.fields?.length || 0 }}</div>
              </td>

              <!-- Submissions Count -->
              <td class="px-6 py-5 whitespace-nowrap">
                <div class="text-slate-700 font-medium">{{ form.submissionsCount || 0 }}</div>
              </td>

              <!-- Form URL -->
              <td class="px-6 py-5">
                <div class="flex items-center space-x-2">
                  <a 
                    :href="`https://www.medlabconvo.com/forms/submit/${form?.accessToken}`"
                    target="_blank"
                    class="text-blue-600 hover:underline truncate max-w-[150px] font-medium"
                    :title="`https://www.medlabconvo.com/forms/submit/${form?.accessToken}`"
                  >
                    ...{{ form?.accessToken?.substring(form?.accessToken?.length - 8) }}
                  </a>
                  <button
                    @click.stop="copyFormUrl(form)"
                    :class="[
                      'p-1.5 rounded-lg transition-all duration-200',
                      copiedFormId === form._id 
                        ? 'text-green-600 bg-green-50' 
                        : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                    ]"
                  >
                    <Icon name="lucide:copy" class="w-4 h-4" />
                  </button>
                </div>
              </td>

              <!-- Created Date -->
              <td class="px-6 py-5 whitespace-nowrap text-slate-500 font-medium">
                {{ formatDate(form.createdAt) }}
              </td>

              <!-- Actions -->
              <td class="px-6 py-5 whitespace-nowrap text-right">
                <div class="flex items-center justify-end space-x-1 text-slate-400">
                  <button
                    @click="editForm(form, 'edit')"
                    class="p-2 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                    title="Edit form"
                  >
                    <Icon name="lucide:pencil" class="w-4 h-4" />
                  </button>
                  <button
                    @click="viewSubmissions(form)"
                    class="p-2 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                    title="View submissions"
                  >
                    <Icon name="lucide:eye" class="w-4 h-4" />
                  </button>
                  <button
                    @click="deleteForm(form._id)"
                    class="p-2 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    title="Delete form"
                  >
                    <Icon name="lucide:trash-2" class="w-4 h-4" />
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
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#033958]"></div>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredForms?.length === 0" class="text-center py-20 bg-white rounded-3xl border border-slate-100">
      <Icon name="lucide:clipboard-list" class="w-12 h-12 text-slate-200 mx-auto mb-4" />
      <p class="text-slate-400 font-medium">No forms found matching your criteria</p>
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
import AnimatedInput from '@/components/ui/AnimatedInput.vue'
import SelectInput from '@/components/ui/SelectInput.vue'
import { Plus } from 'lucide-vue-next'

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
const selectedForm = ref<any>(null)
const copiedFormId = ref<string | null>(null)
const togglingFormId = ref<string | null>(null)

// Load forms on mount
onMounted(() => {
  getForms()
})

// Computed
const filteredForms = computed(() => {
  let filtered = (forms.value as any[]) || []

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
      const cleanedFormData = {
        ...formData,
        fields: formData.fields?.map((field: any) => {
          const { _id, ...fieldWithoutId } = field
          return fieldWithoutId
        })
      }
      
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
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString()
}

const copyFormUrl = async (form: any) => {
  try {
    const formUrl = `https://www.medlabconvo.com/forms/submit/${form.accessToken}`
    await navigator.clipboard.writeText(formUrl)
    
    copiedFormId.value = form._id
    showToast({
      title: "Success",
      message: "Form URL copied to clipboard",
      toastType: "success",
      duration: 3000,
    })
    
    setTimeout(() => {
      copiedFormId.value = null
    }, 2000)
  } catch (error) {
    console.error('Error copying URL:', error)
  }
}

const toggleFormStatus = async (form: any) => {
  if (togglingFormId.value === form._id) {
    return
  }

  try {
    togglingFormId.value = form._id
    const updatedFormData = {
      isActive: !form.isActive
    }
    await updateForm(form._id, updatedFormData)
    await getForms()
  } catch (error) {
    console.error('Error toggling form status:', error)
  } finally {
    togglingFormId.value = null
  }
}
</script>