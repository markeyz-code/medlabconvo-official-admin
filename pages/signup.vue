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
 <h1 class="text-lg font-bold text-white mb-4 leading-tight">Join the Administrative Hub</h1>
 <p class="text-lg text-blue-100/80">Streamline communications, manage staff assignments, and maintain operational excellence.</p>
 </div>
 </div>

 <!-- Right: Form Area -->
 <div class="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-16 lg:p-24 overflow-y-auto">
 <div class="w-full max-w-[440px]">
 
 <h2 class="text-lg font-extrabold text-[#033958] mb-2 ">Create Account</h2>
 <p class="text-gray-900 mb-10 font-medium">Join the Medlabconvo Admin Panel.</p>

 <!-- Signup Form -->
 <form @submit.prevent="handleSignup" class="space-y-5">
 <UiAnimatedInput
 id="firstName"
 v-model="signupForm.firstName"
 type="text"
 required
 label="First Name"
 ></UiAnimatedInput>

 <UiAnimatedInput
 id="lastName"
 v-model="signupForm.lastName"
 type="text"
 required
 label="Last Name"
 ></UiAnimatedInput>

 <UiAnimatedInput
 id="email"
 v-model="signupForm.email"
 type="email"
 required
 label="Email Address"
 ></UiAnimatedInput>

 <div class="relative">
 <UiAnimatedInput
 id="password"
 v-model="signupForm.password"
 :type="showPassword ? 'text' : 'password'"
 required
 label="Create Password"
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
 :disabled="loading"
 class="w-full bg-[#033958] hover:bg-[#044a73] text-white mt-8 py-3.5 px-6 rounded-2xl font-bold text-lg transition-all duration-300 active:scale-[0.98] disabled:opacity-50 shadow-md"
 >
 <div v-if="loading" class="flex items-center justify-center space-x-3">
 <div class="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div>
 <span>Securing...</span>
 </div>
 <span v-else class="flex text-sm items-center justify-center">
 Get Started
 <Icon name="lucide:arrow-right" class="ml-2 w-5 h-5" />
 </span>
 </button>
 </form>

 <div class="mt-10 text-center pt-8 border-t border-gray-100">
 <p class="text-gray-900 font-medium text-sm">
 Member already?
 <NuxtLink to="/" class="text-[#3BAB22] hover:text-[#2d851a] font-bold underline-offset-4 hover:underline transition-all ml-1">
 Sign In
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
 import { useRouter, useRoute } from 'vue-router'
 import Icon from '@/components/Icon.vue'
 import { useSignup } from '@/composables/modules/auth/useSignup'
 import { useCustomToast } from '@/composables/core/useCustomToast'
 import { useLoader } from '@/composables/core/useLoader'
 
 
 // Meta
 ({
 layout: false,
 auth: false
 })
 
 // Composables
 const router = useRouter()
 const route = useRoute()
 const { loading, error, success, signup } = useSignup()
 const { isLoading, showLoader, hideLoader } = useLoader()
 
 // Reactive data
 const signupForm = ref({
 firstName: '',
 lastName: '',
 email: '',
 password: '',
 agreeToTerms: false
 })
 
 const showPassword = ref(false)

// Methods
const handleSignup = async () => {
 if (!signupForm.value.firstName || !signupForm.value.lastName || !signupForm.value.email || !signupForm.value.password) {
 const { showToast } = useCustomToast();
 showToast({ title: "Validation Error", message: "Please fill all required fields.", toastType: "error" });
 return;
 }
 try {
 showLoader()
 const token = route.query.token as string | undefined
 const response: any = await signup({
 firstName: signupForm.value.firstName,
 lastName: signupForm.value.lastName,
 email: signupForm.value.email,
 password: signupForm.value.password
 }, token)
 
 if (response?.email) {
 await router.push({ path: '/verify-signup', query: { email: signupForm.value.email } })
 } else if (success.value) {
 await router.push('/')
 }
 } catch (err) {
 console.error('Signup failed:', err)
 } finally {
 hideLoader()
 }
}
 
 // Lifecycle
 onMounted(() => {
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
 