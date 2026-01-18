<template>
    <div class="min-h-screen flex">
      <!-- Left Side - Carousel Animation -->
      <div class="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 relative overflow-hidden">
        <!-- Animated Background Elements -->
        <div class="absolute inset-0">
          <div class="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full animate-pulse"></div>
          <div class="absolute bottom-32 right-16 w-24 h-24 bg-white/5 rounded-full animate-bounce"></div>
          <div class="absolute top-1/2 left-1/4 w-16 h-16 bg-white/15 rounded-full animate-ping"></div>
        </div>
  
        <!-- Carousel Content -->
        <div class="relative z-10 flex flex-col justify-center items-center text-white p-12">
          <div class="max-w-md text-center">
            <transition name="slide-fade" mode="out-in">
              <div :key="currentSlide" class="space-y-6">
                <div class="w-24 h-24 mx-auto mb-8 relative">
                  <div class="absolute inset-0 bg-white/20 rounded-full animate-spin-slow"></div>
                  <Icon :name="slides[currentSlide].icon" class="w-16 h-16 absolute inset-4 text-white" />
                </div>
                <h2 class="text-3xl font-bold mb-4">{{ slides[currentSlide].title }}</h2>
                <p class="text-lg text-white/90 leading-relaxed">{{ slides[currentSlide].description }}</p>
              </div>
            </transition>
          </div>
  
          <!-- Carousel Indicators -->
          <div class="flex space-x-2 mt-12">
            <button
              v-for="(slide, index) in slides"
              :key="index"
              @click="currentSlide = index"
              :class="[
                'w-3 h-3 rounded-full transition-all duration-300',
                currentSlide === index ? 'bg-white' : 'bg-white/30'
              ]"
            ></button>
          </div>
        </div>
      </div>
  
      <!-- Right Side - Login Form -->
      <div class="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div class="max-w-md w-full">
          <!-- Logo -->
          <div class="text-center mb-8">
            <div class="w-16 h-16 bg-black rounded-xl mx-auto mb-4 flex items-center justify-center">
              <img src="@/assets/img/logo.jpeg" class="rounded-xl" />
              <!-- <span class="text-white font-bold text-2xl">O</span> -->
            </div>
            <h1 class="text-3xl font-bold text-gray-900">Welcome Back</h1>
            <p class="text-gray-600 mt-2">Sign in to your admin dashboard</p>
          </div>
  
          <!-- Login Form -->
          <form @submit.prevent="handleLogin" class="space-y-6">
            <!-- Email Field -->
            <div class="transform transition-all duration-300 hover:scale-105">
              <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div class="relative">
                <UiAnimatedInput
                  label="Email"
                  id="email"
                  v-model="loginForm.email"
                  type="email"
                  required
                />
              </div>
            </div>
  
            <!-- Password Field -->
            <div class="transform transition-all duration-300 hover:scale-105">
              <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div class="relative">
                <UiAnimatedInput
                  id="password"
                  label="Password"
                  v-model="loginForm.password"
                  required
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <Icon :name="showPassword ? 'heroicons:eye-slash' : 'heroicons:eye'" class="w-5 h-5" />
                </button>
              </div>
            </div>
  
            <!-- Error Message -->
            <transition name="shake">
              <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
                <Icon name="heroicons:exclamation-triangle" class="w-5 h-5 text-red-500 flex-shrink-0" />
                <span class="text-red-700 text-sm">{{ error }}</span>
              </div>
            </transition>
  
            <!-- Remember Me -->
            <div class="flex items-center justify-between">
              <label class="flex items-center">
                <input
                  v-model="loginForm.rememberMe"
                  type="checkbox"
                  class="custom-checkbox"
                />
                <span class="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <NuxtLink to="/auth/forgot-password" class="text-sm text-blue-600 hover:text-blue-500">
                Forgot password?
              </NuxtLink>
            </div>
  
            <!-- Submit Button -->
            <button
              type="submit"
              :disabled="loading"
              class="w-full bg-black text-white py-3 px-4 rounded-lg font-medium  focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <div v-if="loading" class="flex items-center justify-center space-x-2">
                <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Signing in...</span>
              </div>
              <span v-else>Sign In</span>
            </button>
          </form>
  
          <!-- Sign Up Link -->
          <div class="text-center mt-8">
            <p class="text-gray-600">
              Don't have an account?
              <NuxtLink to="/signup" class="text-blue-600 hover:text-blue-500 font-medium">
                Sign up here
              </NuxtLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue'
  import { useRouter } from 'vue-router'
  import Icon from '@/components/Icon.vue'
  import { useLogin } from '@/composables/modules/auth/useLogin'
  import { definePageMeta } from '#imports'
  
  // Meta
  definePageMeta({
    layout: false,
    auth: false
  })
  
  // Composables
  const router = useRouter()
  const { loading, error, success, login } = useLogin()
  
  // Reactive data
  const loginForm = ref({
    email: '',
    password: '',
    rememberMe: false
  })
  
  const showPassword = ref(false)
  const currentSlide = ref(0)
  
  // Carousel data
  const slides = [
  {
      icon: 'heroicons:academic-cap',
      title: 'Leading Change',
      description: 'We are leading change, inspiring action, and building the capacity of future generations of world-class professionals in medical laboratory science and in the healthcare system at large.'
    },
    {
      icon: 'heroicons:light-bulb',
      title: 'Career Clarity',
      description: 'MedLabConvo gave me clarity about my career path. The mentorship and resources have transformed the way I approach learning and professional growth. I now feel equipped to excel in the health ecosystem.'
    },
    {
      icon: 'heroicons:star',
      title: 'Game-Changer',
      description: 'MedLabConvo has been a game-changer for me. From knowledge gained through webinars to career mentorship, MedLabConvo has helped me grow professionally and personally.'
    },
    {
      icon: 'heroicons:users',
      title: 'Global Collaboration',
      description: 'MedLabConvo fosters collaboration among medical lab scientists worldwide. It\'s a great place to connect, learn, and contribute to the advancement of our profession.'
    }
  ]
  
  // Carousel auto-play
  let carouselInterval: NodeJS.Timeout
  
  const startCarousel = () => {
    carouselInterval = setInterval(() => {
      currentSlide.value = (currentSlide.value + 1) % slides.length
    }, 4000)
  }
  
  const stopCarousel = () => {
    if (carouselInterval) {
      clearInterval(carouselInterval)
    }
  }
  
  // Methods
  const handleLogin = async () => {
    try {
      await login({
        email: loginForm.value.email,
        password: loginForm.value.password
      })
      
      if (success.value) {
        await router.push('/dashboard')
      }
    } catch (err) {
      console.error('Login failed:', err)
    }
  }
  
  // Lifecycle
  onMounted(() => {
    startCarousel()
  })
  
  onUnmounted(() => {
    stopCarousel()
  })
  </script>
  
<style scoped>
  /* Carousel animations */
  .slide-fade-enter-active,
  .slide-fade-leave-active {
    transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .slide-fade-enter-from {
    opacity: 0;
    transform: translateX(30px);
  }
  
  .slide-fade-leave-to {
    opacity: 0;
    transform: translateX(-30px);
  }
  
  /* Error shake animation */
  .shake-enter-active {
    animation: shake 0.6s ease-in-out;
  }
  
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }
  
  /* Custom spin animation */
  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  .animate-spin-slow {
    animation: spin-slow 8s linear infinite;
  }
  </style>
  