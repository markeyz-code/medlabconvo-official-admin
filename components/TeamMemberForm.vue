<template>
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Image Upload Area -->
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-2">Profile Image</label>
        <ImageUpload v-model="form.image" :multiple="false" folder="team" />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
          <input
            v-model="form.name"
            type="text"
            required
            class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#033958] outline-none"
            placeholder="e.g. Oluwamuyiwa Ogunkoya"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Initials</label>
          <input
            v-model="form.initials"
            type="text"
            required
            class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#033958] outline-none"
            placeholder="e.g. O.O."
          />
        </div>
      </div>
  
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Title</label>
          <input
            v-model="form.title"
            type="text"
            required
            class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#033958] outline-none"
            placeholder="e.g. Executive Director, Team Lead"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Position (Display Order)</label>
          <input
            v-model.number="form.position"
            type="number"
            required
            class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#033958] outline-none"
            placeholder="e.g. 1"
          />
        </div>
      </div>
  
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-2">Biography</label>
        <textarea
          v-model="form.bio"
          required
          rows="4"
          class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#033958] outline-none resize-none"
          placeholder="Enter a brief biography..."
        ></textarea>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">LinkedIn URL</label>
          <input
            v-model="form.linkedin"
            type="url"
            class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#033958] outline-none"
            placeholder="https://linkedin.com/in/..."
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Twitter URL</label>
          <input
            v-model="form.twitter"
            type="url"
            class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#033958] outline-none"
            placeholder="https://twitter.com/..."
          />
        </div>
      </div>
  
      <div class="flex items-center pt-2">
        <input
          v-model="form.isActive"
          type="checkbox"
          id="activeToggle"
          class="w-5 h-5 text-[#3BAB22] border-slate-300 rounded focus:ring-[#3BAB22]"
        />
        <label for="activeToggle" class="ml-2 block text-sm font-bold text-slate-700 cursor-pointer">Set as Active Team Member</label>
      </div>
  
      <div class="flex justify-end space-x-3 pt-6 border-t border-slate-200">
        <button
          type="button"
          @click="$emit('cancel')"
          class="px-6 py-2 border border-slate-300 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="px-6 py-2 bg-[#033958] text-white font-bold rounded-lg hover:bg-[#044a73] transition-colors"
        >
          {{ member ? 'Update Identity' : 'Save Identity' }}
        </button>
      </div>
    </form>
  </template>
  
  <script setup lang="ts">
  import { reactive, watchEffect } from 'vue'
  import { useCustomToast } from '@/composables/core/useCustomToast'
  import ImageUpload from '@/components/ImageUpload.vue'
  
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