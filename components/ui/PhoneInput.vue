<template>
  <div>
    <div class="flex h-full items-center">
      <!-- Country Dropdown -->
      <div class="relative w-32 flex-shrink-0 h-full">
        <button
          type="button"
          @click="showCountryDropdown = !showCountryDropdown"
          class="w-full px-3 py-4 border-none rounded-l-lg bg-[#1A1A1B09] text-gray-700 outline-none text-sm flex items-center gap-2 hover:border-gray-400 transition-colors"
        >
          <span v-if="selectedCountryData" class="text-lg">
            {{ getCountryFlag(selectedCountryData.code) }}
          </span>
          <span class="font-medium text-lg">{{ selectedDialCode }}</span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 7.50004C15 7.50004 11.3176 12.5 9.99996 12.5C8.68237 12.5 5 7.5 5 7.5" stroke="#454745" stroke-width="1.68" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        
        <div
          v-if="showCountryDropdown"
          class="absolute top-full left-0 right-0 mt-1 bg-white border-[0.5px] border-gray-25 rounded-lg shadow-xl z-50 max-h-64 overflow-y-auto"
        >
          <input
            v-model="countrySearchQuery"
            type="text"
            placeholder="Search"
            class="w-full px-3 py-2 text-sm border-b-[0.5px] border-gray-100 focus:outline-none"
          />
          <div
            v-for="c in filteredCountries"
            :key="c.code"
            @click="selectCountry(c)"
            class="px-3 py-2 hover:bg-[#1A1A1B09] mx-3 my-2 rounded-xl cursor-pointer flex items-center gap-2 text-sm"
          >
            <span class="text-lg">{{ getCountryFlag(c.code) }}</span>
            <span class="font-medium text-[#1A1A1B]">{{ c.dialCode }}</span>
          </div>
        </div>
      </div>

      <!-- Phone Number Input -->
      <div class="flex-1">
        <input
          :value="modelValue"
          type="tel"
          :placeholder="phonePlaceholder"
          class="w-full px-3 py-4 bg-[#1A1A1B09] border-none rounded-r-lg focus:border-[0.5px] focus:border-[#3BAB22] outline-none text-lg"
          :class="errorMessage ? 'border-red-500' : 'border-gray-300'"
          @input="onPhoneInput"
          @blur="handleBlur"
        />
      </div>
    </div>

    <!-- Error Message -->
    <p v-if="errorMessage" class="mt-1 text-sm text-red-600 flex items-center">
      <svg class="mr-1 w-4 h-4" fill="none" stroke="currentColor" stroke-width="2"
           viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" x2="12" y1="8" y2="12"/>
        <line x1="12" x2="12.01" y1="16" y2="16"/>
      </svg>
      {{ errorMessage }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { countries } from "@/utils/countriesWithDialingCode";

interface Props {
  modelValue: string;
  countryCode?: string;
  errorMessage?: string;
  validateOnBlur?: boolean;
}

interface Emits {
  (e: 'update:modelValue', value: string): void;
  (e: 'update:countryCode', value: string): void;
  (e: 'update:errorMessage', value: string): void;
  (e: 'update:fullPhoneNumber', value: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  countryCode: 'NG',
  errorMessage: '',
  validateOnBlur: true,
});

const emit = defineEmits<Emits>();

// Local state
const showCountryDropdown = ref(false);
const countrySearchQuery = ref('');

// Phone number masks
const PHONE_MASKS: Record<string, string> = {
  US: '(###) ###-####',
  CA: '(###) ###-####',
  NG: '### ### ####',       // 10 digits shown as 3 3 4
  GB: '#### ### ####',
};

// Computed
const selectedCountryData = computed(() => {
  return countries.find(c => c.code === props.countryCode || c.name === props.countryCode);
});

const selectedDialCode = computed(() => {
  return selectedCountryData.value?.dialCode || '+1';
});

const filteredCountries = computed(() => {
  if (!countrySearchQuery.value) return countries;
  
  const query = countrySearchQuery.value.toLowerCase();
  return countries.filter(c => 
    c.name.toLowerCase().includes(query) || 
    c.dialCode.includes(query) ||
    c.code.toLowerCase().includes(query)
  );
});

const phonePlaceholder = computed(() => {
  const code = selectedCountryData.value?.code;
  const sample = '1234567890';
  const mask = getMaskForCountry(code, sample.length);
  return applyMask(sample, mask);
});

// Helper functions
const getCountryFlag = (countryCode: string): string => {
  if (!countryCode || countryCode.length !== 2) return '';
  
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  
  return String.fromCodePoint(...codePoints);
};

const getPhoneValidationRules = (dialCode: string, countryCode?: string) => {
  if (countryCode?.toUpperCase() === 'NG') {
    return { minLength: 10, maxLength: 10 };
  }

  const dialCodeLength = dialCode.replace('+', '').length;
  const minLength = Math.max(7, 10 - dialCodeLength);
  const maxLength = Math.max(12, 15 - dialCodeLength);

  return { minLength, maxLength };
};

const makeFallbackMask = (digitsLen: number) => {
  if (digitsLen <= 7) return '###-####';
  if (digitsLen <= 10) return '###-###-####';
  return '###-###-#####';
};

const getMaskForCountry = (code?: string, digitsLen?: number) => {
  if (code && PHONE_MASKS[code]) return PHONE_MASKS[code];
  return makeFallbackMask(digitsLen ?? 10);
};

const applyMask = (digits: string, pattern: string) => {
  let i = 0;
  return [...pattern].map(ch => (ch === '#'
    ? (i < digits.length ? digits[i++] : '')
    : (i === 0 && ch.trim() === '' ? '' : ch)
  )).join('').trim();
};

const validatePhoneNumber = (phoneValue: string): string => {
  const cleanedNumber = phoneValue.replace(/\D/g, '');
  
  if (!phoneValue.trim()) {
    return 'Phone number is required';
  }
  
  if (!/^\d+$/.test(cleanedNumber)) {
    return 'Phone number should only contain digits';
  }

  const countryData = selectedCountryData.value;
  if (countryData) {
    const rules = getPhoneValidationRules(countryData.dialCode, countryData.code);

    if (countryData.code === 'NG' && cleanedNumber.length === 11 && cleanedNumber.startsWith('0')) {
      const normalized = cleanedNumber.slice(1);
      emit('update:modelValue', normalized);
    }

    const digits = phoneValue.replace(/\D/g, '');
    if (digits.length < rules.minLength) {
      return `Phone number must be at least ${rules.minLength} digits for ${countryData.name}`;
    }
    if (digits.length > rules.maxLength) {
      return `Phone number must be at most ${rules.maxLength} digits for ${countryData.name}`;
    }
  } else {
    if (cleanedNumber.length < 7) {
      return 'Phone number is too short';
    }
    if (cleanedNumber.length > 15) {
      return 'Phone number is too long';
    }
  }

  return '';
};

// Event handlers
const selectCountry = (selectedCountry: any) => {
  emit('update:countryCode', selectedCountry.code);
  showCountryDropdown.value = false;
  countrySearchQuery.value = '';

  if (props.modelValue) {
    const digits = props.modelValue.replace(/\D/g, '');
    const mask = getMaskForCountry(selectedCountry.code, digits.length);
    emit('update:modelValue', applyMask(digits, mask));
    
    if (props.validateOnBlur) {
      const error = validatePhoneNumber(props.modelValue);
      emit('update:errorMessage', error);
    }
  }
};

const onPhoneInput = (e: Event) => {
  const target = e.target as HTMLInputElement;
  let digits = target.value.replace(/\D/g, '');

  const cc = selectedCountryData.value?.code;
  if (cc === 'NG' && digits.length > 0 && digits[0] === '0') {
    digits = digits.slice(1);
  }

  const mask = getMaskForCountry(cc, digits.length);
  const maskedValue = applyMask(digits, mask);
  
  emit('update:modelValue', maskedValue);
  
  // Emit full phone number with dial code
  const fullPhone = `${selectedDialCode.value}${digits}`;
  emit('update:fullPhoneNumber', fullPhone);
  
  // Clear error on input
  if (props.errorMessage) {
    emit('update:errorMessage', '');
  }
};

const handleBlur = () => {
  if (props.validateOnBlur && props.modelValue) {
    const error = validatePhoneNumber(props.modelValue);
    emit('update:errorMessage', error);
  }
};

// Watch country changes
watch(() => props.countryCode, (newCountry) => {
  if (newCountry && props.modelValue && props.validateOnBlur) {
    const error = validatePhoneNumber(props.modelValue);
    emit('update:errorMessage', error);
  }
});
</script>