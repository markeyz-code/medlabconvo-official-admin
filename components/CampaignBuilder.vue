<template>
  <div class="mx-auto max-w-[1180px] space-y-5 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <!-- Header -->
    <div class="flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <button type="button" class="inline-flex items-center gap-1.5 text-[10px] font-semibold text-slate-400 transition hover:text-[#27628C]" @click="$emit('close')">
          <Icon name="lucide:arrow-left" class="h-3.5 w-3.5" />
          Back to campaigns
        </button>
        <h1 class="mt-2 text-xl font-semibold tracking-[-0.03em] text-slate-900">New email campaign</h1>
        <p class="mt-1 text-[11.5px] text-slate-500">Write the message, choose an audience and decide when it goes out.</p>
      </div>
      <div class="flex items-center gap-1.5">
        <span class="rounded-full bg-amber-50 px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.08em] text-amber-700">Draft</span>
        <span class="rounded-full bg-[#eef5f9] px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.08em] text-[#27628C]">Email</span>
      </div>
    </div>

    <div class="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
      <main class="min-w-0 space-y-4">
        <!-- Campaign details -->
        <section class="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="text-[9px] font-bold uppercase tracking-[0.12em] text-[#27628C]">01 · Details</p>
              <h2 class="mt-1 text-sm font-semibold text-slate-900">Campaign details</h2>
            </div>
            <span class="text-[9px] text-slate-400">Required</span>
          </div>

          <div class="mt-4 grid gap-3 sm:grid-cols-2">
            <div>
              <label class="field-label">Campaign name <span class="text-rose-500">*</span></label>
              <input v-model="form.name" type="text" class="input" placeholder="e.g. October newsletter" />
            </div>
            <div>
              <label class="field-label">Subject line <span class="text-rose-500">*</span></label>
              <input v-model="form.subject" type="text" class="input" placeholder="What lands in the inbox" />
            </div>
            <div class="sm:col-span-2">
              <label class="field-label">Preview text <span class="font-normal text-slate-400">(optional)</span></label>
              <input v-model="form.previewText" type="text" class="input" placeholder="A short inbox preview" />
            </div>
          </div>

          <div class="mt-4">
            <label class="field-label">Campaign banner <span class="font-normal text-slate-400">(optional)</span></label>
            <div class="h-32 overflow-hidden rounded-lg border border-dashed border-slate-300 bg-slate-50/50">
              <ImageUpload v-model="form.bannerImage" />
            </div>
            <p class="mt-1.5 text-[9px] text-slate-400">1200 × 600px recommended · 5MB max</p>
          </div>
        </section>

        <!-- Content -->
        <section class="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="text-[9px] font-bold uppercase tracking-[0.12em] text-[#27628C]">02 · Message</p>
              <h2 class="mt-1 text-sm font-semibold text-slate-900">Content</h2>
            </div>
            <span class="text-[9px] text-slate-400">{{ form.content ? 'Ready' : 'Required' }}</span>
          </div>
          <div class="mt-3">
            <TiptapEditor v-model="form.content" placeholder="Write your campaign message…" />
          </div>
        </section>
      </main>

      <!-- Delivery rail -->
      <aside class="space-y-3 lg:sticky lg:top-4 lg:self-start">
        <section class="rounded-xl border border-slate-200 bg-white p-4">
          <p class="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">Audience</p>
          <div class="mt-3">
            <SelectInput v-model="form.primaryAudience" :options="audienceOptions" />
          </div>
          <p v-if="selectedAudience?.description" class="mt-2 text-[9.5px] leading-4 text-slate-400">{{ selectedAudience.description }}</p>
          <div v-if="form.primaryAudience === 'Specific Emails'" class="mt-3">
            <label class="field-label">Email addresses</label>
            <textarea v-model="manualEmails" rows="4" class="textarea" placeholder="one@example.com, two@example.com" />
          </div>
        </section>

        <section class="rounded-xl border border-slate-200 bg-white p-4">
          <p class="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">Delivery</p>
          <div class="mt-3">
            <SelectInput v-model="form.deliveryType" :options="scheduleOptions" />
          </div>
          <div v-if="form.deliveryType === 'future'" class="mt-3">
            <label class="field-label">Schedule date &amp; time</label>
            <input v-model="form.scheduledAt" type="datetime-local" class="input" />
          </div>
          <div v-else-if="form.deliveryType === 'recurring'" class="mt-3">
            <label class="field-label">Cron expression</label>
            <input v-model="form.cronExpression" type="text" class="input" placeholder="0 0 * * *" />
          </div>
          <p v-else class="mt-2 text-[9.5px] leading-4 text-slate-400">The campaign will be queued immediately after creation.</p>
        </section>

        <section class="rounded-xl border border-[#dbe7ee] bg-[#f5f9fb] p-4">
          <p class="text-[9px] font-bold uppercase tracking-[0.12em] text-[#27628C]">Summary</p>
          <div class="mt-2 space-y-1.5 text-[10px]">
            <div class="flex items-center justify-between gap-2"><span class="text-slate-400">Audience</span><span class="truncate font-semibold text-slate-700">{{ selectedAudience?.label || '—' }}</span></div>
            <div class="flex items-center justify-between gap-2"><span class="text-slate-400">Delivery</span><span class="font-semibold text-slate-700">{{ selectedSchedule?.label || '—' }}</span></div>
            <div class="flex items-center justify-between gap-2"><span class="text-slate-400">Message</span><span class="font-semibold" :class="form.content ? 'text-emerald-600' : 'text-amber-600'">{{ form.content ? 'Ready' : 'Not written' }}</span></div>
          </div>
        </section>

        <div class="flex flex-col gap-2">
          <button type="button" class="btn btn-primary w-full" :disabled="loading || !canSubmit" @click="submit">
            <span v-if="loading" class="h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            <Icon v-else name="lucide:send" class="h-3.5 w-3.5" />
            {{ loading ? 'Processing…' : form.deliveryType === 'immediate' ? 'Send campaign' : 'Schedule campaign' }}
          </button>
          <button type="button" class="btn btn-outline w-full" @click="$emit('close')">Discard</button>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import TiptapEditor from './ui/TiptapEditor.vue'
import SelectInput from './ui/SelectInput.vue'
import ImageUpload from './ImageUpload.vue'
import Icon from './Icon.vue'
import { useEmailCampaigns } from '@/composables/modules/emails/useEmailCampaigns'
import { useCustomToast } from '@/composables/core/useCustomToast'

const { showToast } = useCustomToast()

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
  { label: 'Send immediately', value: 'immediate', description: 'Queue the email now' },
  { label: 'Schedule for later', value: 'future', description: 'Pick a date and time' },
  { label: 'Recurring', value: 'recurring', description: 'Run on a cron schedule' },
]

const selectedAudience = computed(() => audienceOptions.find(option => option.value === form.primaryAudience))
const selectedSchedule = computed(() => scheduleOptions.find(option => option.value === form.deliveryType))
const canSubmit = computed(() => Boolean(form.name.trim() && form.subject.trim() && form.content.trim()))

const submit = async () => {
  if (!form.name || !form.subject || !form.content) {
    showToast({
      title: 'Validation Error',
      message: 'Please fill in the campaign name, subject, and content.',
      toastType: 'error'
    })
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
