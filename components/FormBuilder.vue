<template>
  <div class="space-y-6">
    <!-- Form Basic Info -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="space-y-4">
        <AnimatedInput
          v-model="form.title"
          id="formTitle"
          label="Form Title"
          type="text"
          required
          position="top"
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
          position="top"
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
          class="px-3 py-2 text-slate-600 hover:text-slate-800 border-[0.5px] border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          title="Clear program selection"
        >
          <Icon name="lucide:x" class="w-4 h-4" />
        </button>
      </div>
      <p class="mt-1 text-sm text-slate-500">
        {{ form.programId ? 'This form will be linked to the selected program' : 'This form will be a standalone form' }}
      </p>
    </div>

    <div class="space-y-4">
      <AnimatedInput
        v-model="form.description"
        id="formDesc"
        label="Description"
        type="textarea"
        :rows="3"
        position="top"
      />
      <AnimatedInput
        v-model="form.instructions"
        id="formInstr"
        label="Instructions (Optional)"
        type="textarea"
        :rows="2"
        position="bottom"
      />
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
    <div class="pt-8 border-t border-slate-100">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h3 class="text-xl font-bold text-slate-900 tracking-tight">Form Fields</h3>
          <p class="text-sm text-slate-500 mt-1">Design the data structure for this form.</p>
        </div>
        <button
          @click="addField"
          type="button"
          class="px-6 py-3 bg-[#033958] text-white rounded-xl font-bold text-sm hover:bg-[#022f42] transition-all active:scale-95 flex items-center space-x-2"
        >
          <Icon name="lucide:plus" class="w-4 h-4" />
          <span>Add Field</span>
        </button>
      </div>

      <div class="space-y-6">
        <div
          v-for="(field, index) in form.fields"
          :key="field.id"
          class="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 group relative"
        >
          <div class="flex items-center justify-between mb-8 pb-4 border-b border-slate-50">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-[#033958] font-bold text-sm">
                {{ index + 1 }}
              </div>
              <h4 class="font-bold text-slate-900">Field Configuration</h4>
            </div>
            <button
              @click="removeField(index)"
              type="button"
              class="text-slate-300 hover:text-red-500 p-2 rounded-xl hover:bg-red-50 transition-all"
              title="Remove field"
            >
              <Icon name="lucide:trash-2" class="w-5 h-5" />
            </button>
          </div>

          <div class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-0">
              <AnimatedInput
                v-model="field.label"
                :id="'field-label-'+index"
                label="Label"
                type="text"
                required
                position="top"
              />
              <SelectInput
                v-model="field.type"
                label="Field Type"
                :options="[
                  { label: 'Text', value: 'text' },
                  { label: 'Email', value: 'email' },
                  { label: 'Number', value: 'number' },
                  { label: 'Textarea', value: 'textarea' },
                  { label: 'Select', value: 'select' },
                  { label: 'Radio', value: 'radio' },
                  { label: 'Checkbox', value: 'checkbox' },
                  { label: 'Date', value: 'date' },
                  { label: 'File', value: 'file' }
                ]"
                position="top"
              />
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-0">
              <AnimatedInput
                v-model="field.placeholder"
                :id="'field-placeholder-'+index"
                label="Placeholder"
                type="text"
                position="middle"
              />
              <div class="flex items-center px-6 bg-white border-l border-slate-50">
                <label class="flex items-center group cursor-pointer">
                  <div class="relative flex items-center justify-center w-5 h-5 rounded border-2 border-slate-300 group-hover:border-[#033958] transition-colors">
                    <input
                      v-model="field.required"
                      type="checkbox"
                      class="absolute opacity-0 w-full h-full cursor-pointer z-10"
                    />
                    <div v-if="field.required" class="w-2.5 h-2.5 bg-[#033958] rounded-sm"></div>
                  </div>
                  <span class="ml-3 text-sm font-bold text-slate-700 group-hover:text-[#033958] transition-colors">Mark as required</span>
                </label>
              </div>
            </div>

            <AnimatedInput
              v-model="field.description"
              :id="'field-desc-'+index"
              label="Description / Help Text"
              type="text"
              position="bottom"
            />
          </div>

          <!-- Options for select/radio/checkbox -->
          <div v-if="['select', 'radio', 'checkbox'].includes(field.type)" class="mt-8 pt-6 border-t border-slate-50">
            <div class="flex items-center justify-between mb-4">
              <label class="text-sm font-bold text-slate-400 uppercase tracking-widest px-1">Options</label>
              <button
                @click="addOption(field)"
                type="button"
                class="text-[#033958] hover:text-[#022f42] text-sm font-bold flex items-center space-x-1"
              >
                <Icon name="lucide:plus" class="w-3.5 h-3.5" />
                <span>Add Option</span>
              </button>
            </div>
            <div class="space-y-3">
              <div
                v-for="(option, optionIndex) in field.options"
                :key="optionIndex"
                class="flex items-center space-x-3 group/opt"
              >
                <div class="flex-1">
                  <AnimatedInput
                    v-model="field.options[optionIndex]"
                    :id="'field-'+index+'-opt-'+optionIndex"
                    :label="'Option ' + (optionIndex + 1)"
                    type="text"
                  />
                </div>
                <button
                  @click="removeOption(field, optionIndex)"
                  type="button"
                  class="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                >
                  <Icon name="lucide:x" class="w-4 h-4" />
                </button>
              </div>
              <div v-if="!field.options || field.options.length === 0" class="text-center py-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <p class="text-sm text-slate-400">No options added yet. Click "Add Option" to start.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Post-submission Config -->
    <div class="space-y-4 pt-8 border-t border-slate-100">
      <AnimatedInput
        v-model="form.successMessage"
        id="formSuccessMsg"
        label="Success Message (Optional)"
        type="text"
        position="top"
      />
      <AnimatedInput
        v-model="form.redirectUrl"
        id="formRedirectUrl"
        label="Redirect URL After Submission (Optional)"
        type="url"
        position="bottom"
      />
    </div>

    <!-- Form Actions -->
    <div class="flex justify-end space-x-3 pt-6 border-t border-slate-200">
      <button
        type="button"
        @click="$emit('cancel')"
        class="px-4 py-2 border-[0.5px] border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
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
import AnimatedInput from '@/components/ui/AnimatedInput.vue'
import SelectInput from '@/components/ui/SelectInput.vue'
import Icon from '@/components/Icon.vue'

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