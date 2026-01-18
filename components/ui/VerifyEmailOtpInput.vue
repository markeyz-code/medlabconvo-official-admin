<template>
    <div>
      <div class="flex justify-center space-x-2 md:space-x-3">
        <div 
          v-for="(digit, index) in length" 
          :key="index"
          class="relative"
        >
          <input
            :ref="el => inputRefs[index] = el"
            type="text"
            inputmode="numeric"
            maxlength="1"
            v-model="otpValues[index]"
            @input="handleInput(index)"
            @keydown="handleKeyDown($event, index)"
            @focus="handleFocus(index)"
            @paste="handlePaste"
            class="w-14 h-14 text-center text-2xl font-bold bg-[#F7F7F7]  rounded-md focus:outline-none"
            :class="[
              index === activeInput ? 'border-green-500 ring-1 ring-green-500' : 'border-gray-200',
              { 'border-red-500 ring-1 ring-red-500': error }
            ]"
          />
        </div>
      </div>
      <p v-if="error" class="mt-2 text-sm text-red-500">{{ error }}</p>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, watch, onMounted, nextTick } from 'vue';
  
  const props = defineProps({
    length: {
      type: Number,
      default: 6
    },
    modelValue: {
      type: String,
      default: ''
    },
    autoSubmit: {
      type: Boolean,
      default: true
    },
    error: {
      type: String,
      default: ''
    }
  });
  
  const emit = defineEmits(['update:modelValue', 'completed']);
  
  const otpValues = ref(Array(props.length).fill(''));
  const inputRefs = ref<HTMLInputElement[]>([]);
  const activeInput = ref(0);
  
  // Initialize OTP values from modelValue if provided
  watch(() => props.modelValue, (newValue) => {
    if (newValue) {
      const valueArray = newValue.split('').slice(0, props.length);
      otpValues.value = [...valueArray, ...Array(props.length - valueArray.length).fill('')];
    } else {
      otpValues.value = Array(props.length).fill('');
    }
  }, { immediate: true });
  
  // Emit the combined OTP value whenever it changes
  watch(otpValues, (newValues) => {
    const otpValue = newValues.join('');
    emit('update:modelValue', otpValue);
    
    // If all inputs are filled, emit completed event
    if (otpValue.length === props.length && props.autoSubmit) {
      emit('completed', otpValue);
    }
  }, { deep: true });
  
  // Focus the first input on mount
  onMounted(() => {
    nextTick(() => {
      if (inputRefs.value[0]) {
        inputRefs.value[0].focus();
      }
    });
  });
  
  // Handle input changes
  const handleInput = (index: number) => {
    // Ensure only numeric input
    otpValues.value[index] = otpValues.value[index].replace(/[^0-9]/g, '');
    
    // Move to next input if current one is filled
    if (otpValues.value[index] && index < props.length - 1) {
      activeInput.value = index + 1;
      nextTick(() => {
        inputRefs.value[index + 1]?.focus();
      });
    }
  };
  
  // Handle keyboard navigation
  const handleKeyDown = (event: KeyboardEvent, index: number) => {
    // Handle backspace
    if (event.key === 'Backspace') {
      if (otpValues.value[index]) {
        otpValues.value[index] = '';
      } else if (index > 0) {
        otpValues.value[index - 1] = '';
        activeInput.value = index - 1;
        nextTick(() => {
          inputRefs.value[index - 1]?.focus();
        });
      }
      event.preventDefault();
    } 
    // Handle arrow keys
    else if (event.key === 'ArrowLeft' && index > 0) {
      activeInput.value = index - 1;
      nextTick(() => {
        inputRefs.value[index - 1]?.focus();
      });
      event.preventDefault();
    } else if (event.key === 'ArrowRight' && index < props.length - 1) {
      activeInput.value = index + 1;
      nextTick(() => {
        inputRefs.value[index + 1]?.focus();
      });
      event.preventDefault();
    }
  };
  
  // Handle focus on input
  const handleFocus = (index: number) => {
    activeInput.value = index;
    // Select the content when focused
    nextTick(() => {
      inputRefs.value[index]?.select();
    });
  };
  
  // Handle paste event
  const handlePaste = (event: ClipboardEvent) => {
    event.preventDefault();
    
    if (!event.clipboardData) return;
    
    // Get pasted content and filter only numbers
    const pastedData = event.clipboardData.getData('text');
    const numericData = pastedData.replace(/[^0-9]/g, '').split('');
    
    // Fill the OTP fields with pasted data
    for (let i = 0; i < props.length; i++) {
      if (i < numericData.length) {
        otpValues.value[i] = numericData[i];
      }
    }
    
    // Focus the next empty input or the last one
    const nextEmptyIndex = otpValues.value.findIndex(val => !val);
    const focusIndex = nextEmptyIndex !== -1 ? nextEmptyIndex : props.length - 1;
    
    activeInput.value = focusIndex;
    nextTick(() => {
      inputRefs.value[focusIndex]?.focus();
    });
  };
  </script>