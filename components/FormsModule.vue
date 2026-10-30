<template>
  <div class="space-y-8">
    <!-- Header Actions -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white/50 backdrop-blur-md p-6 rounded-[1.25rem] border border-slate-100 shadow-sm">
      <div class="flex items-center space-x-6 flex-1 w-full max-w-2xl">
        <div class="flex-1">
          <AnimatedInput
            v-model="searchQuery"
            id="formSearch"
            label="Search all forms..."
            type="text"
          />
        </div>
        <div class="w-64">
          <SelectInput
            v-model="statusFilter"
            :options="[
              { label: 'All Statuses', value: '' },
              { label: 'Active Forms', value: 'active' },
              { label: 'Inactive Forms', value: 'inactive' }
            ]"
          />
        </div>
      </div>
      <button v-if="hasPermission('forms:create')"
        @click="openCreateModal"
        class="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-[#27628C] to-[#044d77] text-white rounded-2xl font-bold text-sm shadow-sm border border-slate-200 shadow-blue-900/20 hover:shadow-sm border border-slate-200 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center space-x-3"
      >
        <div class="bg-white/20 p-1 rounded-lg">
          <Plus class="w-4 h-4" />
        </div>
        <span>Create New Programme Form</span>
      </button>
    </div>

    <!-- Forms Grid/Table Container -->
    <div class="bg-white rounded-[1.5rem] border border-slate-100 overflow-hidden shadow-sm border border-slate-200 shadow-slate-200/50">
      <AdminTableLoading v-if="loading" :columns="6" :rows="6" label="Loading forms" />

      <div v-else-if="filteredForms?.length" class="overflow-x-auto">
        <table class="admin-table stack-table min-w-full divide-y divide-slate-100 text-sm">
          <thead class="bg-slate-50/50">
            <tr>
              <th scope="col" class="px-8 py-6 text-left font-black text-slate-400  tracking-normal text-sm">
                Programme Form
              </th>
              <th scope="col" class="px-8 py-6 text-left font-black text-slate-400  tracking-normal text-sm">
                Status
              </th>
              <th scope="col" class="px-8 py-6 text-left font-black text-slate-400  tracking-normal text-sm">
                Configuration
              </th>
              <th scope="col" class="px-8 py-6 text-left font-black text-slate-400  tracking-normal text-sm">
                Engagement
              </th>
              <th scope="col" class="px-8 py-6 text-left font-black text-slate-400  tracking-normal text-sm">
                Share Link
              </th>
              <th scope="col" class="px-8 py-6 text-right font-black text-slate-400  tracking-normal text-sm">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-slate-50">
            <tr
              v-for="form in filteredForms"
              :key="form._id"
              class="group hover:bg-blue-50/30 transition-all duration-300"
            >
              <!-- Title & Description -->
              <td class="px-8 py-6 whitespace-nowrap">
                <div class="flex flex-col">
                  <div class="font-bold text-slate-900 text-base group-hover:text-[#27628C] transition-colors">
                    {{ form.title || 'Untitled Professional Form' }}
                  </div>
                  <div class="text-slate-400 text-xs mt-1 max-w-xs truncate font-medium">
                    {{ form.description || 'No description provided' }}
                  </div>
                </div>
              </td>

              <!-- Status -->
              <td class="px-8 py-6 whitespace-nowrap">
                <button v-if="hasPermission('forms:update')"
                  @click="toggleFormStatus(form)"
                  :disabled="togglingFormId === form._id"
                  :class="[
                    'px-4 py-1.5 inline-flex items-center text-sm font-black  tracking-normal rounded-full transition-all duration-300',
                    form.isActive 
                      ? 'bg-emerald-100 text-emerald-700 shadow-sm shadow-emerald-200' 
                      : 'bg-slate-100 text-slate-500 shadow-sm shadow-slate-200',
                    togglingFormId === form._id ? 'opacity-50 cursor-not-allowed scale-95' : 'hover:scale-105 active:scale-95'
                  ]"
                >
                  <div v-if="togglingFormId === form._id" class="mr-2">
                    <svg class="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                  <div v-else :class="['w-1.5 h-1.5 rounded-full mr-2', form.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400']"></div>
                  {{ form.isActive ? 'Live' : 'Draft' }}
                </button>
              </td>

              <!-- Configuration (Fields) -->
              <td class="px-8 py-6 whitespace-nowrap">
                <div class="flex items-center space-x-2">
                  <div class="p-2 bg-blue-50 rounded-lg text-[#27628C]">
                    <Icon name="lucide:layout" class="w-4 h-4" />
                  </div>
                  <span class="font-bold text-slate-700">{{ form.fields?.length || 0 }}</span>
                  <span class="text-slate-400 text-xs font-bold  tracking-normal">Fields</span>
                </div>
              </td>

              <!-- Engagement (Submissions) -->
              <td class="px-8 py-6 whitespace-nowrap">
                <div class="flex items-center space-x-2">
                  <div class="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                    <Icon name="lucide:users" class="w-4 h-4" />
                  </div>
                  <span class="font-bold text-slate-700">{{ form.submissionsCount || 0 }}</span>
                  <span class="text-slate-400 text-xs font-bold  tracking-normal">Entries</span>
                </div>
              </td>

              <!-- Form URL -->
              <td class="px-8 py-6 whitespace-nowrap">
                <div class="flex items-center space-x-3 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 group/link cursor-pointer hover:bg-white hover:border-blue-200 transition-all duration-300" @click="copyFormUrl(form)">
                  <a 
                    :href="`https://www.medlabconvo.com/forms/submit/${form?.slug}`"
                    target="_blank"
                    class="text-blue-600 font-bold text-xs truncate max-w-[100px] hover:underline"
                    @click.stop
                  >
                    /{{ form?.slug }}
                  </a>
                  <Icon 
                    :name="copiedFormId === form._id ? 'lucide:check' : 'lucide:copy'" 
                    :class="['w-3.5 h-3.5 transition-all duration-300', copiedFormId === form._id ? 'text-emerald-500 scale-125' : 'text-slate-400 group-hover/link:text-blue-500']" 
                  />
                </div>
              </td>

              <!-- Actions -->
              <td class="px-8 py-6 whitespace-nowrap text-right">
                <div class="flex items-center justify-end space-x-2">
                  <button v-if="hasPermission('forms:update')"
                    @click="editForm(form, 'edit')"
                    class="p-2.5 bg-white border border-slate-100 text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:shadow-md rounded-xl transition-all duration-300"
                    title="Configure form"
                  >
                    <Icon name="lucide:settings-2" class="w-4.5 h-4.5" />
                  </button>
                  <button
                    @click="viewSubmissions(form)"
                    class="p-2.5 bg-white border border-slate-100 text-slate-400 hover:text-emerald-600 hover:border-emerald-200 hover:shadow-md rounded-xl transition-all duration-300"
                    title="Analyze results"
                  >
                    <Icon name="lucide:bar-chart-3" class="w-4.5 h-4.5" />
                  </button>
                  <button v-if="hasPermission('forms:delete')"
                    @click="deleteForm(form._id)"
                    class="p-2.5 bg-white border border-slate-100 text-slate-400 hover:text-red-600 hover:border-red-200 hover:shadow-md rounded-xl transition-all duration-300"
                    title="Remove form"
                  >
                    <Icon name="lucide:trash-2" class="w-4.5 h-4.5" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <AdminEmptyState
        v-else
        icon="lucide:clipboard-list"
        title="No forms found"
        description="No programme forms match the current search or filters."
      >
        <button
          v-if="searchQuery || statusFilter"
          class="btn btn-outline"
          @click="searchQuery = ''; statusFilter = ''"
        >
          Clear all filters
        </button>
        <button v-else-if="hasPermission('forms:create')" class="btn btn-primary" @click="openCreateModal">
          <Icon name="lucide:plus" class="w-4 h-4" />
          Create form
        </button>
      </AdminEmptyState>
    </div>

    <!-- Side Drawers -->
    <SlideOver v-model="showModal" :title="mode === 'edit' ? 'Edit Programme Form' : 'Create Programme Form'" size="full">
      <FormBuilder
        :form="selectedForm"
        :mode="mode"
        @save="handleSaveForm"
        @cancel="closeModal"
      />
    </SlideOver>

    <SlideOver v-model="showSubmissionsModal" title="Form Submission Intelligence" size="full">
      <FormSubmissions
        v-if="selectedForm"
        :form="selectedForm"
        @close="closeSubmissionsModal"
      />
    </SlideOver>

    <ConfirmModal
      v-model="showDeleteModal"
      title="Archive Programme Form"
      message="Are you sure you want to move this form to the archive? Public access will be immediately revoked."
      confirmText="Archive Form"
      @confirm="executeDelete"
    />

    <!-- Form link -->
    <Modal v-model="showLinkModal" title="Form link" eyebrow="Public form" description="Share this link with respondents." size="md">
      <div v-if="generatedLink" class="space-y-4">
        <div class="flex items-start gap-3 rounded-lg border border-[#e0e9ef] bg-[#f4f8fb] p-3.5">
          <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#27628C] text-white"><Icon name="lucide:rocket" class="h-4 w-4" /></span>
          <div>
            <p class="text-[11px] font-semibold text-[#0A202B]">Your form is live</p>
            <p class="mt-0.5 text-[10.5px] leading-5 text-slate-500">The link is publicly reachable and ready to share.</p>
          </div>
        </div>
        <div>
          <label class="field-label">Public form URL</label>
          <div class="flex items-stretch gap-2">
            <input :value="generatedLink" readonly class="input min-w-0 flex-1 font-mono text-[11px]" />
            <button type="button" class="btn btn-primary shrink-0" @click="copyGeneratedLink">
              <Icon :name="isCopied ? 'lucide:check' : 'lucide:copy'" class="h-3.5 w-3.5" />
              {{ isCopied ? 'Copied' : 'Copy' }}
            </button>
          </div>
        </div>
        <div class="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
          <button type="button" class="btn btn-outline" @click="showLinkModal = false">Close</button>
          <a :href="generatedLink" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
            View live form <Icon name="lucide:external-link" class="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
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
import SlideOver from '@/components/SlideOver.vue'
import FormBuilder from '@/components/FormBuilder.vue'
import FormSubmissions from '@/components/FormSubmissions.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'
import { useUser } from '@/composables/modules/auth/user'
import AdminEmptyState from '@/components/AdminEmptyState.vue'
import AdminTableLoading from '@/components/AdminTableLoading.vue'

const { hasPermission } = useUser()

// Composables
const { forms, loading, getForms } = useGetForms()
const { createForm, error: createError } = useCreateForm()
const { updateForm, error: updateError } = useUpdateForm()
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
const showDeleteModal = ref(false)
const idToDelete = ref('')
const showLinkModal = ref(false)
const generatedLink = ref('')
const isCopied = ref(false)

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
  mode.value = 'create'
  showModal.value = true
}

const editForm = (form: any, action: any) => {
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
      
      const updated = await updateForm(selectedForm.value._id, cleanedFormData)
      if (updated && (updated._id || updated.slug)) {
        showToast({
          title: "Form Updated",
          message: "Your changes have been successfully saved.",
          toastType: "success",
        })
        closeModal()
        await getForms()
      } else {
        showToast({
          title: "Update Failed",
          message: updateError.value || "Could not update form. Please verify the inputs.",
          toastType: "error",
        })
      }
    } else {
      const result = await createForm(formData)
      if (result && (result._id || result.slug)) {
        try {
          localStorage.removeItem('medlab_standalone_form_draft')
        } catch (e) {}
        generatedLink.value = `https://www.medlabconvo.com/forms/submit/${result.slug}`
        showLinkModal.value = true
        closeModal()
        await getForms()
      } else {
        showToast({
          title: "Creation Failed",
          message: createError.value || "Could not create form. Please check your inputs.",
          toastType: "error",
        })
      }
    }
  } catch (error) {
    console.error('Error saving form:', error)
    showToast({
      title: "Error",
      message: "An unexpected error occurred while saving the form.",
      toastType: "error",
    })
  }
}

const copyGeneratedLink = async () => {
  try {
    await navigator.clipboard.writeText(generatedLink.value)
    isCopied.value = true
    showToast({
      title: "Link Copied",
      message: "Ready to share with your audience.",
      toastType: "success",
    })
    setTimeout(() => {
      isCopied.value = false
    }, 2000)
  } catch (error) {
    console.error('Failed to copy link:', error)
  }
}

const deleteForm = (formId: string) => {
  idToDelete.value = formId
  showDeleteModal.value = true
}

const executeDelete = async () => {
  try {
    await softDeleteForm(idToDelete.value)
    await getForms()
  } catch (error) {
    console.error('Error deleting form:', error)
  } finally {
    showDeleteModal.value = false
    idToDelete.value = ''
  }
}

const formatDate = (date: string) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString()
}

const copyFormUrl = async (form: any) => {
  try {
    const formUrl = `https://www.medlabconvo.com/forms/submit/${form.slug}`
    await navigator.clipboard.writeText(formUrl)
    
    copiedFormId.value = form._id
    showToast({
      title: "Link Copied",
      message: "The form URL is ready to be shared.",
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
    
    showToast({
      title: form.isActive ? "Form Deactivated" : "Form Published",
      message: `The form status has been successfully updated.`,
      toastType: "success",
      duration: 3000,
    })
  } catch (error) {
    console.error('Error toggling form status:', error)
  } finally {
    togglingFormId.value = null
  }
}
</script>