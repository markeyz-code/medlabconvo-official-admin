<template>
  <div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
    
    <!-- Conditional View: List vs Builder -->
    <div v-if="!isBuilding" class="space-y-8">
      <!-- Action Header -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 rounded-[2rem] border border-slate-100">
        <div class="flex items-center gap-6">
          <div class="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-[#27628C]">
            <Icon name="heroicons:megaphone" class="w-8 h-8" />
          </div>
          <div>
            <h2 class="text-2xl font-black text-slate-900 tracking-tight">Campaign Analytics</h2>
            <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Marketing & Automation</p>
          </div>
        </div>

        <button
          @click="startBuilding"
          class="px-8 py-4 bg-gray-900 text-white rounded-2xl font-black text-sm hover:scale-105 active:scale-95 transition-all flex items-center gap-3 shadow-xl shadow-gray-900/10 group"
        >
          <Icon name="heroicons:plus" class="w-5 h-5 group-hover:rotate-90 transition-transform" />
          <span>New Campaign</span>
        </button>
      </div>

      <!-- Campaigns List Table -->
      <div class="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden relative shadow-sm">
        <div v-if="loading" class="absolute inset-0 bg-white/80 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center">
          <div class="w-12 h-12 border-4 border-slate-100 border-t-[#27628C] rounded-full animate-spin mb-4"></div>
          <p class="text-[10px] font-black text-[#27628C] uppercase tracking-widest animate-pulse">Syncing Engine...</p>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left border-separate border-spacing-0">
            <thead>
              <tr class="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                <th class="px-10 py-6 border-b border-slate-100">Campaign Identity</th>
                <th class="px-10 py-6 border-b border-slate-100">Recipient Audience</th>
                <th class="px-10 py-6 border-b border-slate-100">Schedule Status</th>
                <th class="px-10 py-6 border-b border-slate-100">Delivery Status</th>
                <th class="px-10 py-6 text-right border-b border-slate-100">Execution</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr v-for="campaign in campaigns" :key="campaign._id" class="group hover:bg-slate-50/10 transition-all duration-300">
                <td class="px-10 py-8 whitespace-nowrap">
                  <div class="flex flex-col">
                    <span class="text-slate-900 font-black text-sm tracking-tight">{{ campaign.name }}</span>
                    <span class="text-[10px] font-bold text-slate-400 mt-1 italic">{{ campaign.subject }}</span>
                  </div>
                </td>
                <td class="px-10 py-8 whitespace-nowrap">
                   <div class="flex items-center gap-1.5 flex-wrap max-w-[200px]">
                      <span v-for="type in campaign.recipientType" :key="type" class="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[9px] font-black text-slate-600 uppercase">
                        {{ type }}
                      </span>
                   </div>
                </td>
                <td class="px-10 py-8 whitespace-nowrap text-slate-500 font-bold text-sm">
                   {{ campaign.status === 'RECURRING' ? 'Every ' + (campaign.cronExpression || '---') : (campaign.scheduledAt ? formatDate(campaign.scheduledAt) : 'Manual Trigger') }}
                </td>
                <td class="px-10 py-8 whitespace-nowrap">
                  <span :class="[
                    'px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border',
                    statusClass(campaign.status)
                  ]">
                    {{ campaign.status }}
                  </span>
                </td>
                <td class="px-10 py-8 whitespace-nowrap text-right">
                  <button
                    v-if="campaign.status === 'DRAFT'"
                    @click="handleSendNow(campaign._id)"
                    class="h-10 px-4 bg-blue-50 text-[#27628C] rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#27628C] hover:text-white transition-all active:scale-95"
                  >
                    Fire Trigger
                  </button>
                  <span v-else class="text-[10px] font-black text-slate-300 uppercase tracking-widest">Locked</span>
                </td>
              </tr>
            </tbody>
          </table>
          
          <!-- Empty State -->
          <div v-if="!loading && campaigns.length === 0" class="py-32 text-center bg-slate-50/10">
            <div class="w-32 h-32 bg-white rounded-[3rem] flex items-center justify-center mx-auto mb-8 border border-slate-200 shadow-sm relative">
               <div class="absolute inset-0 bg-[#27628B]/5 rounded-full blur-2xl"></div>
               <Icon name="heroicons:envelope-open" class="w-14 h-14 text-slate-100 relative z-10" />
            </div>
            <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">Zero Campaigns Detected</h3>
            <p class="text-slate-400 text-sm font-bold max-w-sm mx-auto leading-relaxed">Your message queue is currently empty. Initiate your first marketing blast to begin engaging with the community.</p>
            <button @click="startBuilding" class="mt-10 px-10 py-5 bg-[#27628C] text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-blue-900/20">
               Craft First Identity
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 2. Builder View -->
    <div v-else class="min-h-screen">
      <CampaignBuilder @close="isBuilding = false" @success="handleSuccess" />
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useEmailCampaigns } from '@/composables/modules/emails/useEmailCampaigns'
import CampaignBuilder from '@/components/CampaignBuilder.vue'
import Icon from '@/components/Icon.vue'

const { campaigns, loading, getCampaigns, sendCampaign } = useEmailCampaigns()
const isBuilding = ref(false)

const startBuilding = () => {
  isBuilding.value = true
}

const handleSuccess = async () => {
  isBuilding.value = false
  await getCampaigns()
}

onMounted(() => {
  getCampaigns()
})

const handleSendNow = async (id: string) => {
  if (confirm('Trigger immediate delivery? This identity will be processed by the mail engine instantly.')) {
    await sendCampaign(id)
    await getCampaigns()
  }
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const statusClass = (status: string) => {
  switch (status) {
    case 'SENT': return 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-sm shadow-emerald-500/10 font-black'
    case 'SENDING': return 'bg-blue-50 text-blue-600 border-blue-100 animate-pulse font-black'
    case 'SCHEDULED': return 'bg-amber-50 text-amber-600 border-amber-100 font-black'
    case 'RECURRING': return 'bg-indigo-50 text-indigo-600 border-indigo-100 font-black'
    case 'FAILED': return 'bg-rose-50 text-rose-600 border-rose-100 font-black'
    default: return 'bg-slate-50 text-slate-400 border-slate-100 font-black'
  }
}
</script>
