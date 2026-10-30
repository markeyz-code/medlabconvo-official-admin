<script setup lang="ts">
const props = withDefaults(defineProps<{ active?: string }>(), { active: 'posts' })

const copy: Record<string, { title: string; description: string }> = {
  posts: { title: 'Publish your own publication.', description: 'Write, publish, email subscribers and moderate the conversation — all inside MedLabConvo. No Substack account required.' },
  audience: { title: 'Know who is reading.', description: 'Your subscribers, in one place. Add readers, export the audience and keep the list healthy.' },
  comments: { title: 'Keep the conversation healthy.', description: 'Approve, hide or remove reader comments across every Convo Stack post.' },
  settings: { title: 'Make the publication yours.', description: 'Set the name, tagline and voice of your inbuilt newsletter — no external publishing account needed.' },
}

const activeCopy = computed(() => copy[props.active] || copy.posts)

const tabs = [
  { key: 'posts', label: 'Posts', href: '/dashboard/convostack' },
  { key: 'audience', label: 'Audience', href: '/dashboard/convostack/audience' },
  { key: 'comments', label: 'Comments', href: '/dashboard/convostack/comments' },
  { key: 'settings', label: 'Settings', href: '/dashboard/convostack/settings' },
]
</script>

<template>
  <div class="space-y-5">
    <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <div class="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#27628C]">
          <span class="h-1.5 w-1.5 rounded-full bg-[#DE6129]" />
          Convo Stack Studio
        </div>
        <h1 class="mt-2 text-[1.65rem] font-bold tracking-[-0.04em] text-slate-900">{{ activeCopy.title }}</h1>
        <p class="mt-1 max-w-2xl text-xs leading-5 text-slate-500">{{ activeCopy.description }}</p>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <a href="https://www.medlabconvo.com/convostack" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">
          <Icon name="lucide:external-link" class="h-4 w-4" />
          View public site
        </a>
        <NuxtLink to="/dashboard/convostack/create" class="btn btn-primary">
          <Icon name="lucide:plus" class="h-4 w-4" />
          Write a post
        </NuxtLink>
      </div>
    </div>

    <div class="flex items-center gap-1 overflow-x-auto border-b border-slate-200 pb-px">
      <NuxtLink
        v-for="tab in tabs"
        :key="tab.key"
        :to="tab.href"
        class="relative flex shrink-0 items-center gap-2 px-3.5 py-2.5 text-[11.5px] font-semibold transition"
        :class="active === tab.key ? 'text-[#27628C]' : 'text-slate-400 hover:text-slate-700'"
      >
        {{ tab.label }}
        <span v-if="active === tab.key" class="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-[#27628C]" />
      </NuxtLink>
    </div>
  </div>
</template>
