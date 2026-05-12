<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="modelValue" class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" @click="$emit('update:modelValue', false)"></div>
    </Transition>

    <Transition
      enter-active-class="transform transition-transform duration-500 ease-out"
      enter-from-class="translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transform transition-transform duration-300 ease-in"
      leave-from-class="translate-x-0"
      leave-to-class="translate-x-full"
    >
      <div
        v-if="modelValue"
        class="fixed inset-y-0 right-0 z-50 w-full max-w-4xl bg-white shadow-2xl flex flex-col overflow-hidden"
      >
              <!-- Header with Gradient -->
              <div class="relative flex-shrink-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 px-8 py-6">
                <div class="absolute inset-0 bg-black/10"></div>
                <div class="relative flex items-center justify-between">
                  <div class="space-y-1">
                    <h3 class="text-2xl font-bold text-white">
                      {{ episode ? 'Edit Episode' : 'Create New Episode' }}
                    </h3>
                    <p class="text-blue-100">
                      {{ episode ? 'Update your episode details' : 'Add a new episode to your podcast' }}
                    </p>
                  </div>
                  <button
                    @click="$emit('update:modelValue', false)"
                    class="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-xl transition-all duration-200"
                  >
                    <Icon name="lucide:x" class="w-6 h-6" />
                  </button>
                </div>
                
                <!-- Progress Indicator -->
                <div class="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                  <div 
                    class="h-full bg-white/60 transition-all duration-500 ease-out"
                    :style="{ width: `${formProgress}%` }"
                  ></div>
                </div>
              </div>

              <!-- Form Content -->
              <div class="flex-1 overflow-y-auto">
                <form @submit.prevent="handleSubmit" class="p-8 space-y-8">
                  <!-- Basic Information Section -->
                  <div class="space-y-6">
                    <div class="flex items-center space-x-3 mb-6">
                      <div class="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                        <Icon name="lucide:info" class="w-4 h-4 text-white" />
                      </div>
                      <h4 class="text-lg font-semibold text-gray-900">Basic Information</h4>
                    </div>

                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <!-- Title -->
                      <div class="lg:col-span-2 group">
                        <label class="block text-sm font-semibold text-gray-700 mb-2">
                          Episode Title *
                        </label>
                        <div class="relative">
                          <input
                            v-model="form.title"
                            type="text"
                            required
                            class="w-full px-4 py-3 border-[0.5px] border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-all duration-200 bg-gray-50/50 hover:bg-white group-hover:border-gray-300"
                           
                          />
                          <div class="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-focus-within:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
                        </div>
                      </div>

                      <!-- Description -->
                      <div class="lg:col-span-2 group">
                        <label class="block text-sm font-semibold text-gray-700 mb-2">
                          Description *
                        </label>
                        <div class="relative">
                          <textarea
                            v-model="form.description"
                            required
                            rows="4"
                            class="w-full px-4 py-3 border-[0.5px] border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-all duration-200 bg-gray-50/50 hover:bg-white resize-none group-hover:border-gray-300"
                           
                          ></textarea>
                          <div class="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-focus-within:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
                        </div>
                      </div>

                      <!-- Season & Episode -->
                      <div class="group">
                        <label class="block text-sm font-semibold text-gray-700 mb-2">
                          Season *
                        </label>
                        <div class="relative">
                          <input
                            v-model.number="form.season"
                            type="number"
                            required
                            min="1"
                            class="w-full px-4 py-3 border-[0.5px] border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-all duration-200 bg-gray-50/50 hover:bg-white group-hover:border-gray-300"
                          />
                          <Icon name="lucide:hash" class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        </div>
                      </div>

                      <div class="group">
                        <label class="block text-sm font-semibold text-gray-700 mb-2">
                          Episode Number *
                        </label>
                        <div class="relative">
                          <input
                            v-model.number="form.episode"
                            type="number"
                            required
                            min="1"
                            class="w-full px-4 py-3 border-[0.5px] border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-all duration-200 bg-gray-50/50 hover:bg-white group-hover:border-gray-300"
                          />
                          <Icon name="lucide:play" class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        </div>
                      </div>

                      <!-- Duration & Published Date -->
                      <div class="group">
                        <label class="block text-sm font-semibold text-gray-700 mb-2">
                          Duration (minutes) *
                        </label>
                        <div class="relative">
                          <input
                            v-model.number="form.duration"
                            type="number"
                            required
                            min="1"
                            class="w-full px-4 py-3 border-[0.5px] border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-all duration-200 bg-gray-50/50 hover:bg-white group-hover:border-gray-300"
                          />
                          <Icon name="lucide:clock" class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        </div>
                      </div>

                      <div class="group">
                        <label class="block text-sm font-semibold text-gray-700 mb-2">
                          Published Date *
                        </label>
                        <div class="relative">
                          <input
                            v-model="form.publishedAt"
                            type="datetime-local"
                            required
                            class="w-full px-4 py-3 border-[0.5px] border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-all duration-200 bg-gray-50/50 hover:bg-white group-hover:border-gray-300"
                          />
                          <Icon name="lucide:calendar" class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Media Upload Section -->
                  <div class="space-y-6">
                    <div class="flex items-center space-x-3 mb-6">
                      <div class="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center">
                        <Icon name="lucide:image" class="w-4 h-4 text-white" />
                      </div>
                      <h4 class="text-lg font-semibold text-gray-900">Media & Images</h4>
                    </div>

                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <!-- Thumbnail Upload -->
                      <div class="space-y-4">
                        <label class="block text-sm font-semibold text-gray-700">
                          Thumbnail Image *
                        </label>
                        <div
                          @click="triggerThumbnailUpload"
                          @dragover.prevent="handleDragOver('thumbnail')"
                          @dragleave.prevent="handleDragLeave('thumbnail')"
                          @drop.prevent="handleThumbnailDrop"
                          class="relative group cursor-pointer"
                        >
                          <input
                            ref="thumbnailInput"
                            type="file"
                            accept="image/*"
                            class="hidden"
                            @change="handleThumbnailUpload"
                          />
                          
                          <div
                            :class="[
                              'relative border-[0.5px] border-dashed rounded-2xl p-8 transition-all duration-300',
                              thumbnailDragOver 
                                ? 'border-blue-500 bg-blue-50 scale-105' 
                                : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                            ]"
                          >
                            <div v-if="!form.thumbnailUrl && !thumbnailUploading" class="text-center space-y-4">
                              <div class="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-200">
                                <!-- <Icon name="lucide:image-plus" class="w-8 h-8 text-blue-500" /> -->
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-blue-500" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"></path></svg>
                              </div>
                              <div>
                                <p class="text-sm font-medium text-gray-700">
                                  <span class="text-blue-600">Click to upload</span> or drag and drop
                                </p>
                                <p class="text-sm text-gray-900 mt-1">PNG, JPG, GIF up to 10MB</p>
                              </div>
                            </div>

                            <div v-else-if="thumbnailUploading" class="text-center space-y-4">
                              <div class="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto">
                                <!-- <Icon name="lucide:loader-2" class="w-8 h-8 text-blue-600 animate-spin" /> -->
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-blue-600 animate-spin" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M136,32V64a8,8,0,0,1-16,0V32a8,8,0,0,1,16,0Zm37.25,58.75a8,8,0,0,0,5.66-2.35l22.63-22.62a8,8,0,0,0-11.32-11.32L167.6,77.09a8,8,0,0,0,5.65,13.66ZM224,120H192a8,8,0,0,0,0,16h32a8,8,0,0,0,0-16Zm-45.09,47.6a8,8,0,0,0-11.31,11.31l22.62,22.63a8,8,0,0,0,11.32-11.32ZM128,184a8,8,0,0,0-8,8v32a8,8,0,0,0,16,0V192A8,8,0,0,0,128,184ZM77.09,167.6,54.46,190.22a8,8,0,0,0,11.32,11.32L88.4,178.91A8,8,0,0,0,77.09,167.6ZM72,128a8,8,0,0,0-8-8H32a8,8,0,0,0,0,16H64A8,8,0,0,0,72,128ZM65.78,54.46A8,8,0,0,0,54.46,65.78L77.09,88.4A8,8,0,0,0,88.4,77.09Z"></path></svg>
                              </div>
                              <p class="text-sm font-medium text-gray-700">Uploading thumbnail...</p>
                              <div class="w-full bg-gray-200 rounded-full h-2">
                                <div class="bg-primary h-2 rounded-full animate-pulse" style="width: 60%"></div>
                              </div>
                            </div>

                            <div v-else class="relative">
                              <img
                                :src="form.thumbnailUrl"
                                alt="Thumbnail preview"
                                class="w-full h-48 object-cover rounded-xl"
                              />
                              <div class="absolute top-2 right-2 flex items-center justify-center">
                                <button
                                  @click.stop="removeThumbnail"
                                  type="button"
                                  class="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-200 shadow-md"
                                >
                                <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"></path></svg>
                                  <!-- <Icon name="lucide:trash-2" class="w-4 h-4" /> -->
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- Episode Cover Upload -->
                      <div class="space-y-4">
                        <label class="block text-sm font-semibold text-gray-700">
                          Episode Cover Image
                        </label>
                        <div
                          @click="triggerImageUpload"
                          @dragover.prevent="handleDragOver('image')"
                          @dragleave.prevent="handleDragLeave('image')"
                          @drop.prevent="handleImageDrop"
                          class="relative group cursor-pointer"
                        >
                          <input
                            ref="imageInput"
                            type="file"
                            accept="image/*"
                            class="hidden"
                            @change="handleImageUpload"
                          />
                          
                          <div
                            :class="[
                              'relative border-[0.5px] border-dashed rounded-2xl p-8 transition-all duration-300',
                              imageDragOver 
                                ? 'border-green-500 bg-green-50 scale-105' 
                                : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                            ]"
                          >
                            <div v-if="!form.image && !imageUploading" class="text-center space-y-4">
                              <div class="w-16 h-16 bg-gradient-to-br from-green-100 to-teal-100 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-200">
                                <!-- <Icon name="lucide:image" class="w-8 h-8 text-green-500" /> -->
                                <svg xmlns="http://www.w3.org/2000/svg"  class="w-8 h-8 text-green-500" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,16V158.75l-26.07-26.06a16,16,0,0,0-22.63,0l-20,20-44-44a16,16,0,0,0-22.62,0L40,149.37V56ZM40,172l52-52,80,80H40Zm176,28H194.63l-36-36,20-20L216,181.38V200ZM144,100a12,12,0,1,1,12,12A12,12,0,0,1,144,100Z"></path></svg>
                              </div>
                              <div>
                                <p class="text-sm font-medium text-gray-700">
                                  <span class="text-green-600">Click to upload</span> or drag and drop
                                </p>
                                <p class="text-sm text-gray-900 mt-1">PNG, JPG, GIF up to 10MB</p>
                              </div>
                            </div>

                            <div v-else-if="imageUploading" class="text-center space-y-4">
                              <div class="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto">
                                <!-- <Icon name="lucide:loader-2" class="w-8 h-8 text-green-600 animate-spin" /> -->
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-green-600 animate-spin" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M136,32V64a8,8,0,0,1-16,0V32a8,8,0,0,1,16,0Zm37.25,58.75a8,8,0,0,0,5.66-2.35l22.63-22.62a8,8,0,0,0-11.32-11.32L167.6,77.09a8,8,0,0,0,5.65,13.66ZM224,120H192a8,8,0,0,0,0,16h32a8,8,0,0,0,0-16Zm-45.09,47.6a8,8,0,0,0-11.31,11.31l22.62,22.63a8,8,0,0,0,11.32-11.32ZM128,184a8,8,0,0,0-8,8v32a8,8,0,0,0,16,0V192A8,8,0,0,0,128,184ZM77.09,167.6,54.46,190.22a8,8,0,0,0,11.32,11.32L88.4,178.91A8,8,0,0,0,77.09,167.6ZM72,128a8,8,0,0,0-8-8H32a8,8,0,0,0,0,16H64A8,8,0,0,0,72,128ZM65.78,54.46A8,8,0,0,0,54.46,65.78L77.09,88.4A8,8,0,0,0,88.4,77.09Z"></path></svg>
                              </div>
                              <p class="text-sm font-medium text-gray-700">Uploading image...</p>
                              <div class="w-full bg-gray-200 rounded-full h-2">
                                <div class="bg-green-600 h-2 rounded-full animate-pulse" style="width: 60%"></div>
                              </div>
                            </div>

                            <div v-else class="relative">
                              <img
                                :src="getImageUrl(form.image)"
                                alt="Episode cover preview"
                                class="w-full h-48 object-cover rounded-xl"
                              />
                              <div class="absolute top-2 right-2 flex items-center justify-center">
                                <button
                                  @click.stop="removeImage"
                                  type="button"
                                  class="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-200 shadow-md"
                                >
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" class="w-4 h-4" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"></path></svg>
                                  <!-- <Icon name="lucide:trash-2" class="w-4 h-4" /> -->
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- People Section -->
                  <div class="space-y-6">
                    <div class="flex items-center space-x-3 mb-6">
                      <div class="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <!-- <Icon name="lucide:users" class="w-4 h-4 text-white" /> -->
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" class="w-4 h-4 text-white" fill="#000000" viewBox="0 0 256 256"><path d="M117.25,157.92a60,60,0,1,0-66.5,0A95.83,95.83,0,0,0,3.53,195.63a8,8,0,1,0,13.4,8.74,80,80,0,0,1,134.14,0,8,8,0,0,0,13.4-8.74A95.83,95.83,0,0,0,117.25,157.92ZM40,108a44,44,0,1,1,44,44A44.05,44.05,0,0,1,40,108Zm210.14,98.7a8,8,0,0,1-11.07-2.33A79.83,79.83,0,0,0,172,168a8,8,0,0,1,0-16,44,44,0,1,0-16.34-84.87,8,8,0,1,1-5.94-14.85,60,60,0,0,1,55.53,105.64,95.83,95.83,0,0,1,47.22,37.71A8,8,0,0,1,250.14,206.7Z"></path></svg>
                      </div>
                      <h4 class="text-lg font-semibold text-gray-900">People</h4>
                    </div>

                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <!-- Hosts -->
                      <div class="lg:col-span-2">
                        <label class="block text-sm font-semibold text-gray-700 mb-4">
                          Hosts *
                        </label>
                        <div class="space-y-3">
                          <TransitionGroup
                            enter-active-class="transition-all duration-300 ease-out"
                            enter-from-class="opacity-0 scale-95 translate-x-4"
                            enter-to-class="opacity-100 scale-100 translate-x-0"
                            leave-active-class="transition-all duration-200 ease-in"
                            leave-from-class="opacity-100 scale-100 translate-x-0"
                            leave-to-class="opacity-0 scale-95 -translate-x-4"
                            tag="div"
                            class="space-y-3"
                          >
                            <div
                              v-for="(host, index) in form.hosts"
                              :key="`host-${index}`"
                              class="flex items-center space-x-3 group"
                            >
                              <div class="flex-1 relative">
                                <input
                                  v-model="form.hosts[index]"
                                  type="text"
                                  required
                                  class="w-full px-4 py-3 border-[0.5px] border-gray-200 rounded-xl focus:border-purple-500 focus:ring-0 transition-all duration-200 bg-gray-50/50 hover:bg-white group-hover:border-gray-300"
                                  :placeholder="`Host ${index + 1} name`"
                                />
                                <svg class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z"></path></svg>
                                <!-- <Icon name="lucide:user" class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /> -->
                              </div>
                              <button
                                v-if="form.hosts.length > 1"
                                @click="removeHost(index)"
                                type="button"
                                class="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200"
                              >
                              <svg xmlns="http://www.w3.org/2000/svg"  class="w-5 h-5" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"></path></svg>
                                <!-- <Icon name="lucide:trash-2" class="w-5 h-5" /> -->
                              </button>
                            </div>
                          </TransitionGroup>
                          
                          <button
                            @click="addHost"
                            type="button"
                            class="inline-flex items-center px-4 py-2 text-sm font-medium text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-xl transition-all duration-200"
                          >
                            <!-- <Icon name="lucide:plus" class="w-4 h-4 mr-2" /> -->
                            <svg class="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M256,136a8,8,0,0,1-8,8H232v16a8,8,0,0,1-16,0V144H200a8,8,0,0,1,0-16h16V112a8,8,0,0,1,16,0v16h16A8,8,0,0,1,256,136Zm-57.87,58.85a8,8,0,0,1-12.26,10.3C165.75,181.19,138.09,168,108,168s-57.75,13.19-77.87,37.15a8,8,0,0,1-12.25-10.3c14.94-17.78,33.52-30.41,54.17-37.17a68,68,0,1,1,71.9,0C164.6,164.44,183.18,177.07,198.13,194.85ZM108,152a52,52,0,1,0-52-52A52.06,52.06,0,0,0,108,152Z"></path></svg>
                            Add Another Host
                          </button>
                        </div>
                      </div>

                      <!-- Guest Information -->
                      <div class="group">
                        <label class="block text-sm font-semibold text-gray-700 mb-2">
                          Guest Name
                        </label>
                        <div class="relative">
                          <input
                            v-model="form.guest"
                            type="text"
                            class="w-full px-4 py-3 border-[0.5px] border-gray-200 rounded-xl focus:border-purple-500 focus:ring-0 transition-all duration-200 bg-gray-50/50 hover:bg-white group-hover:border-gray-300"
                           
                          />
                          <svg class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"  xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M168,56a8,8,0,0,1,8-8h16V32a8,8,0,0,1,16,0V48h16a8,8,0,0,1,0,16H208V80a8,8,0,0,1-16,0V64H176A8,8,0,0,1,168,56Zm62.56,54.68a103.92,103.92,0,1,1-85.24-85.24,8,8,0,0,1-2.64,15.78A88.07,88.07,0,0,0,40,128a87.62,87.62,0,0,0,22.24,58.41A79.66,79.66,0,0,1,98.3,157.66a48,48,0,1,1,59.4,0,79.66,79.66,0,0,1,36.06,28.75A87.62,87.62,0,0,0,216,128a88.85,88.85,0,0,0-1.22-14.68,8,8,0,1,1,15.78-2.64ZM128,152a32,32,0,1,0-32-32A32,32,0,0,0,128,152Zm0,64a87.57,87.57,0,0,0,53.92-18.5,64,64,0,0,0-107.84,0A87.57,87.57,0,0,0,128,216Z"></path></svg>
                          <!-- <Icon name="lucide:user-plus" class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /> -->
                        </div>
                      </div>

                      <div class="group">
                        <label class="block text-sm font-semibold text-gray-700 mb-2">
                          Guest Title
                        </label>
                        <div class="relative">
                          <input
                            v-model="form.guestTitle"
                            type="text"
                            class="w-full px-4 py-3 border-[0.5px] border-gray-200 rounded-xl focus:border-purple-500 focus:ring-0 transition-all duration-200 bg-gray-50/50 hover:bg-white group-hover:border-gray-300"
                           
                          />
                          <svg xmlns="http://www.w3.org/2000/svg" width="32" class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M216,56H176V48a24,24,0,0,0-24-24H104A24,24,0,0,0,80,48v8H40A16,16,0,0,0,24,72V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V72A16,16,0,0,0,216,56ZM96,48a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96ZM216,72v41.61A184,184,0,0,1,128,136a184.07,184.07,0,0,1-88-22.38V72Zm0,128H40V131.64A200.19,200.19,0,0,0,128,152a200.25,200.25,0,0,0,88-20.37V200ZM104,112a8,8,0,0,1,8-8h32a8,8,0,0,1,0,16H112A8,8,0,0,1,104,112Z"></path></svg>
                          <!-- <Icon name="lucide:briefcase" class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /> -->
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Links & Distribution -->
                  <div class="space-y-6">
                    <div class="flex items-center space-x-3 mb-6">
                      <div class="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                        <!-- <Icon name="lucide:link" class="w-4 h-4 text-white" /> -->
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M240,88.23a54.43,54.43,0,0,1-16,37L189.25,160a54.27,54.27,0,0,1-38.63,16h-.05A54.63,54.63,0,0,1,96,119.84a8,8,0,0,1,16,.45A38.62,38.62,0,0,0,150.58,160h0a38.39,38.39,0,0,0,27.31-11.31l34.75-34.75a38.63,38.63,0,0,0-54.63-54.63l-11,11A8,8,0,0,1,135.7,59l11-11A54.65,54.65,0,0,1,224,48,54.86,54.86,0,0,1,240,88.23ZM109,185.66l-11,11A38.41,38.41,0,0,1,70.6,208h0a38.63,38.63,0,0,1-27.29-65.94L78,107.31A38.63,38.63,0,0,1,144,135.71a8,8,0,0,0,16,.45A54.86,54.86,0,0,0,144,96a54.65,54.65,0,0,0-77.27,0L32,130.75A54.62,54.62,0,0,0,70.56,224h0a54.28,54.28,0,0,0,38.64-16l11-11A8,8,0,0,0,109,185.66Z"></path></svg>
                      </div>
                      <h4 class="text-lg font-semibold text-gray-900">Distribution Links</h4>
                    </div>

                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div class="group">
                        <label class="block text-sm font-semibold text-gray-700 mb-2">
                          Spotify URL
                        </label>
                        <div class="relative">
                          <input
                            v-model="form.spotifyUrl"
                            type="url"
                            class="w-full px-4 py-3 border-[0.5px] border-gray-200 rounded-xl focus:border-green-500 focus:ring-0 transition-all duration-200 bg-gray-50/50 hover:bg-white group-hover:border-gray-300"
                           
                          />
                          <div class="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                            <!-- <Icon name="lucide:music" class="w-3 h-3 text-white" /> -->
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" class="w-3 h-3 text-white"  height="32" fill="#000000" viewBox="0 0 256 256"><path d="M201.89,54.66A103.43,103.43,0,0,0,128.79,24H128A104,104,0,0,0,24,128v56a24,24,0,0,0,24,24H64a24,24,0,0,0,24-24V144a24,24,0,0,0-24-24H40.36A88.12,88.12,0,0,1,190.54,65.93,87.39,87.39,0,0,1,215.65,120H192a24,24,0,0,0-24,24v40a24,24,0,0,0,24,24h24a24,24,0,0,1-24,24H136a8,8,0,0,0,0,16h56a40,40,0,0,0,40-40V128A103.41,103.41,0,0,0,201.89,54.66ZM64,136a8,8,0,0,1,8,8v40a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V136Zm128,56a8,8,0,0,1-8-8V144a8,8,0,0,1,8-8h24v56Z"></path></svg>
                          </div>
                        </div>
                      </div>

                      <div class="group">
                        <label class="block text-sm font-semibold text-gray-700 mb-2">
                          Apple Podcasts URL
                        </label>
                        <div class="relative">
                          <input
                            v-model="form.appleUrl"
                            type="url"
                            class="w-full px-4 py-3 border-[0.5px] border-gray-200 rounded-xl focus:0 focus:ring-0 transition-all duration-200 bg-gray-50/50 hover:bg-white group-hover:border-gray-300"
                           
                          />
                          <div class="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 bg-gray-800 rounded-full flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 text-white" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M201.89,54.66A103.43,103.43,0,0,0,128.79,24H128A104,104,0,0,0,24,128v56a24,24,0,0,0,24,24H64a24,24,0,0,0,24-24V144a24,24,0,0,0-24-24H40.36A88,88,0,0,1,128,40h.67a87.71,87.71,0,0,1,87,80H192a24,24,0,0,0-24,24v40a24,24,0,0,0,24,24h16a24,24,0,0,0,24-24V128A103.41,103.41,0,0,0,201.89,54.66ZM64,136a8,8,0,0,1,8,8v40a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V136Zm152,48a8,8,0,0,1-8,8H192a8,8,0,0,1-8-8V144a8,8,0,0,1,8-8h24Z"></path></svg>
                            <!-- <Icon name="lucide:headphones" class="w-3 h-3 text-white" /> -->
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Tags & Settings -->
                  <div class="space-y-6">
                    <div class="flex items-center space-x-3 mb-6">
                      <div class="w-8 h-8 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full flex items-center justify-center">
                        <Icon name="lucide:tag" class="w-4 h-4 text-white" />
                      </div>
                      <h4 class="text-lg font-semibold text-gray-900">Tags & Settings</h4>
                    </div>

                    <div class="space-y-6">
                      <!-- Tags -->
                      <div class="group">
                        <label class="block text-sm font-semibold text-gray-700 mb-2">
                          Tags
                        </label>
                        <div class="relative">
                          <input
                            v-model="tagsInput"
                            type="text"
                            class="w-full px-4 py-3 border-[0.5px] border-gray-200 rounded-xl focus:border-teal-500 focus:ring-0 transition-all duration-200 bg-gray-50/50 hover:bg-white group-hover:border-gray-300"
                           
                            @input="updateTags"
                          />
                          <svg xmlns="http://www.w3.org/2000/svg" class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M243.31,136,144,36.69A15.86,15.86,0,0,0,132.69,32H40a8,8,0,0,0-8,8v92.69A15.86,15.86,0,0,0,36.69,144L136,243.31a16,16,0,0,0,22.63,0l84.68-84.68a16,16,0,0,0,0-22.63Zm-96,96L48,132.69V48h84.69L232,147.31ZM96,84A12,12,0,1,1,84,72,12,12,0,0,1,96,84Z"></path></svg>
                          <!-- <Icon name="lucide:hash" class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /> -->
                        </div>
                        
                        <TransitionGroup
                          v-if="form.tags.length"
                          enter-active-class="transition-all duration-300 ease-out"
                          enter-from-class="opacity-0 scale-95"
                          enter-to-class="opacity-100 scale-100"
                          leave-active-class="transition-all duration-200 ease-in"
                          leave-from-class="opacity-100 scale-100"
                          leave-to-class="opacity-0 scale-95"
                          tag="div"
                          class="flex flex-wrap gap-2 mt-3"
                        >
                          <span
                            v-for="tag in form.tags"
                            :key="tag"
                            class="inline-flex items-center px-3 py-1 bg-gradient-to-r from-teal-100 to-cyan-100 text-teal-800 rounded-full text-sm font-medium border border-teal-200 hover:from-teal-200 hover:to-cyan-200 transition-all duration-200"
                          >
                            {{ tag }}
                            <button
                              @click="removeTag(tag)"
                              type="button"
                              class="ml-2 text-teal-600 hover:text-teal-800 transition-colors duration-200"
                            >
                              <!-- <Icon name="lucide:x" class="w-3 h-3" /> -->
                              <svg class="w-3 h-3" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M165.66,101.66,139.31,128l26.35,26.34a8,8,0,0,1-11.32,11.32L128,139.31l-26.34,26.35a8,8,0,0,1-11.32-11.32L116.69,128,90.34,101.66a8,8,0,0,1,11.32-11.32L128,116.69l26.34-26.35a8,8,0,0,1,11.32,11.32ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z"></path></svg>
                            </button>
                          </span>
                        </TransitionGroup>
                      </div>

                      <!-- Status Toggle -->
                      <div class="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border border-gray-200">
                        <div class="flex items-center space-x-3">
                          <div class="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
                            <!-- <Icon name="lucide:eye" class="w-5 h-5 text-white" /> -->
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M247.31,124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57,61.26,162.88,48,128,48S61.43,61.26,36.34,86.35C17.51,105.18,9,124,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208s66.57-13.26,91.66-38.34c18.83-18.83,27.3-37.61,27.65-38.4A8,8,0,0,0,247.31,124.76ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.47,133.47,0,0,1,25,128,133.33,133.33,0,0,1,48.07,97.25C70.33,75.19,97.22,64,128,64s57.67,11.19,79.93,33.25A133.46,133.46,0,0,1,231.05,128C223.84,141.46,192.43,192,128,192Zm0-112a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z"></path></svg>
                          </div>
                          <div>
                            <h5 class="font-semibold text-gray-900">Publish Episode</h5>
                            <p class="text-sm text-gray-600">Make this episode visible to your audience</p>
                          </div>
                        </div>
                        <label class="relative inline-flex items-center cursor-pointer">
                          <input
                            v-model="form.isActive"
                            type="checkbox"
                            class="sr-only peer"
                          />
                          <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-purple-500"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <!-- Form Actions -->
                  <div class="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-8 border-t border-gray-200">
                    <button
                      @click="$emit('update:modelValue', false)"
                      type="button"
                      class="px-6 py-3 text-sm font-medium text-gray-700 bg-white border-[0.5px] border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 focus:ring-4 focus:ring-gray-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      :disabled="isSubmitting"
                      class="relative px-8 py-3 text-sm font-medium text-white bg-black rounded-xl  focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
                    >
                      <span v-if="!isSubmitting" class="flex items-center">
                        <!-- <Icon :name="episode ? 'lucide:save' : 'lucide:plus'" class="w-4 h-4 mr-2" /> -->
                        <svg v-if="episode" class="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Z"></path></svg>
                        <svg v-else  class="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"></path></svg>
                        {{ episode ? 'Update Episode' : 'Create Episode' }}
                      </span>
                      <span v-else class="flex items-center">
                        <!-- <Icon name="lucide:loader-2" class="w-4 h-4 mr-2 animate-spin" /> -->
                        <svg class="w-4 h-4 mr-2 animate-spin" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M136,32V64a8,8,0,0,1-16,0V32a8,8,0,0,1,16,0Zm37.25,58.75a8,8,0,0,0,5.66-2.35l22.63-22.62a8,8,0,0,0-11.32-11.32L167.6,77.09a8,8,0,0,0,5.65,13.66ZM224,120H192a8,8,0,0,0,0,16h32a8,8,0,0,0,0-16Zm-45.09,47.6a8,8,0,0,0-11.31,11.31l22.62,22.63a8,8,0,0,0,11.32-11.32ZM128,184a8,8,0,0,0-8,8v32a8,8,0,0,0,16,0V192A8,8,0,0,0,128,184ZM77.09,167.6,54.46,190.22a8,8,0,0,0,11.32,11.32L88.4,178.91A8,8,0,0,0,77.09,167.6ZM72,128a8,8,0,0,0-8-8H32a8,8,0,0,0,0,16H64A8,8,0,0,0,72,128ZM65.78,54.46A8,8,0,0,0,54.46,65.78L77.09,88.4A8,8,0,0,0,88.4,77.09Z"></path></svg>
                        {{ episode ? 'Updating...' : 'Creating...' }}
                      </span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { LabCast, CreateLabCastData } from '@/types/labcast'
import { useCreateLabCast } from "@/composables/modules/labcast/useCreateLabCast"
import { useUpdateLabCast } from "@/composables/modules/labcast/useUpdateLabCast"
import { useSingleUploadFile } from '@/composables/core/useSingleUpload'
import { useCustomToast } from '@/composables/core/useCustomToast'
import { ref, computed, watch } from 'vue'

interface Props {
  modelValue: boolean
  episode?: LabCast | null
}

const props = defineProps<Props>()

const { singleUploadFile, loading: uploadingSingle, uploadResponse: singleUploadResponse } = useSingleUploadFile()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  saved: []
}>()

// Refs
const thumbnailInput = ref<HTMLInputElement>()
const imageInput = ref<HTMLInputElement>()
const thumbnailDragOver = ref(false)
const imageDragOver = ref(false)
const thumbnailUploading = ref(false)
const imageUploading = ref(false)


const {
  loading: createLoading,
  error: createError,
  success: createSuccess,
  labcastData: createLabcastData,
  createLabCast,
  resetState: resetCreateState
} = useCreateLabCast()

const {
  loading: updateLoading,
  error: updateError,
  success: updateSuccess,
  labcast: updateLabcast,
  updateLabCast,
  resetState: resetUpdateState
} = useUpdateLabCast()

// Form state
const form = ref<CreateLabCastData>({
  title: '',
  description: '',
  season: 1,
  episode: 1,
  hosts: [''],
  guest: '',
  guestTitle: '',
  thumbnailUrl: '',
  spotifyUrl: '',
  appleUrl: '',
  image: '',
  publishedAt: new Date().toISOString().slice(0, 16),
  isActive: true,
  tags: [],
  duration: 30
})

const tagsInput = ref('')
const isSubmitting = computed(() => uploadingSingle.value)

// Form progress calculation
const formProgress = computed(() => {
  const fields = [
    form.value.title,
    form.value.description,
    form.value.season,
    form.value.episode,
    form.value.duration,
    form.value.publishedAt,
    form.value.hosts.filter(h => h.trim()).length > 0,
    form.value.thumbnailUrl
  ]
  
  const filledFields = fields.filter(field => {
    if (typeof field === 'boolean') return field
    if (typeof field === 'number') return field > 0
    if (typeof field === 'string') return field.trim().length > 0
    return false
  }).length
  
  return Math.round((filledFields / fields.length) * 100)
})

// Image upload methods
const triggerThumbnailUpload = () => {
  thumbnailInput.value?.click()
}

const triggerImageUpload = () => {
  imageInput.value?.click()
}

const handleThumbnailUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    await uploadThumbnail(file)
  }
}

const handleImageUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    await uploadEpisodeImage(file)
  }
}

const handleThumbnailDrop = async (event: DragEvent) => {
  thumbnailDragOver.value = false
  const file = event.dataTransfer?.files?.[0]
  if (file && file.type.startsWith('image/')) {
    await uploadThumbnail(file)
  }
}

const handleImageDrop = async (event: DragEvent) => {
  imageDragOver.value = false
  const file = event.dataTransfer?.files?.[0]
  if (file && file.type.startsWith('image/')) {
    await uploadEpisodeImage(file)
  }
}

const uploadThumbnail = async (file: File) => {
  try {
    thumbnailUploading.value = true
    const response = await singleUploadFile(file)
    form.value.thumbnailUrl = response.url
  } catch (error) {
    console.error('Thumbnail upload failed:', error)
  } finally {
    thumbnailUploading.value = false
  }
}

const uploadEpisodeImage = async (file: File) => {
  try {
    imageUploading.value = true
    const response = await singleUploadFile(file)
    form.value.image = response.filename || response.url
  } catch (error) {
    console.error('Image upload failed:', error)
  } finally {
    imageUploading.value = false
  }
}

const removeThumbnail = () => {
  form.value.thumbnailUrl = ''
  if (thumbnailInput.value) {
    thumbnailInput.value.value = ''
  }
}

const removeImage = () => {
  form.value.image = ''
  if (imageInput.value) {
    imageInput.value.value = ''
  }
}

const getImageUrl = (image: string) => {
  if (image.startsWith('http')) {
    return image
  }
  return `/images/episodes/${image}`
}

// Drag and drop handlers
const handleDragOver = (type: 'thumbnail' | 'image') => {
  if (type === 'thumbnail') {
    thumbnailDragOver.value = true
  } else {
    imageDragOver.value = true
  }
}

const handleDragLeave = (type: 'thumbnail' | 'image') => {
  if (type === 'thumbnail') {
    thumbnailDragOver.value = false
  } else {
    imageDragOver.value = false
  }
}

// Form methods
const resetForm = () => {
  form.value = {
    title: '',
    description: '',
    season: 1,
    episode: 1,
    hosts: [''],
    guest: '',
    guestTitle: '',
    thumbnailUrl: '',
    spotifyUrl: '',
    appleUrl: '',
    image: '',
    publishedAt: new Date().toISOString().slice(0, 16),
    isActive: true,
    tags: [],
    duration: 30
  }
  tagsInput.value = ''
}

const populateForm = (episode: LabCast) => {
  form.value = {
    title: episode.title,
    description: episode.description,
    season: episode.season,
    episode: episode.episode,
    hosts: [...episode.hosts],
    guest: episode.guest,
    guestTitle: episode.guestTitle,
    thumbnailUrl: episode.thumbnailUrl,
    spotifyUrl: episode.spotifyUrl,
    appleUrl: episode.appleUrl,
    image: episode.image,
    publishedAt: new Date(episode.publishedAt).toISOString().slice(0, 16),
    isActive: episode.isActive,
    tags: [...episode.tags],
    duration: episode.duration
  }
  tagsInput.value = episode.tags.join(', ')
}

const addHost = () => {
  form.value.hosts.push('')
}

const removeHost = (index: number) => {
  form.value.hosts.splice(index, 1)
}

const updateTags = () => {
  form.value.tags = tagsInput.value
    .split(',')
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0)
}

const removeTag = (tagToRemove: string) => {
  form.value.tags = form.value.tags.filter(tag => tag !== tagToRemove)
  tagsInput.value = form.value.tags.join(', ')
}

const { showToast } = useCustomToast()

const handleSubmit = async () => {
  // Validate required fields
  if (!form.value.title.trim() || !form.value.description.trim()) {
    showToast({ title: "Validation Error", message: "Title and Description are required.", toastType: "error" });
    return;
  }
  if (!form.value.season || !form.value.episode || !form.value.duration) {
    showToast({ title: "Validation Error", message: "Season, Episode number, and Duration are required.", toastType: "error" });
    return;
  }
  if (!form.value.publishedAt) {
    showToast({ title: "Validation Error", message: "Published date is required.", toastType: "error" });
    return;
  }
  if (!form.value.thumbnailUrl) {
    showToast({ title: "Validation Error", message: "Thumbnail image is required.", toastType: "error" });
    return;
  }
  // Clean up hosts array
  form.value.hosts = form.value.hosts.filter(host => host.trim().length > 0)
  if (form.value.hosts.length === 0) {
    showToast({ title: "Validation Error", message: "At least one host is required.", toastType: "error" });
    return;
  }

  if (props.episode) {
    // Update existing episode
    await updateLabCast(props.episode._id, form.value)
    if (updateSuccess.value) {
      emit('saved')
      resetForm()
    }
  } else {
    // Create new episode
    await createLabCast(form.value)
    if (createSuccess.value) {
      emit('saved')
      resetForm()
    }
  }
}

// Watch for episode changes
watch(() => props.episode, (episode) => {
  if (episode) {
    populateForm(episode)
  } else {
    resetForm()
  }
}, { immediate: true })

// Watch for modal close
watch(() => props.modelValue, (isOpen) => {
  if (!isOpen) {
    resetForm()
  }
})
</script>

<style scoped>
/* Custom scrollbar */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Custom focus styles */
input:focus, textarea:focus, select:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Smooth transitions for all interactive elements */
* {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
</style>