<template>
  <div class="max-w-4xl mx-auto space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-6 duration-700">
    
    <!-- Header with Back Button -->
    <div class="flex items-center justify-between">
      <button @click="$emit('close')" class="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-slate-900 transition-colors group">
        <Icon name="heroicons:arrow-left" class="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Campaigns
      </button>
      <h2 class="text-xl font-black text-slate-900 tracking-tight">Craft New Campaign</h2>
    </div>

    <!-- 1. Campaign Details -->
    <div class="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm space-y-8">
      <h3 class="text-base font-black text-slate-900 tracking-tight flex items-center gap-3">
        <span class="w-8 h-8 rounded-xl bg-blue-50 text-[#27628C] flex items-center justify-center text-xs">1</span>
        Campaign Details
      </h3>

      <div class="space-y-6">
        <div class="grid grid-cols-1 gap-6">
          <div class="space-y-2">
            <label class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">Campaign Name</label>
            <input 
              v-model="form.name" 
              type="text" 
              placeholder="Internal campaign reference name"
              class="w-full h-16 px-6 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-blue-600/20 focus:ring-4 focus:ring-blue-600/5 transition-all outline-none font-bold text-sm"
            />
          </div>

          <div class="space-y-2">
            <label class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">Subject Line</label>
            <input 
              v-model="form.subject" 
              type="text" 
              placeholder="What recipients see in their inbox"
              class="w-full h-16 px-6 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-blue-600/20 focus:ring-4 focus:ring-blue-600/5 transition-all outline-none font-bold text-sm"
            />
          </div>

          <div class="space-y-2">
            <label class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">Preview Text (Optional)</label>
            <input 
              v-model="form.previewText" 
              type="text" 
              placeholder="Short teaser text after the subject"
              class="w-full h-16 px-6 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-blue-600/20 focus:ring-4 focus:ring-blue-600/5 transition-all outline-none font-bold text-sm"
            />
          </div>
        </div>

        <!-- Banner Upload -->
        <div class="space-y-4">
          <label class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">Campaign Banner</label>
          <ImageUpload v-model="form.bannerImage" />
          <p class="text-[10px] text-slate-400 font-medium px-1 italic">Recommended size: 1200x600px. Max size: 5MB.</p>
        </div>
      </div>
    </div>

    <!-- 2. Content -->
    <div class="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm space-y-8">
      <h3 class="text-base font-black text-slate-900 tracking-tight flex items-center gap-3">
        <span class="w-8 h-8 rounded-xl bg-orange-50 text-[#DE6129] flex items-center justify-center text-xs">2</span>
        Content Builder
      </h3>
      
      <TiptapEditor v-model="form.content" />
    </div>

    <!-- 3. Audience -->
    <div class="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm space-y-8">
      <h3 class="text-base font-black text-slate-900 tracking-tight flex items-center gap-3">
        <span class="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs">3</span>
        Target Audience
      </h3>

      <div class="space-y-6">
        <CampaignDropdown 
          v-model="form.primaryAudience" 
          :options="audienceOptions" 
          label="Select Target Segment"
          placeholder="Who should receive this?"
        />

        <!-- Specific Emails logic -->
        <Transition name="fade">
          <div v-if="form.primaryAudience === 'Specific Emails'" class="space-y-2">
            <label class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">Specific Email Addresses</label>
            <textarea 
              v-model="manualEmails"
              placeholder="Enter emails separated by commas (e.g. john@example.com, jane@example.com)"
              class="w-full h-32 p-6 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-blue-600/20 focus:ring-4 focus:ring-blue-600/5 transition-all outline-none font-medium text-sm leading-relaxed"
            ></textarea>
          </div>
        </Transition>
      </div>
    </div>

    <!-- 4. Schedule -->
    <div class="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm space-y-8">
      <h3 class="text-base font-black text-slate-900 tracking-tight flex items-center gap-3">
        <span class="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs">4</span>
        Delivery Schedule
      </h3>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <CampaignDropdown 
          v-model="form.deliveryType" 
          :options="scheduleOptions" 
          label="Delivery Strategy"
          placeholder="When should we send?"
        />

        <div class="pt-1">
          <!-- Future Schedule -->
          <Transition name="fade" mode="out-in">
            <div v-if="form.deliveryType === 'future'" class="space-y-2 animate-in slide-in-from-top-2 duration-300">
               <label class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">Schedule Date & Time</label>
               <input 
                 type="datetime-local" 
                 v-model="form.scheduledAt"
                 class="w-full h-16 px-6 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-blue-600/20 focus:ring-4 focus:ring-blue-600/5 transition-all outline-none font-bold text-sm"
               />
            </div>
            <!-- Cron Option -->
            <div v-else-if="form.deliveryType === 'recurring'" class="space-y-2 animate-in slide-in-from-top-2 duration-300">
               <label class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">Cron Expression (e.g. 0 0 * * *)</label>
               <input 
                 v-model="form.cronExpression"
                 placeholder="Standard cron syntax for recurring sends"
                 class="w-full h-16 px-6 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-blue-600/20 focus:ring-4 focus:ring-blue-600/5 transition-all outline-none font-bold text-sm"
               />
            </div>
            <!-- Immediate Info -->
            <div v-else class="h-full flex items-center px-4">
              <p class="text-xs font-bold text-slate-400 leading-relaxed italic">Campaign will be processed immediately upon creation.</p>
            </div>
          </Transition>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex items-center justify-end gap-6 pt-4">
      <button 
        @click="$emit('close')" 
        class="px-10 py-4 text-sm font-black text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest"
      >
        Discard
      </button>
      <button 
        @click="submit"
        :disabled="loading"
        class="h-16 px-16 bg-gray-900 text-white rounded-2xl font-black text-sm hover:scale-105 active:scale-95 transition-all shadow-xl shadow-gray-900/10 flex items-center gap-3 disabled:opacity-50 disabled:scale-100"
      >
        <span v-if="!loading">{{ form.deliveryType === 'immediate' ? 'Send Campaign' : 'Schedule Campaign' }}</span>
        <div v-else class="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
        <Icon v-if="!loading" name="heroicons:paper-airplane" class="w-4 h-4 -rotate-45" />
      </button>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import TiptapEditor from './ui/TiptapEditor.vue'
import CampaignDropdown from './ui/CampaignDropdown.vue'
import ImageUpload from './ImageUpload.vue'
import Icon from './Icon.vue'
import { useEmailCampaigns } from '@/composables/modules/emails/useEmailCampaigns'

const emit = defineEmits(['close', 'success'])
const { createCampaign, loading } = useEmailCampaigns()

const manualEmails = ref('')

const form = reactive({
  name: '',
  subject: '',
  previewText: '',
  bannerImage: '',
  content: '',
  primaryAudience: 'All Clients',
  deliveryType: 'immediate',
  scheduledAt: '',
  cronExpression: ''
})

const audienceOptions = [
  { label: 'All Clients', value: 'All Clients', description: 'Includes all users and active subscribers' },
  { label: 'Active Subscribers', value: 'Subscribers', description: 'Only users on the mailing list' },
  { label: 'Members', value: 'Members', description: 'Registered platform users only' },
  { label: 'Team', value: 'Team', description: 'Internal MedLabConvo team members' },
  { label: 'Specific Emails', value: 'Specific Emails', description: 'Manually entered list of addresses' },
]

const scheduleOptions = [
  { label: 'Send Immediately', value: 'immediate', description: 'Email will be queued right now' },
  { label: 'Schedule for Future', value: 'future', description: 'Set a specific date and time' },
  { label: 'Recurring (Cron)', value: 'recurring', description: 'Continuous delivery based on a pattern' },
]

const submit = async () => {
  if (!form.name || !form.subject || !form.content) {
    alert('Please fill in the campaign name, subject, and content.')
    return
  }

  const payload = {
    name: form.name,
    subject: form.subject,
    previewText: form.previewText,
    bannerImage: form.bannerImage,
    content: form.content,
    recipientType: [form.primaryAudience],
    recipientEmails: form.primaryAudience === 'Specific Emails' ? manualEmails.value.split(',').map(e => e.trim()) : [],
    status: form.deliveryType === 'immediate' ? 'DRAFT' : (form.deliveryType === 'future' ? 'SCHEDULED' : 'RECURRING'),
    isRecurring: form.deliveryType === 'recurring',
    cronExpression: form.deliveryType === 'recurring' ? form.cronExpression : null,
    scheduledAt: form.deliveryType === 'future' ? form.scheduledAt : null
  }

  try {
    const res = await createCampaign(payload)
    if (res) {
      if (form.deliveryType === 'immediate') {
         // Auto-trigger send if immediate
         const { sendCampaign } = useEmailCampaigns()
         await sendCampaign(res._id)
      }
      emit('success')
    }
  } catch (error) {
    console.error('Campaign creation failed:', error)
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
