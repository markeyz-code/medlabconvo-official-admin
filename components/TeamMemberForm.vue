<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Image Upload Area -->
    <div>
      <label class="block text-sm font-medium text-slate-700 mb-2">Profile Image</label>
      <ImageUpload v-model="form.image" :multiple="false" folder="team" />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <AnimatedInput
          v-model="form.name"
          id="memberName"
          label="Full Name"
          type="text"
          required
        />
      </div>
      <div>
        <SelectInput 
          v-model="form.roleCategory" 
          label="Role Category"
          :options="[
            { label: 'Executive Board', value: 'Executive Board' },
            { label: 'Management Team', value: 'Management Team' },
            { label: 'Volunteer Committee', value: 'Volunteer Committee' },
            { label: 'Advisory Council', value: 'Advisory Council' }
          ]" 
        />
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <AnimatedInput
          v-model="form.title"
          id="memberTitle"
          label="Job Title"
          type="text"
          required
        />
      </div>
      <div>
        <AnimatedInput
          v-model="form.position"
          id="memberPosition"
          label="Display Order"
          type="number"
          required
        />
      </div>
    </div>

    <div class="grid grid-cols-1 gap-8">
      <div class="space-y-4">
        <label class="text-sm font-black  tracking-normal text-slate-400 px-1">Biography</label>
        <TiptapEditor
          v-model="form.bio"

        />
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <AnimatedInput
          v-model="form.linkedin"
          id="memberLinkedin"
          label="LinkedIn URL"
          type="url"
        />
      </div>
      <div>
        <AnimatedInput
          v-model="form.twitter"
          id="memberTwitter"
          label="Twitter URL"
          type="url"
        />
      </div>
    </div>


    <div class="flex justify-end space-x-6 pt-10 border-t border-slate-50">
      <button
        type="button"
        @click="$emit('cancel')"
        class="text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors"
      >
        Cancel
      </button>
      <button
        type="submit"
        class="px-10 py-4 bg-[#033958] text-white rounded-2xl font-bold text-sm hover:bg-[#022f42] transition-all active:scale-95 flex items-center space-x-3"
      >
        <span>{{ member ? 'Save member' : 'Create member' }}</span>
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive, watchEffect } from 'vue'
import { useCustomToast } from '@/composables/core/useCustomToast'
import ImageUpload from '@/components/ImageUpload.vue'
import AnimatedInput from '@/components/ui/AnimatedInput.vue'
import SelectInput from '@/components/ui/SelectInput.vue'
import TiptapEditor from '@/components/ui/TiptapEditor.vue'

interface Props {
  member?: any
}

const props = defineProps<Props>()
const emit = defineEmits(['save', 'cancel'])

const form = reactive({
  name: '',
  title: '',
  roleCategory: 'Executive Board',
  position: 1,
  image: '',
  bio: '',
  linkedin: '',
  twitter: ''
})

watchEffect(() => {
  if (props.member) {
    let linked = ''
    let twitt = ''
    if (props.member.profiles && Array.isArray(props.member.profiles)) {
      const li = props.member.profiles.find((p: any) => p.type === 'linkedin')
      if (li) linked = li.url
      const tw = props.member.profiles.find((p: any) => p.type === 'twitter')
      if (tw) twitt = tw.url
    }
    Object.assign(form, {
      name: props.member.name || '',
      title: props.member.title || '',
      roleCategory: props.member.roleCategory || 'Executive Board',
      position: props.member.position ?? 1,
      image: props.member.image || '',
      bio: props.member.bio || '',
      linkedin: linked,
      twitter: twitt
    })
  } else {
    Object.assign(form, {
      name: '',
      title: '',
      roleCategory: 'Executive Board',
      position: 1,
      image: '',
      bio: '',
      linkedin: '',
      twitter: ''
    })
  }
})

const { showToast } = useCustomToast()

const handleSubmit = () => {
  if (!form.name.trim() || !form.title.trim() || !form.bio.trim() || !form.roleCategory.trim()) {
    showToast({ title: "Validation Error", message: "Name, Title, Role Category, and Bio are required.", toastType: "error" })
    return
  }

  const profiles = []
  if (form.linkedin) profiles.push({ type: 'linkedin', url: form.linkedin })
  if (form.twitter) profiles.push({ type: 'twitter', url: form.twitter })

  const payload = {
    name: form.name,
    title: form.title,
    roleCategory: form.roleCategory,
    position: form.position,
    image: form.image,
    bio: form.bio,
    profiles: profiles
  }

  emit('save', payload)
}
</script>