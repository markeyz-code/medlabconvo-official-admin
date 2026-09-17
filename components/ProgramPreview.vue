<template>
  <div class="space-y-12 pb-20">
    <!-- Hero Banner Section -->
    <div class="relative h-80 rounded-[2.5rem] overflow-hidden group shadow-sm border border-slate-200">
      <img 
        :src="program?.image || '/placeholder-program.jpg'" 
        :alt="program?.title"
        class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-[#033958] via-[#033958]/40 to-transparent"></div>
      
      <!-- Status & Category Badges -->
      <div class="absolute top-8 left-8 flex gap-3">
        <span class="px-4 py-2 bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-xl text-xs font-black  tracking-normal">
          {{ program?.category || 'General' }}
        </span>
        <span :class="[
          'px-4 py-2 backdrop-blur-md border rounded-xl text-xs font-black  tracking-normal shadow-sm border border-slate-100',
          program?.status === 'active' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
        ]">
          {{ program?.status }}
        </span>
      </div>

      <!-- Hero Text Content -->
      <div class="absolute bottom-10 left-10 right-10">
        <h1 class="text-lg md:text-xl font-black text-white tracking-normal mb-4 leading-none">
          {{ program?.title }}
        </h1>
        <div class="flex flex-wrap items-center gap-6 text-blue-100/80 font-bold text-sm">
          <div class="flex items-center gap-2">
            <Icon name="lucide:clock" class="w-4 h-4" />
            <span>{{ program?.duration || 'Flexible schedule' }}</span>
          </div>
          <div class="flex items-center gap-2">
            <Icon name="lucide:users" class="w-4 h-4" />
            <span>{{ program?.applicationsCount || 0 }} Applicants</span>
          </div>
          <div class="flex items-center gap-2">
            <Icon name="lucide:calendar" class="w-4 h-4" />
            <span>Launched {{ formatDate(program?.createdAt) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
      <!-- Left Column: Core Details -->
      <div class="lg:col-span-8 space-y-12">
        <!-- Overview -->
        <section class="bg-white rounded-[2rem] p-10 border border-slate-100 shadow-sm">
          <h3 class="text-xl font-bold text-[#033958] mb-6 flex items-center gap-3">
            <Icon name="lucide:info" class="w-6 h-6 text-blue-500" />
            Program Overview
          </h3>
          <p class="text-slate-600 leading-relaxed text-lg whitespace-pre-wrap">
            {{ program?.description }}
          </p>
        </section>

        <!-- Focus Areas & Outcomes -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Focus Areas -->
          <section class="bg-slate-50 rounded-[2rem] p-8 border border-slate-100">
            <h4 class="text-sm font-black  tracking-normal text-[#033958]/50 mb-6 px-1">Specialized focus</h4>
            <div class="space-y-4">
              <div v-for="(area, idx) in program?.focusAreas" :key="idx" class="flex items-start gap-4 p-4 bg-white rounded-2xl border border-slate-100">
                <div class="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                  <Icon name="lucide:target" class="w-4 h-4" />
                </div>
                <span class="text-sm font-bold text-slate-700 leading-tight">{{ area }}</span>
              </div>
            </div>
          </section>

          <!-- Outcomes -->
          <section class="bg-emerald-50/30 rounded-[2rem] p-8 border border-emerald-100/50">
            <h4 class="text-sm font-black  tracking-normal text-emerald-700/50 mb-6 px-1">Key outcomes</h4>
            <div class="space-y-4">
              <div v-for="(outcome, idx) in program?.outcomes" :key="idx" class="flex items-start gap-4 p-4 bg-white/60 rounded-2xl border border-emerald-100/50">
                <div class="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                  <Icon name="lucide:check-circle" class="w-4 h-4" />
                </div>
                <span class="text-sm font-bold text-slate-700 leading-tight">{{ outcome }}</span>
              </div>
            </div>
          </section>
        </div>

        <!-- Faculty Section -->
        <section v-if="program?.speakers?.length" class="space-y-6">
          <h3 class="text-xl font-bold text-[#033958] px-2 flex items-center gap-3">
            <Icon name="lucide:mic-2" class="w-6 h-6 text-purple-500" />
            Scientific Speakers
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div v-for="(speaker, idx) in program?.speakers" :key="idx" class="flex items-center gap-5 p-6 bg-white rounded-3xl border border-slate-100 hover:border-purple-200 transition-all shadow-sm group">
              <img 
                :src="speaker.image || '/placeholder-avatar.jpg'" 
                class="w-16 h-16 rounded-2xl object-cover ring-4 ring-slate-50 group-hover:ring-purple-50 transition-all shadow-sm border border-slate-100"
              />
              <div>
                <h5 class="font-bold text-slate-900 leading-none mb-2">{{ speaker.name }}</h5>
                <p class="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed">{{ speaker.bio }}</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- Right Column: Metadata & Highlights -->
      <div class="lg:col-span-4 space-y-10">
        <!-- Highlights Card -->
        <section class="bg-[#033958] rounded-[2.5rem] p-10 text-white shadow-sm border border-slate-200 relative overflow-hidden">
          <Icon name="lucide:sparkles" class="absolute -top-10 -right-10 w-40 h-40 text-white/5 rotate-12" />
          <h3 class="text-lg font-bold mb-8 flex items-center gap-3">
            <Icon name="lucide:zap" class="w-5 h-5 text-amber-400" />
            Program Highlights
          </h3>
          <div class="space-y-8 relative z-10">
            <div v-for="(hl, idx) in program?.highlights" :key="idx" class="space-y-2">
              <div class="text-xs font-black  tracking-normal text-blue-300/80">{{ hl.title }}</div>
              <p class="text-sm font-medium text-blue-50 leading-relaxed">{{ hl.description }}</p>
            </div>
          </div>
        </section>

        <!-- Registration Context -->
        <section class="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm space-y-6">
          <h4 class="text-sm font-black  tracking-normal text-slate-400 px-1">Internal workflow</h4>
          <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div class="flex items-center gap-3 mb-2">
              <Icon name="lucide:form-input" class="w-4 h-4 text-[#033958]" />
              <span class="text-sm font-bold text-slate-900">Custom Registration</span>
            </div>
            <p class="text-xs text-slate-500 font-medium leading-relaxed">
              This program uses a custom built form with {{ program?.formFields?.length || 0 }} specific data fields.
            </p>
          </div>
          
          <button 
            @click="copyLink"
            class="w-full py-4 bg-[#033958] text-white rounded-2xl font-bold text-sm hover:bg-[#022f42] transition-all active:scale-95 flex items-center justify-center gap-3 shadow-sm border border-slate-100"
          >
            <Icon name="lucide:share-2" class="w-4 h-4" />
            Share Program Link
          </button>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '#components'
import { useCustomToast } from '@/composables/core/useCustomToast'

const props = defineProps<{
  program: any
}>()

const { showToast } = useCustomToast()

const formatDate = (date: string) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

const copyLink = async () => {
  // Mock logic to show link functionality
  const link = `https://medlabconvo.com/programs/${props.program?.id || props.program?._id}`
  await navigator.clipboard.writeText(link)
  showToast({
    title: 'Link Copied',
    message: 'Program URL has been copied to your clipboard.',
    toastType: 'success'
  })
}
</script>
