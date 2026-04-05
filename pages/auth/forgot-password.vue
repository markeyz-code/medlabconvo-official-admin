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
        <div class="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Forgot Password?</h2>
        <p class="text-gray-600">No worries! Enter your email and we'll send you reset instructions.</p>
      </div>
  
      <!-- Success State -->
      <div v-if="success" class="text-center">
        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Check Your Email!</h3>
        <p class="text-gray-600 text-sm mb-6">
          We've sent password reset instructions to your email address.
        </p>
        <button 
          @click="resetState"
          class="w-full bg-black text-white py-3 px-4 rounded-xl font-medium  transition-all duration-200 transform hover:scale-[1.02]"
        >
          Send Another Email
        </button>
      </div>
  
      <!-- Form State -->
      <form v-else @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Email Input -->
        <div class="space-y-2">
          <AnimatedInput
            id="email"
            v-model="form.email"
            type="email"
            required
            label="Email Address"
           
            :disabled="loading"
          />
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
          :disabled="loading || !form.email"
          class="w-full bg-black text-white py-3 px-4 rounded-xl font-medium  disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] disabled:hover:scale-100 flex items-center justify-center"
        >
          <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ loading ? 'Sending...' : 'Send Reset Instructions' }}
        </button>
      </form>
  
      <!-- Footer Links -->
      <div class="mt-6 text-center">
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
  import { ref, reactive } from 'vue'
  import { useForgotPassword } from '@/composables/modules/auth/useForgotPassword'
  import { useCustomToast } from '@/composables/core/useCustomToast'
  import { definePageMeta } from '#imports'
  import AnimatedInput from '@/components/ui/AnimatedInput.vue'
  
  
  // Form data
  const form = reactive({
    email: ''
  })
  
  // Composable
  const { loading, error, success, forgotPassword, resetState } = useForgotPassword()
  
  // Methods
  const { showToast } = useCustomToast()
  const handleSubmit = async () => {
    if (!form.email.trim()) {
      showToast({ title: "Validation Error", message: "Please enter your email address.", toastType: "error" });
      return;
    }
    try {
      await forgotPassword({ email: form.email })
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
  