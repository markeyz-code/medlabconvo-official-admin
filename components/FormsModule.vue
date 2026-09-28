<template>
  <div class="space-y-8">
    <!-- Header Actions -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white/50 backdrop-blur-md p-6 rounded-[2rem] border border-slate-100 shadow-sm">
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
      <button
        @click="openCreateModal"
        class="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-[#033958] to-[#044d77] text-white rounded-2xl font-bold text-sm shadow-sm border border-slate-200 shadow-blue-900/20 hover:shadow-sm border border-slate-200 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center space-x-3"
      >
        <div class="bg-white/20 p-1 rounded-lg">
          <Plus class="w-4 h-4" />
        </div>
        <span>Create New Programme Form</span>
      </button>
    </div>

    <!-- Forms Grid/Table Container -->
    <div class="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm border border-slate-200 shadow-slate-200/50">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-slate-100 text-sm">
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
                  <div class="font-bold text-slate-900 text-base group-hover:text-[#033958] transition-colors">
                    {{ form.title || 'Untitled Professional Form' }}
                  </div>
                  <div class="text-slate-400 text-xs mt-1 max-w-xs truncate font-medium">
                    {{ form.description || 'No description provided' }}
                  </div>
                </div>
              </td>

              <!-- Status -->
              <td class="px-8 py-6 whitespace-nowrap">
                <button
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
                  <div class="p-2 bg-blue-50 rounded-lg text-[#033958]">
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
                  <button
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
                  <button
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

      <!-- Empty State -->
      <div v-if="!loading && filteredForms?.length === 0" class="text-center py-32">
        <div class="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 shadow-inner">
          <Icon name="lucide:clipboard-list" class="w-10 h-10 text-slate-200" />
        </div>
        <h3 class="text-xl font-bold text-slate-900">No forms found</h3>
        <p class="text-slate-400 mt-2 max-w-sm mx-auto font-medium">We couldn't find any programme forms matching your current filters.</p>
        <button 
          @click="searchQuery = ''; statusFilter = ''" 
          class="mt-8 text-[#033958] font-black text-xs  tracking-normal hover:underline"
        >
          Clear all filters
        </button>
      </div>
      
      <!-- Loading State Overlay -->
      <div v-if="loading" class="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center z-10">
        <div class="flex flex-col items-center">
          <div class="w-12 h-12 border-4 border-slate-100 border-t-[#033958] rounded-full animate-spin"></div>
          <span class="mt-4 text-xs font-black text-[#033958]  tracking-normal">Syncing...</span>
        </div>
      </div>
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

    <!-- Form Connectivity Gateway (Premium Modal) -->
    <Modal v-model="showLinkModal" title="Gateway Activation" size="md">
      <div v-if="generatedLink" class="p-0 overflow-hidden">
        <!-- Hero Header -->
        <div class="bg-gradient-to-br from-[#033958] to-[#044d77] p-10 text-center relative overflow-hidden">
          <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <Icon name="lucide:zap" class="w-32 h-32 text-white/5 absolute -top-8 -right-8 rotate-12" />
          
          <div class="relative z-10 space-y-4">
            <div class="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-[2rem] border border-white/20 flex items-center justify-center mx-auto shadow-sm border border-slate-200">
              <Icon name="lucide:rocket" class="w-10 h-10 text-white" />
            </div>
            <div>
              <h3 class="text-lg font-black text-white tracking-normal">Form is Live!</h3>
              <p class="text-blue-100/60 text-sm font-bold  tracking-normal">Premium sharing enabled</p>
            </div>
          </div>
        </div>

        <!-- Content Body -->
        <div class="p-10 space-y-10 bg-white">
          <div class="space-y-4">
            <div class="flex items-center justify-between px-1">
              <label class="text-sm font-black  tracking-normal text-slate-400">Your Unique Form URL</label>
              <span class="text-sm font-black text-emerald-500  tracking-normal flex items-center gap-1">
                <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                Publicly Reachable
              </span>
            </div>
            
            <div class="group relative">
              <div class="absolute inset-0 bg-blue-500/5 blur-xl group-hover:bg-blue-500/10 transition-all rounded-3xl"></div>
              <div class="relative flex items-center bg-slate-50 border border-slate-100 rounded-3xl p-2 pl-6 focus-within:border-blue-300 focus-within:bg-white transition-all shadow-inner">
                <span class="text-sm font-bold text-slate-400 select-none mr-2">/</span>
                <input
                  :value="generatedLink.split('/').pop()"
                  readonly
                  class="flex-1 bg-transparent border-none text-sm font-black text-[#033958] focus:ring-0 cursor-default truncate py-4"
                />
                <button
                  @click="copyGeneratedLink"
                  class="px-6 py-4 bg-[#033958] text-white rounded-[1.2rem] font-bold text-xs hover:bg-[#022a41] transition-all active:scale-95 flex items-center gap-2 shadow-sm border border-slate-100"
                >
                  <Icon :name="isCopied ? 'lucide:check' : 'lucide:copy'" class="w-4 h-4" />
                  <span>{{ isCopied ? 'Copied' : 'Copy' }}</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Sharing Strategies -->
          <div class="grid grid-cols-2 gap-4">
            <div class="p-6 bg-slate-50 rounded-3xl border border-slate-100 group hover:border-blue-100 transition-all cursor-pointer">
              <div class="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-blue-600 mb-4 shadow-sm group-hover:scale-110 transition-transform">
                <Icon name="lucide:qr-code" class="w-5 h-5" />
              </div>
              <h4 class="text-xs font-black text-slate-900  mb-1">QR Access</h4>
              <p class="text-sm text-slate-400 font-bold leading-tight">Instant access via mobile scan</p>
            </div>
            <div class="p-6 bg-slate-50 rounded-3xl border border-slate-100 group hover:border-indigo-100 transition-all cursor-pointer">
              <div class="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-indigo-600 mb-4 shadow-sm group-hover:scale-110 transition-transform">
                <Icon name="lucide:share-2" class="w-5 h-5" />
              </div>
              <h4 class="text-xs font-black text-slate-900  mb-1">Social Share</h4>
              <p class="text-sm text-slate-400 font-bold leading-tight">Broaden your campaign reach</p>
            </div>
          </div>

          <!-- Actions -->
          <div class="pt-6 border-t border-slate-50 flex items-center justify-between">
            <button 
              @click="showLinkModal = false"
              class="text-xs font-black  tracking-normal text-slate-400 hover:text-slate-900 transition-colors"
            >
              Back to Dashboard
            </button>
            <a 
              :href="generatedLink" 
              target="_blank"
              class="text-xs font-black  tracking-normal text-[#033958] flex items-center gap-2 hover:gap-3 transition-all"
            >
              View Live Form
              <Icon name="lucide:external-link" class="w-4 h-4" />
            </a>
          </div>
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
      
      await updateForm(selectedForm.value._id, cleanedFormData)
      showToast({
        title: "Form Updated",
        message: "Your changes have been successfully saved.",
        toastType: "success",
      })
    } else {
      const result = await createForm(formData)
      if (result) {
        generatedLink.value = `https://www.medlabconvo.com/forms/submit/${result.slug}`
        showLinkModal.value = true
      }
    }
    await getForms()
    closeModal()
  } catch (error) {
    console.error('Error saving form:', error)
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