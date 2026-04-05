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
        <AnimatedInput
          v-model="form.initials"
          id="memberInitials"
          label="Initials"
          type="text"
          required
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
      <AnimatedInput
        v-model="form.bio"
        id="memberBio"
        label="Biography"
        type="textarea"
        :rows="5"
      />
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

    <div class="grid grid-cols-1 gap-8">
      <SelectInput
        v-model="form.isActive"
        label="Status"
        :options="[
          { label: 'Active', value: true },
          { label: 'Inactive', value: false }
        ]"
      />
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

interface Props {
  member?: any
}

const props = defineProps<Props>()
const emit = defineEmits(['save', 'cancel'])

const form = reactive({
  name: '',
  initials: '',
  title: '',
  position: 1,
  image: '',
  bio: '',
  linkedin: '',
  twitter: '',
  isActive: true
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
      initials: props.member.initials || '',
      title: props.member.title || '',
      position: props.member.position ?? 1,
      image: props.member.image || '',
      bio: props.member.bio || '',
      linkedin: linked,
      twitter: twitt,
      isActive: props.member.isActive ?? true
    })
  } else {
    Object.assign(form, {
      name: '',
      initials: '',
      title: '',
      position: 1,
      image: '',
      bio: '',
      linkedin: '',
      twitter: '',
      isActive: true
    })
  }
})

const { showToast } = useCustomToast()

const handleSubmit = () => {
  if (!form.name.trim() || !form.title.trim() || !form.bio.trim() || !form.initials.trim()) {
    showToast({ title: "Validation Error", message: "Name, Initials, Title, and Bio are required.", toastType: "error" })
    return
  }

  const profiles = []
  if (form.linkedin) profiles.push({ type: 'linkedin', url: form.linkedin })
  if (form.twitter) profiles.push({ type: 'twitter', url: form.twitter })

  const payload = {
    name: form.name,
    initials: form.initials,
    title: form.title,
    position: form.position,
    image: form.image,
    bio: form.bio,
    profiles: profiles,
    isActive: form.isActive
  }

  emit('save', payload)
}
</script>