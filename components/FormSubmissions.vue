<template>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-semibold text-slate-800">{{ form.title }} - Submissions</h3>
          <p class="text-sm text-slate-600">Total submissions: {{ submissions.length }}</p>
        </div>
        <button
          @click="exportSubmissions"
          class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
        >
          <Icon name="lucide:download" class="w-4 h-4" />
          <span>Export CSV</span>
        </button>
      </div>
  
      <!-- Submissions Table -->
      <div class="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-slate-50 border-b border-slate-200">
              <tr>
                <th class="px-4 py-3 text-left text-sm font-medium text-slate-500 ">Date</th>
                <th class="px-4 py-3 text-left text-sm font-medium text-slate-500 ">Email</th>
                <th
                  v-for="field in form.fields"
                  :key="field.id"
                  class="px-4 py-3 text-left text-sm font-medium text-slate-500 "
                >
                  {{ field.label }}
                </th>
                <th class="px-4 py-3 text-right text-sm font-medium text-slate-500 ">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200">
              <tr v-for="submission in submissions" :key="submission._id" class="hover:bg-slate-50">
                <td class="px-4 py-3 text-sm text-slate-600">
                  {{ formatDate(submission.createdAt) }}
                </td>
                <td class="px-4 py-3 text-sm text-slate-900">
                  {{ submission.submitterEmail || 'Anonymous' }}
                </td>
                <td
                  v-for="field in form.fields"
                  :key="field.id"
                  class="px-4 py-3 text-sm text-slate-600"
                >
                  {{ getFieldValue(submission, field.id) }}
                </td>
                <td class="px-4 py-3 text-right">
                  <button
                    @click="viewSubmission(submission)"
                    class="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                  >
                    <Icon name="lucide:eye" class="w-4 h-4" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
  
        <!-- Empty State -->
        <div v-if="submissions.length === 0" class="text-center py-12">
          <Icon name="lucide:file-text" class="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <p class="text-slate-500">No submissions yet</p>
        </div>
      </div>
  
      <!-- Submission Detail Modal -->
      <Modal v-model="showDetailModal" title="Submission Details" size="lg">
        <div v-if="selectedSubmission" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Submitted</label>
              <p class="text-slate-900">{{ formatDate(selectedSubmission.createdAt) }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <p class="text-slate-900">{{ selectedSubmission.submitterEmail || 'Anonymous' }}</p>
            </div>
          </div>
          
          <div class="space-y-4">
            <div
              v-for="response in selectedSubmission.responses"
              :key="response.fieldId"
            >
              <label class="block text-sm font-medium text-slate-700 mb-1">{{ response.fieldLabel }}</label>
              <p class="text-slate-900 bg-slate-50 p-3 rounded-lg">{{ response.value }}</p>
            </div>
          </div>
          
          <div class="flex justify-end pt-4 border-t border-slate-200">
            <button
              @click="closeDetailModal"
              class="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useGetFormSubmissions } from '@/composables/modules/forms/useGetFormSubmissions'
  
  interface Props {
    form: any
  }
  
  const props = defineProps<Props>()
  const emit = defineEmits(['close'])
  
  // Composables
  const { submissions, getFormSubmissions } = useGetFormSubmissions()
  
  // Reactive data
  const showDetailModal = ref(false)
  const selectedSubmission = ref(null)
  
  // Load submissions on mount
  onMounted(() => {
    getFormSubmissions(props.form._id)
  })
  
  // Methods
  const getFieldValue = (submission: any, fieldId: string) => {
    const response = submission.responses?.find((r: any) => r.fieldId === fieldId)
    return response?.value || '-'
  }
  
  const viewSubmission = (submission: any) => {
    selectedSubmission.value = submission
    showDetailModal.value = true
  }
  
  const closeDetailModal = () => {
    showDetailModal.value = false
    selectedSubmission.value = null
  }
  
  const exportSubmissions = () => {
    const headers = ['Date', 'Email', ...props.form.fields.map((f: any) => f.label)]
    const rows = submissions.value.map(submission => [
      formatDate(submission.createdAt),
      submission.submitterEmail || 'Anonymous',
      ...props.form.fields.map((field: any) => getFieldValue(submission, field.id))
    ])
  
    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n')
  
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${props.form.title}-submissions.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }
  
  const formatDate = (date: string) => {
    return new Date(date).toLocaleString()
  }
  </script>
  