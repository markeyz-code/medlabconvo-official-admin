<template>
  <component 
    :is="iconComponent" 
    v-if="iconComponent" 
    :size="size"
    :class="className"
    :stroke-width="strokeWidth"
    v-bind="$attrs"
  />
  <span v-else class="text-xs text-red-500 font-mono">[Icon: {{ name }}]</span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import * as LucideIcons from 'lucide-vue-next'

interface Props {
  name: string
  size?: number | string
  className?: string
  strokeWidth?: string | number
}

const props = withDefaults(defineProps<Props>(), {
  size: 24,
  className: '',
  strokeWidth: 2
})

// Legacy Heroicons to Lucide mapping
const legacyMap: Record<string, string> = {
  'heroicons:bars-3': 'Menu',
  'heroicons:x-mark': 'X',
  'heroicons:magnifying-glass': 'Search',
  'heroicons:chat-bubble-left-right': 'MessagesSquare',
  'heroicons:exclamation-triangle': 'AlertTriangle',
  'heroicons:exclamation-circle': 'AlertCircle',
  'heroicons:arrow-path': 'RefreshCw',
  'heroicons:academic-cap': 'GraduationCap',
  'heroicons:paper-airplane': 'Send',
  'heroicons:envelope': 'Mail',
  'heroicons:envelope-open': 'MailOpen',
  'heroicons:user-group': 'Users',
  'heroicons:squares-2x2': 'LayoutGrid',
  'heroicons:archive-box': 'Archive',
  'heroicons:chat-bubble-bottom-center-text': 'MessageSquareText',
  'heroicons:phone': 'Phone',
  'heroicons:bell': 'Bell',
  'heroicons:document-text': 'FileText',
  'heroicons:pencil': 'Pencil',
  'heroicons:trash': 'Trash2',
  'heroicons:eye-slash': 'EyeOff',
  'heroicons:check-badge': 'BadgeCheck',
  'heroicons:sparkles': 'Sparkles',
  'heroicons:arrow-right-on-rectangle': 'LogOut',
  'heroicons:arrow-left-on-rectangle': 'LogIn',
  'heroicons:chevron-double-right': 'ChevronsRight',
  'heroicons:chevron-double-left': 'ChevronsLeft',
  'heroicons:arrow-top-right-on-square': 'ExternalLink',
  'heroicons:document-duplicate': 'Copy',
}

const iconComponent = computed(() => {
  let iconName = props.name

  // Handle legacy mapping
  if (legacyMap[iconName]) {
    return (LucideIcons as any)[legacyMap[iconName]]
  }

  // Handle prefixes (heroicons:, lucide:)
  const cleanName = iconName.includes(':') ? iconName.split(':')[1] : iconName

  // Convert kebab-case or snake_case to PascalCase for Lucide
  const pascalName = cleanName
    .split(/[-_]/)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')

  return (LucideIcons as any)[pascalName] || (LucideIcons as any)[cleanName] || null
})
</script>