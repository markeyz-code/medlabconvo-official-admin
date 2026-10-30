<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
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

    <div class="grid grid-cols-1 gap-3">
      <AnimatedInput
        v-model="form.email"
        id="email"
        label="Email Address"
        type="email"
      />
    </div>

    <div v-if="!user" class="grid grid-cols-1 gap-3">
      <AnimatedInput
        v-model="form.password"
        id="password"
        label="Password"
        type="password"
      />
    </div>

    <div class="grid grid-cols-1 gap-3">
      <SelectInput
        v-model="form.role"
        label="User Role"
        :options="roleOptions"
      />
    </div>

    <div class="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-4">
      <button type="button" class="btn btn-outline" @click="$emit('cancel')">Cancel</button>
      <button type="submit" class="btn btn-primary">{{ user ? 'Save changes' : 'Create user' }}</button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watchEffect } from 'vue';
import AnimatedInput from '@/components/ui/AnimatedInput.vue'
import SelectInput from '@/components/ui/SelectInput.vue'
import { useCustomToast } from '@/composables/core/useCustomToast'
import { useGetRoles } from '@/composables/modules/roles/useGetRoles'
import { useUser } from '@/composables/modules/auth/user'
import { ROLE_LABELS } from '@/utils/permissions'

const { roles, getRoles } = useGetRoles()
const { role: currentRole, hasPermission } = useUser()
const builtInRoles = [
  'super_admin', 'executive_director', 'asst_executive_director',
  'admin', 'head_of_department', 'co_lead', 'editor', 'member'
]

const roleOptions = computed(() => {
  const names = Array.from(new Set([
    ...builtInRoles,
    ...(roles.value || []).map((role: any) => String(role.name || '').toLowerCase()).filter(Boolean),
  ]))
  const canAssignPrivileged = ['super_admin', 'executive_director'].includes(currentRole.value)
  return names
    .filter((name) => canAssignPrivileged || !['super_admin', 'executive_director'].includes(name))
    .map((name) => ({
      label: ROLE_LABELS[name] || name.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      value: name,
    }))
})

onMounted(() => {
  if (hasPermission('roles:read')) getRoles().catch(() => {})
})

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