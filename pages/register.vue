<template>
  <div class="h-screen overflow-hidden bg-white flex lg:flex-row-reverse font-sans text-slate-900">
    <!-- Left Section: Registration Form -->
    <div class="w-full lg:w-1/2 flex flex-col p-8 md:p-12 lg:p-20 overflow-y-auto">
      <!-- Logo & Branding -->
      <div class="flex items-center space-x-3 mb-16 animate-in fade-in slide-in-from-left-4 duration-700">
        <img src="@/assets/img/logo.jpeg" class="h-12 w-12 rounded-xl ring-4 ring-slate-50 shadow-sm" />
        <span class="font-black text-2xl tracking-tighter  text-[#033958]">MedLabConvo</span>
      </div>

      <div class="max-w-[440px] w-full mx-auto my-auto py-10">
        <!-- Status: Loading -->
        <div v-if="loadingInvite" class="flex flex-col items-center text-center py-20 animate-in fade-in duration-500">
          <div class="w-16 h-16 border-4 border-slate-100 border-t-[#033958] rounded-full animate-spin mb-6"></div>
          <h2 class="text-2xl font-black text-slate-900 mb-2  tracking-tight">Validating Invite</h2>
          <p class="text-slate-500 font-medium tracking-tight antialiased">Checking your secure invitation link...</p>
        </div>

        <!-- Status: Error -->
        <div v-else-if="inviteError" class="bg-rose-50 rounded-3xl p-10 border border-rose-100 flex flex-col items-center text-center animate-in zoom-in-95 duration-500">
          <div class="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm">
            <Icon name="lucide:alert-triangle" class="w-8 h-8 text-rose-600" />
          </div>
          <h2 class="text-xl font-black text-slate-900 mb-4  tracking-tight">Access Restricted</h2>
          <p class="text-slate-600 font-medium tracking-tight antialiased mb-8 leading-relaxed">{{ inviteError }}</p>
          <NuxtLink to="/" class="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm  tracking-widest hover:bg-black transition-all text-center">
            Return to Gateway
          </NuxtLink>
        </div>

        <!-- Status: Success / Form -->
        <div v-else class="animate-in fade-in slide-in-from-bottom-6 duration-1000">
          <div class="mb-10">
            <div class="inline-flex items-center space-x-2 px-3 py-1 bg-[#3BAB22]/10 rounded-full mb-4">
              <div class="w-1.5 h-1.5 rounded-full bg-[#3BAB22]"></div>
              <span class="text-sm font-black text-[#3BAB22]  tracking-widest">Team Invitation</span>
            </div>
            <h2 class="text-2xl font-black text-slate-900 mb-3 tracking-tight">Create your account</h2>
            <p class="text-slate-500 font-medium text-lg leading-relaxed antialiased">
              Welcome aboard! You've been invited as a <span class="text-[#033958] font-bold ">{{ invitation?.role?.replace('_', ' ') }}</span>. Please complete your profile to continue.
            </p>
          </div>

          <form @submit.prevent="handleRegister" class="space-y-6">
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <AnimatedInput
                  v-model="form.firstName"
                  id="firstName"
                  label="First Name"
                  type="text"
                  required
                 
                />
              </div>
              <div class="space-y-2">
                <AnimatedInput
                  v-model="form.lastName"
                  id="lastName"
                  label="Last Name"
                  type="text"
                  required
                 
                />
              </div>
            </div>

            <div class="space-y-2">
              <AnimatedInput
                v-model="form.email"
                id="email"
                label="Email Address"
                disabled
                type="email"
               
              />
            </div>

            <div class="space-y-2">
              <div class="relative">
                <AnimatedInput
                  v-model="form.password"
                  id="password"
                  label="Choose Password"
                  required
                  :type="showPassword ? 'text' : 'password'"
                 
                />
                <button 
                  type="button" 
                  @click="showPassword = !showPassword"
                  class="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-[#033958] transition-colors"
                >
                  <Icon :name="showPassword ? 'lucide:eye-off' : 'lucide:eye'" class="w-5 h-5" />
                </button>
              </div>
              <p class="text-[9px] font-bold text-slate-400  tracking-tight ml-1">Must be at least 6 characters long</p>
            </div>

            <div class="pt-6">
              <button
                type="submit"
                :disabled="loadingRegister"
                class="w-full py-5 bg-[#3BAB22] text-white rounded-2xl font-black text-sm  tracking-widest hover:bg-[#2d851a] disabled:bg-slate-100 disabled:text-slate-300 transition-all shadow-xl shadow-green-900/10 active:scale-[0.98] flex items-center justify-center space-x-3"
              >
                <div v-if="loadingRegister" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>{{ loadingRegister ? 'Signing up...' : 'Complete Registration' }}</span>
              </button>
            </div>
          </form>

          <p class="mt-10 text-center text-sm font-medium text-slate-400 antialiased">
            By joining, you agree to the <a href="#" class="text-[#033958] font-bold hover:underline">Administrative Guidelines</a> and <a href="#" class="text-[#033958] font-bold hover:underline">Security Protocols</a>.
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div class="mt-auto pt-10 text-slate-300 text-[9px] font-black  tracking-[0.2em] text-center lg:text-left">
        &copy; 2026 MedLabConvo Systems. Access Restricted.
      </div>
    </div>

    <!-- Right Section: Visual Hero -->
    <div class="hidden lg:block lg:w-1/2 relative bg-[#033958]">
      <img 
        src="/lab-hero.png" 
        class="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-luminosity brightness-75 transition-all duration-1000"
      />
      <!-- Gradient Overlay -->
      <div class="absolute inset-0 bg-gradient-to-tr from-[#033958] via-transparent to-transparent opacity-90"></div>
      
      <!-- Quote Overlay -->
      <div class="absolute bottom-20 left-16 right-16 text-white p-10 border-l border-white/20 backdrop-blur-sm bg-white/5 rounded-r-3xl animate-in fade-in slide-in-from-right-10 duration-1000 delay-300">
        <Icon name="lucide:quote" class="w-10 h-10 text-[#3BAB22] mb-6 opacity-80" />
        <h3 class="text-2xl font-black tracking-tight mb-4 leading-tight lowercase first-letter: ">Empowering the medical conversation through modern technology and collaborative research.</h3>
        <div class="flex items-center space-x-4">
          <div class="w-10 h-px bg-white/30"></div>
          <p class="text-sm font-black  tracking-[0.3em] text-[#3BAB22]">Platform Infrastructure</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
  auth: false
})

import { useInvitations } from '@/composables/modules/users/useInvitations'
import { useSignup } from '@/composables/modules/auth/useSignup'
import { useCustomToast } from '@/composables/core/useCustomToast'

import AnimatedInput from '@/components/ui/AnimatedInput.vue'

const route = useRoute()
const router = useRouter()
const { getInvitation, loading: loadingInvite, error: inviteError } = useInvitations()
const { signup, loading: loadingRegister } = useSignup()
const { showToast } = useCustomToast()

const token = ref(route.query.token as string)
const invitation = ref<any>(null)
const showPassword = ref(false)

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: ''
})

onMounted(async () => {
  if (!token.value) {
    inviteError.value = "Access token is missing. Please check your invitation link."
    return
  }

  try {
    const data = await getInvitation(token.value)
    invitation.value = data
    form.email = data.email
  } catch (err: any) {
    // Error handled by composable
  }
})

const handleRegister = async () => {
  try {
    await signup({
      ...form
    }, token.value)

    showToast({
      title: "Success!",
      message: "Your account is ready. Redirecting to login...",
      toastType: "success"
    })

    setTimeout(() => {
      router.push('/')
    }, 2000)
  } catch (err: any) {
    // Error handled by composable
  }
}
</script>

<style scoped>
/* Smooth transitions */
.animate-in {
  animation-fill-mode: forwards;
}
</style>
