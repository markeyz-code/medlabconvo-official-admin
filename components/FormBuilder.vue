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
         
        />
      </div>
      
      <div>
        <SelectInput
          v-model="form.isActive"
          label="Status"
          :options="[
            { label: 'Active', value: true },
            { label: 'Inactive', value: false }
          ]"
        />
      </div>
    </div>

    <!-- Program Selection -->
    <div>
      <div class="flex items-center space-x-3">
        <div class="flex-1">
          <SelectInput
            v-model="form.programId"
            label="Attach to Program (Optional)"
            :options="[{ label: 'Standalone Form (No Program)', value: '' }].concat(programs.map(p => ({ label: p.title, value: p._id })))"
          />
        </div>
        <button
          v-if="form.programId"
          @click="form.programId = null"
          type="button"
          class="px-3 py-2 text-slate-600 hover:text-slate-800 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          title="Clear program selection"
        >
          <Icon name="lucide:x" class="w-4 h-4" />
        </button>
      </div>
      <p class="mt-1 text-sm text-slate-500">
        {{ form.programId ? 'This form will be linked to the selected program' : 'This form will be a standalone form' }}
      </p>
    </div>

    <div>
      <label class="block text-sm font-medium text-slate-700 mb-2">Description</label>
      <textarea
        v-model="form.description"
        rows="3"
        class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
       
      ></textarea>
    </div>

    <div>
      <label class="block text-sm font-medium text-slate-700 mb-2">Instructions (Optional)</label>
      <textarea
        v-model="form.instructions"
        rows="2"
        class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
       
      ></textarea>
    </div>

    <!-- Banner Image Upload -->
    <div class="col-span-full">
      <label class="block text-sm font-medium text-slate-700 mb-2">Form Banner (Optional)</label>
      <ImageUpload v-model="form.bannerImage" />
      <p class="mt-1 text-sm text-slate-500">
        Upload a promotional banner or poster to be displayed beautifully at the top of the form.
      </p>
    </div>

    <!-- Form Fields Builder -->
    <div>
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-slate-800">Form Fields</h3>
        <button
          @click="addField"
          type="button"
          class="px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors flex items-center space-x-2"
        >
          <Icon name="lucide:plus" class="w-4 h-4" />
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
              <Icon name="lucide:trash-2" class="w-4 h-4" />
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
               
              />
            </div>
            
            <div>
              <SelectInput
                v-model="field.type"
                label="Type"
                :options="[
                  { label: 'Text', value: 'text' },
                  { label: 'Email', value: 'email' },
                  { label: 'Phone', value: 'number' },
                  { label: 'Textarea', value: 'textarea' },
                  { label: 'Select', value: 'select' },
                  { label: 'Radio', value: 'radio' },
                  { label: 'Checkbox', value: 'checkbox' },
                  { label: 'Date', value: 'date' },
                  { label: 'File', value: 'file' }
                ]"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Placeholder</label>
              <input
                v-model="field.placeholder"
                type="text"
                class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
               
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
                 
                />
                <button
                  @click="removeOption(field, optionIndex)"
                  type="button"
                  class="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                >
                  <Icon name="lucide:x" class="w-4 h-4" />
                </button>
              </div>
              <button
                @click="addOption(field)"
                type="button"
                class="text-cyan-600 hover:text-cyan-800 text-sm flex items-center space-x-1"
              >
                <Icon name="lucide:plus" class="w-4 h-4" />
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
       
      />
    </div>

    <!-- Redirect URL -->
    <div>
      <label class="block text-sm font-medium text-slate-700 mb-2">Redirect URL After Submission (Optional)</label>
      <input
        v-model="form.redirectUrl"
        type="url"
        class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
       
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
import ImageUpload from '@/components/ImageUpload.vue'

interface Props {
  form?: any,
  mode?: 'create' | 'edit'
}

const { programs, loadingPrograms, getPrograms } = useGetPrograms()

const props = defineProps<Props>()
const emit = defineEmits(['save', 'cancel'])


const form = reactive({
  title: '',
  bannerImage: '',
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
      bannerImage: props.form.bannerImage || '',
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
      bannerImage: '',
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