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
        <h1 class="text-4xl font-bold text-white mb-4 leading-tight">Welcome to MedLabConvo</h1>
        <p class="text-lg text-blue-100/80">You're just one step away from joining our administrative platform.</p>
      </div>
    </div>

    <!-- Right: Form Area -->
    <div class="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-16 lg:p-24 overflow-y-auto">
      <div class="w-full max-w-[440px]">
        
        <div class="w-20 h-20 bg-[#f0fdf4] rounded-2xl flex items-center justify-center mb-8 shadow-sm border border-emerald-50">
          <Icon name="lucide:mail-open" class="w-10 h-10 text-[#3BAB22]" />
        </div>
        
        <h2 class="text-2xl font-extrabold text-[#033958] mb-4 tracking-tight">Verify Your Email</h2>
        <p class="text-gray-900 mb-10 font-medium">
          We've sent a 6-digit activation code to <br/>
          <span class="text-[#033958] font-bold">{{ email }}</span>
        </p>

        <div class="mb-8">
          <UiVerifyEmailOtpInput 
            v-model="otpCode" 
            :error="otpError"
            :autoSubmit="false"
          />
        </div>

        <button
          @click="verify"
          :disabled="isLoading || otpCode.length !== 6"
          class="w-full bg-[#033958] hover:bg-[#044a73] text-white py-3 px-4 rounded-xl font-semibold text-base transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          <div v-if="isLoading" class="flex items-center justify-center space-x-2">
            <div class="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div>
            <span>Verifying...</span>
          </div>
          <span v-else>Verify Email</span>
        </button>

        <div class="mt-8 text-center pt-8 border-t border-gray-100">
          <p class="text-gray-900 text-sm font-medium">
            Didn't receive the email?
            <NuxtLink to="/signup" class="text-[#3BAB22] font-bold hover:underline transition-all ml-1">
              Sign up again
            </NuxtLink>
          </p>
          <NuxtLink to="/" class="block mt-6 text-gray-400 font-bold text-sm hover:text-[#033958] transition-colors">
            Cancel and Return to Login
          </NuxtLink>
        </div>
      </div>
    </div>

    <UiFullscreenLoader :isVisible="isLoading" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useLoader } from '@/composables/core/useLoader'
import { useCustomToast } from '@/composables/core/useCustomToast'
import { auth_api } from '@/api_factory/modules/auth'
import { definePageMeta } from '#imports'

definePageMeta({
  layout: false,
  auth: false
})

const router = useRouter()
const route = useRoute()
const { isLoading, showLoader, hideLoader } = useLoader()
const { showToast } = useCustomToast()

const email = ref((route.query.email as string) || '')
const otpCode = ref('')
const otpError = ref('')

onMounted(() => {
  if (!email.value) {
    router.push('/signup')
  }
})

const verify = async () => {
  if (otpCode.value.length !== 6) return

  try {
    showLoader()
    otpError.value = ''
    await auth_api.$_verify_otp({
      email: email.value,
      otp: otpCode.value
    })
    
    showToast({ title: "Verified", message: "Email verified successfully. You can now log in.", toastType: "success" })
    
    setTimeout(() => {
      router.push('/')
    }, 1500)
  } catch (err: any) {
    otpError.value = err.response?.data?.message || 'Invalid verification code'
  } finally {
    hideLoader()
  }
}
</script>
