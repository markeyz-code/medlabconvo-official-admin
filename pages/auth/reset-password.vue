<template>
    <div class="animate-fade-in">
      <!-- Back to Login Link -->
      <div class="mb-6">
        <NuxtLink 
          to="/auth/login" 
          class="inline-flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Login
        </NuxtLink>
      </div>
  
      <!-- Header -->
      <div class="text-center mb-8">
        <div class="w-16 h-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Reset Password</h2>
        <p class="text-gray-600">Enter your new password below to complete the reset process.</p>
      </div>
  
      <!-- Success State -->
      <div v-if="success" class="text-center">
        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Password Reset Successful!</h3>
        <p class="text-gray-600 text-sm mb-6">
          Your password has been successfully updated. You can now sign in with your new password.
        </p>
        <NuxtLink 
          to="/auth/login"
          class="inline-block w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 px-4 rounded-xl font-medium hover:from-green-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-[1.02] text-center"
        >
          Continue to Login
        </NuxtLink>
      </div>
  
      <!-- Invalid Token State -->
      <div v-else-if="!token" class="text-center">
        <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Invalid Reset Link</h3>
        <p class="text-gray-600 text-sm mb-6">
          This password reset link is invalid or has expired. Please request a new one.
        </p>
        <NuxtLink 
          to="/auth/forgot-password"
          class="inline-block w-full bg-black text-white py-3 px-4 rounded-xl font-medium  transition-all duration-200 transform hover:scale-[1.02] text-center"
        >
          Request New Reset Link
        </NuxtLink>
      </div>
  
      <!-- Form State -->
      <form v-else @submit.prevent="handleSubmit" class="space-y-6">
        <!-- New Password Input -->
        <div class="space-y-2">
          <div class="relative">
            <AnimatedInput
              id="password"
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              required
              label="New Password"
             
              :disabled="loading"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-4 top-[22px]"
            >
              <svg v-if="showPassword" class="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
              </svg>
              <svg v-else class="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          </div>
          <p class="text-sm text-gray-900">Password must be at least 8 characters long</p>
        </div>
  
        <!-- Confirm Password Input -->
        <div class="space-y-2">
          <div class="relative">
            <AnimatedInput
              id="password_confirmation"
              v-model="form.password_confirmation"
              :type="showConfirmPassword ? 'text' : 'password'"
              required
              label="Confirm New Password"
             
              :disabled="loading"
            />
            <button
              type="button"
              @click="showConfirmPassword = !showConfirmPassword"
              class="absolute right-4 top-[22px]"
            >
              <svg v-if="showConfirmPassword" class="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
              </svg>
              <svg v-else class="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          </div>
        </div>
  
        <!-- Password Match Validation -->
        <div v-if="form.password && form.password_confirmation && form.password !== form.password_confirmation" class="bg-red-50 border border-red-200 rounded-xl p-4">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-sm text-red-700">Passwords do not match</p>
          </div>
        </div>
  
        <!-- Error Message -->
        <div v-if="error" class="bg-red-50 border border-red-200 rounded-xl p-4">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-sm text-red-700">{{ error }}</p>
          </div>
        </div>
  
        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="loading || !form.password || !form.password_confirmation || form.password !== form.password_confirmation"
          class="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 px-4 rounded-xl font-medium hover:from-green-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] disabled:hover:scale-100 flex items-center justify-center"
        >
          <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ loading ? 'Resetting Password...' : 'Reset Password' }}
        </button>
      </form>
  
      <!-- Footer Links -->
      <div v-if="!success" class="mt-6 text-center">
        <p class="text-sm text-gray-600">
          Remember your password? 
          <NuxtLink to="/" class="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200">
            Sign In
          </NuxtLink>
        </p>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, reactive, computed } from 'vue'
  import { useRoute } from 'vue-router'
  import { useResetPassword } from '@/composables/modules/auth/useResetPassword'
  import { useCustomToast } from '@/composables/core/useCustomToast'
  import { definePageMeta } from '#imports'
  import AnimatedInput from '@/components/ui/AnimatedInput.vue'
  

  // Route and composable
  const route = useRoute()
  const token = computed(() => route.query.token as string)
  const { loading, error, success, resetPassword } = useResetPassword()
  
  // Form data
  const form = reactive({
    password: '',
    password_confirmation: ''
  })
  
  // UI state
  const showPassword = ref(false)
  const showConfirmPassword = ref(false)
  
  // Methods
  const { showToast } = useCustomToast()
  const handleSubmit = async () => {
    if (!token.value) return
    if (form.password.length < 8) {
      showToast({ title: "Validation Error", message: "Password must be at least 8 characters.", toastType: "error" });
      return;
    }
    if (form.password !== form.password_confirmation) {
      showToast({ title: "Validation Error", message: "Passwords do not match.", toastType: "error" });
      return;
    }
    try {
      await resetPassword(token.value, {
        password: form.password,
        password_confirmation: form.password_confirmation
      })
    } catch (err) {
      // Error is handled by the composable
    }
  }

    
  // Meta
  definePageMeta({
    layout: false,
    auth: false
  })
  </script>
  