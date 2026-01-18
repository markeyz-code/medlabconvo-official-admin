<template>
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <UiAnimatedInput
            v-model="form.name"
            type="text"
            required
            label="Full Name"
          />
        </div>
        
        <div>
          <UiAnimatedInput
            v-model="form.email"
            type="email"
            required
            label="Email Address"
          />
        </div>
      </div>
  
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <UiAnimatedInput
            v-model="form.position"
            type="text"
            required
            label="Position"
          />
        </div>
        
        <div>
          <UiSelectInput
            :options="[
              { label: 'Engineering', value: 'engineering' },
              { label: 'Design', value: 'design' },
              { label: 'Marketing', value: 'marketing' },
              { label: 'Sales', value: 'sales' },
              { label: 'Human Resources', value: 'hr' },
              { label: 'Finance', value: 'finance' },
              { label: 'Operations', value: 'operations' }
            ]"
            label="Department"
            v-model="form.department"
            required
          />
        </div>
      </div>
  
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <UiAnimatedInput
            v-model="form.phone"
            type="tel"
            label="Phone" 
          />
        </div>
        
        <div>
          <UiAnimatedInput
            v-model="form.location"
            type="text"
            label="Location"  
          />
        </div>
      </div>
  
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-2">Bio</label>
        <UiAnimatedInput
        type="textarea"
        label="Biography"
          v-model="form.bio"
          :rows="4"
          :cols="6"
        />
      </div>
  
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <UiAnimatedInput
            v-model="form.linkedin"
            label="Linkedin"
            type="url"
          />
        </div>
        
        <div>
          <UiAnimatedInput
            v-model="form.twitter"
            label="Twitter"
            type="text"
          />
        </div>
      </div>
  
      <div class="flex items-center">
        <input
          v-model="form.isActive"
          type="checkbox"
          class="custom-checkbox"
        />
        <label class="ml-2 block text-sm text-slate-700">Active team member</label>
      </div>
  
      <div class="flex justify-end space-x-3 pt-6 border-t border-slate-200">
        <button
          type="button"
          @click="$emit('cancel')"
          class="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="px-4 py-2 bg-black text-white rounded-lg  transition-all duration-200"
        >
          {{ member ? 'Update' : 'Add' }} Member
        </button>
      </div>
    </form>
  </template>
  
  <script setup lang="ts">
  import { reactive, watchEffect } from 'vue';
  
  interface Props {
    member?: any
  }
  
  const props = defineProps<Props>()
  const emit = defineEmits(['save', 'cancel'])
  
  const form = reactive({
    name: '',
    email: '',
    position: '',
    department: '',
    phone: '',
    location: '',
    bio: '',
    linkedin: '',
    twitter: '',
    isActive: true
  })
  
  // Initialize form with member data if editing
  watchEffect(() => {
    if (props.member) {
      Object.assign(form, {
        name: props.member.name || '',
        email: props.member.email || '',
        position: props.member.position || '',
        department: props.member.department || '',
        phone: props.member.phone || '',
        location: props.member.location || '',
        bio: props.member.bio || '',
        linkedin: props.member.linkedin || '',
        twitter: props.member.twitter || '',
        isActive: props.member.isActive ?? true
      })
    } else {
      // Reset form for new member
      Object.assign(form, {
        name: '',
        email: '',
        position: '',
        department: '',
        phone: '',
        location: '',
        bio: '',
        linkedin: '',
        twitter: '',
        isActive: true
      })
    }
  })
  
  const handleSubmit = () => {
    emit('save', { ...form })
  }
  </script>
  