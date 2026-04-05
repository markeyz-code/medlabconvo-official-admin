<template>
  <div class="space-y-8 animate-in fade-in duration-700">
    <!-- Header Actions -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      <div class="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
        <div class="w-full sm:w-72">
          <AnimatedInput
            v-model="searchQuery"
            id="search-labcast"
            label="Search episodes"
            type="text"
            @input="debouncedSearch"
          />
        </div>
        <div class="w-full sm:w-48">
          <SelectInput
            v-model="selectedSeason"
            label="Season"
            :options="seasonOptions"
            @change="filterBySeason"
          />
        </div>
      </div>
      <div class="flex items-center space-x-4 w-full md:w-auto">
        <button
          @click="showBatchModal = true"
          class="flex-1 md:flex-none px-6 py-3 border border-slate-200 text-slate-900 rounded-xl hover:bg-slate-50 transition-all font-bold text-sm flex items-center justify-center space-x-2"
        >
          <Icon name="heroicons:arrow-up-tray" class="w-5 h-4" />
          <span>Batch upload</span>
        </button>
        <button
          @click="openCreateModal"
          class="flex-1 md:flex-none px-6 py-3 bg-[#033958] text-white rounded-xl hover:bg-[#022a41] transition-all duration-300 flex items-center justify-center space-x-3 group"
        >
          <Icon name="heroicons:plus" class="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          <span class="font-bold text-sm">New Episode</span>
        </button>
      </div>
    </div>

    <!-- Stats Overview -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="stat in labcastStatsList" :key="stat.title" class="p-6 bg-white rounded-3xl border border-slate-100 flex items-center space-x-4">
        <div :class="['w-12 h-12 rounded-2xl flex items-center justify-center', stat.bg]">
          <Icon :name="stat.icon" :class="['w-6 h-6', stat.color]" />
        </div>
        <div>
          <p class="text-[10px] font-bold text-slate-400 mb-1">{{ stat.title }}</p>
          <p class="text-xl font-bold text-slate-900 tracking-tight">{{ stat.value }}</p>
        </div>
      </div>
    </div>

    <!-- Episodes Grid -->
    <div v-if="labcastsLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      <div v-for="i in 8" :key="i" class="bg-slate-50 rounded-2xl h-80 animate-pulse"></div>
    </div>

    <div v-else-if="labcasts?.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      <div
        v-for="episode in labcasts"
        :key="episode.id"
        class="group bg-white rounded-3xl border border-slate-100 overflow-hidden hover:border-[#033958]/10 transition-all duration-500"
      >
        <div class="relative h-48 bg-slate-50 overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-br from-[#033958]/5 to-transparent group-hover:scale-110 transition-transform duration-700"></div>
          <div class="absolute inset-0 flex items-center justify-center">
            <Icon name="heroicons:microphone" class="w-12 h-12 text-slate-100 group-hover:text-slate-200 transition-colors duration-500" />
          </div>
          <div class="absolute top-4 left-4">
            <span class="px-3 py-1 bg-white/80 backdrop-blur-md text-[10px] font-bold rounded-full border border-slate-100">
              S{{ episode.season }} E{{ episode.episode }}
            </span>
          </div>
        </div>
        <div class="p-6">
          <h3 class="text-lg font-bold text-slate-900 mb-2 line-clamp-2 leading-tight group-hover:text-[#033958] transition-colors">{{ episode.title }}</h3>
          <p class="text-sm font-medium text-slate-500 mb-6 line-clamp-2">{{ episode.description }}</p>
          
          <div class="flex items-center justify-between pt-4 border-t border-slate-50">
            <div class="flex items-center space-x-2 text-slate-400">
              <Icon name="heroicons:clock" class="w-4 h-4" />
              <span class="text-[10px] font-bold">{{ episode.duration || '00:00' }}</span>
            </div>
            <div class="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button @click="editEpisode(episode)" class="p-2 text-slate-400 hover:text-[#033958] hover:bg-slate-50 rounded-lg">
                <Icon name="heroicons:pencil" class="w-4 h-4" />
              </button>
              <button @click="deleteConfirm(episode)" class="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg">
                <Icon name="heroicons:trash" class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="flex flex-col items-center justify-center py-24 bg-slate-50 rounded-[40px] border border-dashed border-slate-200">
      <div class="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mb-6">
        <Icon name="heroicons:microphone" class="w-10 h-10 text-slate-100" />
      </div>
      <h3 class="text-xl font-bold text-slate-900 mb-2 tracking-tight">No episodes found</h3>
      <p class="text-slate-500 mb-8 max-w-xs text-center leading-relaxed font-medium">Your podcast library is currently empty. Upload your first episode to get started.</p>
      <button
        @click="openCreateModal"
        class="px-8 py-3 bg-[#033958] text-white rounded-xl hover:bg-[#022a41] transition-all font-bold text-sm"
      >
        Upload first episode
      </button>
    </div>

    <!-- SlideOver for Create/Edit -->
    <SlideOver v-model="showModal" :title="editingEpisode ? 'Edit episode' : 'New episode'">
      <div class="p-8 space-y-8">
        <div class="grid grid-cols-2 gap-6">
          <AnimatedInput v-model="form.season" id="season" label="Season number" type="number" />
          <AnimatedInput v-model="form.episode" id="episode" label="Episode number" type="number" />
        </div>
        <AnimatedInput v-model="form.title" id="title" label="Episode title" type="text" />
        <div class="space-y-4">
          <label class="text-sm font-bold text-slate-400 ml-1">Description</label>
          <textarea
            v-model="form.description"
            rows="4"
            class="w-full p-6 bg-slate-50 border border-slate-100 rounded-3xl focus:ring-2 focus:ring-[#033958] focus:bg-white font-medium text-slate-700 resize-none transition-all outline-none"
            placeholder="What is this episode about?"
          ></textarea>
        </div>
        <div class="flex justify-end pt-8 gap-4 border-t border-slate-50">
          <button @click="showModal = false" class="px-8 py-3 text-sm font-bold text-slate-400 hover:text-slate-900">Cancel</button>
          <button @click="handleSave" :disabled="createLoading || updateLoading" class="px-10 py-3 bg-[#033958] text-white rounded-xl font-bold text-sm hover:bg-[#022a41] transition-all active:scale-95 disabled:opacity-50">
            {{ editingEpisode ? 'Save changes' : 'Create episode' }}
          </button>
        </div>
      </div>
    </SlideOver>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { useCreateLabCast } from "@/composables/modules/labcast/useCreateLabCast"
import { useGetLabCasts } from "@/composables/modules/labcast/useGetLabCasts"
import { useGetSeasons } from "@/composables/modules/labcast/useGetSeasons"
import { useGetLabCastStats } from "@/composables/modules/labcast/useGetLabCastStats"
import { useUpdateLabCast } from "@/composables/modules/labcast/useUpdateLabCast"
import { useDeleteLabCast } from "@/composables/modules/labcast/useDeleteLabCast"
import AnimatedInput from "@/components/ui/AnimatedInput.vue"
import SelectInput from "@/components/ui/SelectInput.vue"
import Icon from "@/components/Icon.vue"
import SlideOver from "@/components/SlideOver.vue"

const { createLabCast, loading: createLoading } = useCreateLabCast()
const { labcasts, loading: labcastsLoading, getLabCasts } = useGetLabCasts()
const { seasons, getSeasons } = useGetSeasons()
const { stats, getStats } = useGetLabCastStats()
const { updateLabCast, loading: updateLoading } = useUpdateLabCast()
const { deleteLabCast } = useDeleteLabCast()

const searchQuery = ref('')
const selectedSeason = ref('')
const showModal = ref(false)
const showBatchModal = ref(false)
const editingEpisode = ref<any>(null)

const form = ref({
  title: '',
  description: '',
  season: 1,
  episode: 1,
  duration: 0,
  audioUrl: '',
  image: '',
  hosts: [] as string[],
  guest: '',
  guestTitle: '',
  thumbnailUrl: '',
  spotifyUrl: '',
  appleUrl: '',
  tags: [] as string[]
})

const seasonOptions = computed(() => {
  const options = [{ label: 'All seasons', value: '' }]
  seasons.value?.forEach((s: any) => options.push({ label: `Season ${s}`, value: s }))
  return options
})

const labcastStatsList = computed(() => [
  { title: 'Total episodes', value: stats.value?.totalEpisodes || 0, icon: 'heroicons:microphone', color: 'text-blue-600', bg: 'bg-blue-50' },
  { title: 'Total seasons', value: seasons.value?.length || 0, icon: 'heroicons:list-bullet', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { title: 'Total listeners', value: (stats.value as any)?.totalPlays || 0, icon: 'heroicons:user-group', color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { title: 'Avg. duration', value: stats.value?.averageDuration || '00:00', icon: 'heroicons:clock', color: 'text-amber-600', bg: 'bg-amber-50' }
])

const debouncedSearch = useDebounceFn(() => {
  getLabCasts({ search: searchQuery.value, season: selectedSeason.value ? Number(selectedSeason.value) : undefined })
}, 500)

const filterBySeason = () => getLabCasts({ search: searchQuery.value, season: selectedSeason.value ? Number(selectedSeason.value) : undefined })

const openCreateModal = () => {
  editingEpisode.value = null
  form.value = { 
    title: '', description: '', season: 1, episode: (labcasts.value?.length || 0) + 1, duration: 0, 
    audioUrl: '', image: '', hosts: [], guest: '', guestTitle: '', thumbnailUrl: '', spotifyUrl: '', appleUrl: '', tags: [] 
  }
  showModal.value = true
}

const editEpisode = (episode: any) => {
  editingEpisode.value = episode
  form.value = { ...episode }
  showModal.value = true
}

const handleSave = async () => {
  if (editingEpisode.value) {
    await updateLabCast(editingEpisode.value.id, form.value as any)
  } else {
    await createLabCast(form.value as any)
  }
  showModal.value = false
  getLabCasts()
}

const deleteConfirm = async (episode: any) => {
  if (confirm('Are you sure you want to delete this episode?')) {
    await deleteLabCast(episode.id)
    getLabCasts()
  }
}

onMounted(() => {
  getLabCasts()
  getSeasons()
  getStats()
})
</script>