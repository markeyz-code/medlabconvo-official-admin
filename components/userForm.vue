<template>
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <UiAnimatedInput
            v-model="form.firstName"
            type="text"
            label="First Name"
            required
          />
        </div>
        
        <div>
          <UiAnimatedInput
            v-model="form.lastName"
            type="text"
            label="Last Name"
            required
          />
        </div>
      </div>
  
      <div>
        <UiAnimatedInput
          v-model="form.email"
          type="email"
          required
          label="Email"
          class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
  
      <div v-if="!user">
        <UiAnimatedInput
          v-model="form.password"
          type="password"
          required
          label="Password"
        />
      </div>
  
      <div>
        <UiSelectInput :options="['user', 'editor', 'admin']" label="Role" v-model="form.role" />
      </div>
  
      <div class="flex items-center">
        <input
          v-model="form.isActive"
          type="checkbox"
          class="custom-checkbox"
        />
        <label class="ml-2 block text-sm text-slate-700">Active</label>
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
          {{ user ? 'Update' : 'Create' }} User
        </button>
      </div>
    </form>
  </template>
  
  <script setup lang="ts">
  import { reactive, watchEffect } from 'vue';
  import { useCustomToast } from '@/composables/core/useCustomToast'
  
  interface Props {
    user?: any
  }
  
  const props = defineProps<Props>()
  const emit = defineEmits(['save', 'cancel'])
  
  const form = reactive({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'user',
    isActive: true
  })
  
  // Initialize form with user data if editing
  watchEffect(() => {
    if (props.user) {
      Object.assign(form, {
        firstName: props.user.firstName || '',
        lastName: props.user.lastName || '',
        email: props.user.email || '',
        role: props.user.role || 'user',
        isActive: props.user.isActive ?? true
      })
    } else {
      // Reset form for new user
      Object.assign(form, {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'user',
        isActive: true
      })
    }
  })
  
  const { showToast } = useCustomToast()

  const handleSubmit = () => {
    if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim()) {
      showToast({ title: "Validation Error", message: "First name, Last name, and Email are required.", toastType: "error" });
      return;
    }
    if (!props.user && !form.password.trim()) {
      showToast({ title: "Validation Error", message: "Password is required for new users.", toastType: "error" });
      return;
    }
    emit('save', { ...form })
  }
  </script>
  