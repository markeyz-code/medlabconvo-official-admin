<template>
  <div class="h-screen overflow-hidden flex text-gray-900 bg-white">
    <!-- Left: Image Cover -->
    <div class="hidden lg:flex lg:w-1/2 relative bg-[#033958] overflow-hidden items-end p-12">
      <img src="@/assets/img/auth-bg.png" class="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-overlay" />
      <div class="absolute inset-0 bg-gradient-to-t from-[#033958] via-[#033958]/80 to-transparent"></div>
      
      <div class="relative z-10 w-full max-w-lg mb-12">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl mb-8 overflow-hidden shadow-sm border border-slate-200 p-1">
          <img src="@/assets/img/logo.jpeg" class="w-full h-full object-cover rounded-xl" />
        </div>
        <h1 class="text-lg font-bold text-white mb-4 leading-tight">Recover Your Access</h1>
        <p class="text-lg text-blue-100/80">Regain control of your administrative account with our secure recovery process.</p>
      </div>
    </div>

    <!-- Right: Form Area -->
    <div class="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-16 lg:p-24 overflow-y-auto">
      <div class="w-full max-w-[440px]">
        
        <div class="w-20 h-20 bg-[#eff6ff] rounded-2xl flex items-center justify-center mb-8 shadow-sm border border-blue-50">
          <Icon name="lucide:key-round" class="w-10 h-10 text-[#033958]" />
        </div>
        
        <h2 class="text-lg font-extrabold text-[#033958] mb-4 tracking-tight">Forgot Password?</h2>
        <p class="text-gray-900 mb-10 font-medium">
          Enter the email address associated with your account and we'll send you a secure code to reset your password.
        </p>

        <form @submit.prevent="handleForgotPassword" class="space-y-6">
          <UiAnimatedInput
            label="Email Address"
            id="email"
            v-model="email"
            type="email"
            required
          ></UiAnimatedInput>

          <transition name="shake">
            <div v-if="error" class="bg-red-50 border border-red-100 rounded-xl p-3 flex items-center space-x-3">
              <Icon name="lucide:alert-circle" class="w-5 h-5 text-red-500" />
              <span class="text-red-800 text-sm font-medium">{{ error }}</span>
            </div>
          </transition>

          <button
            type="submit"
            :disabled="loading || !email"
            class="w-full bg-[#033958] hover:bg-[#044a73] text-white mt-4 py-3.5 px-6 rounded-2xl font-bold text-lg transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            <div v-if="loading" class="flex items-center justify-center space-x-3">
              <div class="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div>
              <span>Sending...</span>
            </div>
            <span v-else>Send Reset Code</span>
          </button>
        </form>

        <div class="mt-8 text-center pt-8 border-t border-gray-100">
          <p class="text-gray-900 text-sm font-medium">
            Remembered your password?
            <NuxtLink to="/" class="text-[#3BAB22] font-bold hover:underline transition-all ml-1">
              Sign In
            </NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { auth_api } from '@/api_factory/modules/auth'
import { useCustomToast } from '@/composables/core/useCustomToast'

definePageMeta({
  layout: false,
  auth: false
})

const router = useRouter()
const { showToast } = useCustomToast()

const email = ref('')
const loading = ref(false)
const error = ref('')

const handleForgotPassword = async () => {
  if (!email.value) return

  loading.value = true
  error.value = ''
  
  try {
    const response = await auth_api.$_forgot_password({ email: email.value })
    if (response.status === 200 || response.status === 201) {
       showToast({ title: "Sent", message: "If your email is registered, we've sent a code.", toastType: "success" })
       router.push({ path: '/reset-password', query: { email: email.value } })
    }
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to request password reset'
  } finally {
    loading.value = false
  }
}
</script>
