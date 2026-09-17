<template>
    <div class="mb-2">
      <div class="relative input-container" ref="containerRef">
        <!-- Floating Label -->
        <label
          :for="inputId"
          :class="[
            'absolute transition-all duration-300 ease-in-out pointer-events-none z-10',
            isFocused || modelValue ? 'text-sm text-gray-900 left-3 top-2' : 'text-base text-gray-900 left-3 top-1/2 transform -translate-y-1/2'
          ]"
        >
          {{ label }}
        </label>
  
        <!-- Select trigger -->
        <div
          @click="toggleDropdown"
          :class="[
            'w-full py-3 pt-5 px-4 bg-white border-2 border-slate-300 flex justify-between items-center cursor-pointer',
            'focus:outline-none focus:ring-2 focus:ring-[#033958]/20 focus:border-[#033958] transition-all duration-300 font-medium text-slate-900 rounded-2xl shadow-sm',
            roundedClasses,
            disabled ? 'opacity-50 cursor-not-allowed' : '',
            (hasError || (errorMessage && showError)) ? 'ring-1 ring-red-500 border-red-500' : ''
          ]"
        >
          <span class="text-[#1A1A1B]">
            <!-- Custom selected label slot -->
            <slot 
              v-if="slots['selected-label'] && selectedOption" 
              name="selected-label" 
              :option="selectedOption"
            />
            <!-- Default selected label -->
            <template v-else>
              {{ selectedLabel }}
            </template>
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-4 h-4 transition-transform duration-200"
            :class="{ 'transform rotate-180': showDropdown }"
            fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </div>
  
        <!-- Dropdown (Teleported to Body for maximum z-index and no clipping) -->
        <Teleport to="body">
          <div
            v-if="showDropdown"
            ref="dropdownRef"
            :style="dropdownStyle"
            class="fixed z-[9999] bg-white rounded-xl border border-slate-100 shadow-sm border border-slate-200 flex flex-col animate-in fade-in zoom-in duration-200"
          >
            <!-- Search Input -->
            <div class="p-2 border-b-[0.5px] sticky top-0 bg-white rounded-t-xl">
              <div class="relative">
                <svg 
                  class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35"/>
                </svg>
                <input
                  ref="searchInputRef"
                  v-model="searchQuery"
                  type="text"

                  class="w-full pl-9 pr-3 py-2.5 border-[0.5px] border-gray-200 rounded-lg focus:border-[#033958] outline-none text-sm transition-colors"
                  @click.stop
                />
              </div>
            </div>
            
            <!-- Options List -->
            <div class="max-h-60 overflow-y-auto custom-scrollbar p-1">
              <div
                v-for="(option, index) in filteredOptions"
                :key="index"
                @click="selectOption(option)"
                class="p-3 font-medium hover:bg-slate-50 rounded-lg cursor-pointer transition-colors text-sm text-slate-700 flex items-center justify-between group"
              >
                <span class="flex-1">
                  <!-- Custom option slot -->
                  <slot v-if="slots.default" :option="option" :index="index" />
                  <!-- Default option display -->
                  <template v-else>
                    {{ getLabel(option) }}
                  </template>
                </span>
                <Icon v-if="getValue(option) === modelValue" name="lucide:check" class="w-4 h-4 text-[#033958]" />
              </div>
              
              <!-- No results message -->
              <div 
                v-if="filteredOptions.length === 0" 
                class="p-8 text-center"
              >
                <Icon name="lucide:search-x" class="w-8 h-8 text-slate-200 mx-auto mb-2" />
                <p class="text-xs font-bold text-slate-400">No results found for "{{ searchQuery }}"</p>
              </div>
            </div>
          </div>
        </Teleport>
      </div>
  
      <!-- Error message -->
      <div v-if="errorMessage && showError" class="mt-2 flex items-center text-red-600 text-sm animate-in shake duration-300">
        <Icon name="lucide:alert-circle" class="mr-2 w-4 h-4" />
        {{ errorMessage }}
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, useId, onMounted, onUnmounted, nextTick, reactive, watch } from 'vue'
  import Icon from '@/components/Icon.vue'
  
  // Props
  interface Props {
    modelValue?: string | number | boolean
    label: string
    options?: Array<string | number | boolean | { label?: string, value?: string | number | boolean, name?: string, code?: string, [key: string]: any }>
    placeholder?: string
    disabled?: boolean
    errorMessage?: string
    showError?: boolean
    hasError?: boolean
    position?: 'top' | 'middle' | 'bottom' | 'standalone'
  }
  const props = withDefaults(defineProps<Props>(), {
    modelValue: '',
    options: () => [],
    placeholder: '',
    disabled: false,
    errorMessage: '',
    showError: true,
    hasError: false,
    position: 'standalone'
  })
  
  // Slots
  const slots = defineSlots<{
    default?: (props: { option: any, index: number }) => any
    'selected-label'?: (props: { option: any }) => any
  }>()
  
  // Emits
  const emit = defineEmits<{
    (e: 'update:modelValue', value: string | number | boolean): void
  }>()
  
  // Refs
  const showDropdown = ref(false)
  const isFocused = ref(false)
  const containerRef = ref<HTMLElement | null>(null)
  const dropdownRef = ref<HTMLElement | null>(null)
  const searchInputRef = ref<HTMLInputElement | null>(null)
  const searchQuery = ref('')
  const inputId = useId()
  
  const dropdownStyle = reactive({
    top: '0px',
    left: '0px',
    width: '0px',
    minWidth: '200px'
  })
  
  // Positioning logic
  const updateDropdownPosition = () => {
    if (!containerRef.value) return
    
    const rect = containerRef.value.getBoundingClientRect()
    const windowHeight = window.innerHeight
    const dropdownHeight = 300 // Max height estimate
    
    // Check if there's enough space below
    const spaceBelow = windowHeight - rect.bottom
    const openUpward = spaceBelow < dropdownHeight && rect.top > dropdownHeight
    
    dropdownStyle.left = `${rect.left}px`
    dropdownStyle.width = `${rect.width}px`
    
    if (openUpward) {
      // Position above: trigger top - dropdown height (approx 300)
      // Since we don't know exact height, let's use bottom-up positioning
      dropdownStyle.top = 'auto'
      // fixed positioning needs a reference. Let's use top = rect.top - dropdownHeight
      // Actually, it's safer to just set top and let CSS handle max-height.
      // But let's just use bottom: window.innerHeight - rect.top + 4
      dropdownStyle.bottom = `${window.innerHeight - rect.top + 4}px`
      dropdownStyle.top = 'auto'
    } else {
      dropdownStyle.top = `${rect.bottom + 4}px`
      dropdownStyle.bottom = 'auto'
    }
  }

  // Improved positioning with auto-flip
  watch(showDropdown, async (val) => {
    if (val) {
      await nextTick()
      updateDropdownPosition()
      window.addEventListener('scroll', updateDropdownPosition, true)
      window.addEventListener('resize', updateDropdownPosition)
    } else {
      window.removeEventListener('scroll', updateDropdownPosition, true)
      window.removeEventListener('resize', updateDropdownPosition)
    }
  })
  
  // Methods
  const toggleDropdown = async () => {
    if (!props.disabled) {
      showDropdown.value = !showDropdown.value
      isFocused.value = true
      
      // Focus search input when dropdown opens
      if (showDropdown.value) {
        await nextTick()
        searchInputRef.value?.focus()
      } else {
        searchQuery.value = ''
      }
    }
  }
  
  const selectOption = (option: any) => {
    // Support multiple formats: string, { value }, { code }, { name }
    let val: string | number | boolean
    if (typeof option === 'string' || typeof option === 'number' || typeof option === 'boolean') {
      val = option
    } else if (option.value !== undefined) {
      val = option.value
    } else if (option.code !== undefined) {
      val = option.code
    } else if (option.name !== undefined) {
      val = option.name
    } else {
      val = option
    }
    
    emit('update:modelValue', val)
    showDropdown.value = false
    isFocused.value = false
    searchQuery.value = ''
  }
  
  const getLabel = (option: any): string => {
    if (typeof option === 'string' || typeof option === 'number' || typeof option === 'boolean') return String(option)
    // Support multiple label formats
    return option.label || option.name || (option.value !== undefined ? String(option.value) : '') || option.code || String(option)
  }
  
  const getValue = (option: any): string | number | boolean => {
    if (typeof option === 'string' || typeof option === 'number' || typeof option === 'boolean') return option
    return option.value !== undefined ? option.value : (option.code || option.name || option)
  }
  
  const selectedLabel = computed(() => {
    const found = props.options.find((opt) => {
      const optValue = getValue(opt)
      return optValue === props.modelValue
    })
    return found ? getLabel(found) : ''
  })
  
  const selectedOption = computed(() => {
    return props.options.find((opt) => {
      const optValue = getValue(opt)
      return optValue === props.modelValue
    })
  })
  
  // Filter options based on search query
  const filteredOptions = computed(() => {
    if (!searchQuery.value.trim()) {
      return props.options
    }
    
    const query = searchQuery.value.toLowerCase()
    return props.options.filter((option) => {
      const label = getLabel(option).toLowerCase()
      return label.includes(query)
    })
  })
  
  const roundedClasses = computed(() => {
    switch (props.position) {
      case 'top':
        return 'rounded-t-xl rounded-b-sm'
      case 'middle':
        return 'rounded-sm'
      case 'bottom':
        return 'rounded-b-xl rounded-t-sm'
      case 'standalone':
      default:
        return 'rounded-xl'
    }
  })
  
  // Click outside handler
  const handleClickOutside = (event: MouseEvent) => {
    const isClickInsideContainer = containerRef.value && containerRef.value.contains(event.target as Node)
    const isClickInsideDropdown = dropdownRef.value && dropdownRef.value.contains(event.target as Node)
    
    if (!isClickInsideContainer && !isClickInsideDropdown) {
      showDropdown.value = false
      isFocused.value = false
      searchQuery.value = ''
    }
  }
  
  onMounted(() => {
    document.addEventListener('click', handleClickOutside)
  })
  
  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
  })
  </script>
  
  <style scoped>
  .input-container {
    position: relative;
  }
  </style>