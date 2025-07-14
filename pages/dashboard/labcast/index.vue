<template>
    <div class="min-h-screen">
      <!-- Header Section -->
      <div class="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-200/50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div class="space-y-1">
              <h1 class="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Episodes
              </h1>
              <p class="text-gray-600">Manage your LabCast episodes with style</p>
            </div>
              <button
              @click="showCreateModal = true"
              class="group relative inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Icon name="lucide:plus" class="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-200" />
              Add Episode
              <div class="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400 to-indigo-400 opacity-0 group-hover:opacity-20 transition-opacity duration-200"></div>
            </button>
          </div>
        </div>
      </div>



      <div class="space-y-8">
        <!-- Enhanced Filters Section -->
        <div class="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            <!-- Search with Animation -->
            <div class="relative group">
              <label class="block text-sm font-semibold text-gray-700 mb-2">Search Episodes</label>
              <div class="relative w-full">
                <Icon 
                  name="lucide:search" 
                  class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-blue-500 transition-colors duration-200" 
                />
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Search by title, description..."
                  class="pl-10 pr-4 w-full py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm hover:bg-white/80 transition-all duration-200 placeholder-gray-400"
                  @input="debouncedSearch"
                />
                <div class="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-indigo-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
              </div>
            </div>
  
            <!-- Season Filter -->
            <div class="relative group">
              <label class="block text-sm font-semibold text-gray-700 mb-2">Season</label>
              <select
                v-model="selectedSeason"
                class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm hover:bg-white/80 transition-all duration-200 appearance-none cursor-pointer"
                @change="applyFilters"
              >
                <option value="">All Seasons</option>
                <option v-for="season in seasons" :key="season.season" :value="season.season">
                  Season {{ season.season }} ({{ season.episodeCount }} episodes)
                </option>
              </select>
              <Icon name="lucide:chevron-down" class="absolute right-3 top-1/2 transform -translate-y-1/2 mt-4 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>
  
            <!-- Status Filter -->
            <div class="relative group">
              <label class="block text-sm font-semibold text-gray-700 mb-2">Status</label>
              <select
                v-model="selectedStatus"
                class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm hover:bg-white/80 transition-all duration-200 appearance-none cursor-pointer"
                @change="applyFilters"
              >
                <option value="">All Status</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
              <Icon name="lucide:chevron-down" class="absolute right-3 top-1/2 transform -translate-y-1/2 mt-4 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>
  
            <!-- Sort Options -->
            <div class="relative group">
              <label class="block text-sm font-semibold text-gray-700 mb-2">Sort By</label>
              <select
                v-model="sortBy"
                class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm hover:bg-white/80 transition-all duration-200 appearance-none cursor-pointer"
                @change="applyFilters"
              >
                <option value="publishedAt:desc">Latest First</option>
                <option value="publishedAt:asc">Oldest First</option>
                <option value="title:asc">Title A-Z</option>
                <option value="title:desc">Title Z-A</option>
                <option value="season:desc">Season (High-Low)</option>
                <option value="episode:desc">Episode (High-Low)</option>
              </select>
              <Icon name="lucide:chevron-down" class="absolute right-3 top-1/2 transform -translate-y-1/2 mt-4 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>
  
            <!-- View Toggle -->
            <!-- <div class="flex flex-col justify-end">
              <label class="block text-sm font-semibold text-gray-700 mb-2">View</label>
              <div class="flex rounded-xl border border-gray-200 bg-white/50 backdrop-blur-sm p-1">
                <button
                  @click="viewMode = 'grid'"
                  :class="[
                    'flex-1 flex items-center justify-center px-3 py-2 rounded-lg transition-all duration-200',
                    viewMode === 'grid' 
                      ? 'bg-blue-500 text-white shadow-md' 
                      : 'text-gray-600 hover:text-blue-500 hover:bg-blue-50'
                  ]"
                >
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" class="w-4 h-4" fill="#000000" viewBox="0 0 256 256"><path d="M104,40H56A16,16,0,0,0,40,56v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V56A16,16,0,0,0,104,40Zm0,64H56V56h48v48Zm96-64H152a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V56A16,16,0,0,0,200,40Zm0,64H152V56h48v48Zm-96,32H56a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V152A16,16,0,0,0,104,136Zm0,64H56V152h48v48Zm96-64H152a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V152A16,16,0,0,0,200,136Zm0,64H152V152h48v48Z"></path></svg>
                </button>
                <button
                  @click="viewMode = 'list'"
                  :class="[
                    'flex-1 flex items-center justify-center px-3 py-2 rounded-lg transition-all duration-200',
                    viewMode === 'list' 
                      ? 'bg-blue-500 text-white shadow-md' 
                      : 'text-gray-600 hover:text-blue-500 hover:bg-blue-50'
                  ]"
                >
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" class="w-4 h-4" fill="#000000" viewBox="0 0 256 256"><path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z"></path></svg>
                </button>
              </div>
            </div> -->
          </div>
        </div>

        
  
        <!-- Episodes Grid/List -->
        <div class="relative">
          <!-- Loading State -->
          <div v-if="labcastsLoading" class="space-y-6">
            <div :class="[
              'grid gap-6',
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            ]">
              <div v-for="i in 6" :key="i" class="bg-white/70 backdrop-blur-sm rounded-2xl p-6 animate-pulse">
                <div class="flex space-x-4">
                  <div class="w-20 h-20 bg-gray-200 rounded-xl"></div>
                  <div class="flex-1 space-y-3">
                    <div class="h-4 bg-gray-200 rounded-lg w-3/4"></div>
                    <div class="h-3 bg-gray-200 rounded-lg w-1/2"></div>
                    <div class="h-3 bg-gray-200 rounded-lg w-1/4"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          <!-- Episodes List -->
          <TransitionGroup
            v-else-if="currentEpisodes?.length"
            enter-active-class="transition-all duration-500 ease-out"
            enter-from-class="opacity-0 scale-95 translate-y-4"
            enter-to-class="opacity-100 scale-100 translate-y-0"
            leave-active-class="transition-all duration-300 ease-in"
            leave-from-class="opacity-100 scale-100 translate-y-0"
            leave-to-class="opacity-0 scale-95 -translate-y-4"
            tag="div"
            class="space-y-3"
          >
            <div
              v-for="(episode, index) in currentEpisodes"
              :key="episode._id"
              :draggable="!searchQuery && !selectedSeason"
              :class="[
                'bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all duration-300 group relative overflow-hidden',
                {
                  'cursor-move': !searchQuery && !selectedSeason,
                  'opacity-50 scale-95': draggedIndex === index,
                  'border-amber-300 shadow-amber-100': dropTargetIndex === index && draggedIndex !== index,
                  'cursor-not-allowed opacity-60': reorderLoading
                }
              ]"
              @dragstart="handleDragStart($event, index)"
              @dragend="handleDragEnd"
              @dragover="handleDragOver($event, index)"
              @dragleave="handleDragLeave"
              @drop="handleDrop($event, index)"
            >
              <!-- Drag Handle -->
              <div v-if="!searchQuery && !selectedSeason" class="absolute left-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 cursor-move transition-opacity duration-200 z-10">
                <div class="flex flex-col space-y-1">
                  <div class="w-1 h-1 bg-slate-400 rounded-full"></div>
                  <div class="w-1 h-1 bg-slate-400 rounded-full"></div>
                  <div class="w-1 h-1 bg-slate-400 rounded-full"></div>
                </div>
              </div>

              <!-- Drop Target Indicator -->
              <div 
                v-if="dropTargetIndex === index" 
                class="absolute inset-0 border-2 border-dashed border-amber-400 rounded-xl pointer-events-none z-20"
              >
                <div v-if="reorderLoading" class="absolute inset-0 flex items-center justify-center">
                  <div class="animate-spin rounded-full h-8 w-8 border-4 border-amber-500 border-t-transparent"></div>
                </div>
              </div>

              <!-- Episode Card Content -->
              <div class="flex gap-4 p-4 sm:p-6">
                <!-- Episode Thumbnail -->
                <div class="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 relative">
                  <div class="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg overflow-hidden">
                    <img 
                      :src="episode.image" 
                      :alt="episode.title"
                      class="w-full h-full object-cover"
                    />
                  </div>
                  <!-- Season/Episode Badge -->
                  <div class="absolute -bottom-1 -right-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-medium text-gray-800 border border-gray-200">
                    S{{ episode.season }}E{{ episode.episode }}
                  </div>
                </div>

                <!-- Episode Info -->
                <div class="flex-1 min-w-0">
                  <!-- Header with Title and Status -->
                  <div class="flex items-start justify-between gap-2 mb-2">
                    <h3 class="text-base sm:text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
                      {{ episode.title }}
                    </h3>
                    <span :class="[
                      'flex-shrink-0 px-2 py-1 rounded-full text-xs font-medium',
                      episode.isActive 
                        ? 'bg-green-100 text-green-800 border border-green-200' 
                        : 'bg-gray-100 text-gray-800 border border-gray-200'
                    ]">
                      {{ episode.isActive ? 'Published' : 'Draft' }}
                    </span>
                  </div>

                  <!-- Description -->
                  <p class="text-sm text-gray-600 line-clamp-2 mb-3">
                    {{ episode.description }}
                  </p>

                  <!-- Meta Information -->
                  <div class="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-3">
                    <div class="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" width="32" height="32" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm64-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h48A8,8,0,0,1,192,128Z"></path>
                      </svg>
                      <span>{{ episode.duration || '45:30' }}</span>
                    </div>
                    <div class="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" class="w-3 h-3" height="32" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Zm-68-76a12,12,0,1,1-12-12A12,12,0,0,1,140,132Zm44,0a12,12,0,1,1-12-12A12,12,0,0,1,184,132ZM96,172a12,12,0,1,1-12-12A12,12,0,0,1,96,172Zm44,0a12,12,0,1,1-12-12A12,12,0,0,1,140,172Zm44,0a12,12,0,1,1-12-12A12,12,0,0,1,184,172Z"></path>
                      </svg>
                      <span>{{ formatDate(episode.publishedAt) }}</span>
                    </div>
                    <div class="flex items-center gap-1">
                      <span>MLC Journal</span>
                    </div>
                    <div class="flex items-center gap-1">
                      <span>Medical Laboratory Science</span>
                    </div>
                  </div>

                  <!-- Action Buttons - Mobile First -->
                  <div class="flex flex-wrap gap-2 sm:gap-3">
                    <!-- Mobile: Stack buttons vertically on very small screens -->
                    <div class="flex gap-2 flex-wrap sm:flex-nowrap w-full sm:w-auto">
                      <button @click="previewEpisode(episode)" class="flex-1 sm:flex-none flex items-center justify-center gap-1 px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all duration-200 font-medium">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" width="32" height="32" fill="currentColor" viewBox="0 0 256 256">
                          <path d="M247.31,124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57,61.26,162.88,48,128,48S61.43,61.26,36.34,86.35C17.51,105.18,9,124,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208s66.57-13.26,91.66-38.34c18.83-18.83,27.3-37.61,27.65-38.4A8,8,0,0,0,247.31,124.76ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.47,133.47,0,0,1,25,128,133.33,133.33,0,0,1,48.07,97.25C70.33,75.19,97.22,64,128,64s57.67,11.19,79.93,33.25A133.46,133.46,0,0,1,231.05,128C223.84,141.46,192.43,192,128,192Zm0-112a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z"></path>
                        </svg>
                        <span class="hidden sm:inline">Preview</span>
                      </button>
                      
                      <button @click="editEpisode(episode)" class="flex items-center justify-center gap-1 px-3 py-1.5 text-sm bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-all duration-200">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" width="32" height="32" fill="currentColor" viewBox="0 0 256 256">
                          <path d="M227.31,73.37,182.63,28.68a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63ZM92.69,208H48V163.31l88-88L180.69,120ZM192,108.68,147.31,64l24-24L216,84.68Z"></path>
                        </svg>
                        <span class="hidden sm:inline">Edit</span>
                      </button>

                      <button @click="deleteEpisode(episode)" class="flex items-center justify-center gap-1 px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all duration-200">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" width="32" height="32" fill="currentColor" viewBox="0 0 256 256">
                          <path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"></path>
                        </svg>
                        <span class="hidden sm:inline">Delete</span>
                      </button>

                      <button @click="toggleEpisodeStatus(episode)" :class="[
                        'flex items-center justify-center gap-1 px-3 py-1.5 text-sm rounded-lg transition-all duration-200',
                        episode.isActive ? 'bg-orange-50 text-orange-600 hover:bg-orange-100' : 'bg-green-50 text-green-600 hover:bg-green-100'
                      ]">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" width="32" height="32" fill="currentColor" viewBox="0 0 256 256">
                          <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm40-68a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,148ZM96,108H160a8,8,0,0,1,0,16H96a8,8,0,0,1,0-16Z"></path>
                        </svg>
                        <span class="hidden sm:inline">{{ episode.isActive ? 'Deactivate' : 'Activate' }}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TransitionGroup>

          <!-- <div v-else-if="currentEpisodes?.length" :class="[
            'grid gap-6 transition-all duration-300',
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
          ]">
            <div
              v-for="(episode, index) in currentEpisodes"
              :key="episode._id"
              class="group bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 overflow-hidden"
              :style="{ animationDelay: `${index * 100}ms` }"
              draggable="true"
              @dragstart="handleDragStart($event, index)"
              @dragend="handleDragEnd"
              @dragover="handleDragOver($event, index)"
              @dragleave="handleDragLeave"
              @drop="handleDrop($event, index)"
            >

              <div v-if="!searchQuery && !selectedSeason" class="absolute left-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 cursor-move transition-opacity duration-200">
                <div class="flex flex-col space-y-1">
                  <div class="w-1 h-1 bg-slate-400 rounded-full"></div>
                  <div class="w-1 h-1 bg-slate-400 rounded-full"></div>
                  <div class="w-1 h-1 bg-slate-400 rounded-full"></div>
                </div>
              </div>


              <div 
                v-if="dropTargetIndex === index" 
                class="absolute inset-0 border-2 border-dashed border-amber-400 rounded-2xl pointer-events-none"
              >
                <div v-if="reorderLoading" class="absolute inset-0 flex items-center justify-center">
                  <div class="animate-spin rounded-full h-8 w-8 border-4 border-amber-500 border-t-transparent"></div>
                </div>
              </div>


              <div class="relative">
   
                <div class="relative h-48 bg-gradient-to-br from-blue-100 to-indigo-100 overflow-hidden">
                  <img :src="episode.image" class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  <div class="absolute top-4 right-4 flex gap-2">
                    <span :class="[
                      'px-3 py-1 rounded-full text-xs font-semibold',
                      episode.isActive 
                        ? 'bg-green-100 text-green-800 border border-green-200' 
                        : 'bg-gray-100 text-gray-800 border border-gray-200'
                    ]">
                      {{ episode.isActive ? 'Active' : 'Inactive' }}
                    </span>
                  </div>
                  <div class="absolute bottom-4 left-4">
                    <span class="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-800">
                      S{{ episode.season }}E{{ episode.episode }}
                    </span>
                  </div>
                </div>


                <div class="p-6 space-y-4">
                  <div>
                    <h3 class="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
                      {{ episode.title }}
                    </h3>
                    <p class="text-gray-600 text-sm line-clamp-2 mb-3">
                      {{ episode.description }}
                    </p>
                  </div>


                  <div class="flex items-center justify-between text-sm text-gray-500">
                    <div class="flex items-center gap-4">
                      <div class="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm64-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h48A8,8,0,0,1,192,128Z"></path></svg>
                        <span>{{ episode.duration || '45:30' }}</span>
                      </div>
                      <div class="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" class="w-4 h-4" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Zm-68-76a12,12,0,1,1-12-12A12,12,0,0,1,140,132Zm44,0a12,12,0,1,1-12-12A12,12,0,0,1,184,132ZM96,172a12,12,0,1,1-12-12A12,12,0,0,1,96,172Zm44,0a12,12,0,1,1-12-12A12,12,0,0,1,140,172Zm44,0a12,12,0,1,1-12-12A12,12,0,0,1,184,172Z"></path></svg>
                        <span>{{ formatDate(episode.publishedAt) }}</span>
                      </div>
                    </div>
                  </div>

         
                  <div class="flex gap-2 pt-4 border-t border-gray-100">
                              <button
                                @click="previewEpisode(episode)"
                                class="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-all duration-200 font-medium"
                              >
           
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M247.31,124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57,61.26,162.88,48,128,48S61.43,61.26,36.34,86.35C17.51,105.18,9,124,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208s66.57-13.26,91.66-38.34c18.83-18.83,27.3-37.61,27.65-38.4A8,8,0,0,0,247.31,124.76ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.47,133.47,0,0,1,25,128,133.33,133.33,0,0,1,48.07,97.25C70.33,75.19,97.22,64,128,64s57.67,11.19,79.93,33.25A133.46,133.46,0,0,1,231.05,128C223.84,141.46,192.43,192,128,192Zm0-112a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z"></path></svg>
                                Preview
                              </button>
                              <button
                                @click="editEpisode(episode)"
                                class="flex items-center justify-center px-4 py-2 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 transition-all duration-200"
                              >
                              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M53.92,34.62A8,8,0,1,0,42.08,45.38l48.2,53L36.68,152A15.89,15.89,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31l50.4-50.39,47.69,52.46a8,8,0,1,0,11.84-10.76ZM92.69,208H48V163.31l53.06-53,42.56,46.81ZM227.32,73.37,182.63,28.69a16,16,0,0,0-22.63,0L118.33,70.36a8,8,0,0,0,11.32,11.31L136,75.31,180.69,120l-9,9A8,8,0,0,0,183,140.34L227.32,96A16,16,0,0,0,227.32,73.37ZM192,108.69,147.32,64l24-24L216,84.69Z"></path></svg>
          
                              </button>
                              <button
                                @click="deleteEpisode(episode)"
                                class="flex items-center justify-center px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all duration-200"
                              >
                              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"></path></svg>
    
                              </button>
                              <button
                                @click="toggleEpisodeStatus(episode)"
                                :class="[
                                  'flex items-center justify-center px-4 py-2 rounded-xl transition-all duration-200',
                                  episode.isActive 
                                    ? 'bg-orange-50 text-orange-600 hover:bg-orange-100' 
                                    : 'bg-green-50 text-green-600 hover:bg-green-100'
                                ]"
                              >
                              <svg v-if="episode.isActive" xmlns="http://www.w3.org/2000/svg" width="32" class="w-4 h-4" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM112,96v64a8,8,0,0,1-16,0V96a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V96a8,8,0,0,1,16,0Z"></path></svg>

                              <svg v-else xmlns="http://www.w3.org/2000/svg" width="32" height="32" class="w-4 h-4" fill="#000000" viewBox="0 0 256 256"><path d="M232.4,114.49,88.32,26.35a16,16,0,0,0-16.2-.3A15.86,15.86,0,0,0,64,39.87V216.13A15.94,15.94,0,0,0,80,232a16.07,16.07,0,0,0,8.36-2.35L232.4,141.51a15.81,15.81,0,0,0,0-27ZM80,215.94V40l143.83,88Z"></path></svg>
                              </button>
                            </div>
                </div>
              </div>
            </div>
          </div> -->

  
          <!-- Empty State -->
          <div v-else class="text-center py-16">
            <div class="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-12 max-w-md mx-auto">
              <div class="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Icon name="lucide:podcast" class="w-10 h-10 text-blue-500" />
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-2">No episodes found</h3>
              <p class="text-gray-600 mb-8">Get started by creating your first amazing episode.</p>
              <button
                @click="showCreateModal = true"
                class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                <Icon name="lucide:plus" class="w-5 h-5 mr-2" />
                Create First Episode
              </button>
            </div>
          </div>
        </div>
  
        <!-- Enhanced Pagination -->
        <!-- <div v-if="currentEpisodes?.length && labcastsTotalCount > perPage" class="flex justify-center">
          <div class="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-2">
            <div class="flex items-center gap-2">
              <button
                @click="changePage(labcastsCurrentPage - 1)"
                :disabled="labcastsCurrentPage <= 1"
                class="px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Icon name="lucide:chevron-left" class="w-4 h-4" />
              </button>
              
              <div class="flex gap-1">
                <button
                  v-for="page in paginationPages"
                  :key="page"
                  @click="changePage(page)"
                  :class="[
                    'px-4 py-2 rounded-xl transition-all duration-200 font-medium',
                    page === labcastsCurrentPage
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  ]"
                >
                  {{ page }}
                </button>
              </div>
              
              <button
                @click="changePage(labcastsCurrentPage + 1)"
                :disabled="labcastsCurrentPage >= Math.ceil(labcastsTotalCount / perPage)"
                class="px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Icon name="lucide:chevron-right" class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div> -->
      </div>
  
      <!-- Preview Modal -->
      <Teleport to="body">
        <div
          v-if="showPreviewModal"
          class="fixed inset-0 z-50 flex items-center justify-center p-4"
          @click.self="closePreviewModal"
        >
          <div class="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"></div>
          <div class="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden transform transition-all duration-300 scale-100">
            <!-- Modal Header -->
            <div class="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 class="text-xl font-bold text-gray-900">Episode Preview</h2>
              <button
                @click="closePreviewModal"
                class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200"
              >
                <!-- <Icon name="lucide:x" class="w-6 h-6" /> -->
                <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M165.66,101.66,139.31,128l26.35,26.34a8,8,0,0,1-11.32,11.32L128,139.31l-26.34,26.35a8,8,0,0,1-11.32-11.32L116.69,128,90.34,101.66a8,8,0,0,1,11.32-11.32L128,116.69l26.34-26.35a8,8,0,0,1,11.32,11.32ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z"></path></svg>
              </button>
            </div>
  
            <!-- Modal Content -->
            <div v-if="previewingEpisode" class="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div class="grid lg:grid-cols-3 gap-8">
                <!-- Main Content -->
                <div class="lg:col-span-2 space-y-6">
                  <!-- Episode Thumbnail -->
                   <!-- <img :src="previewingEpisode.image" />
                  <div class="aspect-video bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl overflow-hidden relative">
                    <div class="absolute inset-0 flex items-center justify-center">
                      <button class="w-20 h-20 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-blue-600 ml-1" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M232.4,114.49,88.32,26.35a16,16,0,0,0-16.2-.3A15.86,15.86,0,0,0,64,39.87V216.13A15.94,15.94,0,0,0,80,232a16.07,16.07,0,0,0,8.36-2.35L232.4,141.51a15.81,15.81,0,0,0,0-27ZM80,215.94V40l143.83,88Z"></path></svg>
                      </button>
                    </div>
                    <div class="absolute bottom-4 left-4 right-4">
                      <div class="bg-white/90 backdrop-blur-sm rounded-xl p-3">
                        <div class="flex items-center gap-3">
                          <div class="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                          <span class="text-sm font-medium text-gray-800">Ready to play</span>
                          <div class="flex-1 bg-gray-200 rounded-full h-1">
                            <div class="bg-blue-500 h-1 rounded-full w-0"></div>
                          </div>
                          <span class="text-sm text-gray-600">{{ previewingEpisode.duration || '45:30' }}</span>
                        </div>
                      </div>
                    </div>
                  </div> -->

                  <!-- Episode Thumbnail -->
                <div class="aspect-video rounded-2xl overflow-hidden relative">
                  <img :src="previewingEpisode.image" class="w-full h-full object-cover" />
                  
                  <div class="absolute inset-0 flex items-center justify-center">
                    <button class="w-20 h-20 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200">
                      <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-blue-600 ml-1" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M232.4,114.49,88.32,26.35a16,16,0,0,0-16.2-.3A15.86,15.86,0,0,0,64,39.87V216.13A15.94,15.94,0,0,0,80,232a16.07,16.07,0,0,0,8.36-2.35L232.4,141.51a15.81,15.81,0,0,0,0-27ZM80,215.94V40l143.83,88Z"></path></svg>
                    </button>
                  </div>
                  
                  <div class="absolute bottom-4 left-4 right-4">
                    <div class="bg-white/90 backdrop-blur-sm rounded-xl p-3">
                      <div class="flex items-center gap-3">
                        <div class="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <span class="text-sm font-medium text-gray-800">Ready to play</span>
                        <div class="flex-1 bg-gray-200 rounded-full h-1">
                          <div class="bg-blue-500 h-1 rounded-full w-0"></div>
                        </div>
                        <span class="text-sm text-gray-600">{{ previewingEpisode.duration || '45:30' }}</span>
                      </div>
                    </div>
                  </div>
                </div>
  
                  <!-- Episode Details -->
                  <div class="space-y-4">
                    <div class="flex items-center gap-3">
                      <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                        Season {{ previewingEpisode.season }} • Episode {{ previewingEpisode.episode }}
                      </span>
                      <span :class="[
                        'px-3 py-1 rounded-full text-sm font-semibold',
                        previewingEpisode.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      ]">
                        {{ previewingEpisode.isActive ? 'Active' : 'Inactive' }}
                      </span>
                    </div>
                    
                    <h1 class="text-3xl font-bold text-gray-900">{{ previewingEpisode.title }}</h1>
                    <p class="text-gray-600 text-lg leading-relaxed">{{ previewingEpisode.description }}</p>
                  </div>
  
                  <!-- Episode Stats -->
                  <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div class="bg-gray-50 rounded-xl p-4 text-center">
                      <!-- <Icon name="lucide:clock" class="w-6 h-6 text-blue-500 mx-auto mb-2" /> -->
                      <svg  class="w-6 h-6 text-blue-500 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm64-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h48A8,8,0,0,1,192,128Z"></path></svg>
                      <div class="text-sm text-gray-600">Duration</div>
                      <div class="font-semibold text-gray-900">{{ previewingEpisode.duration || '45:30' }}</div>
                    </div>
                    <div class="bg-gray-50 rounded-xl p-4 text-center">
                      <!-- <Icon name="lucide:calendar" class="w-6 h-6 text-green-500 mx-auto mb-2" /> -->
                      <svg class="w-6 h-6 text-green-500 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Zm-68-76a12,12,0,1,1-12-12A12,12,0,0,1,140,132Zm44,0a12,12,0,1,1-12-12A12,12,0,0,1,184,132ZM96,172a12,12,0,1,1-12-12A12,12,0,0,1,96,172Zm44,0a12,12,0,1,1-12-12A12,12,0,0,1,140,172Zm44,0a12,12,0,1,1-12-12A12,12,0,0,1,184,172Z"></path></svg>
                      <div class="text-sm text-gray-600">Published</div>
                      <div class="font-semibold text-gray-900">{{ formatDate(previewingEpisode.publishedAt) }}</div>
                    </div>
                    <div class="bg-gray-50 rounded-xl p-4 text-center">
                      <!-- <Icon name="lucide:headphones" class="w-6 h-6 text-purple-500 mx-auto mb-2" /> -->
                      <svg class="w-6 h-6 text-purple-500 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M201.89,54.66A103.43,103.43,0,0,0,128.79,24H128A104,104,0,0,0,24,128v56a24,24,0,0,0,24,24H64a24,24,0,0,0,24-24V144a24,24,0,0,0-24-24H40.36A88,88,0,0,1,128,40h.67a87.71,87.71,0,0,1,87,80H192a24,24,0,0,0-24,24v40a24,24,0,0,0,24,24h16a24,24,0,0,0,24-24V128A103.41,103.41,0,0,0,201.89,54.66ZM64,136a8,8,0,0,1,8,8v40a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V136Zm152,48a8,8,0,0,1-8,8H192a8,8,0,0,1-8-8V144a8,8,0,0,1,8-8h24Z"></path></svg>
                      <div class="text-sm text-gray-600">Listens</div>
                      <div class="font-semibold text-gray-900">{{ previewingEpisode.listens || '1.2K' }}</div>
                    </div>
                    <div class="bg-gray-50 rounded-xl p-4 text-center">
                      <!-- <Icon name="lucide:heart" class="w-6 h-6 text-red-500 mx-auto mb-2" /> -->
                      <svg class="w-6 h-6 text-red-500 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M178,40c-20.65,0-38.73,8.88-50,23.89C116.73,48.88,98.65,40,78,40a62.07,62.07,0,0,0-62,62c0,70,103.79,126.66,108.21,129a8,8,0,0,0,7.58,0C136.21,228.66,240,172,240,102A62.07,62.07,0,0,0,178,40ZM128,214.8C109.74,204.16,32,155.69,32,102A46.06,46.06,0,0,1,78,56c19.45,0,35.78,10.36,42.6,27a8,8,0,0,0,14.8,0c6.82-16.67,23.15-27,42.6-27a46.06,46.06,0,0,1,46,46C224,155.61,146.24,204.15,128,214.8Z"></path></svg>
                      <div class="text-sm text-gray-600">Likes</div>
                      <div class="font-semibold text-gray-900">{{ previewingEpisode.likes || '89' }}</div>
                    </div>
                  </div>
                </div>
  
                <!-- Sidebar -->
                <div class="space-y-6">
                  <!-- Host Info -->
                  <div class="bg-gray-50 rounded-2xl p-6">
                    <h3 class="font-bold text-gray-900 mb-4">Host Information</h3>
                    <div class="flex items-center gap-3 mb-4">
                      <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
                        {{ (previewingEpisode.host || 'Dr. Sarah Johnson').split(' ').map(n => n[0]).join('') }}
                      </div>
                      <div>
                        <div class="font-semibold text-gray-900">{{ previewingEpisode.host || 'Dr. Sarah Johnson' }}</div>
                        <div class="text-sm text-gray-600">Host & Researcher</div>
                      </div>
                    </div>
                    <p class="text-sm text-gray-600">
                      Leading expert in machine learning and artificial intelligence research.
                    </p>
                  </div>
  
                  <!-- Quick Actions -->
                  <div class="space-y-3">
                    <button
                      @click="editEpisode(previewingEpisode)"
                      class="w-full flex items-center justify-center gap-3 px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all duration-200 font-medium"
                    >
                      <!-- <Icon name="lucide:edit" class="w-5 h-5" /> -->
                      <svg  class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M227.32,73.37,182.63,28.69a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H216a8,8,0,0,0,0-16H115.32l112-112A16,16,0,0,0,227.32,73.37ZM92.69,208H48V163.31l88-88L180.69,120ZM192,108.69,147.32,64l24-24L216,84.69Z"></path></svg>
                      Edit Episode
                    </button>
                    <button
                      @click="toggleEpisodeStatus(previewingEpisode)"
                      :class="[
                        'w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium',
                        previewingEpisode.isActive 
                          ? 'bg-orange-500 text-white hover:bg-orange-600' 
                          : 'bg-green-500 text-white hover:bg-green-600'
                      ]"
                    >
                    <svg v-if="previewingEpisode.isActive" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM112,96v64a8,8,0,0,1-16,0V96a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V96a8,8,0,0,1,16,0Z"></path></svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M232.4,114.49,88.32,26.35a16,16,0,0,0-16.2-.3A15.86,15.86,0,0,0,64,39.87V216.13A15.94,15.94,0,0,0,80,232a16.07,16.07,0,0,0,8.36-2.35L232.4,141.51a15.81,15.81,0,0,0,0-27ZM80,215.94V40l143.83,88Z"></path></svg>
                      <!-- <Icon :name="previewingEpisode.isActive ? 'lucide:pause' : 'lucide:play'" class="w-5 h-5" /> -->
                      {{ previewingEpisode.isActive ? 'Deactivate' : 'Activate' }}
                    </button>
                    <button
                      @click="deleteEpisode(previewingEpisode)"
                      class="w-full flex items-center justify-center gap-3 px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-200 font-medium"
                    >
                      <!-- <Icon name="lucide:trash-2" class="w-5 h-5" /> -->
                      <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"></path></svg>
                      Delete Episode
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Teleport>
  
      <!-- Enhanced Delete Confirmation Modal -->
      <Teleport to="body">
        <div
          v-if="showDeleteModal"
          class="fixed inset-0 z-50 flex items-center justify-center p-4"
          @click.self="showDeleteModal = false"
        >
          <div class="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"></div>
          <div class="relative bg-white rounded-3xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-100">
            <div class="p-8 text-center">
              <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Icon name="lucide:trash-2" class="w-8 h-8 text-red-500" />
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-2">Delete Episode</h3>
              <p class="text-gray-600 mb-8">
                Are you sure you want to delete 
                <span class="font-semibold">"{{ deletingEpisode?.title }}"</span>? 
                This action cannot be undone.
              </p>
              <div class="flex gap-3">
                <button
                  @click="showDeleteModal = false"
                  class="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  @click="confirmDelete"
                  class="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-200 font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </Teleport>
  
      <!-- Create/Edit Modal Placeholder -->
      <LabcastEpisodeModal
        v-model="showCreateModal"
        :episode="editingEpisode"
        @saved="handleEpisodeSaved"
      />
    </div>
  </template>
  
  <script setup lang="ts">
  import type { LabCast } from '@/types/labcast'
  import { ref, computed, onMounted } from 'vue'
  import { useDebounceFn } from '@vueuse/core'
  import { useGetLabCasts } from "@/composables/modules/labcast/useGetLabCasts"
  import { useGetSeasons } from "@/composables/modules/labcast/useGetSeasons"
  import { useSearchEpisodes } from "@/composables/modules/labcast/useSearchEpisodes"
  import { useUpdateLabCast } from "@/composables/modules/labcast/useUpdateLabCast"
  import { useDeleteLabCast } from "@/composables/modules/labcast/useDeleteLabCast"
  import { useReorderLabcasts } from '@/composables/modules/labcast/useReorderLabcasts'
  import { definePageMeta } from '#imports'

  const {
    loading: reorderLoading, 
    error: reorderError, 
    success: reorderSuccess, 
    reorderFromSortedArray,
    resetState: resetReorderState
   } = useReorderLabcasts()
  
  definePageMeta({
    layout: 'dashboard'
  })
  
  // Reactive state
  const showCreateModal = ref(false)
  const showDeleteModal = ref(false)
  const showPreviewModal = ref(false)
  const editingEpisode = ref<LabCast | null>(null)
  const deletingEpisode = ref<LabCast | null>(null)
  const previewingEpisode = ref<LabCast | null>(null)
  const searchQuery = ref('')
  const selectedSeason = ref('')
  const selectedStatus = ref('')
  const sortBy = ref('publishedAt:desc')
  const viewMode = ref<'grid' | 'list'>('grid')
  // const perPage = 10
  
  // Composables
  const {
    loading: labcastsLoading,
    error: labcastsError,
    labcasts,
    totalCount: labcastsTotalCount,
    currentPage: labcastsCurrentPage,
    getLabCasts,
    resetState: resetLabcastsState
  } = useGetLabCasts()
  
  const {
    loading: seasonsLoading,
    error: seasonsError,
    seasons,
    getSeasons,
    resetState: resetSeasonsState
  } = useGetSeasons()
  
  const {
    loading: searchLoading,
    error: searchError,
    episodes: searchEpisodes,
    searchTerm,
    searchEpisodes: performSearchEpisodes,
    resetState: resetSearchState
  } = useSearchEpisodes()
  
  const {
    loading: updateLoading,
    error: updateError,
    success: updateSuccess,
    labcast: updateLabcast,
    updateLabCast,
    resetState: resetUpdateState
  } = useUpdateLabCast()
  
  const {
    loading: deleteLoading,
    error: deleteError,
    success: deleteSuccess,
    deleteLabCast,
    resetState: resetDeleteState
  } = useDeleteLabCast()
  
  // Computed
  const currentEpisodes = computed(() => {
    if (searchQuery.value && searchEpisodes.value) {
      return searchEpisodes.value
    }
    return labcasts.value
  })
  
  // const paginationPages = computed(() => {
  //   const totalPages = Math.ceil(labcastsTotalCount.value / perPage)
  //   const current = labcastsCurrentPage.value
  //   const pages = []
    
  //   // Show up to 5 pages around current page
  //   const start = Math.max(1, current - 2)
  //   const end = Math.min(totalPages, current + 2)
    
  //   for (let i = start; i <= end; i++) {
  //     pages.push(i)
  //   }
    
  //   return pages
  // })
  
  // Methods
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }
  
  const loadEpisodes = async (page = 1) => {
    const filters: any = {
      page,
      sort: sortBy.value
    }
  
    if (selectedSeason.value) {
      filters.season = selectedSeason.value
    }
  
    if (selectedStatus.value) {
      filters.isActive = selectedStatus.value === 'true'
    }
  
    await getLabCasts()
  }
  
  const applyFilters = () => {
    if (searchQuery.value) {
      searchQuery.value = ''
    }
    loadEpisodes(1)
  }
  
  const debouncedSearch = useDebounceFn(async () => {
    if (searchQuery.value.trim()) {
      await performSearchEpisodes({
        query: searchQuery.value,
        limit: perPage
      })
    } else {
      resetSearchState()
      await loadEpisodes(1)
    }
  }, 300)
  
  const changePage = (page: number) => {
    loadEpisodes(page)
  }
  
  const previewEpisode = (episode: LabCast) => {
    previewingEpisode.value = episode
    showPreviewModal.value = true
  }
  
  const closePreviewModal = () => {
    showPreviewModal.value = false
    previewingEpisode.value = null
  }
  
  const editEpisode = (episode: LabCast) => {
    editingEpisode.value = episode
    showCreateModal.value = true
    showPreviewModal.value = false
  }
  
  const deleteEpisode = (episode: LabCast) => {
    deletingEpisode.value = episode
    showDeleteModal.value = true
    showPreviewModal.value = false
  }
  
  const confirmDelete = async () => {
    if (deletingEpisode.value) {
      await deleteLabCast(deletingEpisode.value._id)
      if (deleteSuccess.value) {
        showDeleteModal.value = false
        deletingEpisode.value = null
        await loadEpisodes(labcastsCurrentPage.value)
      }
    }
  }
  
  const toggleEpisodeStatus = async (episode: LabCast) => {
    await updateLabCast(episode._id, {
      ...episode,
      isActive: !episode.isActive
    })
    if (updateSuccess.value) {
      await loadEpisodes(labcastsCurrentPage.value)
      // Update preview if it's the same episode
      if (previewingEpisode.value?._id === episode._id) {
        previewingEpisode.value = { ...previewingEpisode.value, isActive: !episode.isActive }
      }
    }
  }
  
  const handleEpisodeSaved = () => {
    showCreateModal.value = false
    editingEpisode.value = null
    loadEpisodes(labcastsCurrentPage.value)
  }
  
  // Load data on mount
  onMounted(async () => {
    await Promise.all([
      loadEpisodes(),
      getSeasons()
    ])
  })

  //Labcasts re-ordering

  // Add these new reactive variables and methods in your script setup

// Drag-and-drop state
const draggedIndex = ref<number | null>(null)
const dropTargetIndex = ref<number | null>(null)
const localEpisodes = ref<LabCast[]>([])

// Drag-and-drop methods
const handleDragStart = (event: DragEvent, index: number) => {
  if (reorderLoading.value) {
    event.preventDefault()
    return
  }

  draggedIndex.value = index
  event.dataTransfer!.effectAllowed = 'move'
  event.dataTransfer!.setData('text/html', '')

  // Store current episodes order for potential revert
  localEpisodes.value = [...currentEpisodes.value]
}

const handleDragEnd = () => {
  draggedIndex.value = null
  dropTargetIndex.value = null
}

const handleDragOver = (event: DragEvent, index: number) => {
  event.preventDefault()
  event.dataTransfer!.dropEffect = 'move'

  if (draggedIndex.value !== null && draggedIndex.value !== index) {
    dropTargetIndex.value = index
  }
}

const handleDragLeave = () => {
  // Clear drop target
}

const handleDrop = async (event: DragEvent, dropIndex: number) => {
  event.preventDefault()

  if (draggedIndex.value === null || draggedIndex.value === dropIndex || reorderLoading.value) {
    return
  }

  try {
    // Create a new array with the reordered items
    const reorderedItems = [...currentEpisodes.value]
    const draggedItem = reorderedItems[draggedIndex.value]

    // Remove the dragged item from its original position
    reorderedItems.splice(draggedIndex.value, 1)

    // Insert the dragged item at the new position
    reorderedItems.splice(dropIndex, 0, draggedItem)

    // Call the reorder API
    await reorderFromSortedArray(reorderedItems)

    // Refresh episodes list
    await loadEpisodes(labcastsCurrentPage.value)
  } catch (error) {
    console.error('Error reordering labcasts:', error)
  } finally {
    draggedIndex.value = null
    dropTargetIndex.value = null
  }
}


  const reorderLabcasts = async (reorderedLabcasts: LabCast[]) => {
  try {
    await reorderFromSortedArray(reorderedLabcasts)
    resetReorderState()
  } catch (error) {
    console.error('Error reordering labcasts:', error)
  }
}
  </script>
  
  <style scoped>
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-slide-in-up {
    animation: slideInUp 0.3s ease-out;
  }
  </style>

  