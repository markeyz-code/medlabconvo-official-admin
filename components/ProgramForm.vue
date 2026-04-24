<template>
  <div class="animate-in slide-in-from-right duration-500 p-6">
    <!-- {{ program }} -->
    <!-- Step Indicator -->
    <div class="mb-10">

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
              'mt-3 text-[11px] font-bold transition-colors duration-500',
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
      <div v-if="currentStep === 0" class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <header class="mb-8">
          <h3 class="text-xl font-bold text-slate-900 mb-1">Basic details</h3>
          <p class="text-sm text-slate-500">Enter the core information for this program.</p>
        </header>

        <div class="space-y-4">
          <AnimatedInput
            v-model="form.title"
            id="programTitle"
            label="Program title"
            type="text"
            required
            position="top"
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
              required
              position="middle"
            />
          </div>
          <AnimatedInput
            v-model="form.description"
            id="programDesc"
            label="Description"
            type="textarea"
            :rows="6"
            required
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
      </div>

      <!-- Step 2: Curriculum & Focus -->
      <div v-if="currentStep === 1" class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
            <h4 class="text-sm font-bold text-slate-400 px-1">Participant expectations</h4>
            <button @click="addResponsibility" type="button" class="text-[#033958] text-sm font-bold hover:underline">Add expectation</button>
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
                  label="Expectation"
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
      <div v-if="currentStep === 2" class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
              class="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4 relative group"
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
                placeholder="e.g. industry certification"
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
      <div v-if="currentStep === 3" class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <header class="mb-8">
          <h3 class="text-xl font-bold text-slate-900 mb-1">Scientific speakers & mentors</h3>
           <!-- {{ form.speakers }} -->
          <p class="text-sm text-slate-500">Add experts and speakers for this program. You can add bios and avatars now or later.</p>
        </header>

        <section class="space-y-8">
          <div v-for="(speaker, index) in form.speakers" :key="index" class="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 relative group">
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
                  placeholder="e.g. Dr. Jane Smith"
                  position="top"
                />
                <AnimatedInput
                  v-model="speaker.bio"
                  :id="'speaker-bio-'+index"
                  type="textarea"
                  :rows="3"
                  label="Short biography"
                  placeholder="A brief overview of their background and expertise..."
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

      <!-- Step 5: Finalization -->
      <div v-if="currentStep === 4" class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
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

const steps = [
  { title: 'Core info', description: 'Basic details' },
  { title: 'Curriculum', description: 'Learning path' },
  { title: 'Media', description: 'Visual assets' },
  { title: 'Faculty', description: 'Speakers' },
  { title: 'Review', description: 'Final check' }
]

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
  speakers: [] as Array<{ name: string; bio: string; image: string }>
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

// Initialize form with program data if editing
watchEffect(() => {
  if (props.program) {
    Object.assign(form, {
      title: props.program.title || '',
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
      speakers: props.program.speakers?.length ? props.program.speakers.map((s: any) => ({...s})) : []
    })
    maxStepReached.value = 3
  }
})

// Navigation methods
const nextStep = () => {
  if (currentStep.value < steps.length - 1) {
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
  if (!form.title.trim() || !form.category.trim() || !form.description.trim() || !form.duration.trim()) {
    showToast({ title: "Validation Error", message: "Please fill in all required fields.", toastType: "error" })
    return
  }

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
  })
}
</script>
