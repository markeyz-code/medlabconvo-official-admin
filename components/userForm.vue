<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <AnimatedInput
        v-model="form.firstName"
        id="firstName"
        label="First Name"
        type="text"
      />
      <AnimatedInput
        v-model="form.lastName"
        id="lastName"
        label="Last Name"
        type="text"
      />
    </div>

    <div class="grid grid-cols-1 gap-8">
      <AnimatedInput
        v-model="form.email"
        id="email"
        label="Email Address"
        type="email"
      />
    </div>

    <div v-if="!user" class="grid grid-cols-1 gap-8">
      <AnimatedInput
        v-model="form.password"
        id="password"
        label="Password"
        type="password"
      />
    </div>

    <div class="grid grid-cols-1 gap-8">
      <SelectInput
        v-model="form.role"
        label="User Role"
        :options="['admin', 'editor', 'super_admin', 'executive_director', 'asst_executive_director', 'head_of_department', 'co_lead', 'member']"
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
        <span>{{ user ? 'Save Changes' : 'Create User' }}</span>
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive, watchEffect } from 'vue';
import AnimatedInput from '@/components/ui/AnimatedInput.vue'
import SelectInput from '@/components/ui/SelectInput.vue'
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
  role: 'member'
})

// Initialize form with user data if editing
watchEffect(() => {
  if (props.user) {
    Object.assign(form, {
      firstName: props.user.firstName || '',
      lastName: props.user.lastName || '',
      email: props.user.email || '',
      role: props.user.role || 'member'
    })
  } else {
    // Reset form for new user
    Object.assign(form, {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      role: 'member'
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
  const payload = { ...form }
  if (props.user && !payload.password) {
    delete payload.password
  }
  emit('save', payload)
}
</script>