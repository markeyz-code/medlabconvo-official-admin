<template>
  <div class="space-y-6">
    <!-- Form Basic Info -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-2">Form Title</label>
        <input
          v-model="form.title"
          type="text"
          required
          class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          placeholder="Enter form title..."
        />
      </div>
      
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-2">Status</label>
        <select
          v-model="form.isActive"
          class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
        >
          <option :value="true">Active</option>
          <option :value="false">Inactive</option>
        </select>
      </div>
    </div>

    <!-- Program Selection -->
    <div>
      <label class="block text-sm font-medium text-slate-700 mb-2">
        Attach to Program (Optional)
      </label>
      <div class="flex items-center space-x-3">
        <select
          v-model="form.programId"
          class="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
        >
          <option :value="null">Standalone Form (No Program)</option>
          <option v-for="program in programs" :key="program._id" :value="program._id">
            {{ program.title }}
          </option>
        </select>
        <button
          v-if="form.programId"
          @click="form.programId = null"
          type="button"
          class="px-3 py-2 text-slate-600 hover:text-slate-800 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          title="Clear program selection"
        >
          <Icon name="heroicons:x-mark" class="w-4 h-4" />
        </button>
      </div>
      <p class="mt-1 text-xs text-slate-500">
        {{ form.programId ? 'This form will be linked to the selected program' : 'This form will be a standalone form' }}
      </p>
    </div>

    <div>
      <label class="block text-sm font-medium text-slate-700 mb-2">Description</label>
      <textarea
        v-model="form.description"
        rows="3"
        class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
        placeholder="Form description..."
      ></textarea>
    </div>

    <div>
      <label class="block text-sm font-medium text-slate-700 mb-2">Instructions (Optional)</label>
      <textarea
        v-model="form.instructions"
        rows="2"
        class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
        placeholder="Instructions for form users..."
      ></textarea>
    </div>

    <!-- Form Fields Builder -->
    <div>
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-slate-800">Form Fields</h3>
        <button
          @click="addField"
          type="button"
          class="px-3 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors flex items-center space-x-2"
        >
          <Icon name="heroicons:plus" class="w-4 h-4" />
          <span>Add Field</span>
        </button>
      </div>

      <div class="space-y-4">
        <div
          v-for="(field, index) in form.fields"
          :key="field.id"
          class="bg-slate-50 rounded-lg p-4 border border-slate-200"
        >
          <div class="flex items-center justify-between mb-4">
            <h4 class="font-medium text-slate-800">Field {{ index + 1 }}</h4>
            <button
              @click="removeField(index)"
              type="button"
              class="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
            >
              <Icon name="heroicons:trash" class="w-4 h-4" />
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Label</label>
              <input
                v-model="field.label"
                type="text"
                required
                class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="Field label..."
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Type</label>
              <select
                v-model="field.type"
                class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                <option value="text">Text</option>
                <option value="email">Email</option>
                <option value="number">Phone</option>
                <option value="textarea">Textarea</option>
                <option value="select">Select</option>
                <option value="radio">Radio</option>
                <option value="checkbox">Checkbox</option>
                <option value="date">Date</option>
                <option value="file">File</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Placeholder</label>
              <input
                v-model="field.placeholder"
                type="text"
                class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="Field placeholder..."
              />
            </div>
            
            <div class="flex items-center space-x-4 pt-6">
              <div class="flex items-center">
                <input
                  v-model="field.required"
                  type="checkbox"
                  class="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-slate-300 rounded"
                />
                <label class="ml-2 block text-sm text-slate-700">Required</label>
              </div>
            </div>
          </div>

          <div class="mt-4">
            <label class="block text-sm font-medium text-slate-700 mb-1">Description/Help Text</label>
            <input
              v-model="field.description"
              type="text"
              class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              placeholder="Help text for this field..."
            />
          </div>

          <!-- Options for select/radio/checkbox -->
          <div v-if="['select', 'radio', 'checkbox'].includes(field.type)" class="mt-4">
            <label class="block text-sm font-medium text-slate-700 mb-2">Options</label>
            <div class="space-y-2">
              <div
                v-for="(option, optionIndex) in field.options"
                :key="optionIndex"
                class="flex items-center space-x-2"
              >
                <input
                  v-model="field.options[optionIndex]"
                  type="text"
                  class="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="Option text..."
                />
                <button
                  @click="removeOption(field, optionIndex)"
                  type="button"
                  class="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                >
                  <Icon name="heroicons:x-mark" class="w-4 h-4" />
                </button>
              </div>
              <button
                @click="addOption(field)"
                type="button"
                class="text-cyan-600 hover:text-cyan-800 text-sm flex items-center space-x-1"
              >
                <Icon name="heroicons:plus" class="w-4 h-4" />
                <span>Add Option</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Message -->
    <div>
      <label class="block text-sm font-medium text-slate-700 mb-2">Success Message (Optional)</label>
      <input
        v-model="form.successMessage"
        type="text"
        class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
        placeholder="Thank you for your submission!"
      />
    </div>

    <!-- Redirect URL -->
    <div>
      <label class="block text-sm font-medium text-slate-700 mb-2">Redirect URL After Submission (Optional)</label>
      <input
        v-model="form.redirectUrl"
        type="url"
        class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
        placeholder="https://example.com/thank-you"
      />
    </div>

    <!-- Form Actions -->
    <div class="flex justify-end space-x-3 pt-6 border-t border-slate-200">
      <button
        type="button"
        @click="$emit('cancel')"
        class="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
      >
        Cancel
      </button>
      <button
        @click="handleSubmit"
        type="button"
        :disabled="!isFormValid"
        :class="[
          'px-4 py-2 rounded-lg transition-all duration-200',
          isFormValid
            ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-700 hover:to-blue-700'
            : 'bg-slate-300 text-slate-500 cursor-not-allowed'
        ]"
      >
        {{ mode === 'edit' ? 'Update' : 'Create' }} Form
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watchEffect, onMounted, computed } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { useGetPrograms } from '@/composables/modules/programs/useGetPrograms'

interface Props {
  form?: any,
  mode?: 'create' | 'edit'
}

const { programs, loadingPrograms, getPrograms } = useGetPrograms()

const props = defineProps<Props>()
const emit = defineEmits(['save', 'cancel'])


const form = reactive({
  title: '',
  description: '',
  instructions: '',
  isActive: true,
  programId: null as string | null,
  fields: [] as any[],
  successMessage: '',
  redirectUrl: ''
})

// Load programs on mount
onMounted(async () => {
  await getPrograms()
})

// Initialize form with data if editing
watchEffect(() => {
  if (props.form) {
    Object.assign(form, {
      title: props.form.title || '',
      description: props.form.description || '',
      instructions: props.form.instructions || '',
      isActive: props.form.isActive ?? true,
      programId: props.form.programId || null,
      fields: props.form.fields || [],
      successMessage: props.form.successMessage || '',
      redirectUrl: props.form.redirectUrl || ''
    })
  } else {
    // Reset form for new form
    Object.assign(form, {
      title: '',
      description: '',
      instructions: '',
      isActive: true,
      programId: null,
      fields: [],
      successMessage: '',
      redirectUrl: ''
    })
  }
})

const isFormValid = computed(() => {
  return form.title.trim() !== '' && form.fields.length > 0
})

const addField = () => {
  form.fields.push({
    id: uuidv4(),
    label: '',
    type: 'text',
    required: false,
    placeholder: '',
    description: '',
    options: []
  })
}

const removeField = (index: number) => {
  form.fields.splice(index, 1)
}

const addOption = (field: any) => {
  if (!field.options) {
    field.options = []
  }
  field.options.push('')
}

const removeOption = (field: any, index: number) => {
  field.options.splice(index, 1)
}

const handleSubmit = () => {
  if (!isFormValid.value) return
  
  // Clean up form data before submitting
  const formData = {
    ...form,
    programId: form.programId || undefined,
    isStandalone: !form.programId
  }
  
  emit('save', formData)
}
</script>