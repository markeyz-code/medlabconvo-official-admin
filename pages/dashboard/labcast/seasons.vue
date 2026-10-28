<template>
    <div>
      <LabcastAdminHeader 
        title="Seasons" 
        subtitle="Manage your LabCast seasons and episodes"
      />
  
      <!-- Seasons Grid -->
      <div v-if="seasonsLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="i in 6" :key="i" class="admin-skeleton-card h-40"></div>
      </div>

      <div v-else-if="seasonCards.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <button
          v-for="season in seasonCards"
          :key="season.season"
          class="group text-left bg-white rounded-[18px] border border-slate-100 p-5 hover:border-[#27628C]/30 hover:shadow-sm transition-all"
          @click="viewSeason(season.season)"
        >
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-[15px] font-semibold text-slate-900">
              Season {{ season.season }}
            </h3>
            <Icon name="lucide:chevron-right" class="w-4 h-4 text-slate-300 group-hover:text-[#27628C] transition-colors" />
          </div>

          <div class="space-y-2">
            <p v-if="season.episodeCount !== null" class="text-[12.5px] text-slate-500">
              {{ season.episodeCount }} {{ season.episodeCount === 1 ? 'episode' : 'episodes' }}
            </p>
            <p v-else class="text-[12.5px] text-slate-500">Open the season to browse its episodes</p>
            <div class="flex items-center text-[11.5px] font-medium text-slate-400">
              <Icon name="lucide:calendar" class="w-3.5 h-3.5 mr-1.5" />
              <span>Season {{ season.season }}</span>
            </div>
          </div>
        </button>
      </div>

      <div v-else class="bg-white rounded-[18px] border border-slate-100 overflow-hidden">
        <AdminEmptyState
          icon="lucide:layers"
          title="No seasons found"
          description="Create your first episode to start a season."
        />
      </div>
  
      <!-- Season Episodes Modal -->
      <Modal v-model="showSeasonModal" :title="`Season ${selectedSeason ?? ''} episodes`" size="2xl">
        <AdminTableLoading v-if="episodesBySeasonLoading" :columns="3" :rows="4" label="Loading episodes" />

        <div v-else-if="episodesBySeason?.length" class="space-y-2">
          <div
            v-for="episode in episodesBySeason"
            :key="episode._id"
            class="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors"
          >
            <img
              :src="episode.thumbnailUrl"
              :alt="episode.title"
              class="w-14 h-14 rounded-lg object-cover bg-slate-100"
            />
            <div class="flex-1 min-w-0">
              <h4 class="text-[13px] font-semibold text-slate-900 truncate">{{ episode.title }}</h4>
              <p class="text-[11.5px] text-slate-500">
                Episode {{ episode.episode }} · {{ episode.duration }}m
              </p>
              <span
                :class="[
                  'inline-flex items-center px-2 py-0.5 mt-1 rounded-full text-[10px] font-semibold',
                  episode.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                ]"
              >
                {{ episode.isActive ? 'Active' : 'Inactive' }}
              </span>
            </div>
            <NuxtLink
              :to="`/dashboard/labcast?season=${episode.season}`"
              class="btn btn-outline"
            >
              View
            </NuxtLink>
          </div>
        </div>

        <AdminEmptyState
          v-else
          icon="lucide:podcast"
          title="No episodes in this season"
          description="Episodes added to this season will appear here."
          compact
        />
      </Modal>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed, ref, onMounted } from '#imports'
  import { useGetSeasons } from "@/composables/modules/labcast/useGetSeasons"
  import { useGetEpisodesBySeason } from "@/composables/modules/labcast/useGetEpisodesBySeason"
  import Icon from '@/components/Icon.vue'
import AdminTableLoading from '@/components/AdminTableLoading.vue'
import AdminEmptyState from '@/components/AdminEmptyState.vue'
  
 definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
  permission: 'labcast:read'
})
  
  const showSeasonModal = ref(false)
  const selectedSeason = ref<number | null>(null)

  
  // Get all available seasons
  const {
    loading: seasonsLoading,
    error: seasonsError,
    seasons,
    getSeasons,
    resetState: resetSeasonsState
  } = useGetSeasons()
  
  const seasonCards = computed(() =>
    (seasons.value || []).map((season: any) =>
      typeof season === 'number'
        ? { season, episodeCount: null }
        : { season: Number(season.season), episodeCount: season.episodeCount ?? null },
    ).filter((season) => Number.isFinite(season.season)),
  )

  // Get episodes by season
  const {
    loading: episodesBySeasonLoading,
    error: episodesBySeasonError,
    episodes: episodesBySeason,
    getEpisodesBySeason,
    resetState: resetEpisodesBySeasonState
  } = useGetEpisodesBySeason()
  
  const viewSeason = async (seasonNumber: number) => {
    selectedSeason.value = seasonNumber
    showSeasonModal.value = true
    await getEpisodesBySeason(seasonNumber)
  }
  
  // Load data on mount
  onMounted(async () => {
    await getSeasons()
  })
  </script>
  