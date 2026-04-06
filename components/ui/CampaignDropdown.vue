<template>
  <div class="relative w-full" v-click-outside="close">
    <div v-if="label" class="mb-2 px-1 flex justify-between items-center">
      <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">{{ label }}</label>
    </div>

    <button
      type="button"
      @click="toggle"
      class="w-full h-16 px-6 bg-[#F1F5F9] border border-transparent rounded-2xl flex items-center justify-between group hover:bg-[#E2E8F0] transition-all focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600/20"
    >
      <div class="flex flex-col items-start">
        <span v-if="modelValue" class="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{{ label }}</span>
        <span :class="['font-bold text-sm truncate transition-colors', modelValue ? 'text-slate-900' : 'text-slate-400']">
          {{ selectedOption?.label || placeholder }}
        </span>
      </div>
      <Icon 
        name="lucide:chevron-down" 
        :class="['w-5 h-5 text-slate-400 transition-transform duration-300', isOpen && 'rotate-180']" 
      />
    </button>

    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="translate-y-2 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-2 opacity-0"
    >
      <div
        v-if="isOpen"
        class="absolute z-[100] w-full mt-2 bg-white border border-slate-200 rounded-[1.5rem] shadow-2xl shadow-slate-200/50 overflow-hidden"
      >
        <!-- Search -->
        <div class="p-4 border-b border-slate-100 group">
          <div class="relative">
            <Icon name="lucide:search" class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
            <input
              v-model="search"
              type="text"
              placeholder="Search..."
              class="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500/30 transition-all"
              @click.stop
            />
          </div>
        </div>

        <!-- Options -->
        <div class="max-h-64 overflow-y-auto py-2 custom-scrollbar">
          <button
            v-for="option in filteredOptions"
            :key="option.value"
            type="button"
            @click="select(option)"
            class="w-full px-6 py-4 text-left flex flex-col hover:bg-slate-50 transition-all group/opt"
          >
            <span :class="['text-sm font-bold transition-colors', modelValue === option.value ? 'text-blue-600' : 'text-slate-900']">
              {{ option.label }}
            </span>
            <span v-if="option.description" class="text-[10px] font-medium text-slate-400 tracking-tight">
              {{ option.description }}
            </span>
          </button>
          
          <div v-if="filteredOptions.length === 0" class="px-6 py-10 text-center">
            <p class="text-xs font-medium text-slate-400">No options found</p>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Option {
  label: string
  value: any
  description?: string
}

const props = defineProps<{
  modelValue: any
  options: Option[]
  label?: string
  placeholder?: string
}>()

const emit = defineEmits(['update:modelValue', 'change'])

const isOpen = ref(false)
const search = ref('')

const selectedOption = computed(() => {
  return props.options.find(opt => opt.value === props.modelValue)
})

const filteredOptions = computed(() => {
  if (!search.value) return props.options
  const s = search.value.toLowerCase()
  return props.options.filter(opt => 
    opt.label.toLowerCase().includes(s) || 
    opt.description?.toLowerCase().includes(s)
  )
})

const toggle = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) search.value = ''
}

const close = () => {
  isOpen.value = false
}

const select = (option: Option) => {
  emit('update:modelValue', option.value)
  emit('change', option.value)
  close()
}

// Click outside directive implementation
const vClickOutside = {
  mounted(el: any, binding: any) {
    el.clickOutsideEvent = (event: Event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value()
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el: any) {
    document.removeEventListener('click', el.clickOutsideEvent)
  }
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #E2E8F0;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #CBD5E1;
}
</style>
