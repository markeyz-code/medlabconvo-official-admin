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
        <h1 class="text-4xl font-bold text-white mb-4 leading-tight">Empowering Healthcare with Intelligent Conversations</h1>
        <p class="text-lg text-blue-100/80">Login to the MedLabConvo administrative console to manage departments, users, and oversee the platform's core operations securely.</p>
      </div>
    </div>

    <!-- Right: Form Area -->
    <div class="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-16 lg:p-24 overflow-y-auto">
      <div class="w-full max-w-[440px]">
        
        <h2 class="text-2xl font-extrabold text-[#033958] mb-2 tracking-tight">Welcome Back</h2>
        <p class="text-gray-900 mb-10 font-medium">Log in to your admin dashboard.</p>

        <!-- Login Form -->
        <form @submit.prevent="handleLogin" class="space-y-6">
          <UiAnimatedInput
            label="Email Address"
            id="email"
            v-model="loginForm.email"
            type="email"
            required
          ></UiAnimatedInput>

          <div class="relative">
            <UiAnimatedInput
              id="password"
              label="Password"
              v-model="loginForm.password"
              :type="showPassword ? 'text' : 'password'"
              required
            ></UiAnimatedInput>
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-4 top-[22px] text-gray-400 hover:text-[#033958] transition-colors"
            >
              <Icon :name="showPassword ? 'heroicons:eye-slash' : 'heroicons:eye'" class="w-5 h-5" />
            </button>
          </div>

          <div class="flex items-center justify-between mt-2">
            <label class="flex items-center cursor-pointer group">
              <input
                v-model="loginForm.rememberMe"
                type="checkbox"
                class="custom-checkbox"
              />
              <span class="ml-2 text-sm text-gray-900 group-hover:text-gray-700 transition-colors font-medium">Remember me</span>
            </label>
            <NuxtLink to="/forgot-password" class="text-sm text-[#033958] hover:text-[#044a73] font-bold transition-colors underline-offset-4 hover:underline">
              Forgot Password?
            </NuxtLink>
          </div>

          <transition name="shake">
            <div v-if="error" class="bg-red-50 border border-red-100 rounded-xl p-3 flex items-center space-x-3">
              <Icon name="heroicons:exclamation-circle" class="w-5 h-5 text-red-500" />
              <span class="text-red-800 text-sm font-medium">{{ error }}</span>
            </div>
          </transition>

          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-[#033958] hover:bg-[#044a73] text-white mt-8 py-3.5 px-6 rounded-2xl font-bold text-lg transition-all duration-300 active:scale-[0.98] disabled:opacity-50 shadow-md"
          >
            <div v-if="loading" class="flex items-center justify-center space-x-3">
              <div class="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div>
              <span>Verifying Credentials...</span>
            </div>
            <span v-else class="flex items-center justify-center">
              Sign In
              <Icon name="heroicons:arrow-right" class="ml-2 w-5 h-5" />
            </span>
          </button>
        </form>

        <div class="mt-10 text-center pt-8 border-t border-gray-100">
          <p class="text-gray-900 font-medium text-sm">
            Don't have an account?
            <NuxtLink to="/signup" class="text-[#3BAB22] hover:text-[#2d851a] font-bold underline-offset-4 hover:underline transition-all ml-1">
              Join here
            </NuxtLink>
          </p>
        </div>
      </div>
    </div>
    <UiFullscreenLoader :isVisible="isLoading" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import Icon from '@/components/Icon.vue'
import { useLogin } from '@/composables/modules/auth/useLogin'
import { useUser } from '@/composables/modules/auth/user'
import { useCustomToast } from '@/composables/core/useCustomToast'
import { useLoader } from '@/composables/core/useLoader'
import { definePageMeta } from '#imports'

// Meta
definePageMeta({
  layout: false,
  auth: false
})

// Composables
const router = useRouter()
const { loading, error, success, login } = useLogin()
const { isLoading, showLoader, hideLoader } = useLoader()

// Reactive data
const loginForm = ref({
  email: '',
  password: '',
  rememberMe: false
})

const showPassword = ref(false)

// Methods
const handleLogin = async () => {
  if (!loginForm.value.email || !loginForm.value.password) {
    const { showToast } = useCustomToast();
    showToast({ title: "Validation Error", message: "Please enter your email and password.", toastType: "error" });
    return;
  }
  try {
    showLoader()
    const response: any = await login({
      email: loginForm.value.email,
      password: loginForm.value.password
    })
    
    if (response?.requiresOtp) {
      await router.push({ path: '/verify-login', query: { email: loginForm.value.email } })
    } else if (success.value) {
      await router.push('/dashboard')
    }
  } catch (err) {
    console.error('Login failed:', err)
  } finally {
    hideLoader()
  }
}

// Lifecycle
onMounted(() => {
  const { isLoggedIn } = useUser()
  if (isLoggedIn.value) {
    router.push('/dashboard')
  }
})

onUnmounted(() => {
})
</script>

<style scoped>
/* Error shake animation */
.shake-enter-active {
  animation: shake 0.6s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}
</style>