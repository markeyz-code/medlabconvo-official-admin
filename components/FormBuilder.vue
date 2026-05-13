<template>
  <div class="space-y-4 p-1">
    <!-- Form Basic Info -->
    <div class="bg-white/50 backdrop-blur-sm rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4">
      <div class="flex items-center space-x-3 mb-2">
        <div class="w-2 h-8 bg-[#033958] rounded-full"></div>
        <h3 class="text-xl font-bold text-slate-900 tracking-tight">Basic Information</h3>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-4">
          <AnimatedInput
            v-model="form.title"
            id="formTitle"
            label="Form Title (Optional)"
            type="text"
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
        <p class="mt-2 text-xs font-medium text-slate-400 px-1">
          {{ form.programId ? 'Linked to selected program' : 'Standalone form' }}
        </p>
      </div>

      <div class="space-y-4">
        <AnimatedInput
          v-model="form.description"
          id="formDesc"
          label="Description (Optional)"
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
        <label class="block text-sm font-bold text-slate-700 mb-3 ml-1">Form Banner (Optional)</label>
        <div class="p-1 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <ImageUpload v-model="form.bannerImage" />
        </div>
        <p class="mt-2 text-xs text-slate-400 ml-1">
          Displays at the top of your form for a professional look.
        </p>
      </div>
    </div>

    <!-- Form Fields Builder -->
    <div class="pt-4">
      <div class="flex items-center justify-between mb-8 px-2">
        <div>
          <div class="flex items-center space-x-3 mb-1">
            <div class="w-2 h-8 bg-cyan-500 rounded-full"></div>
            <h3 class="text-xl font-bold text-slate-900 tracking-tight">Form Fields</h3>
          </div>
          <p class="text-sm text-slate-500 ml-5">Design the structure of your data collection.</p>
        </div>
        <button
          @click="addField"
          type="button"
          class="px-6 py-3 bg-gradient-to-r from-[#033958] to-[#044d77] text-white rounded-2xl font-bold text-sm shadow-lg shadow-blue-900/20 hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-95 flex items-center space-x-2"
        >
          <Icon name="lucide:plus" class="w-4 h-4" />
          <span>Add Field</span>
        </button>
      </div>

      <div class="space-y-8">
        <TransitionGroup 
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="transform scale-95 opacity-0"
          enter-to-class="transform scale-100 opacity-100"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="transform scale-100 opacity-100"
          leave-to-class="transform scale-95 opacity-0"
        >
            <div
              v-for="(field, index) in form.fields"
              :key="field.id"
              class="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-500 group relative focus-within:z-50"
            >
            <!-- Field Number Badge (Glassmorphism style) -->
            <div class="absolute top-0 right-0 w-32 h-32 bg-slate-50/50 -mr-16 -mt-16 rounded-full group-hover:bg-blue-50/50 transition-colors duration-500"></div>
            
            <div class="flex items-center justify-between mb-4 pb-3 border-b border-slate-50 relative z-10">
              <div class="flex items-center space-x-4">
                <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center text-[#033958] font-black text-lg shadow-inner">
                  {{ index + 1 }}
                </div>
                <div>
                  <h4 class="font-bold text-slate-900">Field Configuration</h4>
                  <p class="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Question {{ index + 1 }}</p>
                </div>
              </div>
              <button
                @click="removeField(index)"
                type="button"
                class="text-slate-300 hover:text-red-500 p-3 rounded-2xl hover:bg-red-50 transition-all duration-300"
                title="Remove field"
              >
                <Icon name="lucide:trash-2" class="w-5 h-5" />
              </button>
            </div>

            <div class="space-y-6 relative z-10">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-0 rounded-2xl border border-slate-100">
                <AnimatedInput
                  v-model="field.label"
                  :id="'field-label-'+index"
                  label="Label (Optional)"
                  type="text"
                  position="top"
                  class="border-r border-slate-50"
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
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-0 rounded-2xl border border-slate-100">
                <AnimatedInput
                  v-model="field.placeholder"
                  :id="'field-placeholder-'+index"
                  label="Placeholder (Optional)"
                  type="text"
                  position="middle"
                  class="border-r border-slate-50"
                />
                <div class="flex items-center px-8 bg-white">
                  <label class="flex items-center group cursor-pointer w-full py-4">
                    <div class="relative flex items-center justify-center w-6 h-6 rounded-lg border-2 border-slate-200 group-hover:border-[#033958] transition-all duration-300 overflow-hidden">
                      <input
                        v-model="field.required"
                        type="checkbox"
                        class="absolute opacity-0 w-full h-full cursor-pointer z-10"
                      />
                      <div 
                        v-if="field.required" 
                        class="w-full h-full bg-gradient-to-br from-[#033958] to-[#044d77] flex items-center justify-center animate-in fade-in zoom-in duration-200"
                      >
                        <Icon name="lucide:check" class="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <span class="ml-4 text-sm font-bold text-slate-600 group-hover:text-[#033958] transition-colors">Required Field</span>
                  </label>
                </div>
              </div>

              <AnimatedInput
                v-model="field.description"
                :id="'field-desc-'+index"
                label="Help Text (Optional)"
                type="text"
                position="bottom"
              />
            </div>

            <!-- Options for select/radio/checkbox -->
            <div v-if="['select', 'radio', 'checkbox'].includes(field.type)" class="mt-4 pt-4 border-t border-slate-50 relative z-10">
              <div class="flex items-center justify-between mb-3 px-2">
                <label class="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Options</label>
                <button
                  @click="addOption(field)"
                  type="button"
                  class="text-[#033958] hover:text-blue-700 text-xs font-black flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-full transition-all hover:scale-105"
                >
                  <Icon name="lucide:plus" class="w-3.5 h-3.5" />
                  <span>ADD OPTION</span>
                </button>
              </div>
              
              <div class="space-y-3">
                <TransitionGroup 
                  enter-active-class="transition duration-200 ease-out"
                  enter-from-class="transform -translate-x-4 opacity-0"
                  enter-to-class="transform translate-x-0 opacity-100"
                >
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
                      class="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                    >
                      <Icon name="lucide:x" class="w-4 h-4" />
                    </button>
                  </div>
                </TransitionGroup>
                
                <div v-if="!field.options || field.options.length === 0" class="text-center py-10 bg-slate-50/50 rounded-[1.5rem] border border-dashed border-slate-200">
                  <Icon name="lucide:list-plus" class="w-8 h-8 text-slate-200 mx-auto mb-2" />
                  <p class="text-xs font-bold text-slate-400">Click "Add Option" to populate this field</p>
                </div>
              </div>
            </div>
          </div>
        </TransitionGroup>
        
        <div v-if="form.fields.length === 0" class="text-center py-20 bg-white/50 backdrop-blur-sm rounded-[2.5rem] border border-dashed border-slate-200">
          <Icon name="lucide:layout" class="w-16 h-16 text-slate-100 mx-auto mb-4" />
          <h4 class="text-lg font-bold text-slate-300">No fields added yet</h4>
          <p class="text-sm text-slate-400 mt-1 max-w-xs mx-auto">Click the "Add Field" button above to start building your form's data structure.</p>
        </div>
      </div>
    </div>

    <!-- Post-submission Config -->
    <div class="bg-gradient-to-br from-white to-slate-50 rounded-[2rem] p-6 border border-slate-100 shadow-sm space-y-4">
      <div class="flex items-center space-x-3 mb-2">
        <div class="w-2 h-8 bg-emerald-500 rounded-full"></div>
        <h3 class="text-xl font-bold text-slate-900 tracking-tight">Success & Redirection</h3>
      </div>
      
      <div class="space-y-4">
        <AnimatedInput
          v-model="form.successMessage"
          id="formSuccessMsg"
          label="Custom Success Message (Optional)"
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
    </div>

    <!-- Form Actions -->
    <div class="flex items-center justify-between pt-6 border-t border-slate-200 sticky bottom-0 bg-white/80 backdrop-blur-md pb-2 px-2 z-[60]">
      <div class="flex flex-col">
        <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Status</span>
        <div class="flex items-center space-x-2">
          <div :class="['w-2 h-2 rounded-full animate-pulse', form.isActive ? 'bg-green-500' : 'bg-slate-300']"></div>
          <span class="text-sm font-bold text-slate-700">{{ form.isActive ? 'Active & Accepting Submissions' : 'Inactive / Draft' }}</span>
        </div>
      </div>
      
      <div class="flex space-x-4">
        <button
          type="button"
          @click="$emit('cancel')"
          class="px-8 py-3 border-2 border-slate-200 text-slate-600 rounded-2xl font-bold text-sm hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95"
        >
          Discard Changes
        </button>
        <button
          @click="handleSubmit"
          type="button"
          class="px-10 py-3 bg-gradient-to-r from-cyan-600 to-blue-700 text-white rounded-2xl font-bold text-sm shadow-xl shadow-blue-900/20 hover:shadow-2xl hover:-translate-y-1 transition-all active:scale-95 flex items-center space-x-3"
        >
          <Icon :name="mode === 'edit' ? 'lucide:save' : 'lucide:check-circle'" class="w-4 h-4" />
          <span>{{ mode === 'edit' ? 'Update' : 'Create' }} Professional Form</span>
        </button>
      </div>
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

// All fields are optional now as per aggressive request
const isFormValid = computed(() => true)

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
  // Clean up form data before submitting
  const formData = {
    ...form,
    programId: form.programId || undefined,
    isStandalone: !form.programId
  }
  
  emit('save', formData)
}
</script>

<style scoped>
.animate-in {
  animation: animate-in 0.2s ease-out;
}

@keyframes animate-in {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>