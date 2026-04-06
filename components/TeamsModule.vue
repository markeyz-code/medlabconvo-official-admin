<template>
  <div class="space-y-12 animate-in fade-in duration-700">
    <!-- Action Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl relative overflow-hidden">
      <!-- Background Decor -->
      <div class="absolute right-0 top-0 w-64 h-64 bg-[#033958]/5 blur-3xl rounded-full"></div>
      
      <div class="relative z-10 space-y-2">
        <h2 class="text-3xl font-black text-slate-900 tracking-tighter uppercase ">Board Management</h2>
        <p class="text-sm font-bold text-slate-400 tracking-widest uppercase">Administer the governing body and executive registry</p>
      </div>

      <div class="relative z-10 flex items-center gap-4 w-full sm:w-auto">
        <NuxtLink
          to="/dashboard/leadership/create"
          class="flex-1 sm:flex-none px-10 py-5 bg-[#033958] text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.25em] hover:bg-[#022a41] transition-all flex items-center justify-center space-x-3 shadow-2xl active:scale-95"
        >
          <Icon name="lucide:plus-circle" class="w-5 h-5" />
          <span>Add Visionary</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Search & Control Base -->
    <div class="flex flex-col md:flex-row gap-6 max-w-4xl">
      <div class="flex-1">
        <AnimatedInput 
          v-model="searchQuery" 
          id="search-teams" 
          label="Filter by Name or Title..." 
          type="text" 
        />
      </div>
      <div class="w-full md:w-64">
        <SelectInput 
          v-model="categoryFilter" 
          label="Executive Group" 
          :options="[
            { label: 'All Positions', value: '' },
            { label: 'Executive Board', value: 'Executive Board' },
            { label: 'Management Team', value: 'Management Team' },
            { label: 'Volunteer Committee', value: 'Volunteer Committee' },
            { label: 'Advisory Council', value: 'Advisory Council' }
          ]" 
        />
      </div>
    </div>

    <!-- Registry Table -->
    <div class="bg-white rounded-[3.5rem] border border-slate-100 shadow-2xl overflow-hidden relative min-h-[400px]">
      <!-- Loading Overlay -->
      <div v-if="loading" class="absolute inset-0 bg-white/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center">
         <div class="w-12 h-12 border-4 border-slate-100 border-t-[#033958] rounded-full animate-spin mb-4"></div>
         <span class="text-[10px] font-black uppercase tracking-widest text-[#033958]">Accessing Archives...</span>
      </div>

      <div v-if="!loading && filteredMembers.length === 0" class="py-40 text-center">
        <div class="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
           <Icon name="lucide:users-round" class="w-12 h-12 text-slate-200" />
        </div>
        <h3 class="text-xl font-black text-slate-900 uppercase tracking-tighter ">Registry is Empty</h3>
        <p class="text-sm font-bold text-slate-400 uppercase tracking-widest mt-2">No leaders match your current filters.</p>
      </div>

      <table v-else class="w-full text-left border-collapse">
        <thead>
          <tr class="border-b border-slate-100">
            <th class="px-10 py-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Headshot</th>
            <th class="px-10 py-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Leader Profile</th>
            <th class="px-10 py-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Governance Level</th>
            <th class="px-10 py-8 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Rank</th>
            <th class="px-10 py-8 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Protocol</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-50">
          <tr v-for="member in filteredMembers" :key="member._id" class="group hover:bg-slate-50/50 transition-colors">
            <td class="px-10 py-8">
              <div class="relative w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-md transform group-hover:scale-110 transition-transform">
                 <img v-if="member.image" :src="member.image" class="w-full h-full object-cover" />
                 <div v-else class="w-full h-full flex items-center justify-center text-slate-300">
                    <Icon name="lucide:user" class="w-8 h-8" />
                 </div>
              </div>
            </td>
            <td class="px-10 py-8">
               <div class="flex flex-col">
                  <span class="text-lg font-black text-slate-900 uppercase  tracking-tighter">{{ member.name }}</span>
                  <span class="text-[10px] font-bold text-[#033958] uppercase tracking-widest">{{ member.title }}</span>
               </div>
            </td>
            <td class="px-10 py-8 text-center sm:text-left">
               <div class="inline-flex items-center gap-2 px-3 py-1 bg-[#033958] text-white text-[9px] font-black uppercase tracking-widest rounded-lg">
                  {{ member.roleCategory || 'General' }}
               </div>
            </td>
            <td class="px-10 py-8 text-center text-sm font-black text-slate-300">
               {{ member.position }}
            </td>
            <td class="px-10 py-8 text-right">
               <div class="flex items-center justify-end space-x-3 opacity-100 md:opacity-0 group-hover:opacity-100 transition-all">
                  <NuxtLink 
                    :to="`/dashboard/leadership/${member._id}`"
                    class="p-3 text-slate-400 hover:text-[#033958] hover:bg-[#033958]/5 rounded-xl border border-slate-100 transition-all shadow-sm"
                    title="Edit Dossier"
                  >
                    <Icon name="lucide:square-pen" class="w-5 h-5" />
                  </NuxtLink>
                  <button 
                    @click="handleDelete(member._id!)" 
                    class="p-3 text-slate-200 hover:text-rose-600 hover:bg-rose-50 rounded-xl border border-slate-100 transition-all shadow-sm"
                    title="Purge Link"
                  >
                    <Icon name="lucide:trash-2" class="w-5 h-5" />
                  </button>
               </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { teams_api, type TeamMember } from '@/api_factory/modules/teams'
import { useCustomToast } from '@/composables/core/useCustomToast'
import AnimatedInput from '@/components/ui/AnimatedInput.vue'
import SelectInput from '@/components/ui/SelectInput.vue'
import Icon from '@/components/Icon.vue'

const { showToast } = useCustomToast()

const members = ref<TeamMember[]>([])
const loading = ref(false)
const searchQuery = ref('')
const categoryFilter = ref('')

const fetchMembers = async () => {
  loading.value = true
  try {
    const res = await teams_api.$_get_members()
    members.value = res.data
  } catch (e) {
    showToast({ title: 'System Error', message: 'Registry fetch failure.', toastType: 'error' })
  } finally {
    loading.value = false
  }
}

onMounted(fetchMembers)

const filteredMembers = computed(() => {
  let list = [...members.value]
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(m => m.name.toLowerCase().includes(q) || m.title.toLowerCase().includes(q))
  }
  if (categoryFilter.value) {
    list = list.filter(m => m.roleCategory === categoryFilter.value)
  }
  return list.sort((a, b) => (a.position || 0) - (b.position || 0))
})

const handleDelete = async (id: string) => {
  if (confirm('Are you sure? This will purge the leader registry node.')) {
    try {
      await teams_api.$_delete_member(id)
      showToast({ title: 'Node Purged', message: 'Leader removed from governance.', toastType: 'success' })
      await fetchMembers()
    } catch (e) {
      showToast({ title: 'Protocol Failure', message: 'Delete operation aborted.', toastType: 'error' })
    }
  }
}
</script>