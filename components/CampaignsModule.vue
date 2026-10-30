<template>
  <div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
    
    <!-- Conditional View: List vs Builder -->
    <div v-if="!isBuilding" class="space-y-8">
      <!-- Action Header -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 rounded-[1.25rem] border border-slate-100">
        <div class="flex items-center gap-6">
          <div class="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-[#27628C]">
            <Icon name="lucide:megaphone" class="w-8 h-8" />
          </div>
          <div>
            <h2 class="text-lg font-black text-slate-900 tracking-tight">Campaign Analytics</h2>
            <p class="text-xs font-bold text-slate-400  tracking-normal mt-1">Marketing & Automation</p>
          </div>
        </div>

        <button v-if="hasPermission('campaigns:create')" @click="startBuilding" class="btn btn-primary w-full md:w-auto">
          <Icon name="lucide:plus" class="w-4 h-4" />
          New campaign
        </button>
      </div>

      <!-- Campaigns List Table -->
      <div class="bg-white rounded-[1.5rem] border border-slate-100 overflow-hidden relative shadow-sm">
        <AdminTableLoading v-if="loading" :columns="5" :rows="5" label="Loading campaigns" />

        <div v-else-if="campaigns.length" class="overflow-x-auto">
          <table class="admin-table stack-table w-full text-left border-separate border-spacing-0">
            <thead>
              <tr class="bg-slate-50/50 text-sm font-black text-slate-400  tracking-normal">
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
                    <span class="text-sm font-bold text-slate-400 mt-1 italic">{{ campaign.subject }}</span>
                  </div>
                </td>
                <td class="px-10 py-8 whitespace-nowrap">
                   <div class="flex items-center gap-1.5 flex-wrap max-w-[200px]">
                      <span v-for="type in campaign.recipientType" :key="type" class="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[9px] font-black text-slate-600 ">
                        {{ type }}
                      </span>
                   </div>
                </td>
                <td class="px-10 py-8 whitespace-nowrap text-slate-500 font-bold text-sm">
                   {{ campaign.status === 'RECURRING' ? 'Every ' + (campaign.cronExpression || '---') : (campaign.scheduledAt ? formatDate(campaign.scheduledAt) : 'Manual Trigger') }}
                </td>
                <td class="px-10 py-8 whitespace-nowrap">
                  <span :class="[
                    'px-4 py-1.5 rounded-full text-[9px] font-black  tracking-normal border',
                    statusClass(campaign.status)
                  ]">
                    {{ campaign.status }}
                  </span>
                </td>
                <td class="px-10 py-8 whitespace-nowrap text-right">
                  <button
                    v-if="campaign.status === 'DRAFT'"
                    @click="handleSendNow(campaign._id)"
                    class="h-10 px-4 bg-blue-50 text-[#27628C] rounded-xl font-black text-sm  tracking-normal hover:bg-[#27628C] hover:text-white transition-all active:scale-95"
                  >
                    Fire Trigger
                  </button>
                  <span v-else class="text-sm font-black text-slate-300  tracking-normal">Locked</span>
                </td>
              </tr>
            </tbody>
          </table>
          
        </div>

        <AdminEmptyState
          v-else
          icon="lucide:mail-open"
          title="No campaigns yet"
          description="Your message queue is empty. Create your first campaign to start engaging the community."
        >
          <button v-if="hasPermission('campaigns:create')" class="btn btn-primary" @click="startBuilding">
            <Icon name="lucide:send" class="w-4 h-4" />
            Create campaign
          </button>
        </AdminEmptyState>
      </div>
    </div>

    <!-- 2. Builder View -->
    <div v-else class="min-h-screen">
      <CampaignBuilder @close="isBuilding = false" @success="handleSuccess" />
    </div>

    <!-- Trigger Confirmation Modal -->
    <ConfirmModal
      v-model="showTriggerModal"
      title="Initiate Campaign"
      message="Are you sure you want to trigger immediate delivery? This identity will be processed by the mail engine instantly."
      confirmText="Yes, Fire Trigger"
      confirmClass="bg-blue-600 hover:bg-blue-700"
      @confirm="executeSendNow"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useEmailCampaigns } from '@/composables/modules/emails/useEmailCampaigns'
import CampaignBuilder from '@/components/CampaignBuilder.vue'
import Icon from '@/components/Icon.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'
import { useUser } from '@/composables/modules/auth/user'
import AdminEmptyState from '@/components/AdminEmptyState.vue'
import AdminTableLoading from '@/components/AdminTableLoading.vue'

const { hasPermission } = useUser()

const { campaigns, loading, getCampaigns, sendCampaign } = useEmailCampaigns()
const isBuilding = ref(false)
const showTriggerModal = ref(false)
const campaignIdToTrigger = ref('')

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

const handleSendNow = (id: string) => {
  campaignIdToTrigger.value = id
  showTriggerModal.value = true
}

const executeSendNow = async () => {
  if (!campaignIdToTrigger.value) return
  await sendCampaign(campaignIdToTrigger.value)
  showTriggerModal.value = false
  campaignIdToTrigger.value = ''
  await getCampaigns()
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
    case 'SENT': return 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-sm font-black'
    case 'SENDING': return 'bg-blue-50 text-blue-600 border-blue-100 animate-pulse font-black'
    case 'SCHEDULED': return 'bg-amber-50 text-amber-600 border-amber-100 font-black'
    case 'RECURRING': return 'bg-indigo-50 text-indigo-600 border-indigo-100 font-black'
    case 'FAILED': return 'bg-rose-50 text-rose-600 border-rose-100 font-black'
    default: return 'bg-slate-50 text-slate-400 border-slate-100 font-black'
  }
}
</script>
