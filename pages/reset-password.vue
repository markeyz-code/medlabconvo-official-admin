<template>
  <div class="h-screen overflow-hidden flex text-gray-900 bg-white">
    <!-- Left: Image Cover -->
    <div class="hidden lg:flex lg:w-1/2 relative bg-[#033958] overflow-hidden items-end p-12">
      <img src="@/assets/img/auth-bg.png" class="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-overlay" />
      <div class="absolute inset-0 bg-gradient-to-t from-[#033958] via-[#033958]/80 to-transparent"></div>
      
      <div class="relative z-10 w-full max-w-lg mb-12">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl mb-8 overflow-hidden shadow-2xl p-1">
          <img src="@/assets/img/logo.jpeg" class="w-full h-full object-cover rounded-xl" />
        </div>
        <h1 class="text-4xl font-bold text-white mb-4 leading-tight">Secure Your Account</h1>
        <p class="text-lg text-blue-100/80">Choose a strong, unique password to protect your operations.</p>
      </div>
    </div>

    <!-- Right: Form Area -->
    <div class="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-16 lg:p-24 overflow-y-auto">
      <div class="w-full max-w-[440px]">
        
        <h2 class="text-2xl font-extrabold text-[#033958] mb-4 tracking-tight">Create New Password</h2>
        <p class="text-gray-900 mb-8 font-medium">
          Enter the 6-digit code sent to <span class="text-[#033958] font-bold">{{ email }}</span> and create your new password.
        </p>

        <form @submit.prevent="handleResetPassword" class="space-y-6">
          <div>
            <label class="block text-sm font-bold text-[#033958] mb-2">Verification Code</label>
            <UiVerifyEmailOtpInput 
              v-model="otpCode" 
              :error="otpError"
              :autoSubmit="false"
            />
          </div>

          <div class="relative mt-8">
            <UiAnimatedInput
              id="password"
              label="New Password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              required
            ></UiAnimatedInput>
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-4 top-[22px] text-gray-400 hover:text-[#033958] transition-colors"
            >
              <Icon :name="showPassword ? 'lucide:eye-off' : 'lucide:eye'" class="w-5 h-5" />
            </button>
          </div>

          <transition name="shake">
            <div v-if="error" class="bg-red-50 border border-red-100 rounded-xl p-3 flex items-center space-x-3">
              <Icon name="lucide:alert-circle" class="w-5 h-5 text-red-500" />
              <span class="text-red-800 text-sm font-medium">{{ error }}</span>
            </div>
          </transition>

          <button
            type="submit"
            :disabled="loading || !password || otpCode.length !== 6"
            class="w-full bg-[#3BAB22] hover:bg-[#2e8a1a] text-white mt-8 py-3 px-4 rounded-xl font-semibold text-base transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
             <div v-if="loading" class="flex items-center justify-center space-x-2">
                <div class="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div>
                <span>Securing Wallet...</span>
              </div>
              <span v-else>Update Password</span>
          </button>
        </form>
        
        <div class="mt-8 text-center">
            <NuxtLink to="/forgot-password" class="text-sm font-medium text-gray-900 hover:text-[#033958] transition-colors">
              Wrong email or need a new code? Try again
            </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { auth_api } from '@/api_factory/modules/auth'
import { useCustomToast } from '@/composables/core/useCustomToast'
import { definePageMeta } from '#imports'

definePageMeta({
  layout: false,
  auth: false
})

const router = useRouter()
const route = useRoute()
const { showToast } = useCustomToast()

const email = ref((route.query.email as string) || '')
const otpCode = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')
const otpError = ref('')

onMounted(() => {
  if (!email.value) {
    router.push('/forgot-password')
  }
})

const handleResetPassword = async () => {
  if (otpCode.value.length !== 6 || !password.value) return

  loading.value = true
  error.value = ''
  
  try {
    const response = await auth_api.$_reset_password('', { 
      email: email.value, 
      otp: otpCode.value, 
      password: password.value 
    } as any)
    
    if (response.status === 200 || response.status === 201) {
       showToast({ title: "Secured", message: "Password updated successfully. You can now log in.", toastType: "success" })
       router.push('/')
    }
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to reset password'
  } finally {
    loading.value = false
  }
}
</script>
