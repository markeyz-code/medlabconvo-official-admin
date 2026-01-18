<template>
  <div class="relative">
    <label v-if="label" class="block text-sm font-semibold text-gray-700 mb-2">
      {{ label }}
    </label>
    
    <button
      type="button"
      @click="isOpen = !isOpen"
      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white text-left flex items-center justify-between"
    >
      <span class="text-gray-700">{{ selectedLabel }}</span>
      <Icon 
        name="heroicons:chevron-down" 
        :class="['w-5 h-5 text-gray-400 transition-transform', isOpen && 'rotate-180']" 
      />
    </button>

    <Transition name="dropdown">
      <div 
        v-if="isOpen"
        v-click-outside="() => isOpen = false"
        class="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
      >
        <div class="max-h-60 overflow-y-auto">
          <button
            v-for="option in options"
            :key="option.value"
            type="button"
            @click="selectOption(option)"
            :class="[
              'w-full px-4 py-3 text-left hover:bg-blue-50 transition text-sm',
              modelValue === option.value ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
            ]"
          >
            {{ option.label }}
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import type { DropdownOption } from '~/types/profile';

const props = defineProps<{
  modelValue: string;
  options: DropdownOption[];
  label?: string;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const isOpen = ref(false);

const selectedLabel = computed(() => {
  const selected = props.options.find(opt => opt.value === props.modelValue);
  return selected?.label || 'Select...';
});

const selectOption = (option: DropdownOption) => {
  emit('update:modelValue', option.value);
  isOpen.value = false;
};

// Click outside directive
const vClickOutside = {
  mounted(el: HTMLElement, binding: any) {
    el.clickOutsideEvent = (event: Event) => {
      if (!(el === event.target || el.contains(event.target as Node))) {
        binding.value();
      }
    };
    document.addEventListener('click', el.clickOutsideEvent);
  },
  unmounted(el: HTMLElement & { clickOutsideEvent?: (event: Event) => void }) {
    if (el.clickOutsideEvent) {
      document.removeEventListener('click', el.clickOutsideEvent);
    }
  }
};
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>