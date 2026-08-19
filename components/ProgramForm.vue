<template>
  <div class="animate-in slide-in-from-right duration-500 p-4">
    <!-- {{ program }} -->
    <!-- Step Indicator -->
    <div class="mb-6">

      <div class="flex items-center justify-between px-2">
        <div
          v-for="(step, index) in steps"
          :key="index"
          class="flex flex-col items-center relative flex-1"
        >
          <!-- Line -->
          <div 
            v-if="index < steps.length - 1"
            class="absolute top-4 left-1/2 w-full h-[1px] bg-slate-100 -z-10"
          >
            <div 
              class="h-full bg-[#033958] transition-all duration-500"
              :style="{ width: currentStep > index ? '100%' : '0%' }"
            ></div>
          </div>

          <div
            @click="currentStep = index <= maxStepReached ? index : currentStep"
            :class="[
              'w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 cursor-pointer',
              currentStep === index 
                ? 'bg-[#033958] text-white ring-4 ring-[#033958]/10' 
                : currentStep > index 
                ? 'bg-green-500 text-white' 
                : 'bg-slate-50 text-slate-400 border border-slate-100 hover:bg-slate-100'
            ]"
          >
            <Icon v-if="currentStep > index" name="lucide:check" class="w-5 h-5" />
            <span v-else>{{ index + 1 }}</span>
          </div>
          <span
            :class="[
              'mt-3 text-sm font-bold transition-colors duration-500',
              currentStep >= index ? 'text-[#033958]' : 'text-slate-300'
            ]"
          >
            {{ step.title }}
          </span>
        </div>
      </div>
    </div>

    <!-- Step Content -->
    <form @submit.prevent="handleSubmit" class="space-y-8">
      <!-- Step 1: Basic Information -->
      <div v-if="steps[currentStep]?.id === 'core'" class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <header class="mb-8">
          <h3 class="text-xl font-bold text-slate-900 mb-1">Basic details</h3>
          <p class="text-sm text-slate-500">Enter the core information for this program.</p>
        </header>

        <div class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-0">
            <AnimatedInput
              v-model="form.title"
              id="programTitle"
              label="Program title"
              type="text"
              position="middle"
            />
            <AnimatedInput
              v-model="form.position"
              id="programPosition"
              label="Display Order (lower = higher priority)"
              type="number"
              position="middle"
            />
          </div>
          <AnimatedInput
            v-model="form.slug"
            id="programSlug"
            label="Custom URL Slug (e.g. mastery-course)"
            type="text"
            position="middle"
          />
          <div class="grid grid-cols-1 md:grid-cols-2 gap-0">
            <SelectInput
              v-model="form.category"
              label="Category"
              :options="categoryOptions"
              position="middle"
            />
            <AnimatedInput
              v-model="form.duration"
              id="programDuration"
              label="Duration (e.g. 12 weeks)"
              type="text"
              position="middle"
            />
          </div>
          <AnimatedInput
            v-model="form.description"
            id="programDesc"
            label="Description"
            type="textarea"
            :rows="6"
            position="bottom"
          />
        </div>

        <section class="pt-6 border-t border-slate-50">
          <h4 class="text-sm font-bold text-slate-400 mb-4 px-1">Registration settings</h4>
          <div class="space-y-4">
            <SelectInput
              v-model="form.formId"
              label="Connect internal form (optional)"
              :options="formOptions"
            />
            <AnimatedInput
              v-model="form.externalFormLink"
              id="programExtLink"
              label="External registration link"
              type="url"
            />
          </div>
        </section>

        <section class="pt-6 border-t border-slate-50">
          <div class="flex items-center justify-between mb-4 px-1">
            <div>
              <h4 class="text-sm font-bold text-slate-900">Automated Welcome Email</h4>
              <p class="text-xs text-slate-500">Send an automated email to applicants upon registration.</p>
            </div>
            <CustomToggle v-model="form.sendAutomatedEmail" />
          </div>
          
          <div v-if="form.sendAutomatedEmail" class="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
            <div class="bg-blue-50/50 rounded-2xl p-4 border border-blue-100 flex gap-3">
              <Icon name="lucide:info" class="w-5 h-5 text-blue-500 shrink-0" />
              <p class="text-xs text-blue-700 leading-relaxed">
                This email will be wrapped in the standard MedLabConvo branded template. You can use the editor below to customize the content, add images, and format the text.
              </p>
            </div>
            <TiptapEditor 
              v-model="form.automatedEmailContent" 

            />
          </div>
        </section>
      </div>

      <!-- Step 2: Curriculum & Focus -->
      <div v-if="steps[currentStep]?.id === 'curriculum'" class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <header class="mb-8">
          <h3 class="text-xl font-bold text-slate-900 mb-1">Curriculum design</h3>
          <p class="text-sm text-slate-500">Detail the focus and outcomes of this program.</p>
        </header>

        <!-- Focus Areas -->
        <section>
          <div class="flex items-center justify-between mb-4">
            <h4 class="text-sm font-bold text-slate-400 px-1">Specific focus areas</h4>
            <button @click="addFocusArea" type="button" class="text-[#033958] text-sm font-bold hover:underline">Add area</button>
          </div>
          <div class="space-y-3">
            <div
              v-for="(area, index) in form.focusAreas"
              :key="index"
              class="flex items-center group"
            >
              <div class="flex-1">
                <AnimatedInput
                  v-model="form.focusAreas[index]"
                  :id="'area-'+index"
                  label="Area title"
                />
              </div>
              <button
                v-if="form.focusAreas.length > 1"
                @click="removeFocusArea(index)"
                type="button"
                class="ml-2 p-3 text-slate-300 hover:text-red-500 transition-colors"
              >
                <Icon name="lucide:trash-2" class="w-5 h-5" />
              </button>
            </div>
          </div>
        </section>

        <!-- Outcomes -->
        <section>
          <div class="flex items-center justify-between mb-4">
            <h4 class="text-sm font-bold text-slate-400 px-1">Learning outcomes</h4>
            <button @click="addOutcome" type="button" class="text-[#033958] text-sm font-bold hover:underline">Add outcome</button>
          </div>
          <div class="space-y-3">
            <div
              v-for="(outcome, index) in form.outcomes"
              :key="index"
              class="flex items-center group"
            >
              <div class="flex-1">
                <AnimatedInput
                  v-model="form.outcomes[index]"
                  :id="'outcome-'+index"
                  label="Outcome description"
                />
              </div>
              <button
                v-if="form.outcomes.length > 1"
                @click="removeOutcome(index)"
                type="button"
                class="ml-2 p-3 text-slate-300 hover:text-red-500 transition-colors"
              >
                <Icon name="lucide:trash-2" class="w-5 h-5" />
              </button>
            </div>
          </div>
        </section>

        <!-- Key Responsibilities -->
        <section>
          <div class="flex items-center justify-between mb-4">
            <h4 class="text-sm font-bold text-slate-400 px-1">Program Schedule</h4>
            <button @click="addResponsibility" type="button" class="text-[#033958] text-sm font-bold hover:underline">Add schedule</button>
          </div>
          <div class="space-y-3">
            <div
              v-for="(responsibility, index) in form.keyResponsibilities"
              :key="index"
              class="flex items-center group"
            >
              <div class="flex-1">
                <AnimatedInput
                  v-model="form.keyResponsibilities[index]"
                  :id="'resp-'+index"
                  label="Schedule"
                />
              </div>
              <button
                v-if="form.keyResponsibilities.length > 1"
                @click="removeResponsibility(index)"
                type="button"
                class="ml-2 p-3 text-slate-300 hover:text-red-500 transition-colors"
              >
                <Icon name="lucide:trash-2" class="w-5 h-5" />
              </button>
            </div>
          </div>
        </section>
      </div>

      <!-- Step 3: Visual Assets & Highlights -->
      <div v-if="steps[currentStep]?.id === 'media'" class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <header class="mb-8">
          <h3 class="text-xl font-bold text-slate-900 mb-1">Visual assets</h3>
          <p class="text-sm text-slate-500">Upload media and add key highlights for this program.</p>
        </header>

        <section class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 class="text-sm font-bold text-slate-400 mb-4 px-1">Cover image</h4>
            <ImageUpload
              v-model="form.image"
              :multiple="false"
              folder="programs"
              class="rounded-3xl border border-slate-100"
            />
          </div>
          <div>
            <h4 class="text-sm font-bold text-slate-400 mb-4 px-1">Additional images (optional)</h4>
            <ImageUpload
              v-model="form.images"
              :multiple="true"
              folder="programs"
              class="rounded-3xl border border-slate-100"
            />
          </div>
        </section>

        <!-- Highlights -->
        <section>
          <div class="flex items-center justify-between mb-6">
            <h4 class="text-sm font-bold text-slate-400 px-1">Program highlights</h4>
            <button @click="addHighlight" type="button" class="text-[#033958] text-sm font-bold hover:underline">Add highlight</button>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                v-for="(highlight, index) in form.highlights"
                :key="index"
                class="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-4 relative group focus-within:z-20"
              >
              <button
                v-if="form.highlights.length > 1"
                @click="removeHighlight(index)"
                type="button"
                class="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 transition-colors"
              >
                <Icon name="lucide:trash-2" class="w-4 h-4" />
              </button>
              
              <AnimatedInput
                v-model="highlight.title"
                label="Highlight title"

                position="top"
              />
              <AnimatedInput
                v-model="highlight.description"
                type="textarea"
                :rows="2"
                label="Short description"
                position="bottom"
              />
            </div>
          </div>
        </section>
      </div>
      
      <!-- Step 4: Speakers & Faculty -->
      <div v-if="steps[currentStep]?.id === 'faculty'" class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <header class="mb-8">
          <h3 class="text-xl font-bold text-slate-900 mb-1">Scientific speakers & mentors</h3>
           <!-- {{ form.speakers }} -->
          <p class="text-sm text-slate-500">Add experts and speakers for this program. You can add bios and avatars now or later.</p>
        </header>

        <section class="space-y-6">
          <div v-for="(speaker, index) in form.speakers" :key="index" class="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 relative group focus-within:z-20">
            <button
              @click="removeSpeaker(index)"
              type="button"
              class="absolute top-6 right-6 p-2 text-slate-300 hover:text-red-500 transition-colors"
            >
              <Icon name="lucide:trash-2" class="w-5 h-5" />
            </button>

            <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              <!-- Speaker Image -->
              <div class="md:col-span-4 space-y-4">
                <label class="text-sm font-black uppercase tracking-widest text-slate-400 px-1">Avatar</label>
                <div class="relative w-32 h-32 mx-auto md:mx-0">
                <!-- {{ speaker.image }} -->
                  <ImageUpload
                    v-model="speaker.image"
                    :multiple="false"
                    folder="speakers"
                    class="rounded-full w-32 h-32 border-4 border-white shadow-xl overflow-hidden mx-auto md:mx-0"
                  />
                </div>
              </div>

              <!-- Speaker Info -->
              <div class="md:col-span-8 space-y-6">
                <AnimatedInput
                  v-model="speaker.name"
                  :id="'speaker-name-'+index"
                  label="Speaker name"

                  position="top"
                />
                <AnimatedInput
                  v-model="speaker.bio"
                  :id="'speaker-bio-'+index"
                  type="textarea"
                  :rows="3"
                  label="Short biography"

                  position="bottom"
                />
              </div>
            </div>
          </div>

          <button
            @click="addSpeaker"
            type="button"
            class="w-full py-6 bg-white border-2 border-dashed border-slate-100 rounded-[2rem] text-slate-400 font-bold text-sm hover:border-slate-200 hover:bg-slate-50 transition-all flex items-center justify-center space-x-3"
          >
            <Icon name="lucide:plus-circle" class="w-6 h-6" />
            <span>Add expert speaker</span>
          </button>
        </section>
      </div>

        <!-- Step 5: Registration Form Builder -->
        <div v-if="steps[currentStep]?.id === 'registration'" class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <header class="mb-8">
            <h3 class="text-xl font-bold text-slate-900 mb-1">Registration Builder</h3>
            <p class="text-sm text-slate-500">Define custom fields for this program's application form.</p>
          </header>

          <div class="space-y-4">
            <div class="flex items-center justify-between mb-4">
              <h4 class="text-sm font-bold text-slate-400 uppercase tracking-widest px-1">Custom Fields</h4>
              <button
                @click="addFormField"
                type="button"
                class="px-6 py-3 bg-[#033958] text-white rounded-xl font-bold text-sm hover:bg-[#022f42] transition-all active:scale-95 flex items-center space-x-2"
              >
                <Icon name="lucide:plus" class="w-4 h-4" />
                <span>Add Field</span>
              </button>
            </div>

            <div class="space-y-6">
              <div
                v-for="(field, index) in form.formFields"
                :key="index"
                class="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 group relative focus-within:z-30"
              >
                <div class="flex items-center justify-between mb-4 pb-3 border-b border-slate-50">
                  <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-[#033958] font-bold text-sm">
                      {{ index + 1 }}
                    </div>
                    <h4 class="font-bold text-slate-900">Field Configuration</h4>
                  </div>
                  <button
                    @click="removeFormField(index)"
                    type="button"
                    class="text-slate-300 hover:text-red-500 p-2 rounded-xl hover:bg-red-50 transition-all"
                  >
                    <Icon name="lucide:trash-2" class="w-5 h-5" />
                  </button>
                </div>

                <div class="space-y-4">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-0">
                    <AnimatedInput
                      v-model="field.label"
                      :id="'prog-field-label-'+index"
                      label="Label"
                      type="text"
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
                      :id="'prog-field-placeholder-'+index"
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

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-0">
                    <AnimatedInput
                      v-model="field.description"
                      :id="'prog-field-desc-'+index"
                      label="Description / Help Text"
                      type="text"
                      position="middle"
                      class="border-r border-slate-50"
                    />
                    <div v-if="['select', 'radio', 'checkbox'].includes(field.type)" class="flex items-center px-6 bg-white">
                      <label class="flex items-center group cursor-pointer">
                        <div class="relative flex items-center justify-center w-5 h-5 rounded border-2 border-slate-300 group-hover:border-[#033958] transition-colors">
                          <input
                            v-model="field.allowOther"
                            type="checkbox"
                            class="absolute opacity-0 w-full h-full cursor-pointer z-10"
                          />
                          <div v-if="field.allowOther" class="w-2.5 h-2.5 bg-[#033958] rounded-sm"></div>
                        </div>
                        <span class="ml-3 text-sm font-bold text-slate-700 group-hover:text-[#033958] transition-colors">Allow "Other"</span>
                      </label>
                    </div>
                  </div>
                </div>

                <!-- Options for select/radio/checkbox -->
                <div v-if="['select', 'radio', 'checkbox'].includes(field.type)" class="mt-8 pt-6 border-t border-slate-50">
                  <div class="flex items-center justify-between mb-4">
                    <label class="text-sm font-bold text-slate-400 uppercase tracking-widest px-1">Options</label>
                    <button
                      @click="addFormFieldOption(field)"
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
                          :id="'prog-field-'+index+'-opt-'+optionIndex"
                          :label="'Option ' + (optionIndex + 1)"
                          type="text"
                        />
                      </div>
                      <button
                        @click="removeFormFieldOption(field, optionIndex)"
                        type="button"
                        class="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <Icon name="lucide:x" class="w-4 h-4" />
                      </button>
                    </div>
                    <div v-if="!field.options || field.options.length === 0" class="text-center py-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                      <p class="text-sm text-slate-400">No options added yet.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="form.formFields.length === 0" class="text-center py-16 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-100">
                <Icon name="lucide:clipboard-list" class="w-12 h-12 text-slate-200 mx-auto mb-4" />
                <p class="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No custom fields defined</p>
                <p class="text-xs text-slate-400 mt-1">Add fields to collect specific data from applicants.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 6: Final Review -->
        <div v-if="steps[currentStep]?.id === 'review'" class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <header class="mb-8 text-center">
          <h3 class="text-xl font-bold text-slate-900 mb-1">Review program</h3>
          <p class="text-sm text-slate-500">Double check your program settings before publishing.</p>
        </header>
        <div class="bg-[#1A1A1B09] rounded-3xl p-8 border border-slate-100 space-y-6">
          <div class="grid grid-cols-2 gap-8">
            <div>
              <span class="text-sm font-bold text-slate-400">Title</span>
              <p class="text-sm font-bold text-slate-900 mt-1">{{ form.title }}</p>
            </div>
            <div>
              <span class="text-sm font-bold text-slate-400">Category</span>
              <p class="text-sm font-bold text-slate-900 mt-1">{{ form.category }}</p>
            </div>
            <div>
              <span class="text-sm font-bold text-slate-400">Duration</span>
              <p class="text-sm font-bold text-slate-900 mt-1">{{ form.duration }}</p>
            </div>
            <div>
              <span class="text-sm font-bold text-slate-400">Components</span>
              <p class="text-sm font-bold text-slate-900 mt-1">
                {{ form.focusAreas.filter(a => a).length }} areas · 
                {{ form.outcomes.filter(o => o).length }} outcomes
              </p>
            </div>
          </div>
          
          <div class="pt-6 border-t border-slate-100">
            <SelectInput
              v-model="form.status"
              label="Visibility"
              :options="[
                { label: 'Draft (hidden)', value: 'draft' },
                { label: 'Active (public)', value: 'active' }
              ]"
            />
          </div>
        </div>
      </div>

      <!-- Footer Navigation -->
      <div class="flex items-center justify-between pt-8 border-t border-slate-100">
        <button
          v-if="currentStep > 0"
          @click="previousStep"
          type="button"
          class="px-8 py-3 text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors inline-flex items-center space-x-2"
        >
          <Icon name="lucide:arrow-left" class="w-4 h-4" />
          <span>Previous</span>
        </button>
        <div v-else></div>

        <div class="flex justify-end space-x-6">
          <button
            type="button"
            @click="$emit('cancel')"
            class="text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors"
          >
            Discard
          </button>
          
          <button
            v-if="currentStep < steps.length - 1"
            type="button"
            @click="nextStep"
            class="px-10 py-4 bg-[#033958] text-white rounded-2xl font-bold text-sm hover:bg-[#022f42] transition-all active:scale-95 flex items-center space-x-3"
          >
            <span>Continue</span>
            <Icon name="lucide:arrow-right" class="w-4 h-4" />
          </button>
          
          <button
            v-else
            type="submit"
            :disabled="isSubmitting"
            class="px-10 py-4 bg-[#033958] text-white rounded-2xl font-bold text-sm hover:bg-[#022f42] transition-all active:scale-95 flex items-center space-x-3"
          >
            <div v-if="isSubmitting" class="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white"></div>
            <span>{{ program ? 'Update Program' : 'Publish Program' }}</span>
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watchEffect, computed } from 'vue'
import { useCustomToast } from '@/composables/core/useCustomToast'
import AnimatedInput from '@/components/ui/AnimatedInput.vue'
import SelectInput from '@/components/ui/SelectInput.vue'
import CustomToggle from '@/components/ui/CustomToggle.vue'
import TiptapEditor from '@/components/ui/TiptapEditor.vue'
import { useGetForms } from '@/composables/modules/forms/useGetForms'
import ImageUpload from '@/components/ImageUpload.vue'
import Icon from '@/components/Icon.vue'

interface Props {
  program?: any
}

const props = defineProps<Props>()
// const emit = defineEmits(['save', 'cancel'])
const emit = defineEmits<{
  (e: 'save', form: any, done: () => void): void
  (e: 'cancel'): void
}>()

const currentStep = ref(0)
const maxStepReached = ref(0)
const isSubmitting = ref(false)

const hasAttachedForm = computed(() => !!form.formId || !!form.externalFormLink)

const steps = computed(() => {
  const allSteps = [
    { title: 'Core info', description: 'Basic details', id: 'core' },
    { title: 'Curriculum', description: 'Learning path', id: 'curriculum' },
    { title: 'Media', description: 'Visual assets', id: 'media' },
    { title: 'Faculty', description: 'Speakers', id: 'faculty' },
    { title: 'Registration', description: 'Custom fields', id: 'registration' },
    { title: 'Review', description: 'Final check', id: 'review' }
  ]
  if (hasAttachedForm.value) {
    return allSteps.filter((s) => s.id !== 'registration')
  }
  return allSteps
})

const categoryOptions = [
  {label:'Technology training',value:'Technology Training'},
  {label:'Business development',value:'Business Development'},
  {label:'Design & creative',value:'Design & Creative'},
  {label:'Marketing & sales',value:'Marketing & Sales'},
  {label:'Data science',value:'Data Science'},
  {label:'Healthcare',value:'Healthcare'},
  {label:'Education',value:'Education'}
]

const form = reactive({
  title: '',
  position: 0,
  slug: '',
  category: '',
  description: '',
  duration: '',
  focusAreas: [''],
  outcomes: [''],
  keyResponsibilities: [''],
  image: '',
  images: [] as string[],
  highlights: [{ title: '', description: '' }],
  formId: '',
  externalFormLink: '',
  status: 'draft',
  sendAutomatedEmail: false,
  automatedEmailContent: '',
  speakers: [] as Array<{ name: string; bio: string; image: string }>,
  formFields: [] as any[]
})

const { forms, getForms } = useGetForms()
getForms()

const formOptions = computed(() => {
  const options = [{ label: 'Select internal form', value: '' }]
  if (forms.value) {
    forms.value.forEach((f: any) => {
      options.push({ label: f.title || 'Untitled form', value: f.id || f._id })
    })
  }
  return options
})
const STORAGE_KEY = 'medlab_program_form_draft'

// Cache form changes to localStorage
watch(form, (newVal) => {
  if (!props.program) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newVal))
  }
}, { deep: true })

// Initialize form with program data if editing
watchEffect(() => {
  if (props.program) {
    Object.assign(form, {
      title: props.program.title || '',
      position: props.program.position || 0,
      slug: props.program.slug || '',
      category: props.program.category || '',
      description: props.program.description || '',
      duration: props.program.duration || '',
      focusAreas: props.program.focusAreas?.length ? [...props.program.focusAreas] : [''],
      outcomes: props.program.outcomes?.length ? [...props.program.outcomes] : [''],
      keyResponsibilities: props.program.keyResponsibilities?.length ? [...props.program.keyResponsibilities] : [''],
      image: props.program.image || '',
      images: props.program.images || [],
      highlights: props.program.highlights?.length ? props.program.highlights.map((h: any) => ({...h})) : [{ title: '', description: '' }],
      formId: props.program.form?._id || props.program.form || '',
      externalFormLink: props.program.externalFormLink || '',
      status: props.program.status || 'draft',
      sendAutomatedEmail: props.program.sendAutomatedEmail || false,
      automatedEmailContent: props.program.automatedEmailContent || '',
      speakers: props.program.speakers?.length ? props.program.speakers.map((s: any) => ({...s})) : [],
      formFields: props.program.formFields?.length ? props.program.formFields.map((f: any) => ({...f})) : []
    })
    maxStepReached.value = 3
  } else {
    // Check for draft in localStorage
    const savedDraft = localStorage.getItem(STORAGE_KEY)
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft)
        Object.assign(form, draft)
        return
      } catch (e) {}
    }
  }
})

watch(hasAttachedForm, () => {
  if (currentStep.value >= steps.value.length) {
    currentStep.value = steps.value.length - 1
  }
  if (maxStepReached.value >= steps.value.length) {
    maxStepReached.value = steps.value.length - 1
  }
})

// Navigation methods
const nextStep = () => {
  if (currentStep.value < steps.value.length - 1) {
    currentStep.value++
    if (currentStep.value > maxStepReached.value) {
      maxStepReached.value = currentStep.value
    }
  }
}

const previousStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

// Array management methods
const addFocusArea = () => form.focusAreas.push('')
const removeFocusArea = (index: number) => form.focusAreas.splice(index, 1)

const addOutcome = () => form.outcomes.push('')
const removeOutcome = (index: number) => form.outcomes.splice(index, 1)

const addResponsibility = () => form.keyResponsibilities.push('')
const removeResponsibility = (index: number) => form.keyResponsibilities.splice(index, 1)

const addHighlight = () => form.highlights.push({ title: '', description: '' })
const removeHighlight = (index: number) => form.highlights.splice(index, 1)

const addSpeaker = () => form.speakers.push({ name: '', bio: '', image: '' })
const removeSpeaker = (index: number) => form.speakers.splice(index, 1)

const addFormField = () => {
  form.formFields.push({
    id: Date.now().toString(),
    label: '',
    type: 'text',
    required: false,
    placeholder: '',
    description: '',
    options: [],
    allowOther: false
  })
}
const removeFormField = (index: number) => form.formFields.splice(index, 1)
const addFormFieldOption = (field: any) => {
  if (!field.options) field.options = []
  field.options.push('')
}
const removeFormFieldOption = (field: any, index: number) => field.options.splice(index, 1)

const { showToast } = useCustomToast()

// const handleSubmit = async () => {
//   if (!form.title.trim() || !form.category.trim() || !form.description.trim() || !form.duration.trim()) {
//     showToast({ title: "Validation Error", message: "Title, Category, Description, and Duration are required.", toastType: "error" });
//     return;
//   }
//   isSubmitting.value = true
//   try {
//     const extractUrl = (val: any) => {
//       if (typeof val === 'string') return val
//       if (val && typeof val === 'object') return val.url || val.secure_url || ''
//       return ''
//     }

//     const cleanedForm = {
//       ...form,
//       image: extractUrl(form.image),
//       images: form.images.map(extractUrl).filter(url => !!url),
//       focusAreas: form.focusAreas.filter(area => area.trim()),
//       outcomes: form.outcomes.filter(outcome => outcome.trim()),
//       keyResponsibilities: form.keyResponsibilities.filter(resp => resp.trim()),
//       highlights: form.highlights
//         .filter(h => h.title.trim() || h.description.trim())
//         .map(h => {
//           const { _id, ...cleanHighlight } = h as any
//           return {
//             title: cleanHighlight.title,
//             description: cleanHighlight.description
//           }
//         }),
//       speakers: form.speakers
//         .filter(s => s.name.trim() || s.bio.trim() || s.image)
//         .map(s => {
//           const { _id, ...cleanSpeaker } = s as any
//           return {
//             name: cleanSpeaker.name,
//             bio: cleanSpeaker.bio,
//             image: extractUrl(cleanSpeaker.image)
//           }
//         })
//     }
    
//     await emit('save', cleanedForm)
//   } finally {
//     isSubmitting.value = false
//   }
// }

// handleSubmit in the child form component
const handleSubmit = async () => {
  isSubmitting.value = true  // 👈 spinner starts here

  const extractUrl = (val: any) => {
    if (typeof val === 'string') return val
    if (val && typeof val === 'object') return val.url || val.secure_url || ''
    return ''
  }

  const cleanedForm = {
    ...form,
    image: extractUrl(form.image),
    images: form.images.map(extractUrl).filter(Boolean),
    focusAreas: form.focusAreas.filter((a: string) => a.trim()),
    outcomes: form.outcomes.filter((o: string) => o.trim()),
    keyResponsibilities: form.keyResponsibilities.filter((r: string) => r.trim()),
    highlights: form.highlights
      .filter((h: any) => h.title.trim() || h.description.trim())
      .map(({ _id, ...h }: any) => ({ title: h.title, description: h.description })),
    speakers: form.speakers
      .filter((s: any) => s.name.trim() || s.bio.trim() || s.image)
      .map(({ _id, ...s }: any) => ({ name: s.name, bio: s.bio, image: extractUrl(s.image) }))
  }

  // ✅ Pass done() — parent calls it when its async work finishes
  emit('save', cleanedForm, () => {
    isSubmitting.value = false  // 👈 spinner stops here, driven by parent
    localStorage.removeItem(STORAGE_KEY)
  })
}
</script>
