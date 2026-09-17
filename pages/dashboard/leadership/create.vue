<template>
  <div class="p-6 md:p-10 space-y-10 animate-in fade-in duration-700 pb-40">
    <!-- Breadcrumbs & Header -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      <div class="space-y-2">
        <div class="flex items-center gap-2 text-sm font-black  tracking-normal text-slate-400">
           <NuxtLink to="/dashboard/leadership" class="hover:text-[#033958] transition-colors">Team</NuxtLink>
           <Icon name="lucide:chevron-right" class="w-3 h-3" />
           <span class="text-slate-900">New Member</span>
        </div>
        <h1 class="text-lg font-black text-slate-900 tracking-normal  ">Add Team Member</h1>
      </div>
      
      <div class="flex items-center gap-4">
        <button @click="$router.push('/dashboard/leadership')" class="px-8 py-4 text-sm font-black  tracking-normal text-slate-400 hover:text-slate-900 transition-colors">Cancel</button>
        <button 
          @click="handleSubmit" 
          :disabled="submitting || !isFormValid"
          class="px-12 py-4 bg-[#033958] text-white rounded-2xl font-black text-sm  tracking-normal shadow-sm border border-slate-200 hover:bg-[#022a41] transition-all disabled:opacity-50 flex items-center gap-3"
        >
          <div v-if="submitting" class="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
          <span>Save Member</span>
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-12">
      <!-- Sidebar: Preview -->
      <div class="xl:col-span-1 space-y-8">
        <div class="bg-white rounded-[3rem] border border-slate-100 p-10 shadow-sm border border-slate-200 space-y-8 sticky top-10">
           <label class="text-sm font-black  tracking-normal text-slate-400 block px-1">Preview</label>
           
           <div class="relative aspect-square rounded-[3.5rem] bg-slate-50 border-4 border-dashed border-slate-100 overflow-hidden group">
              <img v-if="form.image" :src="form.image" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div v-else class="absolute inset-0 flex flex-col items-center justify-center text-slate-200">
                 <Icon name="lucide:user" class="w-20 h-20 mb-4" />
                 <span class="text-[9px] font-black  tracking-normal">No Photo Selected</span>
              </div>
              <input type="file" @change="handleImageUpload" class="absolute inset-0 opacity-0 cursor-pointer z-10" />
              <div v-if="uploading" class="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-20">
                 <div class="w-10 h-10 border-4 border-[#033958]/10 border-t-[#033958] rounded-full animate-spin"></div>
              </div>
           </div>

           <div class="space-y-4">
              <h3 class="text-xl font-black text-slate-900 tracking-normal  ">{{ form.name || 'Member Name' }}</h3>
              <p class="text-xs font-black text-[#033958]  tracking-normal truncate">{{ form.title || 'Job Title' }}</p>
              <div class="inline-flex px-3 py-1 bg-emerald-50 text-emerald-600 text-[9px] font-black  tracking-normal rounded-lg border border-emerald-100">
                 {{ form.roleCategory }}
              </div>
           </div>

           <p class="text-sm font-medium text-slate-400  leading-relaxed">
             "{{ form.bio || 'Add a biography for this team member to showcase their expertise and contributions.' }}"
           </p>
        </div>
      </div>

      <!-- Main Form -->
      <div class="xl:col-span-2 space-y-12">
        <!-- Basic Information -->
        <section class="bg-white rounded-[3.5rem] p-10 md:p-14 border border-slate-100 shadow-sm border border-slate-200 space-y-10">
           <div class="flex items-center gap-4">
              <div class="w-10 h-10 bg-[#033958] text-white rounded-xl flex items-center justify-center font-black ">01</div>
              <h2 class="text-xl font-black text-slate-900  tracking-normal ">Basic Information</h2>
           </div>

           <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <AnimatedInput v-model="form.name" id="name" label="Full Name" type="text" required />
              <AnimatedInput v-model="form.title" id="title" label="Job Title (e.g. Executive Director)" type="text" required />
              <SelectInput 
                v-model="form.roleCategory" 
                label="Role Category"
                :options="[
                  { label: 'Executive Board', value: 'Executive Board' },
                  { label: 'Management Team', value: 'Management Team' },
                  { label: 'Volunteer Committee', value: 'Volunteer Committee' },
                  { label: 'Advisory Council', value: 'Advisory Council' }
                ]" 
              />
              <AnimatedInput v-model="form.position" id="pos" label="Display Order (lower = higher priority)" type="number" />
           </div>
           
           <div class="space-y-4">
              <label class="text-sm font-black  tracking-normal text-slate-400 px-1">Biography</label>
              <AnimatedInput v-model="form.bio" id="bio" label="Write a short bio for this team member..." type="textarea" :rows="8" required />
           </div>
        </section>

        <!-- Achievements -->
        <section class="bg-white rounded-[3.5rem] p-10 md:p-14 border border-slate-100 shadow-sm border border-slate-200 space-y-10">
           <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center font-black ">02</div>
                <h2 class="text-xl font-black text-slate-900  tracking-normal ">Achievements</h2>
              </div>
              <button @click="addAchievement" class="text-sm font-black  tracking-normal text-[#033958] hover:text-black">Add Achievement</button>
           </div>

           <div class="space-y-6">
              <div v-for="(ach, idx) in form.achievements" :key="idx" class="flex items-center gap-4 group">
                 <div class="flex-1">
                   <AnimatedInput v-model="form.achievements[idx]" :id="'ach-'+idx" label="Achievement or award" type="text" />
                 </div>
                 <button @click="removeAchievement(idx)" class="p-4 text-slate-200 hover:text-rose-500 transition-colors">
                    <Icon name="lucide:trash-2" class="w-5 h-5" />
                 </button>
              </div>
              <div v-if="!form.achievements.length" class="py-20 border-2 border-dashed border-slate-50 rounded-[2.5rem] flex flex-col items-center justify-center text-slate-200">
                 <Icon name="lucide:sparkles" class="w-12 h-12 mb-4" />
                 <p class="text-sm font-black  tracking-normal">No achievements added yet.</p>
              </div>
           </div>
        </section>

        <!-- Social Profiles -->
        <section class="bg-white rounded-[3.5rem] p-10 md:p-14 border border-slate-100 shadow-sm border border-slate-200 space-y-10">
           <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 bg-blue-500 text-white rounded-xl flex items-center justify-center font-black ">03</div>
                <h2 class="text-xl font-black text-slate-900  tracking-normal ">Social Profiles</h2>
              </div>
              <button @click="addProfile" class="text-sm font-black  tracking-normal text-[#033958] hover:text-black">Add Profile</button>
           </div>

           <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div v-for="(profile, idx) in form.profiles" :key="idx" class="relative bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100 space-y-4">
                 <SelectInput 
                    v-model="profile.type" 
                    label="Platform type"
                    :options="[
                      { label: 'LinkedIn', value: 'linkedin' },
                      { label: 'X (Twitter)', value: 'twitter' },
                      { label: 'Instagram', value: 'instagram' },
                      { label: 'Facebook', value: 'facebook' },
                      { label: 'Website', value: 'website' }
                    ]" 
                 />
                 <AnimatedInput v-model="profile.url" :id="'prof-'+idx" label="Profile URL" type="text" />
                 <button @click="removeProfile(idx)" class="absolute -top-3 -right-3 w-8 h-8 bg-white text-slate-200 hover:text-rose-500 rounded-full border border-slate-100 shadow-sm border border-slate-200 flex items-center justify-center">
                    <Icon name="lucide:x" class="w-4 h-4" />
                 </button>
              </div>
              <div v-if="!form.profiles.length" class="md:col-span-2 py-20 border-2 border-dashed border-slate-50 rounded-[2.5rem] flex flex-col items-center justify-center text-slate-200">
                 <Icon name="lucide:globe" class="w-12 h-12 mb-4" />
                 <p class="text-sm font-black  tracking-normal">No social profiles added yet.</p>
              </div>
           </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { teams_api } from '@/api_factory/modules/teams'
import { useCustomToast } from '@/composables/core/useCustomToast'
import { useUploadImage } from '@/composables/modules/upload/useUploadImage'
import AnimatedInput from '@/components/ui/AnimatedInput.vue'
import SelectInput from '@/components/ui/SelectInput.vue'
import Icon from '@/components/Icon.vue'


definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

const router = useRouter()
const { showToast } = useCustomToast()
const { uploadImage, uploading } = useUploadImage()

const submitting = ref(false)
const form = reactive({
  name: '',
  title: '',
  roleCategory: 'Executive Board',
  image: '',
  bio: '',
  position: 0,
  achievements: [] as string[],
  profiles: [] as { type: string; url: string }[]
})

const isFormValid = computed(() => {
  return form.name.length > 2 && form.title.length > 2 && form.bio.length > 10
})

const handleImageUpload = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  try {
    const res = await uploadImage(file)
    form.image = res.url
    showToast({ title: 'Uploaded', message: 'Photo uploaded successfully.', toastType: 'success' })
  } catch (err) {
    showToast({ title: 'Upload Failed', message: 'Failed to upload photo.', toastType: 'error' })
  }
}

const addAchievement = () => form.achievements.push('')
const removeAchievement = (idx: number) => form.achievements.splice(idx, 1)

const addProfile = () => form.profiles.push({ type: 'linkedin', url: '' })
const removeProfile = (idx: number) => form.profiles.splice(idx, 1)

const handleSubmit = async () => {
  submitting.value = true
  try {
    await teams_api.$_create_member(form)
    showToast({ title: 'Success', message: 'Team member added successfully.', toastType: 'success' })
    router.push('/dashboard/leadership')
  } catch (err) {
    showToast({ title: 'Error', message: 'Failed to save team member.', toastType: 'error' })
  } finally {
    submitting.value = false
  }
}
</script>
