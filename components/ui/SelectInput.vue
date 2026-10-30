<template>
  <div class="w-full">
    <label v-if="label" :for="inputId" class="field-label">{{ label }}</label>

    <div ref="containerRef" class="relative">
      <button
        :id="inputId"
        type="button"
        class="select-trigger"
        :class="{
          'select-trigger-error': hasError || (errorMessage && showError),
          'select-trigger-open': showDropdown,
        }"
        :disabled="disabled"
        :aria-expanded="showDropdown"
        aria-haspopup="listbox"
        @click="toggleDropdown"
        @keydown="onTriggerKeydown"
      >
        <span class="min-w-0 flex-1 truncate text-left">
          <slot v-if="slots['selected-label'] && selectedOption" name="selected-label" :option="selectedOption" />
          <template v-else-if="selectedOption">{{ getLabel(selectedOption) }}</template>
          <span v-else class="select-placeholder">{{ placeholder || 'Select an option' }}</span>
        </span>
        <Icon name="lucide:chevron-down" class="h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform duration-150" :class="{ 'rotate-180': showDropdown }" />
      </button>

      <Teleport to="body">
        <Transition name="select-pop">
          <div
            v-if="showDropdown"
            ref="dropdownRef"
            :style="dropdownStyle"
            class="select-popover"
            role="listbox"
            @keydown="onMenuKeydown"
          >
            <div v-if="showSearch" class="border-b border-slate-100 p-1.5">
              <div class="relative">
                <Icon name="lucide:search" class="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                <input
                  ref="searchInputRef"
                  v-model="searchQuery"
                  type="text"
                  placeholder="Search options…"
                  class="select-search h-8 w-full rounded-md border border-slate-200 bg-white pl-8 pr-2.5 text-[12px] text-slate-700 outline-none placeholder:text-slate-300 focus:border-[#27628C]/40"
                  @click.stop
                />
              </div>
            </div>

            <div class="max-h-[248px] overflow-y-auto p-1 scrollbar-slim">
              <button
                v-for="(option, index) in filteredOptions"
                :key="index"
                type="button"
                class="select-option"
                :class="{ 'select-option-active': index === activeIndex, 'select-option-selected': getValue(option) === modelValue }"
                role="option"
                :aria-selected="getValue(option) === modelValue"
                @mouseenter="activeIndex = index"
                @click="selectOption(option)"
              >
                <span class="min-w-0 flex-1 truncate">
                  <slot v-if="slots.default" :option="option" :index="index" />
                  <template v-else>{{ getLabel(option) }}</template>
                </span>
                <Icon v-if="getValue(option) === modelValue" name="lucide:check" class="h-3.5 w-3.5 shrink-0 text-[#27628C]" />
              </button>

              <div v-if="filteredOptions.length === 0" class="px-3 py-6 text-center">
                <p class="text-[11.5px] font-semibold text-slate-500">No matches</p>
                <p class="mt-0.5 text-[10px] text-slate-400">Try a different search term.</p>
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>
    </div>

    <p v-if="errorMessage && showError" class="mt-1.5 flex items-center gap-1 text-[10.5px] font-medium text-red-600">
      <Icon name="lucide:alert-circle" class="h-3 w-3" />
      {{ errorMessage }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, useId, watch } from 'vue'
import Icon from '@/components/Icon.vue'

interface Props {
  modelValue?: string | number | boolean
  label?: string
  options?: Array<string | number | boolean | { label?: string; value?: string | number | boolean; name?: string; code?: string; [key: string]: any }>
  placeholder?: string
  disabled?: boolean
  errorMessage?: string
  showError?: boolean
  hasError?: boolean
  position?: 'top' | 'middle' | 'bottom' | 'standalone'
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  label: '',
  options: () => [],
  placeholder: '',
  disabled: false,
  errorMessage: '',
  showError: true,
  hasError: false,
  position: 'standalone',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number | boolean): void
}>()

const slots = defineSlots<{
  default?: (props: { option: any; index: number }) => any
  'selected-label'?: (props: { option: any }) => any
}>()

const inputId = useId()
const containerRef = ref<HTMLElement | null>(null)
const dropdownRef = ref<HTMLElement | null>(null)
const searchInputRef = ref<HTMLInputElement | null>(null)
const showDropdown = ref(false)
const searchQuery = ref('')
const activeIndex = ref(0)
const dropdownStyle = reactive<Record<string, string>>({
  top: '0px',
  left: '0px',
  width: '0px',
  minWidth: '180px',
  bottom: 'auto',
})

const showSearch = computed(() => props.options.length > 6)
const filteredOptions = computed(() => {
  if (!searchQuery.value.trim()) return props.options
  const q = searchQuery.value.toLowerCase()
  return props.options.filter(option => getLabel(option).toLowerCase().includes(q))
})

const getValue = (option: any): string | number | boolean => {
  if (typeof option === 'string' || typeof option === 'number' || typeof option === 'boolean') return option
  if (option?.value !== undefined) return option.value
  if (option?.code !== undefined) return option.code
  if (option?.name !== undefined) return option.name
  return option
}

const getLabel = (option: any): string => {
  if (typeof option === 'string' || typeof option === 'number' || typeof option === 'boolean') return String(option)
  return option?.label || option?.name || option?.code || (option?.value !== undefined ? String(option.value) : String(option))
}

const selectedOption = computed(() => props.options.find(option => getValue(option) === props.modelValue) || null)

const updatePosition = () => {
  if (!containerRef.value) return
  const rect = containerRef.value.getBoundingClientRect()
  const viewportHeight = window.innerHeight
  const estimatedHeight = Math.min(300, 42 + props.options.length * 32)
  const openAbove = viewportHeight - rect.bottom < estimatedHeight && rect.top > estimatedHeight

  dropdownStyle.left = `${Math.max(8, Math.min(rect.left, window.innerWidth - rect.width - 8))}px`
  dropdownStyle.width = `${rect.width}px`
  dropdownStyle.minWidth = `${Math.min(rect.width, 240)}px`
  dropdownStyle.top = openAbove ? 'auto' : `${rect.bottom + 5}px`
  dropdownStyle.bottom = openAbove ? `${viewportHeight - rect.top + 5}px` : 'auto'
}

const open = async () => {
  if (props.disabled) return
  showDropdown.value = true
  searchQuery.value = ''
  activeIndex.value = Math.max(0, props.options.findIndex(option => getValue(option) === props.modelValue))
  await nextTick()
  updatePosition()
  if (showSearch.value) searchInputRef.value?.focus()
  window.addEventListener('scroll', updatePosition, true)
  window.addEventListener('resize', updatePosition)
}

const close = () => {
  showDropdown.value = false
  searchQuery.value = ''
  window.removeEventListener('scroll', updatePosition, true)
  window.removeEventListener('resize', updatePosition)
}

const toggleDropdown = () => {
  showDropdown.value ? close() : open()
}

const selectOption = (option: any) => {
  emit('update:modelValue', getValue(option))
  close()
}

const onTriggerKeydown = (event: KeyboardEvent) => {
  if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
    event.preventDefault()
    if (!showDropdown.value) open()
    else if (event.key === 'Enter' && filteredOptions.value[activeIndex.value]) selectOption(filteredOptions.value[activeIndex.value])
    else moveActive(event.key === 'ArrowUp' ? -1 : 1)
  }
  if (event.key === 'Escape') close()
}

const onMenuKeydown = (event: KeyboardEvent) => {
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault()
    moveActive(event.key === 'ArrowDown' ? 1 : -1)
  } else if (event.key === 'Enter' && filteredOptions.value[activeIndex.value]) {
    event.preventDefault()
    selectOption(filteredOptions.value[activeIndex.value])
  } else if (event.key === 'Escape') {
    event.preventDefault()
    close()
  }
}

const moveActive = (direction: number) => {
  if (!filteredOptions.value.length) return
  activeIndex.value = (activeIndex.value + direction + filteredOptions.value.length) % filteredOptions.value.length
  nextTick(() => dropdownRef.value?.querySelector('.select-option-active')?.scrollIntoView({ block: 'nearest' }))
}

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as Node
  if (!containerRef.value?.contains(target) && !dropdownRef.value?.contains(target)) close()
}

watch(searchQuery, () => { activeIndex.value = 0 })
watch(() => props.options, () => { if (showDropdown.value) updatePosition() }, { deep: true })

onMounted(() => document.addEventListener('click', handleClickOutside))
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
  close()
})
</script>

<style scoped>
.select-trigger {
  display: flex;
  width: 100%;
  min-height: 38px;
  align-items: center;
  gap: 8px;
  border: 1px solid var(--mc-border-strong, #dfe7ee);
  border-radius: 9px;
  background: #fff;
  padding: 0 11px;
  font-size: 12.5px;
  font-weight: 500;
  color: var(--mc-ink, #0a202b);
  transition: border-color 0.16s ease, box-shadow 0.16s ease;
}
.select-trigger:hover:not(:disabled) { border-color: #c7d7e2; }
.select-trigger:focus-visible,
.select-trigger-open {
  outline: none;
  border-color: #27628c;
  box-shadow: 0 0 0 3px rgba(39, 98, 140, 0.1);
}
.select-trigger:disabled { cursor: not-allowed; opacity: 0.5; }
.select-trigger-error { border-color: #fca5a5 !important; background: #fff8f8; }
.select-placeholder { color: #a6b7c2; font-weight: 400; }

.select-popover {
  position: fixed;
  z-index: 9999;
  overflow: hidden;
  border: 1px solid #e0e9ef;
  border-radius: 11px;
  background: #fff;
  box-shadow: 0 18px 48px -18px rgba(3, 30, 48, 0.35), 0 2px 8px -3px rgba(3, 30, 48, 0.12);
}

.select-option {
  display: flex;
  width: 100%;
  min-height: 32px;
  align-items: center;
  gap: 8px;
  border-radius: 7px;
  padding: 6px 9px;
  text-align: left;
  font-size: 12px;
  font-weight: 500;
  color: #405866;
  transition: background 0.12s ease, color 0.12s ease;
}
.select-option-active { background: #f2f7fa; color: #0a202b; }
.select-option-selected { color: #27628c; font-weight: 600; }
.select-search { padding-left: 34px !important; }

.select-pop-enter-active,
.select-pop-leave-active { transition: opacity 0.14s ease, transform 0.14s ease; }
.select-pop-enter-from,
.select-pop-leave-to { opacity: 0; transform: translateY(-3px) scale(0.995); }
</style>
