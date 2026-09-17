<template>
  <button
    type="button"
    @mousedown.prevent="$emit('click')"
    :disabled="disabled"
    :class="[
      'w-9 h-9 flex items-center justify-center rounded-lg transition-all active:scale-95 disabled:opacity-30 disabled:pointer-events-none',
      active ? 'bg-[#27628C]/10 text-[#27628B] shadow-inner' : 'text-slate-500 hover:bg-slate-200/50 hover:text-slate-900'
    ]"
    :title="label"
  >
    <Icon v-if="icon" :name="icon" class="w-4 h-4" />
    <span v-else class="text-sm font-black tracking-tight">{{ label }}</span>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  icon?: string
  label?: string
  active?: boolean
  disabled?: boolean
}>()

defineEmits(['click'])
</script>
