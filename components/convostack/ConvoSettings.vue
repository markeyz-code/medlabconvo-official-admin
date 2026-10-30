<script setup lang="ts">
import { useGetCms } from '@/composables/modules/cms/useGetCms'
import { useUpsertCms } from '@/composables/modules/cms/useUpsertCms'
import AnimatedInput from '@/components/ui/AnimatedInput.vue'

const { getCmsByKey } = useGetCms()
const { upsertCms, loading: saving } = useUpsertCms()

const form = reactive({
  publicationName: 'Convo Stack',
  tagline: 'The conversation around the lab, in real time.',
  fromName: 'MedLabConvo Convo Stack',
  replyTo: 'admin@medlabconvo.com',
  welcomeMessage: 'Welcome to the Convo Stack. You will receive new essays, research notes and ecosystem pulses directly in your inbox.',
  footerNote: 'You are receiving this because you subscribed to the MedLabConvo Convo Stack.',
})

const loading = ref(true)

onMounted(async () => {
  try {
    const cms = await getCmsByKey('convostack_settings')
    const section = cms?.data?.sections?.find((s: any) => s.id === 'publication')
    if (section?.content && typeof section.content === 'object') Object.assign(form, section.content)
  } catch {
    // Use defaults when settings do not exist yet.
  } finally {
    loading.value = false
  }
})

const save = async () => {
  await upsertCms({
    key: 'convostack_settings',
    title: 'Convo Stack Settings',
    data: {
      sections: [{
        id: 'publication',
        title: 'Publication settings',
        content: { ...form },
        isVisible: true,
        order: 0,
      }],
    },
  })
}
</script>

<template>
  <div class="grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
    <div class="rounded-2xl border border-slate-100 bg-white p-5 sm:p-6">
      <div class="border-b border-slate-100 pb-4">
        <p class="text-[10px] font-bold uppercase tracking-[0.14em] text-[#27628C]">Publication settings</p>
        <h2 class="mt-2 text-lg font-bold tracking-[-0.03em] text-slate-900">Your inbuilt publication.</h2>
        <p class="mt-1 text-xs leading-5 text-slate-500">These settings describe the Convo Stack publication and the emails it sends to subscribers.</p>
      </div>

      <div v-if="loading" class="py-10 text-center text-xs text-slate-400">Loading settings…</div>

      <form v-else class="mt-5 space-y-4" @submit.prevent="save">
        <AnimatedInput v-model="form.publicationName" id="publication-name" label="Publication name" type="text" />
        <AnimatedInput v-model="form.tagline" id="publication-tagline" label="Tagline" type="text" />
        <div class="grid gap-4 sm:grid-cols-2">
          <AnimatedInput v-model="form.fromName" id="publication-from" label="From name" type="text" />
          <AnimatedInput v-model="form.replyTo" id="publication-reply" label="Reply-to email" type="email" />
        </div>
        <label class="block">
          <span class="mb-1.5 block text-[11px] font-semibold text-slate-600">Welcome message</span>
          <textarea v-model="form.welcomeMessage" rows="4" class="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs leading-6 text-slate-700 outline-none focus:border-[#27628C]/40" />
        </label>
        <label class="block">
          <span class="mb-1.5 block text-[11px] font-semibold text-slate-600">Email footer note</span>
          <textarea v-model="form.footerNote" rows="3" class="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs leading-6 text-slate-700 outline-none focus:border-[#27628C]/40" />
        </label>
        <div class="flex justify-end border-t border-slate-100 pt-4">
          <button type="submit" class="btn btn-primary" :disabled="saving">
            <Icon name="lucide:check" class="h-4 w-4" />
            {{ saving ? 'Saving…' : 'Save settings' }}
          </button>
        </div>
      </form>
    </div>

    <aside class="space-y-4">
      <div class="rounded-2xl bg-[#033958] p-5 text-white">
        <p class="text-[9px] font-bold uppercase tracking-[0.16em] text-white/45">No Substack required</p>
        <h3 class="mt-2 text-lg font-bold leading-tight tracking-[-0.03em] !text-white">Write here. Send here. Grow here.</h3>
        <p class="mt-2 text-[11px] leading-5 text-white/55">Posts, subscribers, email delivery, comments and analytics now live inside MedLabConvo.</p>
        <div class="mt-4 space-y-2 border-t border-white/10 pt-4 text-[10px] text-white/55">
          <p class="flex items-center gap-2"><Icon name="lucide:check" class="h-3.5 w-3.5 text-[#f1a37f]" /> Publish essays and research notes</p>
          <p class="flex items-center gap-2"><Icon name="lucide:check" class="h-3.5 w-3.5 text-[#f1a37f]" /> Email every active subscriber</p>
          <p class="flex items-center gap-2"><Icon name="lucide:check" class="h-3.5 w-3.5 text-[#f1a37f]" /> Moderate the conversation</p>
        </div>
      </div>
      <div class="rounded-2xl border border-slate-100 bg-white p-5">
        <p class="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">Migration note</p>
        <p class="mt-2 text-[11px] leading-5 text-slate-500">Existing Substack posts can be pasted as rich HTML in the editor. Future posts should be written and published directly in the Convo Stack Studio.</p>
      </div>
    </aside>
  </div>
</template>
