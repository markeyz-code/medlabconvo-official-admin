<template>
  <transition name="fade">
    <div 
      v-if="isVisible" 
      class="fixed inset-0 z-[100] flex items-center justify-center bg-white/60 backdrop-blur-md"
    >
      <div class="relative flex flex-col items-center">
        <!-- Logo Container with Spinning Border -->
        <div class="relative w-32 h-32 flex items-center justify-center">
          <!-- Animated Spinner Ring -->
          <div class="absolute inset-0 rounded-full border-4 border-t-[#033958] border-r-transparent border-b-[#3BAB22] border-l-transparent animate-spin-slow"></div>
          
          <!-- Inner Pulse Circle -->
          <div class="absolute inset-2 rounded-full bg-white  flex items-center justify-center overflow-hidden animate-pulse-gentle">
            <img src="@/assets/img/logo.jpeg" class="w-full h-full object-cover" alt="Logo" />
          </div>
        </div>

        <!-- Loading Text -->
        <div class="mt-8 text-center">
          <h2 class="text-[#033958] font-bold text-xl tracking-wider  animate-bounce-subtle">
            Processing
          </h2>
          <div class="flex space-x-1 mt-2 justify-center">
            <div class="w-1.5 h-1.5 bg-[#3BAB22] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div class="w-1.5 h-1.5 bg-[#3BAB22] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div class="w-1.5 h-1.5 bg-[#3BAB22] rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
defineProps<{
  isVisible: boolean
}>()
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes pulse-gentle {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.9; }
}

@keyframes bounce-subtle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}

.animate-spin-slow {
  animation: spin-slow 2s linear infinite;
}

.animate-pulse-gentle {
  animation: pulse-gentle 2s ease-in-out infinite;
}

.animate-bounce-subtle {
  animation: bounce-subtle 2s ease-in-out infinite;
}
</style>
