<template>
  <div class="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
    <!-- Introduction Section -->
    <section class="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
      <div class="absolute top-0 right-0 w-64 h-64 bg-[#033958]/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
      <div class="relative z-10">
        <h1 class="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-4">Laboratory Style Guide</h1>
        <p class="text-slate-500 font-medium max-w-2xl leading-relaxed antialiased">
          A premium design system built for MedLabConvo. This guide demonstrates the atomic components and patterns used to maintain a high-contrast, minimalist, and professional administrative interface.
        </p>
      </div>
    </section>

    <!-- Forms & Inputs -->
    <section class="space-y-8">
      <div class="flex items-center space-x-4 px-2">
        <div class="h-px bg-slate-200 flex-1"></div>
        <h2 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Forms & Data Input</h2>
        <div class="h-px bg-slate-200 flex-1"></div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Animated Inputs -->
        <div class="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-8">
          <h3 class="text-sm font-black text-slate-900 uppercase tracking-widest border-b border-slate-50 pb-4">Animated Inputs</h3>
          <div class="space-y-6">
            <AnimatedInput v-model="demoText" label="Full Legal Name" id="demo1" type="text" />
            <AnimatedInput v-model="demoEmail" label="Operational Email" id="demo2" type="email" />
            <AnimatedInput v-model="demoPass" label="Security Protocol (Password)" id="demo3" type="password" />
          </div>
        </div>

        <!-- Select & Toggles -->
        <div class="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-8">
          <h3 class="text-sm font-black text-slate-900 uppercase tracking-widest border-b border-slate-50 pb-4">Standardized Selectors</h3>
          <div class="space-y-6">
            <SelectInput 
              v-model="demoSelect" 
              label="Functional Access Level" 
              :options="[
                { label: 'SUPER ADMIN PROTOCOL', value: 'admin' },
                { label: 'EXECUTIVE DIRECTORATE', value: 'exec' },
                { label: 'STANDARD RESEARCHER', value: 'user' }
              ]"
            />
            
            <div class="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
              <div>
                <p class="text-sm font-black text-slate-900 uppercase tracking-tight">Deployment Status</p>
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Set component as operational</p>
              </div>
              <label class="relative inline-flex cursor-pointer items-center">
                <input type="checkbox" v-model="demoToggle" class="peer sr-only" />
                <div class="peer h-7 w-12 rounded-full bg-slate-200 after:absolute after:left-[4px] after:top-[4px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-emerald-500 peer-checked:after:translate-x-full peer-focus:outline-none"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Layout & Sheets -->
    <section class="space-y-8">
      <div class="flex items-center space-x-4 px-2">
        <div class="h-px bg-slate-200 flex-1"></div>
        <h2 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Overlays & sheets</h2>
        <div class="h-px bg-slate-200 flex-1"></div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="bg-[#033958] p-10 rounded-[2.5rem] text-white space-y-6 relative overflow-hidden group">
          <div class="relative z-10">
            <h3 class="text-xl font-black uppercase tracking-tighter mb-4">Protocol Slide-Over</h3>
            <p class="text-blue-100/60 text-sm font-medium leading-relaxed mb-8">The standard full-height sheet for entity creation and modification. Maintains focus and context.</p>
            <button 
              @click="showSheet = true"
              class="px-8 py-4 bg-white text-[#033958] rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-50 transition-all flex items-center space-x-3 active:scale-95 shadow-2xl shadow-blue-900/40"
            >
              <Icon name="lucide:sparkles" class="w-4 h-4" />
              <span>Trigger Protocol Sheet</span>
            </button>
          </div>
          <Icon name="lucide:plus-square" class="absolute -bottom-10 -right-10 w-48 h-48 text-white/5 opacity-0 group-hover:opacity-10 transition-opacity duration-700" />
        </div>

        <div class="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6 flex flex-col justify-center">
            <h3 class="text-xl font-black text-slate-900 uppercase tracking-tighter mb-4">System Modals</h3>
            <p class="text-slate-500 text-sm font-medium leading-relaxed mb-8">Used for destructive actions or important confirmations. Immediate attention required.</p>
            <div class="flex space-x-4">
              <button 
                @click="showModal = true"
                class="px-8 py-4 bg-slate-100 text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95"
              >
                Launch Standard Modal
              </button>
            </div>
        </div>
      </div>
    </section>

    <!-- Metric Cards -->
    <section class="space-y-8">
      <div class="flex items-center space-x-4 px-2">
        <div class="h-px bg-slate-200 flex-1"></div>
        <h2 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Operational Metrics</h2>
        <div class="h-px bg-slate-200 flex-1"></div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div class="bg-white p-8 rounded-[2rem] border border-slate-50 shadow-sm border-l-4 border-l-emerald-500">
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Systems Online</p>
          <div class="flex items-center justify-between">
            <span class="text-2xl font-black text-slate-900 tracking-tighter">99.8%</span>
            <div class="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
              <Icon name="lucide:check-circle-2" class="w-6 h-6" />
            </div>
          </div>
        </div>

        <div class="bg-white p-8 rounded-[2rem] border border-slate-50 shadow-sm border-l-4 border-l-blue-500">
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Acquisition</p>
          <div class="flex items-center justify-between">
            <span class="text-2xl font-black text-slate-900 tracking-tighter">1,204</span>
            <div class="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
              <Icon name="lucide:trending-up" class="w-6 h-6" />
            </div>
          </div>
        </div>

        <div class="bg-slate-900 p-8 rounded-[2rem] text-white relative overflow-hidden">
             <div class="relative z-10">
                <p class="text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">Dark Protocol</p>
                <div class="flex items-center justify-between">
                  <span class="text-2xl font-black text-white tracking-tighter">ACTIVE</span>
                  <div class="w-10 h-10 bg-white/10 text-white rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <Icon name="lucide:shield-alert" class="w-6 h-6" />
                  </div>
                </div>
             </div>
             <div class="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
        </div>

        <div class="bg-white p-8 rounded-[2rem] border border-slate-50 shadow-sm border-l-4 border-l-rose-500">
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Threat Vector</p>
          <div class="flex items-center justify-between">
            <span class="text-2xl font-black text-slate-900 tracking-tighter">ZERO</span>
            <div class="w-10 h-10 bg-rose-50 text-rose-600 rounded-lg flex items-center justify-center">
               <Icon name="lucide:ban" class="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Components Reference -->
    <SlideOver v-model="showSheet" title="Deployment Sheet (Example)">
      <div class="p-8 space-y-10">
         <div class="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 flex flex-col items-center justify-center space-y-4">
            <div class="w-16 h-16 bg-[#033958] rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-900/40">
              <Icon name="lucide:box" class="w-8 h-8" />
            </div>
            <p class="text-sm font-black text-slate-900 uppercase tracking-tight">Context Retention Protocol</p>
            <p class="text-sm text-slate-400 font-bold uppercase tracking-widest text-center leading-relaxed">This sheet allows users to modify data without losing their current scroll position in the background list.</p>
         </div>

         <div class="space-y-6">
            <AnimatedInput v-model="demoText" label="Registry Identifier" id="ref1" type="text" />
            <SelectInput v-model="demoSelect" label="Security Class" :options="[{label: 'UNRESTRICTED', value: '1'}]" />
         </div>

         <div class="flex justify-end pt-10 border-t border-slate-50 gap-4">
            <button @click="showSheet = false" class="px-10 py-5 bg-[#033958] text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl active:scale-95 w-full">Close Protocol</button>
         </div>
      </div>
    </SlideOver>

    <Modal v-model="showModal" title="Security Confirmation" size="sm">
      <div class="p-8 space-y-8 text-center">
        <div class="w-20 h-20 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-rose-50/50">
          <Icon name="lucide:alert-triangle" class="w-10 h-10" />
        </div>
        <div class="space-y-3">
          <h3 class="text-xl font-black text-slate-900 uppercase tracking-tight">Irreversible Action</h3>
          <p class="text-slate-400 text-sm font-bold uppercase tracking-widest leading-relaxed">Proceeding will initiate a terminal purge of the current dataset identity registry.</p>
        </div>
        <div class="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
          <button @click="showModal = false" class="py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Cancel</button>
          <button @click="showModal = false" class="py-4 bg-rose-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-rose-900/10">Confirm Purge</button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AnimatedInput from '@/components/ui/AnimatedInput.vue'
import SelectInput from '@/components/ui/SelectInput.vue'
import SlideOver from '@/components/SlideOver.vue'
import Modal from '@/components/Modal.vue'
import Icon from '@/components/Icon.vue'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

// Demo State
const demoText = ref('Standard Lab Entry')
const demoEmail = ref('ops@medlabconvo.com')
const demoPass = ref('security-secret')
const demoSelect = ref('admin')
const demoToggle = ref(true)
const showSheet = ref(false)
const showModal = ref(false)
</script>
